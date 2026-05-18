import WebSocket from "ws";
import { anthropic } from "./claude";

interface CDPTarget {
  webSocketDebuggerUrl: string;
  type: string;
  title: string;
}

interface CDPMessage {
  id: number;
  result?: { result?: { value?: unknown } };
  error?: { message: string };
}

async function getCDPTargets(port = 9222): Promise<CDPTarget[]> {
  const res = await fetch(`http://localhost:${port}/json`);
  if (!res.ok) throw new Error(`CDP not available on port ${port}`);
  return res.json() as Promise<CDPTarget[]>;
}

function cdpEval(wsUrl: string, expression: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const timer = setTimeout(() => { ws.terminate(); reject(new Error("CDP timeout")); }, 8000);

    ws.on("open", () => {
      ws.send(JSON.stringify({
        id: 1,
        method: "Runtime.evaluate",
        params: { expression, returnByValue: true },
      }));
    });

    ws.on("message", (raw) => {
      const msg = JSON.parse(raw.toString()) as CDPMessage;
      if (msg.id !== 1) return;
      clearTimeout(timer);
      ws.close();
      if (msg.error) return reject(new Error(msg.error.message));
      resolve(String(msg.result?.result?.value ?? ""));
    });

    ws.on("error", (err) => { clearTimeout(timer); reject(err); });
  });
}

// Port 9224 is reserved for the Fluid-controlled app.
// Port 9222 (if used) is left alone so existing Codex customizations are never touched.
const FLUID_CDP_PORT = 9224;

export async function zapElectronApp(request: string): Promise<string> {
  // 1. Connect to the Fluid-designated app via CDP
  let targets: CDPTarget[];
  try {
    targets = await getCDPTargets(FLUID_CDP_PORT);
  } catch {
    return `No app found on port ${FLUID_CDP_PORT} — launch your target app with --remote-debugging-port=${FLUID_CDP_PORT}`;
  }

  const page = targets.find((t) => t.type === "page");
  if (!page) return `No page target on CDP port ${FLUID_CDP_PORT}`;

  const ws = page.webSocketDebuggerUrl;

  // 2. Inspect the live DOM so Claude sees real class names
  const [domSnippet, classList] = await Promise.all([
    cdpEval(ws, `document.body.innerHTML.substring(0, 4000)`),
    cdpEval(ws,
      `Array.from(document.querySelectorAll('*'))
        .filter(el => el.className && typeof el.className === 'string' && el.className.trim())
        .map(el => el.tagName + ' ' + el.className.substring(0, 100))
        .slice(0, 50)
        .join('\\n')`
    ),
  ]);

  // 3. Ask Claude to generate the patch from real DOM context
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: `You are patching a live Electron desktop app via CDP injection.
The user made a voice request. Generate CSS and/or JS to fulfil it precisely.
The class names below are REAL — copy them exactly when writing CSS selectors.
Prefer CSS for visual changes. Use JS only for structural changes (reorder, add/remove elements).
IMPORTANT: Never break the app layout. Test your logic mentally before generating.
Respond ONLY with valid JSON, no markdown fences:
{"css":"...","js":"...","speak":"<what you did, under 10 words>"}`,
    messages: [{
      role: "user",
      content: `Request: "${request}"\n\nLive element classes:\n${classList}\n\nDOM:\n${domSnippet}`,
    }],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "{}";
  const match = raw.match(/\{[\s\S]*\}/);
  let patch: { css?: string; js?: string; speak?: string } = {};
  try { patch = JSON.parse(match?.[0] ?? "{}"); } catch { /* ignore */ }

  // 4. Inject CSS — replaces any previous Fluid injection cleanly
  if (patch.css?.trim()) {
    await cdpEval(ws, `
      (function(){
        const prev = document.getElementById('__fluid_zap__');
        if (prev) prev.remove();
        const s = document.createElement('style');
        s.id = '__fluid_zap__';
        s.textContent = ${JSON.stringify(patch.css)};
        document.head.appendChild(s);
        return 'css-injected';
      })()`);
  }

  // 5. Inject JS
  if (patch.js?.trim()) {
    await cdpEval(ws, patch.js);
  }

  return patch.speak ?? "Done";
}

export async function resetZap(): Promise<string> {
  let targets: CDPTarget[];
  try { targets = await getCDPTargets(FLUID_CDP_PORT); } catch { return "App not reachable"; }
  const page = targets.find((t) => t.type === "page");
  if (!page) return "No target found";
  await cdpEval(page.webSocketDebuggerUrl,
    `(function(){ const s = document.getElementById('__fluid_zap__'); if(s) s.remove(); return 'reset'; })()`
  );
  return "Electron app reset to default";
}
