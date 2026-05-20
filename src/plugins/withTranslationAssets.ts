import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import fs from "fs";
import path from "path";

const ALLOWED_EXTS = new Set([".mp3", ".ogg", ".opus"]);

const copyRecursive = (src: string, dest: string) => {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (ALLOWED_EXTS.has(path.extname(entry.name).toLowerCase())) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const withTranslationAssets: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    (config) => {
      const src = path.resolve(config.modRequest.projectRoot, "src/assets/translations");
      const dest = path.resolve(
        config.modRequest.platformProjectRoot,
        "app/src/main/assets/translations"
      );

      copyRecursive(src, dest);

      return config;
    },
  ]);
};

export default withTranslationAssets;
