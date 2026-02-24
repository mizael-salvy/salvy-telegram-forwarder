# Salvy Telegram Forwarder

Forward SMS messages from [Salvy](https://salvy.com.br) virtual phone numbers to a Telegram chat or group.

```
SMS → Salvy Virtual Number → Webhook → This Service → Telegram
```

## Quick Start

```bash
# Install dependencies
npm install

# Set your env vars
cp .env.example .env
# Edit .env with your values

# Start the server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SALVY_WEBHOOK_SECRET` | Svix signing secret from Salvy webhook settings (`whsec_...`) |
| `TELEGRAM_BOT_TOKEN` | Bot token from [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | Target Telegram chat or group ID |
| `PORT` | Server port (default: `3000`) |

## How It Works

Salvy uses [Svix](https://svix.com) for webhook delivery. When an SMS arrives at your Salvy virtual number, Salvy sends a `POST` to your `/webhook` endpoint with an `sms.received` event payload signed with HMAC-SHA256.

This service:
1. Verifies the Svix signature (rejects invalid or replayed requests)
2. Formats the SMS into a readable message
3. Sends it to your configured Telegram chat via the Bot API

## Production Deployment

See [DEPLOY.md](./DEPLOY.md) for step-by-step instructions for Vercel, Railway, and Fly.io.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with hot reload (tsx watch) |
| `npm start` | Start the server |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Type check without emitting |
