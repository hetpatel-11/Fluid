"use client";

import { useEffect, useRef, useState } from "react";
import { GitPullRequest, Mic, Bot } from "lucide-react";
import FluidLogo from "@/components/FluidLogo";

interface Turn {
  role: "user" | "agent";
  text: string;
  ts: number;
}

export default function FluidOverlay() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const es = new EventSource("/api/stream");

    es.onmessage = (e) => {
      const { type, data } = JSON.parse(e.data) as { type: string; data: Record<string, string> };

      if (type === "transcript") {
        const role = data.role as "user" | "agent";
        if (role === "agent" && data.text?.includes("watching your screen")) {
          setActive(true);
        }
        setTurns((prev) => [...prev, { role, text: data.text, ts: Date.now() }]);
      } else if (type === "ui-change") {
        const chunks: string[] = (data as unknown as { chunks?: string[] }).chunks ?? [data.code];
        chunks.forEach((chunk, i) => {
          setTimeout(() => {
            try {
              // eslint-disable-next-line no-new-func
              new Function(chunk)();
            } catch (err) {
              console.error("UI change failed:", err);
            }
          }, i * 250);
        });
      } else if (type === "pr-created") {
        setPrUrl(data.url);
      } else if (type === "status") {
        // status messages are shown inline in transcript as agent thinking indicator
      }
    };

    es.onerror = () => {
      // SSE will auto-reconnect
    };

    return () => es.close();
  }, []);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  if (!active && turns.length === 0) return (
    <>
      {prUrl && <PRBanner url={prUrl} onClose={() => setPrUrl(null)} />}
    </>
  );

  return (
    <>
      {/* Transcript panel — fixed right side */}
      <div
        id="fluid-overlay"
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: 320,
          background: "rgba(8,8,8,0.96)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          zIndex: 45,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}>
          <FluidLogo size={20} />
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>Fluid</span>
          <span style={{
            marginLeft: "auto",
            width: 7, height: 7, borderRadius: "50%",
            background: "#22c55e",
            display: "block",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ color: "#22c55e", fontSize: 10, fontWeight: 600 }}>LIVE</span>
        </div>

        {/* Turns */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          {turns.map((turn, i) => (
            <div key={i} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: turn.role === "user" ? "flex-end" : "flex-start",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 3,
                flexDirection: turn.role === "user" ? "row-reverse" : "row",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: turn.role === "user" ? "rgba(255,153,0,0.2)" : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {turn.role === "user"
                    ? <Mic size={9} color="#FF9900" />
                    : <Bot size={9} color="rgba(255,255,255,0.5)" />
                  }
                </div>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {turn.role === "user" ? "You" : "Fluid"}
                </span>
              </div>
              <div style={{
                maxWidth: "85%",
                padding: "8px 12px",
                borderRadius: turn.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                background: turn.role === "user" ? "rgba(255,153,0,0.12)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${turn.role === "user" ? "rgba(255,153,0,0.25)" : "rgba(255,255,255,0.08)"}`,
                color: turn.role === "user" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.75)",
                fontSize: 12,
                lineHeight: 1.5,
              }}>
                {turn.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div style={{
          padding: "10px 14px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          fontSize: 10,
          color: "rgba(255,255,255,0.2)",
          textAlign: "center",
          flexShrink: 0,
        }}>
          Speaking on your phone → changes appear here
        </div>
      </div>

      {prUrl && <PRBanner url={prUrl} onClose={() => setPrUrl(null)} />}
    </>
  );
}

function PRBanner({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999,
      background: "#16a34a", color: "#fff",
      padding: "12px 20px", borderRadius: 16,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", gap: 10,
      fontSize: 13, fontWeight: 500,
    }}>
      <GitPullRequest size={16} />
      <span>PR opened on GitHub</span>
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: "underline", opacity: 0.9 }}>View →</a>
      <button onClick={onClose} style={{ marginLeft: 8, opacity: 0.6, cursor: "pointer", background: "none", border: "none", color: "#fff" }}>✕</button>
    </div>
  );
}
