<p align="center">
  <img src="./public/logo.svg" width="72" height="72" alt="Fluid" />
</p>

<h1 align="center">Fluid</h1>

<p align="center">
  <strong>Customer support isn't supposed to be a chatbot.</strong><br/>
  Feature requests are a thing of the past.
</p>

<p align="center">
  Fluid calls your users. They speak — the product changes live while they're still on the phone.<br/>
  No ticket. No queue. No chat widget.
</p>

<p align="center">
  <a href="#demo">Demo</a> · <a href="#how-it-works">How it works</a> · <a href="#stack">Stack</a> · <a href="#setup">Setup</a>
</p>

---

## What is Fluid?

Fluid is an AI voice assistant that embeds into any web or desktop app. When a user clicks **Ask Fluid**, they get a real phone call. While they're on the call, they can say anything — navigate to a page, restyle the UI, walk through a wizard, open a desktop app — and it happens live on their screen.

Every change is also submitted as a GitHub PR so nothing is lost.

---

## Demo

| Mode | What it does |
|------|-------------|
| **AWS Console** (`/aws`) | Voice-controlled AWS dashboard — navigate services, open wizards, restyle the UI live |
| **Electron apps** (`/electron`) | Control any running Electron app (Codex, VS Code, Slack) via Chrome DevTools Protocol |

---

## How it works

```
User clicks "Ask Fluid"
        │
        ▼
AgentPhone dials the user's phone number
        │
        ▼
User speaks  →  AgentPhone webhooks  →  Next.js API route
        │
        ▼
Claude (claude-sonnet-4-6) interprets the request
        │
        ├─ Navigate / highlight / click  →  SSE → browser executes JS
        ├─ Restyle UI                    →  window.__fluid.css() → persistent <style> tag
        ├─ Open wizard                   →  window.__fluid.wizardOpen() → React state
        ├─ Open desktop app              →  child_process.exec("open -a ...")
        └─ Change Electron app           →  Chrome DevTools Protocol on :9224
                │
                ▼
        (optionally) GitHub PR with your voice transcript as context
```

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| AI | Anthropic Claude `claude-sonnet-4-6` |
| Voice | AgentPhone (outbound call + webhook) |
| Real-time | Server-Sent Events (`/api/stream`) |
| Desktop control | Chrome DevTools Protocol (`ws` on port 9224) |
| Font | Geist (via `next/font`) |
| UI | Tailwind CSS + shadcn/ui |
| PRs | GitHub REST API |

---

## Setup

### 1. Install

```bash
git clone https://github.com/hetpatel-11/Fluid
cd Fluid
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
AGENTPHONE_API_KEY=...
GITHUB_TOKEN=...
GITHUB_REPO=owner/repo
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Electron app control

Launch any Electron app with the Chrome DevTools Protocol exposed:

```bash
open -a "Codex"              --args --remote-debugging-port=9224
open -a "Visual Studio Code" --args --remote-debugging-port=9224
open -a "Slack"              --args --remote-debugging-port=9224
```

Then go to `/electron`, click **Ask Fluid**, and speak — *"make the font bigger"*, *"hide the sidebar"*, *"dark mode"*, etc.

> Port 9222 is never touched — your existing debug sessions are safe.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── aws/page.tsx              # AWS console demo
│   ├── electron/page.tsx         # Electron app control
│   └── api/
│       ├── webhook/route.ts      # AgentPhone webhook → Claude → actions
│       ├── stream/route.ts       # SSE stream to browser
│       └── cdp-status/route.ts   # CDP connection status
├── components/
│   ├── aws/
│   │   ├── FluidCallButton.tsx   # "Ask Fluid" phone button
│   │   ├── FluidOverlay.tsx      # Live transcript panel
│   │   └── CreateWizards.tsx     # S3 + RDS multi-step wizards
│   └── FluidLogo.tsx
└── lib/
    ├── claude.ts                 # Claude prompt + processVoiceCommand()
    ├── events.ts                 # SSE emitter
    ├── zap.ts                    # CDP Electron control
    └── github.ts                 # PR creation
```

---

<p align="center">
  Built at <strong>YC · Call My Agent Hackathon · San Francisco · 2026</strong><br/>
  <sub>AgentPhone · Anthropic Claude · Chrome DevTools Protocol</sub>
</p>
