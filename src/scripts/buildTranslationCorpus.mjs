#!/usr/bin/env node

/**
 * buildTranslationCorpus.mjs
 *
 * Parses Tanzil pipe-delimited translation files and outputs per-language
 * JSON corpus files to src/assets/quran/.
 *
 * Input files (download from tanzil.net and place in scripts/):
 *   scripts/en.sahih.txt
 *   scripts/id.indonesian.txt
 *
 * Output:
 *   src/assets/quran/quran-translation-en.json
 *   src/assets/quran/quran-translation-id.json
 *
 * Usage:
 *   node scripts/buildTranslationCorpus.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LANGUAGES = [
  {
    code: "en",
    inputFile: "en.sahih.txt",
    outputFile: "quran-translation-en.json",
  },
  {
    code: "id",
    inputFile: "id.indonesian.txt",
    outputFile: "quran-translation-id.json",
  },
];

const INPUT_DIR = path.resolve(__dirname, "../assets/quran/translations");
const OUTPUT_DIR = path.resolve(__dirname, "../assets/quran/translations");

function parseTranslationFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const entries = [];

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();

    // Skip empty lines and comments (Tanzil files start with # headers)
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [chapterStr, verseStr, ...textParts] = trimmed.split("|");
    const chapterNumber = parseInt(chapterStr, 10);
    const verseNumber = parseInt(verseStr, 10);
    const text = textParts.join("|").trim().replace(/[\[\]\(\)]/g, ""); // rejoin in case text contains |

    if (isNaN(chapterNumber) || isNaN(verseNumber) || !text) {
      console.warn(`  ⚠ Skipping malformed line: ${trimmed.slice(0, 60)}`);
      continue;
    }

    entries.push({ chapterNumber, verseNumber, text });
  }

  return entries;
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const { code, inputFile, outputFile } of LANGUAGES) {
    const inputPath = path.join(INPUT_DIR, inputFile);
    const outputPath = path.join(OUTPUT_DIR, outputFile);

    if (!fs.existsSync(inputPath)) {
      console.error(`❌ Missing input file: ${inputPath}`);
      console.error(`   Download from https://tanzil.net/trans/${code === "en" ? "en.sahih" : "id.indonesian"}`);
      process.exit(1);
    }

    process.stdout.write(`Parsing ${inputFile}… `);
    const entries = parseTranslationFile(inputPath);
    console.log(`${entries.length} verses`);

    fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2), "utf-8");
    console.log(`✅ Written → ${outputPath}\n`);
  }

  console.log("Done.");
}

main();
