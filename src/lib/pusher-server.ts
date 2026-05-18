import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export const FLUID_CHANNEL = "fluid-aws";
export const UI_CHANGE_EVENT = "ui-change";
export const NAVIGATE_EVENT = "navigate";
export const STATUS_EVENT = "status";
