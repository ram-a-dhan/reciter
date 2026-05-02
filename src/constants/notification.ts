export const LISTENER_NOTIFICATION_CHANNEL_ID = "listener-channel" as const;

export const LISTENER_NOTIFICATION_CATEGORY_ID = "listener-category" as const;

export const LISTENER_NOTIFICATION_IDENTIFIER = "listener-notification" as const;

export const LISTENER_NOTIFICATION_ACTION_ID = {
  STOP_LISTENING: "STOP_LISTENING"
} as const;

export const NOTIFICATION_ICON_SIZE = {
  "mipmap-mdpi": 24,
  "mipmap-hdpi": 36,
  "mipmap-xhdpi": 48,
  "mipmap-xxhdpi": 72,
  "mipmap-xxxhdpi": 96,
} as const;
