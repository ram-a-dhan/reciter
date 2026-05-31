#!/usr/bin/env node

/**
 * generateTranslationAudio.mjs
 *
 * Generates per-verse translation audio using edge-tts and converts to
 * opus at 24kbps using ffmpeg for minimal file size.
 *
 * Prerequisites:
 *   pipx install edge-tts
 *   sudo apt install ffmpeg
 *
 * Input:
 *   src/assets/quran/translations/quran-translation-en.json
 *   src/assets/quran/translations/quran-translation-id.json
 *
 * Output:
 *   src/assets/translations/en/{chapter}{verse}.opus
 *   src/assets/translations/id/{chapter}{verse}.opus
 *
 * Usage:
 *   node scripts/generateTranslationAudio.mjs
 *   node scripts/generateTranslationAudio.mjs --lang en
 *   node scripts/generateTranslationAudio.mjs --lang id
 *   node scripts/generateTranslationAudio.mjs --lang en --from 2 --verse 255
 *   node scripts/generateTranslationAudio.mjs --delay 500
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import { promisify } from "util";
import os from "os";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────

const LANGUAGES = {
  en: {
    voice: "en-US-ChristopherNeural",
    rate: "+0%",
    corpus: "quran-translation-en.json",
    outputDir: "en",
  },
  id: {
    voice: "id-ID-ArdiNeural",
    rate: "-25%",
    corpus: "quran-translation-id.json",
    outputDir: "id",
  },
};

const CORPUS_DIR = path.resolve(__dirname, "../assets/quran/translations");
const OUTPUT_BASE = path.resolve(__dirname, "../assets/translations");
const TMP_DIR = os.tmpdir();

const DEFAULTS = {
  delay: 300,       // ms between verses (be polite to edge-tts servers)
  retries: 3,
  retryDelay: 3_000,
};

// ─── Args ─────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 && args[i + 1] ? args[i + 1] : null;
  };
  const getNum = (flag, def) => {
    const v = get(flag);
    return v !== null ? Number(v) : def;
  };

  const langArg = get("--lang");
  const langs = langArg
    ? [langArg]
    : Object.keys(LANGUAGES);

  return {
    langs,
    fromChapter: getNum("--from", 1),
    fromVerse: getNum("--verse", 1),
    delay: getNum("--delay", DEFAULTS.delay),
    retries: getNum("--retries", DEFAULTS.retries),
    retryDelay: getNum("--retry-delay", DEFAULTS.retryDelay),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n) {
  return String(n).padStart(3, "0");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatEta(remaining, avgMs) {
  const totalSec = Math.round((remaining * avgMs) / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `~${min}m ${sec}s` : `~${sec}s`;
}

async function checkDependency(cmd) {
  try {
    const flag = cmd === "ffmpeg" ? "-version" : "--version";
    await execFileAsync(cmd, [flag]);
    return true;
  } catch {
    return false;
  }
}

// ─── Core ─────────────────────────────────────────────────────────────────────

async function generateVerse(text, voice, rate, destPath, retries, retryDelay) {
  const tmpMp3 = path.join(TMP_DIR, `edge_tts_${Date.now()}.mp3`);

  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Generate mp3 via edge-tts
      await execFileAsync("edge-tts", [
        "--voice", voice,
        "--rate=" + rate,
        "--text", text,
        "--write-media", tmpMp3,
      ]);

      if (!fs.existsSync(tmpMp3) || fs.statSync(tmpMp3).size === 0) {
        throw new Error("edge-tts produced empty output");
      }

      // Convert to opus at 24kbps via ffmpeg
      await execFileAsync("ffmpeg", [
        "-y",                    // overwrite output
        "-i", tmpMp3,            // input
        "-c:a", "libopus",       // opus codec
        "-b:a", "24k",           // 24kbps
        "-vbr", "on",            // variable bitrate
        "-compression_level", "10", // max compression
        "-application", "voip",  // optimised for speech
        destPath,
      ]);

      if (!fs.existsSync(destPath) || fs.statSync(destPath).size === 0) {
        throw new Error("ffmpeg produced empty output");
      }

      return fs.statSync(destPath).size;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        console.log(
          `  ⚠  Attempt ${attempt}/${retries} failed: ${err.message}. Retrying in ${retryDelay / 1000}s…`
        );
        await sleep(retryDelay);
      }
    } finally {
      if (fs.existsSync(tmpMp3)) fs.unlinkSync(tmpMp3);
    }
  }

  throw new Error(`Failed after ${retries} attempts: ${lastError?.message}`);
}

async function generateLanguage(langCode, config, args) {
  const { voice, rate, corpus, outputDir } = config;
  const { fromChapter, fromVerse, delay, retries, retryDelay } = args;

  const corpusPath = path.join(CORPUS_DIR, corpus);
  if (!fs.existsSync(corpusPath)) {
    console.error(`❌ Corpus not found: ${corpusPath}`);
    console.error(`   Run buildTranslationCorpus.mjs first.`);
    process.exit(1);
  }

  const outDir = path.join(OUTPUT_BASE, outputDir);
  fs.mkdirSync(outDir, { recursive: true });

  const verses = JSON.parse(fs.readFileSync(corpusPath, "utf-8"));

  // Filter from --from/--verse if resuming
  const todo = verses.filter(
    (v) =>
      v.chapterNumber > fromChapter ||
      (v.chapterNumber === fromChapter && v.verseNumber >= fromVerse)
  );

  console.log(`\n🗣  [${langCode}] Voice: ${voice}`);
  console.log(`📄 Corpus: ${corpus} (${verses.length} verses total)`);
  console.log(`📦 Output: ${outDir}`);
  console.log(`▶  Starting from ${pad(fromChapter)}:${pad(fromVerse)} — ${todo.length} verse(s) to generate\n`);

  const failed = [];
  let generated = 0;
  let skipped = 0;
  let totalBytes = 0;
  const times = [];

  for (let i = 0; i < todo.length; i++) {
    const { chapterNumber, verseNumber, text } = todo[i];
    const filename = `${pad(chapterNumber)}${pad(verseNumber)}.opus`;
    const destPath = path.join(outDir, filename);
    const position = `[${i + 1}/${todo.length}]`;

    // Skip already generated
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      skipped++;
      continue;
    }

    process.stdout.write(`${position} ${pad(chapterNumber)}:${pad(verseNumber)}… `);

    const t0 = Date.now();

    try {
      const bytes = await generateVerse(text, voice, rate, destPath, retries, retryDelay);
      const elapsed = Date.now() - t0;

      totalBytes += bytes;
      generated++;
      times.push(elapsed + delay);

      const avgMs = times.reduce((a, b) => a + b, 0) / times.length;
      const remaining = todo.length - i - 1 - skipped;
      const eta = remaining > 0 ? `  ETA ${formatEta(remaining, avgMs)}` : "";
      console.log(`✅ ${formatBytes(bytes)}${eta}`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed.push({ chapterNumber, verseNumber, error: err.message });
    }

    if (i < todo.length - 1) await sleep(delay);
  }

  // ─── Summary ────────────────────────────────────────────────────────────────

  console.log(`\n─────────────────────────────────────`);
  console.log(`[${langCode}] ✅ Generated : ${generated} (${formatBytes(totalBytes)})`);
  console.log(`[${langCode}] ⏭  Skipped   : ${skipped} already present`);
  console.log(`[${langCode}] ❌ Failed     : ${failed.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed verses:`);
    for (const { chapterNumber, verseNumber, error } of failed) {
      console.log(`  ${pad(chapterNumber)}:${pad(verseNumber)} — ${error}`);
    }
    console.log(
      `\nResume with: node scripts/generateTranslationAudio.mjs --lang ${langCode} --from <chapter> --verse <verse>`
    );
  }

  return failed.length === 0;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();

  // Check dependencies
  const hasEdgeTts = await checkDependency("edge-tts");
  const hasFfmpeg = await checkDependency("ffmpeg");

  if (!hasEdgeTts) {
    console.error("❌ edge-tts not found. Install with: pipx install edge-tts");
    process.exit(1);
  }
  if (!hasFfmpeg) {
    console.error("❌ ffmpeg not found. Install with: sudo apt install ffmpeg");
    process.exit(1);
  }

  let allSuccess = true;

  for (const langCode of args.langs) {
    if (!LANGUAGES[langCode]) {
      console.error(`❌ Unknown language: ${langCode}. Available: ${Object.keys(LANGUAGES).join(", ")}`);
      process.exit(1);
    }
    const success = await generateLanguage(langCode, LANGUAGES[langCode], args);
    if (!success) allSuccess = false;
  }

  if (!allSuccess) process.exit(1);
  console.log("\n✅ All done.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
