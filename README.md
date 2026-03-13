# Nailit

This repository contains a Nailit platform prototype with:

- a static frontend
- browser-based registration/login demo
- a ChatGPT-backed issue analysis API via a small Express server

## Project structure

- `index.html`: page markup
- `styles.css`: site styles
- `script.js`: client-side interactions
- `server.js`: Express API for ChatGPT-based issue analysis
- `.env.example`: environment variable template
- `.env.sandbox.example`: payment sandbox template for Stripe/PayPal testing

## Run locally

## Run with ChatGPT analysis

From the project folder, run:

```bash
cd /Users/julianneuenburg/Nailit
cp .env.example .env
npm install
```

Then set your real OpenAI API key in `.env`:

```bash
OPENAI_API_KEY=...
```

Optional payment configuration for live Stripe and PayPal redirects:

```bash
APP_BASE_URL=http://localhost:3000
DB_FILE_PATH=./data/nailit.db
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PAYMENT_LINK=https://buy.stripe.com/... # optional fallback
PAYPAL_CHECKOUT_URL=https://www.paypal.com/checkoutnow?token=... # optional fallback
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
BANK_TRANSFER_HOLDER=Nailit Services GmbH
BANK_TRANSFER_IBAN=DE12500105170648489890
BANK_TRANSFER_BIC=INGDDEFFXXX
BANK_TRANSFER_BANK=Nailit Partnerbank
```

Start the app with:

```bash
npm run dev
```

Then open `http://localhost:3000` in a browser.

## Fallback mode without API key

If the server runs without `OPENAI_API_KEY`, the frontend still works, but the issue analysis falls back to the local rule-based classifier instead of ChatGPT.

If `STRIPE_SECRET_KEY` is present, Nailit creates real Stripe Checkout Sessions on the server and verifies the return URL before the chat is marked as paid. If it is missing, Stripe falls back to demo mode or the optional `STRIPE_PAYMENT_LINK`.

If `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are present, Nailit creates real PayPal orders on the server, captures them after the return URL, and updates the chat automatically. Without them, the optional `PAYPAL_CHECKOUT_URL` stays as a fallback link.

Chat, payment, invoice, and offer status data are now persisted server-side in SQLite at `DB_FILE_PATH`. The browser still keeps a local cache, but the server database is the primary source for payment state.

The direct-chat offer flow also supports local and persisted status tracking for partial payments, full settlement, cancellations, and external checkout returns.

For quick sandbox setup, you can also copy `.env.sandbox.example` to `.env` and fill in your Stripe and PayPal sandbox credentials.

## Good next steps for building on it

- Replace placeholder business data with real contact details and content.
- Connect the form to a real backend or form service.
- Add additional pages such as pricing, portfolio, and partner onboarding.
- Introduce a proper asset pipeline or frontend framework only if the site outgrows static HTML.