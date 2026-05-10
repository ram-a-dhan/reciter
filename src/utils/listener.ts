import { initWhisper, initWhisperVad } from "whisper.rn";
import type { WhisperContext, WhisperVadContext } from "whisper.rn";
import { RealtimeTranscriber } from "whisper.rn/realtime-transcription/RealtimeTranscriber.js";
import { AudioPcmStreamAdapter } from "whisper.rn/realtime-transcription/adapters/AudioPcmStreamAdapter.js";
import { VAD_MODEL, WHISPER_MODEL } from "@/constants/model";

interface IStartListenerTranscriptionOptions {
  onText: (text: string) => void;
  onEnd: () => void;
}

let whisperContext: WhisperContext | null = null;
let vadContext: WhisperVadContext | null = null;
let transcriber: RealtimeTranscriber | null = null;
let isInitializing = false;
let isStarting = false;
let isStoppingManually = false;
let lastText = "";

function isWhisperContextValid(ctx: WhisperContext | null): boolean {
  if (!ctx) return false;
  const ptr = (ctx as any).ptr;
  return typeof ptr === "number" && ptr > 0;
}

function isVadContextValid(ctx: WhisperVadContext | null): boolean {
  if (!ctx) return false
  const id = (ctx as any).id
  return typeof id === 'number' && id > 0
}

export async function initListenerInstance() {
  if ((isWhisperContextValid(whisperContext) && isVadContextValid(vadContext)) || isInitializing) return;
  isInitializing = true;

  try {
    whisperContext = null;
    whisperContext = await initWhisper({
      filePath: WHISPER_MODEL,
    });
    vadContext = null;
    vadContext = await initWhisperVad({
      filePath: VAD_MODEL,
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

  if (!isWhisperContextValid(whisperContext) || !isVadContextValid(vadContext)) {
    await initListenerInstance();
  }

  await stopListenerTranscription();

  try {
    const audioStream = new AudioPcmStreamAdapter();

    transcriber = new RealtimeTranscriber(
      {
        whisperContext: whisperContext!,
        vadContext: vadContext!,
        audioStream,
      },
      {
        // TODO: Fine-tune transcriber options
        audioSliceSec: 30,
        audioMinSec: 1,
        promptPreviousSlices: false,
        vadPreset: "sensitive",
        initialPrompt: "بسم الله الرحمن الرحيم",
        autoSliceOnSpeechEnd: true,
        autoSliceThreshold: 0.3,
        vadThrottleMs: 500,
        vadOptions: {
          threshold: 0.3,
          minSpeechDurationMs: 200,
          minSilenceDurationMs: 100,
          maxSpeechDurationS: 15,
          speechPadMs: 50,
          samplesOverlap: 0.2,
        },
        transcribeOptions: {
          language: 'ar',
          temperature: 0,
          beamSize: 5,
          bestOf: 5,
          maxContext: 0,
        },
      },
      {
        onTranscribe: (event) => {
          // Skip start/end marker events — only process actual transcriptions
          if (event.type !== "transcribe") return;

          const fullText = event.data?.result?.trim();
          if (!fullText) return;

          const newText = fullText.slice(lastText.length).trim();
          lastText = fullText;
          if (!newText) return;

          onText(newText);
        },
        onStatusChange: (isActive) => {
          // Only fire onEnd when audio stops naturally, not when we stop manually
          if (!isActive && !isStoppingManually) {
            onEnd();
          }
        },
        onError: (error) => {
          console.error("transcriber error:", error);
        },
      },
    );

    await transcriber.start();
  } catch (error) {
    console.error("listener start error:", error);
    whisperContext = null;
  } finally {
    isStarting = false;
  }
}

export async function stopListenerTranscription() {
  if (!transcriber) return;
  isStoppingManually = true;

  try {
    await transcriber.stop();
    await transcriber.release();
  } catch (error) {
    console.error("listener stop error:", error);
  } finally {
    lastText = "";
    transcriber = null;
    isStoppingManually = false;
  }
}

export async function releaseListenerInstance() {
  await stopListenerTranscription();
  await whisperContext?.release();
  await vadContext?.release();
  whisperContext = null;
  vadContext = null;
}
