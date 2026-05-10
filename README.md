# Reciter

## Setup

Requirements:

- node >= 18.0.0
- pnpm >= 10.30.3

Install dependencies:

```
$ pnpm install
```

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

Download the VAD (Voice Activation Detection) model from:

```
https://huggingface.co/ggml-org/whisper-vad
```

And put them in:

```
src/assets/models/
```

Make sure the filename and path matches with the import path:

```ts
// src/constants/model.ts

export { default as VAD_MODEL } from "@/assets/models/ggml-silero-v6.2.0.bin";
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
$ pnpm android
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
```

Fix diagnosed problems:

```
$ pnpm exec expo install --check
```