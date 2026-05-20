/**
 * translationPlayer.ts
 *
 * Plays per-verse English translation audio from the bundled asset folder.
 * Files live in android/app/src/main/assets/translations/{chapterPadded}{versePadded}.mp3
 * and are accessed via asset:/// URIs — no Metro bundling or file copying needed.
 *
 * Usage (Option A — whisper drives, player follows):
 *   On verse match → playTranslation(chapter, verse)
 *   Player plays the file and goes idle when done.
 *   Next whisper match triggers the next file.
 *
 * Singleton — one player instance, one file at a time.
 */

import { AudioPlayer, createAudioPlayer } from "expo-audio";

interface ITranslationItemInternal {
  translation: string;
  chapter: number;
  verse: number;
}

interface ITranslationItemExternal {
  translation?: string;
  chapter: number;
  verse: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(3, "0");
}

function getTranslationUri({
  translation,
  chapter,
  verse,
}: ITranslationItemInternal): string {
  return `asset:///translations/${translation}/${pad(chapter)}${pad(verse)}.mp3`;
}

// ─── State ────────────────────────────────────────────────────────────────────

let player: AudioPlayer | null = null;
let queue: ITranslationItemInternal[] = [];
let isPlaying = false;

// ─── Internal ─────────────────────────────────────────────────────────────────

function playNext() {
  if (queue.length === 0) {
    isPlaying = false;
    return;
  }

  const { chapter, verse, translation } = queue.shift()!;

  try {
    if (player) {
      try { player.remove(); } catch {}
      player = null;
    }

    const uri = getTranslationUri({
      translation,
      chapter,
      verse,
    });
    player = createAudioPlayer({ uri });

    player.addListener("playbackStatusUpdate", (status) => {
      if (status.didJustFinish) {
        playNext();
      }
    });

    isPlaying = true;
    player.play();
  } catch (err) {
    console.error(`translation player error: failed to play ${chapter}:${verse}`, err);
    // skip broken item and try next
    playNext();
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function playTranslation({
  translation = "prototype",
  chapter,
  verse,
}: ITranslationItemExternal) {
  queue.push({ chapter, verse, translation });
  if (!isPlaying) playNext();
}

export function stopTranslation() {
  queue = [];
  isPlaying = false;
  if (player) {
    try { player.remove(); } catch {}
    player = null;
  }
}

export function isTranslationPlaying(): boolean {
  return isPlaying;
}
