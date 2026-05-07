import { initWhisper, WhisperContext } from "whisper.rn";
import { WHISPER_MODEL } from "@/constants/model";

interface IStartListenerTranscriptionOptions {
  onText: (text: string) => void;
  onEnd: () => void;
}

let whisperContext: WhisperContext | null = null;
let stopTranscription: (() => Promise<void>) | null = null;
let isInitializing: boolean = false;
let isStarting: boolean = false;

function isContextValid(ctx: WhisperContext | null): boolean {
  if (!ctx) return false
  const ptr = (ctx as any).ptr
  return typeof ptr === 'number' && ptr > 0
}

export async function initListenerInstance() {
  if (isContextValid(whisperContext) || isInitializing) return;
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

  if (!isContextValid(whisperContext)) {
    await initListenerInstance();
  }

  await stopListenerTranscription();

  try {
    const {
      stop,
      subscribe,
    } = await whisperContext!.transcribeRealtime({
      language: "ar",
      temperature: 0,
      realtimeAudioSec: 60,
      realtimeAudioSliceSec: 10,
      realtimeAudioMinSec: 2,
      beamSize: 5,
      bestOf: 5,
    });
  
    stopTranscription = stop;
  
    subscribe((event) => {
      const text = event.data?.result;
      if (text) onText(text);
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
}

export async function releaseListenerInstance() {
  await stopListenerTranscription();
  await whisperContext?.release();
  whisperContext = null;
}
