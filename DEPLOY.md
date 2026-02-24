# Deployment Guide

All platforms require setting three environment variables:

- `TELEGRAM_BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
- `TELEGRAM_CHAT_ID` — target chat or group ID
- `SALVY_WEBHOOK_SECRET` — Svix signing secret from Salvy (`whsec_...`)

After deploying, configure Salvy's webhook to point to `https://<your-domain>/webhook` with the `sms.received` event.

## Vercel

1. Create `vercel.json`:
   ```json
   {
     "builds": [
       { "src": "src/index.ts", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "src/index.ts" }
     ]
   }
   ```

2. Deploy:
   ```bash
   npx vercel deploy --prod
   ```

3. Set env vars in the Vercel dashboard (Project → Settings → Environment Variables).

## Railway

1. Deploy:
   ```bash
   npx @railway/cli login
   npx @railway/cli init
   npx @railway/cli up
   ```

2. Set env vars via dashboard or CLI:
   ```bash
   npx @railway/cli variables set TELEGRAM_BOT_TOKEN=...
   npx @railway/cli variables set TELEGRAM_CHAT_ID=...
   npx @railway/cli variables set SALVY_WEBHOOK_SECRET=...
   ```

## Fly.io

1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:20-slim
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY . .
   EXPOSE 3000
   CMD ["npx", "tsx", "src/index.ts"]
   ```

2. Deploy:
   ```bash
   fly launch
   fly deploy
   ```

3. Set secrets:
   ```bash
   fly secrets set TELEGRAM_BOT_TOKEN=...
   fly secrets set TELEGRAM_CHAT_ID=...
   fly secrets set SALVY_WEBHOOK_SECRET=...
   ```

## Salvy Webhook Setup

1. Go to [Salvy Dashboard](https://salvy.com.br) → Settings → Webhooks
2. Add endpoint: `https://<your-domain>/webhook`
3. Select the `sms.received` event
4. Copy the signing secret and set it as `SALVY_WEBHOOK_SECRET`
