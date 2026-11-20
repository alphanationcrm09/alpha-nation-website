# Alpha Nation Cloudflare deployment

This project is deployed through the existing Cloudflare Workers / OpenNext setup. Do not use AppDeploy for the production website.

## 1. Get the reviewed website branch

Open PowerShell in the local repository folder:

```powershell
git fetch origin
git checkout feat/alpha-nation-v2-deploy-ready
git pull origin feat/alpha-nation-v2-deploy-ready
```

## 2. Install and validate

Use Node.js 22.16.0 or newer and npm 10.9.2 or newer.

```powershell
node --version
npm --version
npm ci
npm run lint
npm run cf:build
```

The Cloudflare build command runs the Next.js production build and OpenNext Cloudflare adapter build. Resolve any failing command before deployment.

## 3. Deploy to the configured Cloudflare Worker

Only after reviewing the local build output and confirming the intended Cloudflare account:

```powershell
npx wrangler whoami
npm run deploy
```

The configured Worker name is alpha-ins. The command deploys using the existing wrangler.jsonc and OpenNext configuration.

## Production checks after deployment

- Open the public homepage and verify desktop navigation at 1280px and mobile navigation below 1100px.
- Test the quote request, appointment request, contact form and Cloudflare Turnstile.
- Confirm Supabase submissions and lead notifications using a controlled test submission.
- Check /carriers, /calculator, /privacy, /terms, /beneficiary-services and /customer/login.
- Check /robots.txt and /sitemap.xml and verify the production domain and Google Search Console property.

## Before accepting real insurance leads

The website does not invent producer license numbers, licensed states, legal entity details or carrier appointments. Confirm those details and have the consent, privacy, terms and state-specific insurance/telemarketing disclosures reviewed by qualified compliance counsel before accepting live leads. Do not add marketing SMS or automated marketing calls under the request-only contact checkbox.