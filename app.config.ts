import "tsx/cjs";
import { ConfigContext, ExpoConfig } from "expo/config";

module.exports = ({ config } : ConfigContext): ExpoConfig => ({
  ...config,
  "name": "Reciter",
  "slug": "reciter",
  "scheme": "reciter",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./src/assets/icons/reciter/reciter1.png",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true,
  "notification": {
    "icon": "./src/assets/icons/reciter/notification-icon.png",
  },
  "ios": {
    "supportsTablet": true,
    "icon": {
      "light": "./src/assets/icons/reciter/ios-light.png",
      "dark": "./src/assets/icons/reciter/ios-dark.png",
      "tinted": "./src/assets/icons/reciter/ios-tinted.png",
    },
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./src/assets/icons/reciter/adaptive-icon.png",
      "monochromeImage": "./src/assets/icons/reciter/adaptive-icon.png",
      "backgroundColor": "#ffffff",
    },
    "edgeToEdgeEnabled": true,
    "predictiveBackGestureEnabled": false,
    "package": "com.anonymous.reciter",
  },
  "web": {
    "favicon": "./src/assets/favicon.png",
  },
  "assetBundlePatterns": [
    "src/assets/**/*",
  ],
  "plugins": [
    "expo-router",
    "expo-system-ui",
    "expo-navigation-bar",
    "expo-font",
    "expo-audio",
    "expo-asset",
    [
      "expo-build-properties",
      {
        "android": {
          "minSdkVersion": 24,
          "targetSdkVersion": 35,
          "compileSdkVersion": 35,
          "buildToolsVersion": "35.0.0",
        },
      },
    ],
    [
      "expo-splash-screen",
      {
        "image": "./src/assets/icons/reciter/splash-icon.png",
        "backgroundColor": "#408040",
        "imageWidth": 200,
        "resizeMode": "contain",
      },
    ],
    "./src/plugins/withNotifyKit",
    "./src/plugins/withTranslationAssets",
  ],
  "experiments": {
    "typedRoutes": true,
  },
})
