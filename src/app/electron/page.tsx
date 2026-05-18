"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Bot, Zap, RotateCcw } from "lucide-react";
import FluidCallButton from "@/components/aws/FluidCallButton";
import FluidLogo from "@/components/FluidLogo";

interface Turn {
  role: "user" | "agent";
  text: string;
  ts: number;
}

interface ZapEvent {
  request: string;
  ts: number;
}

export default function ElectronPage() {
  const [turns, setTurns]         = useState<Turn[]>([]);
  const [zapEvents, setZapEvents] = useState<ZapEvent[]>([]);
  const [active, setActive]       = useState(false);
  const [appStatus, setAppStatus] = useState<"unknown" | "connected" | "offline">("unknown");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check if an app is listening on port 9224
  useEffect(() => {
    async function checkCDP() {
      try {
        const res = await fetch("/api/cdp-status");
        const { connected } = await res.json() as { connected: boolean };
        setAppStatus(connected ? "connected" : "offline");
      } catch {
        setAppStatus("offline");
      }
    }
    checkCDP();
    const interval = setInterval(checkCDP, 5000);
    return () => clearInterval(interval);
  }, []);

  // SSE transcript + ui-change events
  useEffect(() => {
    const es = new EventSource("/api/stream");
    es.onmessage = (e) => {
      const { type, data } = JSON.parse(e.data) as { type: string; data: Record<string, string> };

      if (type === "transcript") {
        const role = data.role as "user" | "agent";
        if (role === "agent" && data.text?.includes("watching your screen")) {
          setActive(true);
        }
        setTurns(prev => [...prev, { role, text: data.text, ts: Date.now() }]);
      } else if (type === "ui-change") {
        // ui-change on this page means a zap was applied — show it as a notification
        setZapEvents(prev => [...prev, { request: data.request ?? "UI change", ts: Date.now() }]);
      }
    };
    return () => es.close();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, zapEvents]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      color: "#fff",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#0a0f1a",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FluidLogo size={26} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Fluid</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Electron App Control</div>
          </div>
        </div>

        {/* CDP status — only show when connected */}
        {appStatus === "connected" && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: "8px 14px",
            fontSize: 12,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            App connected on :9224
          </div>
        )}

        {/* Nav link back to AWS demo */}
        <a href="/aws" style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 12,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
        }}>
          AWS Demo →
        </a>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Main transcript */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Empty state */}
          {turns.length === 0 && (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              color: "rgba(255,255,255,0.2)",
              padding: 40,
            }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mic size={28} color="rgba(255,255,255,0.15)" />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>No conversation yet</div>
                <div style={{ fontSize: 13 }}>Click "Ask Fluid" → call yourself → speak to change the app live</div>
              </div>
              <div style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 8,
              }}>
                {["Make the font bigger", "Dark mode", "Hide the sidebar", "Make buttons rounder", "Change the background color"].map(s => (
                  <span key={s} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: "5px 12px",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.35)",
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Transcript */}
          {turns.length > 0 && (
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 720,
              width: "100%",
              alignSelf: "center",
            }}>
              {turns.map((turn, i) => (
                <div key={i} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: turn.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                    flexDirection: turn.role === "user" ? "row-reverse" : "row",
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: turn.role === "user" ? "rgba(255,153,0,0.2)" : "rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {turn.role === "user"
                        ? <Mic size={11} color="#FF9900" />
                        : <Bot size={11} color="rgba(255,255,255,0.5)" />}
                    </div>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {turn.role === "user" ? "You" : "Fluid"}
                    </span>
                  </div>
                  <div style={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    borderRadius: turn.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: turn.role === "user" ? "rgba(255,153,0,0.1)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${turn.role === "user" ? "rgba(255,153,0,0.2)" : "rgba(255,255,255,0.07)"}`,
                    color: turn.role === "user" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}>
                    {turn.text}
                  </div>
                </div>
              ))}

              {/* Zap applied notifications inline */}
              {zapEvents.map((ev, i) => (
                <div key={`zap-${i}`} style={{
                  alignSelf: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 12,
                  color: "#22c55e",
                }}>
                  <Zap size={12} />
                  App changed
                  <RotateCcw size={11} style={{ marginLeft: 4, opacity: 0.6 }} />
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
          )}

          {/* Active call indicator */}
          {active && (
            <div style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 24px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: 12,
              color: "#22c55e",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 1.5s infinite" }} />
              Call active — speak to change the app
            </div>
          )}
        </main>
      </div>

      <FluidCallButton />
    </div>
  );
}
