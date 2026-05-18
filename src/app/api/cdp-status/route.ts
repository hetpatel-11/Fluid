import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:9224/json", { signal: AbortSignal.timeout(1500) });
    const targets = await res.json() as Array<{ type: string; title?: string }>;
    const page = targets.find((t) => t.type === "page");
    return NextResponse.json({ connected: !!page, title: page?.title ?? null });
  } catch {
    return NextResponse.json({ connected: false, title: null });
  }
}
