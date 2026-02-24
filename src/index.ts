import express from "express";
import "dotenv/config";
import { getConfig, isConfigured } from "./config.js";
import { verifyWebhook, type SvixHeaders } from "./verify.js";
import { sendMessage } from "./telegram.js";
import { formatSmsMessage,isSmsReceivedEventPayload } from "./formatter.js";

const app = express();

// Track last forwarded SMS
let lastForwardedAt: Date | null = null;

// --- Raw body parser for webhook route (needed for Svix verification) ---
app.post(
  "/webhook",
  express.raw({ type: "*/*" }),
  async (req, res): Promise<void> => {
    const config = getConfig();

    if (!config.SALVY_WEBHOOK_SECRET || !config.TELEGRAM_BOT_TOKEN || !config.TELEGRAM_CHAT_ID) {
      res.status(503).json({ error: "Service not configured" });
      return;
    }

    const headers: SvixHeaders = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
      res.status(400).json({ error: "Missing webhook headers" });
      return;
    }

    let payload: { type?: string; data?: Record<string, unknown> };
    try {
      payload = verifyWebhook(
        config.SALVY_WEBHOOK_SECRET,
        req.body,
        headers
      ) as typeof payload;
    } catch (err) {
      console.error("Webhook verification failed:", (err as Error).message);
      res.status(400).json({ error: "Invalid signature" });
      return;
    }

    // Only process sms.received events
    if (!isSmsReceivedEventPayload(payload)) {
      res.status(200).json({ ok: true, skipped: true });
      return;
    }

    const text = formatSmsMessage(payload.data);

    try {
      const result = await sendMessage(
        config.TELEGRAM_BOT_TOKEN,
        config.TELEGRAM_CHAT_ID,
        text
      );

      if (!result.ok) {
        console.error("Telegram send failed:", result.description);
        res.status(502).json({ error: "Telegram send failed" });
        return;
      }

      lastForwardedAt = new Date();
      console.log("SMS forwarded to Telegram");
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Telegram send error:", (err as Error).message);
      res.status(502).json({ error: "Telegram send error" });
    }
  }
);

// --- Status page ---
app.get("/", (_req, res) => {
  if (!isConfigured()) {
    res.status(503).send("Not configured. Set SALVY_WEBHOOK_SECRET, TELEGRAM_BOT_TOKEN, and TELEGRAM_CHAT_ID.");
    return;
  }

  const ago = lastForwardedAt
    ? `${Math.round((Date.now() - lastForwardedAt.getTime()) / 1000)}s ago`
    : "never";

  res.send(`Salvy Telegram Forwarder — running. Last SMS forwarded: ${ago}`);
});

// --- Start server ---
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Salvy Telegram Forwarder running on port ${port}`);
  if (!isConfigured()) {
    console.log("Warning: missing env vars. Set SALVY_WEBHOOK_SECRET, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.");
  }
});
