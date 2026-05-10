// scripts/buildQuranCorpus.mjs
//
// Converts quran-simple-clean.txt to a pre-normalized quran-corpus.json.
// Run once manually from the project root:
//   node scripts/buildQuranCorpus.mjs
//
// Input:  assets/quran/quran-simple-clean.txt
// Output: assets/quran/quran-corpus.json

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT = resolve(__dirname, "../assets/quran/quran-simple-clean.txt");
const OUTPUT = resolve(__dirname, "../assets/quran/quran-corpus.json");

// ---------------------------------------------------------------------------
// Normalization (mirrors verseMatcher.ts normalize())
// ---------------------------------------------------------------------------

function normalize(text) {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[\u0623\u0625\u0622\u0671]/g, "\u0627")
    .trim();
}

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

const raw = readFileSync(INPUT, "utf8");

const corpus = raw
  .split("\n")
  .filter((line) => line.trim() !== "" && !line.startsWith("#"))
  .map((line) => {
    const parts = line.split("|");
    const chapterNumber = parseInt(parts[0], 10);
    const verseNumber = parseInt(parts[1], 10);
    const text = normalize(parts.slice(2).join("|"));
    return { chapterNumber, verseNumber, text };
  })
  .filter(
    (e) =>
      !isNaN(e.chapterNumber) && !isNaN(e.verseNumber) && e.text.length > 0,
  );

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

writeFileSync(OUTPUT, JSON.stringify(corpus), "utf8");
console.log(`Done — ${corpus.length} verses written to ${OUTPUT}`);
