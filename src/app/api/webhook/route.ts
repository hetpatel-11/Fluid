import { NextRequest, NextResponse } from "next/server";
import { processVoiceCommand } from "@/lib/claude";
import { emitUIChange, emitStatus, emitPR, emitTranscript } from "@/lib/events";
import { createUIPullRequest } from "@/lib/github";
import { zapElectronApp, resetZap } from "@/lib/zap";
import { exec } from "child_process";

const conversationHistory: { role: "user" | "assistant"; content: string }[] = [];
const appliedPatches: { code: string; request: string }[] = [];

function extractTranscript(body: Record<string, unknown>): string | null {
  const data = body.data as Record<string, unknown> | undefined;

  const candidates = [
    // Real voice call payload: body.data.transcript
    data?.transcript,
    // recentHistory: last user turn
    ...(Array.isArray(body.recentHistory)
      ? (body.recentHistory as Record<string, unknown>[])
          .filter((m) => m.role === "user")
          .slice(-1)
          .map((m) => m.content)
      : []),
    // Fallbacks for other formats
    (body.message as Record<string, unknown>)?.content,
    body.transcript,
    body.text,
    body.content,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

export async function POST(req: NextRequest) {
  const raw = await req.json();
  // AgentPhone sends double-encoded JSON for voice calls
  const body = (typeof raw === "string" ? JSON.parse(raw) : raw) as Record<string, unknown>;
  const event = (body.event ?? body.type ?? "") as string;

  console.log("[webhook] event:", event);

  // Call started
  if (
    event === "call.started" ||
    event === "agent.call_started" ||
    event === "call_started"
  ) {
    const greeting = "Hey, I'm Fluid. I'm watching your screen right now. Tell me what you want to change or where you want to go.";
    emitTranscript({ role: "agent", text: greeting });
    return NextResponse.json({ text: greeting, interim: false });
  }

  // Call ended — reset history
  if (
    event === "call.ended" ||
    event === "agent.call_ended" ||
    event === "call_ended"
  ) {
    conversationHistory.length = 0;
    appliedPatches.length = 0;
    return NextResponse.json({ text: "", interim: false });
  }

  // Only handle user message turns
  if (event && !["agent.message", "message.received", "message", "response_required"].includes(event)) {
    return NextResponse.json({ text: "", interim: false });
  }

  const transcript = extractTranscript(body);
  if (!transcript) {
    console.log("[webhook] could not extract transcript from:", JSON.stringify(body));
    return NextResponse.json({ text: "Could you repeat that?", interim: false });
  }

  emitTranscript({ role: "user", text: transcript });
  emitStatus(`Processing: "${transcript.slice(0, 50)}…"`);

  try {
    const result = await processVoiceCommand(transcript, conversationHistory);

    conversationHistory.push({ role: "user", content: transcript });
    if (result.speak) conversationHistory.push({ role: "assistant", content: result.speak });

    if (result.speak) emitTranscript({ role: "agent", text: result.speak });

    if (result.actions?.length > 0) {
      const jsChunks: string[] = [];
      let zapSpeak = "";

      for (const action of result.actions as { type: string; selector?: string; code?: string; message?: string; request?: string }[]) {
        // ── Shell (open apps, run local commands) ───────────────────────
        if (action.type === "shell" && action.code) {
          await new Promise<void>((resolve) => exec(action.code!, () => resolve()));
          continue;
        }
        // ── Electron app (CDP) ──────────────────────────────────────────
        if (action.type === "zap" && action.request) {
          zapSpeak = await zapElectronApp(action.request);
          continue;
        }
        if (action.type === "reset-zap") {
          zapSpeak = await resetZap();
          continue;
        }
        // ── Browser UI changes ──────────────────────────────────────────
        if (action.type === "click" && action.selector) {
          jsChunks.push(`(function(){ var el = document.querySelector(${JSON.stringify(action.selector)}); if(el){ el.click(); } })()`);
        } else if (action.type === "highlight" && action.selector) {
          const msg = action.message ?? "";
          jsChunks.push(`(function(){
            var el = document.querySelector(${JSON.stringify(action.selector)});
            if(!el) return;
            var prev = el.style.outline;
            el.style.outline = '3px solid #FF9900';
            el.style.outlineOffset = '3px';
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ${msg ? `
            var tip = document.createElement('div');
            tip.id = '__fluid_tip__';
            tip.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#FF9900;color:#000;padding:10px 18px;border-radius:12px;font-size:13px;font-weight:600;z-index:99999;pointer-events:none;';
            tip.textContent = ${JSON.stringify(msg)};
            document.body.appendChild(tip);
            setTimeout(function(){ el.style.outline = prev; tip.remove(); }, 4000);
            ` : `setTimeout(function(){ el.style.outline = prev; }, 3000);`}
          })()`);
        } else if (action.type === "scroll" && action.selector) {
          jsChunks.push(`(function(){ var el = document.querySelector(${JSON.stringify(action.selector)}); if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); })()`);
        } else if (action.type === "js" && action.code) {
          jsChunks.push(action.code);
        }
      }

      if (jsChunks.length > 0) {
        appliedPatches.push({ code: jsChunks.join(";\n"), request: transcript });
        emitUIChange({ chunks: jsChunks, request: transcript });

        if (result.createPR) {
          const prUrl = await createUIPullRequest(jsChunks.join(";\n"), transcript);
          if (prUrl) emitPR({ url: prUrl, request: transcript });
        }
      }

      // If zap ran, override the spoken reply with what actually happened
      if (zapSpeak) {
        emitTranscript({ role: "agent", text: zapSpeak });
        return NextResponse.json({ text: zapSpeak, interim: false });
      }
    }

    return NextResponse.json({ text: result.speak, interim: false });
  } catch (e) {
    console.error("[webhook] error:", e);
    return NextResponse.json({ text: "Give me a second, something went wrong.", interim: false });
  }
}
