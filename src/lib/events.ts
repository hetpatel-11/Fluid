import { EventEmitter } from "events";

const emitter = new EventEmitter();
emitter.setMaxListeners(50);

export function emitUIChange(data: { chunks: string[]; request: string }) {
  emitter.emit("ui-change", data);
}

export function emitStatus(message: string) {
  emitter.emit("status", { message });
}

export function emitPR(data: { url: string; request: string }) {
  emitter.emit("pr-created", data);
}

export function emitTranscript(data: { role: "user" | "agent"; text: string }) {
  emitter.emit("transcript", data);
}

export function subscribeToEvents(
  onEvent: (type: string, data: unknown) => void
): () => void {
  const uiHandler = (d: unknown) => onEvent("ui-change", d);
  const statusHandler = (d: unknown) => onEvent("status", d);
  const prHandler = (d: unknown) => onEvent("pr-created", d);
  const transcriptHandler = (d: unknown) => onEvent("transcript", d);

  emitter.on("ui-change", uiHandler);
  emitter.on("status", statusHandler);
  emitter.on("pr-created", prHandler);
  emitter.on("transcript", transcriptHandler);

  return () => {
    emitter.off("ui-change", uiHandler);
    emitter.off("status", statusHandler);
    emitter.off("pr-created", prHandler);
    emitter.off("transcript", transcriptHandler);
  };
}
