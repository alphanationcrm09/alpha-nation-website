# Alpha Nation Cloudflare deployment

This project is deployed through the existing Cloudflare Workers / OpenNext setup. Do not use AppDeploy for the production website.

## 1. Get the reviewed website branch

Open PowerShell in the local repository folder:

```powershell
git fetch origin
git checkout feat/alpha-nation-v2-deploy-ready
git pull origin feat/alpha-nation-v2-deploy-ready
```

## 2. One-command PowerShell deployment

After checking out and pulling the reviewed branch, run:

```powershell
.\deploy-cloudflare.ps1
```

The script checks the branch and configured Worker name, installs locked dependencies, runs lint and the OpenNext Cloudflare build, checks Wrangler authentication, then requires you to type `DEPLOY alpha-ins` before it starts the production deployment. It has not been run in this session.

## 3. Manual install and validation

Use Node.js 22.16.0 or newer and npm 10.9.2 or newer.

```powershell
node --version
npm --version
npm ci
npm run lint
npm run cf:build
```

The Cloudflare build command runs the Next.js production build and OpenNext Cloudflare adapter build. Resolve any failing command before deployment.

## 4. Manual deploy to the configured Cloudflare Worker

Only after reviewing the local build output and confirming the intended Cloudflare account:

```powershell
npx wrangler whoami
npm run deploy
```

The configured production Worker name in wrangler.jsonc is alpha-ins. The PR preview Worker named alpha-nation-site is separate. Do not change the production target based on the preview name. Confirm the account with Wrangler before deployment.

## Production checks after deployment

- Open the public homepage and verify desktop navigation at 1280px and mobile navigation below 1100px.
- Test the quote request, appointment request, contact form and Cloudflare Turnstile.
- Confirm Supabase submissions and lead notifications using a controlled test submission.
- Check /carriers, /calculator, /privacy, /terms, /beneficiary-services and /customer/login.
- Check /robots.txt and /sitemap.xml and verify the production domain and Google Search Console property.

## Before accepting real insurance leads

The website does not invent producer license numbers, licensed states, legal entity details or carrier appointments. Confirm those details and have the consent, privacy, terms and state-specific insurance/telemarketing disclosures reviewed by qualified compliance counsel before accepting live leads. Do not add marketing SMS or automated marketing calls under the request-only contact checkbox.