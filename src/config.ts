export interface Config {
  SALVY_WEBHOOK_SECRET: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  PORT: string;
}

export function getConfig(): Partial<Config> {
  return {
    SALVY_WEBHOOK_SECRET: process.env.SALVY_WEBHOOK_SECRET,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    PORT: process.env.PORT || "3000",
  };
}

export function isConfigured(): boolean {
  const config = getConfig();
  return !!(
    config.SALVY_WEBHOOK_SECRET &&
    config.TELEGRAM_BOT_TOKEN &&
    config.TELEGRAM_CHAT_ID
  );
}
