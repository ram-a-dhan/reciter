// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IVerseEntry {
  chapterNumber: number;
  verseNumber: number;
  text: string; // normalized full verse text, used by Fuse
}

export interface IMatchResult {
  chapterNumber: number;
  verseNumber: number;
  confidence: number; // 0–1, higher is better
}

interface IMatchVerse {
  sttSlice: string;
  corpus: IVerseEntry[];
  activeChapterNumber?: number;
  activeVerseNumber?: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CONFIDENCE_THRESHOLD = 0.4;
const TIE_DELTA = 0.05;

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Applied to both STT output and corpus text before any comparison.
 *
 * - Strip harakat (diacritics): \u064B–\u065F, \u0670
 * - Normalize alef variants (أ إ آ ٱ) → bare alef (ا)
 */
export function normalize(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[\u0623\u0625\u0622\u0671]/g, "\u0627")
    .trim();
}

// ---------------------------------------------------------------------------
// Matcher
// ---------------------------------------------------------------------------

/**
 * Match a single STT slice against the corpus using word overlap scoring.
 *
 * Scoring:
 *   score = matching words / max(stt word count, verse word count)
 *
 * Context bias:
 *   When scores are tied within TIE_DELTA, prefer verses in the active
 *   chapter with a verse number greater than the last confirmed verse.
 *   Resolves repeated verses (e.g. Ar-Rahman).
 */

export function matchVerse({
  sttSlice,
  corpus,
  activeChapterNumber,
  activeVerseNumber,
}: IMatchVerse): IMatchResult | null {
  const normalizedSlice = normalize(sttSlice);
  const sttWords = normalizedSlice.split(/\s+/).filter(Boolean);
  if (sttWords.length === 0) return null;

  const sttSet = new Set(sttWords);

  let bestScore = 0;
  let tied: { entry: IVerseEntry; score: number }[] = [];

  for (const entry of corpus) {
    if (!entry.text) continue;

    const verseWords = entry.text.split(/\s+/).filter(Boolean);
    if (verseWords.length === 0) continue;

    let matchCount = 0;
    for (const word of verseWords) {
      if (sttSet.has(word)) matchCount++;
    }

    if (matchCount === 0) continue;

    const score = matchCount / Math.max(sttWords.length, verseWords.length);

    if (score > bestScore + TIE_DELTA) {
      bestScore = score;
      tied = [{ entry, score }];
    } else if (score >= bestScore - TIE_DELTA) {
      tied.push({ entry, score });
    }
  }

  if (bestScore < CONFIDENCE_THRESHOLD || tied.length === 0) return null;

  // Context bias — prefer active chapter, next verse
  if (
    tied.length > 1 &&
    activeChapterNumber != null &&
    activeVerseNumber != null
  ) {
    const sameChapter = tied.filter(
      (t) => t.entry.chapterNumber === activeChapterNumber,
    );
    const pool = sameChapter.length > 0 ? sameChapter : tied;
    const next = pool.find((t) => t.entry.verseNumber > activeVerseNumber);
    const chosen = next ?? pool[0];
    return {
      chapterNumber: chosen.entry.chapterNumber,
      verseNumber: chosen.entry.verseNumber,
      confidence: chosen.score,
    };
  }

  return {
    chapterNumber: tied[0].entry.chapterNumber,
    verseNumber: tied[0].entry.verseNumber,
    confidence: tied[0].score,
  };
}
