import { AgentPhoneClient } from "agentphone";

export const agentphone = new AgentPhoneClient({
  token: process.env.AGENTPHONE_API_KEY!,
});

export async function callUser(toNumber: string) {
  const agentId = process.env.AGENTPHONE_AGENT_ID!;
  return await agentphone.calls.createOutboundCall({
    agentId,
    toNumber,
  });
}
