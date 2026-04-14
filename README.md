# Reciter

## Setup

Requirements:

- node >= 18.0.0
- pnpm >= 10.30.3

Install dependencies:

```
$ pnpm install
```

## Run

Run the project then use Expo Go:

```
$ pnpm start
```

If need be, clear the cache:

```
$ pnpm start --clear
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
$ pnpm exec install --check
```