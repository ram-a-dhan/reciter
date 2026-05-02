import { NOTIFICATION_ICON_SIZE } from "@/constants/notification";
import {
  ConfigPlugin,
  withAppBuildGradle,
  withAndroidManifest,
  withDangerousMod,
} from "expo/config-plugins";
import sharp from "sharp";
import path from "path";
import fs from "fs";

interface IConfigPluginIcon {
  icon?: string;
}

const withNotifyKit: ConfigPlugin<IConfigPluginIcon> = (
  config,
  { icon } = {},
) => {
  // Step 1: Maven
  config = withAppBuildGradle(config, (mod) => {
    const mavenUrl = `maven { url "$rootDir/../node_modules/react-native-notify-kit/android/libs" }`;
    if (!mod.modResults.contents.includes("react-native-notify-kit")) {
      mod.modResults.contents = mod.modResults.contents.replace(
        /allprojects\s*\{[\s\S]*?repositories\s*\{/,
        (match) => `${match}\n        ${mavenUrl}`
      );
    }
    return mod;
  });

  // Step 2: Permissions
  config = withAndroidManifest(config, (mod) => {
    const app = mod.modResults.manifest.application?.[0];
    if (!app) return mod;

    // POST_NOTIFICATIONS and RECORD_AUDIO
    const permissions = mod.modResults.manifest["uses-permission"] || [];
    const permissionsToAdd = [
      "android.permission.POST_NOTIFICATIONS",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_MICROPHONE",
      "android.permission.RECORD_AUDIO",
    ];
    for (const permission of permissionsToAdd) {
      if (!permissions.some((p: any) => p.$?.["android:name"] === permission)) {
        permissions.push({ $: { "android:name": permission } });
      }
    }
    mod.modResults.manifest["uses-permission"] = permissions;

    // Foreground service declaration
    const services = app.service || [];
    if (!services.some((s: any) => s.$?.["android:name"] === "app.notifee.core.ForegroundService")) {
      services.push({
        $: {
          "android:name": "app.notifee.core.ForegroundService",
          "android:exported": "false",
          "android:foregroundServiceType": "microphone",
        },
      });
    }
    app.service = services;

    return mod;
  });

  // Step 3: Icon
  if (icon) {
    config = withDangerousMod(config, [
      "android",
      async (mod) => {
        const iconSource = path.resolve(mod.modRequest.projectRoot, icon);
        const resDir = path.join(
          mod.modRequest.platformProjectRoot,
          "app/src/main/res"
        );

        await Promise.all(
          Object.entries(NOTIFICATION_ICON_SIZE).map(async ([folder, size]) => {
            const outDir = path.join(resDir, folder);
            fs.mkdirSync(outDir, { recursive: true });
            await sharp(iconSource)
              .resize(size, size)
              .png()
              .toFile(path.join(outDir, "notification_icon.png"));
          })
        );

        return mod;
      },
    ]);
  }

  return config;
};

export default withNotifyKit;