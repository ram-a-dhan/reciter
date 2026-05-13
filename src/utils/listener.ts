import { initWhisper, WhisperContext } from "whisper.rn/index.js";
import { WHISPER_MODEL } from "@/constants/model";

interface IStartListenerTranscriptionOptions {
  onText: (text: string) => void;
  onEnd: () => void;
}

let whisperContext: WhisperContext | null = null;
let stopTranscription: (() => Promise<void>) | null = null;
let isInitializing = false;
let isStarting = false;
let lastText = "";

function isWhisperContextValid(ctx: WhisperContext | null): boolean {
  if (!ctx) return false;
  const ptr = (ctx as any).ptr;
  return typeof ptr === "number" && ptr > 0;
}

export async function initListenerInstance() {
  if (isWhisperContextValid(whisperContext) || isInitializing) return;
  isInitializing = true;

  try {
    whisperContext = null;
    whisperContext = await initWhisper({
      filePath: WHISPER_MODEL,
    });
  } catch (error) {
    console.error("listener init error:", error);
  } finally {
    isInitializing = false;
  }
}

export async function startListenerTranscription({
  onText,
  onEnd,
}: IStartListenerTranscriptionOptions) {
  if (isStarting) return;
  isStarting = true;

  if (!isWhisperContextValid(whisperContext)) {
    await initListenerInstance();
  }

  await stopListenerTranscription();

  try {
    const { stop, subscribe } = await whisperContext!.transcribeRealtime({
      language: "ar",
      prompt: "بسم الله الرحمن الرحيم" ,
      realtimeAudioSec: 3600 * 3, // 3 hours
      realtimeAudioSliceSec: 15,
      realtimeAudioMinSec: 2,
      beamSize: 5,
      bestOf: 5,
      maxContext: -1,
      temperature: 0.2,
      useVad: true,
      vadThold: 0.5,
    });
 
    stopTranscription = stop;
 
    subscribe((event) => {
      const fullText = event.data?.result?.trim();
      if (fullText) {
        const newText = fullText.slice(lastText.length).trim();
        lastText = fullText;
        if (newText) onText(newText);
      }
      if (!event.isCapturing) onEnd();
    });
  } catch (error) {
    console.error("listener start error:", error);
    whisperContext = null;
  } finally {
    isStarting = false;
  }
}

export async function stopListenerTranscription() {
  await stopTranscription?.();
  stopTranscription = null;
  lastText = "";
}

export async function releaseListenerInstance() {
  await stopListenerTranscription();
  await whisperContext?.release();
  whisperContext = null;
}
