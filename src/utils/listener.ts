import { initWhisper, WhisperContext } from "whisper.rn";
import { WHISPER_MODEL } from "@/constants/model";

interface IStartListenerTranscriptionOptions {
  onText: (text: string) => void;
  onEnd: () => void;
}

let whisperContext: WhisperContext | null = null;
let stopTranscription: (() => Promise<void>) | null = null;

export async function initListenerInstance() {
  if (whisperContext) return;

  try {
    whisperContext = await initWhisper({
      filePath: WHISPER_MODEL,
    });
  } catch (error) {
    console.error("listener init error:", error);
  }
}

export async function startListenerTranscription({
  onText,
  onEnd,
}: IStartListenerTranscriptionOptions) {
  if (!whisperContext) return;

  try {
    const {
      stop,
      subscribe,
    } = await whisperContext.transcribeRealtime({
      language: "ar",
      temperature: 0,
      realtimeAudioSec: 60,
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
