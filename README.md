# Restaurant Chat App

A minimal Next.js + Vercel implementation of a conversational Dubai restaurant recommender and reservation bot.

## Prerequisites
- Node.js ≥ 18
- Accounts & API keys:
  * OpenAI
  * Google Places Web Service
  * OpenTable Partner (or SevenRooms/EatApp)
  * SendGrid

## Local Development

```bash
git clone https://github.com/yourname/restaurant-chat-app.git
cd restaurant-chat-app
cp .env.example .env.local  # Fill in keys
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In the Vercel dashboard, click **New Project** → Import the repository.
3. Add the environment variables from `.env.example`.
4. Press **Deploy**. Vercel will provide a preview URL; add your custom domain under **Settings › Domains**.

## Architecture

- **pages/api/** routes act as serverless functions.
- **/components/Chat.tsx** renders the chat UI.
- `lib/*` contains helpers for OpenAI, Google, OpenTable, and email.

## CLI Scripts

A nightly refresh of Google ratings can be scheduled with Vercel Cron invoking `/api/refresh`.
