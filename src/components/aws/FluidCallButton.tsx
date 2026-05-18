"use client";

import { useState } from "react";
import { PhoneCall, X } from "lucide-react";
import FluidLogo from "@/components/FluidLogo";

export default function FluidCallButton() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("+13305734624");
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);

  async function initiateCall() {
    if (!phone) return;
    setCalling(true);
    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      if (res.ok) {
        setCalled(true);
        setTimeout(() => setOpen(false), 2000);
      }
    } finally {
      setCalling(false);
    }
  }

  return (
    <div id="fluid-call-panel">
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{ all: "unset", position: "fixed", bottom: 24, right: 24, zIndex: 9000, display: "flex", alignItems: "center", gap: 10, background: "#fff", color: "#000", fontWeight: 600, padding: "10px 18px", borderRadius: 99, boxShadow: "0 4px 24px rgba(0,0,0,0.4)", cursor: "pointer", fontSize: 14, userSelect: "none" }}
      >
        <FluidLogo size={22} />
        <span>Ask Fluid</span>
        <span style={{ position: "absolute", top: -3, right: -3, width: 10, height: 10, background: "#22c55e", borderRadius: "50%" }} />
      </button>

      {/* Modal */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9001, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FluidLogo size={32} />
                <div>
                  <div className="text-white font-semibold">Fluid</div>
                  <div className="text-white/40 text-xs">We'll call you instantly</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {called ? (
              <div className="text-center py-4">
                <div className="text-green-400 text-lg font-semibold mb-1">Calling you now...</div>
                <div className="text-white/50 text-sm">Pick up and speak naturally</div>
              </div>
            ) : (
              <>
                <p className="text-white/60 text-sm mb-4">
                  Enter your number. Fluid will call you and change the UI live as you speak.
                </p>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && initiateCall()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm mb-4 focus:outline-none focus:border-[#FF9900]"
                />
                <button
                  onClick={initiateCall}
                  disabled={calling || !phone}
                  className="w-full bg-white hover:bg-white/90 disabled:opacity-40 text-black font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall size={18} />
                  {calling ? "Calling..." : "Call me now"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
