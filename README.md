<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7b990f79-85be-4ba7-a53e-50f4a0833082

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to your Gemini API key
3. Run the app:
   `npm run dev`

The development server uses port `3000` by default and automatically tries the next available port if it is occupied. Set `PORT` in `.env` to choose a different starting port.
