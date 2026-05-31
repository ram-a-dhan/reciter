# Reciter

## Setup

Requirements:

- node >= 18.0.0
- pnpm >= 10.30.3

Install dependencies:

```
$ pnpm install
```

### Model

Download the models from:

```
https://huggingface.co/ram-a-dhan/tarteel-whisper-quran-ggml
```

And put them in:

```
src/assets/models/
```

Then change the export path of the `WHISPER_MODEL` constant accordingly:

```ts
// src/constants/model.ts

export { default as WHISPER_MODEL } from "@/assets/models/*.bin";
```

### Translations

#### Prototype Translation

Download the prototype translation:

```
$ node src/scripts/downloadPrototypeTranslation.mjs
```

Then unzip all of them:

```sh
$ for f in src/assets/translations/prototype/*.zip; do unzip -n "$f" -d src/assets/translations/prototype/; done
```

#### Edge TTS Translations

Download the translation `.txt` file from:

```
https://tanzil.net/trans
```

Then add to the languages in the `buildTranslationCorpus.mjs`:

```ts
const LANGUAGES = [
  ...,
  {
    code: "<two-letter-lang-code>",
    inputFile: "<tanzil-translation-text-file>",
    outputFile: "quran-translation-<two-letter-lang-code>.json",
  },
];
```

Then run the script:

```
$ node src/scripts/buildTranslationCorpus.mjs
```

After that, add to the languages in the `generateTranslationAudio.mjs`:

```ts

const LANGUAGES = {
  ...,
  ["<two-letter-lang-code>"]: {
    voice: "<voice-preset>",
    rate: "+0%",
    corpus: "quran-translation-<two-letter-lang-code>.json",
    outputDir: "<two-letter-lang-code>",
  },
};
```

Then run the script:

```
$ node src/scripts/generateTranslationAudio.mjs --lang <two-letter-lang-code>
```

## Run

### Expo Go

Run the project then use Expo Go:

```
$ pnpm start
```

If need be, clear the cache:

```
$ pnpm start --clear
```

### Dev Build

Prepare your device or emulator then run it:

```
$ pnpm run:android
```

## Install Packages

Install regular packages:

```
$ pnpm add <package_name>
```

Install React Native or Expo-related packages:

```
$ pnpm exec expo install <package_name>
```

## Troubleshoot

Diagnose dependencies and version compatibilities:

```
$ pnpm dlx expo-doctor

# or

$ pnpm diag
```

Fix diagnosed problems:

```
$ pnpm exec expo install --check

# or

$ pnpm fix
```