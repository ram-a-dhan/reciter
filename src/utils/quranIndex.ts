// utils/quranIndex.ts
//
// Singleton that loads the Tanzil corpus and holds the Fuse index in memory.
// Call initQuranIndex() once at app startup (in useListener's setup effect).
// Call getQuranIndex() anywhere you need to search.

import quranCorpus from "@/assets/quran/quran-corpus.json";
import type { IVerseEntry } from "@/utils/verseMatcher";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let corpus: IVerseEntry[] | null = null;

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

export async function initQuranIndex(): Promise<void> {
  if (corpus !== null) return;
  corpus = quranCorpus as IVerseEntry[];
}

// ---------------------------------------------------------------------------
// Getter
// ---------------------------------------------------------------------------

/**
 * Returns the Fuse index. Throws if initQuranIndex() hasn't completed yet.
 */
export function getQuranIndex(): IVerseEntry[] {
  if (corpus === null) {
    throw new Error(
      "quranIndex: corpus not initialized — call initQuranIndex() first",
    );
  }
  return corpus;
}

// ---------------------------------------------------------------------------
// Release (optional, for testing or full app reset)
// ---------------------------------------------------------------------------

export function releaseQuranIndex(): void {
  corpus = null;
}
