import { NextRequest, NextResponse } from "next/server";
import { callUser } from "@/lib/agentphone";

export async function POST(req: NextRequest) {
  const { phoneNumber } = await req.json();

  if (!phoneNumber) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  try {
    const call = await callUser(phoneNumber);
    return NextResponse.json({ success: true, callId: call.id });
  } catch (e) {
    console.error("Call failed:", e);
    return NextResponse.json({ error: "Failed to initiate call" }, { status: 500 });
  }
}
