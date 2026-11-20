$ErrorActionPreference = "Stop"

$ExpectedBranch = "feat/alpha-nation-v2-deploy-ready"
$ExpectedWorker = "alpha-ins"

Set-Location $PSScriptRoot

$CurrentBranch = (git branch --show-current).Trim()
if ($CurrentBranch -ne $ExpectedBranch) {
    throw "Wrong Git branch. Expected '$ExpectedBranch', found '$CurrentBranch'. Fetch and check out the reviewed branch first."
}

$Config = Get-Content -Raw -Path ".\wrangler.jsonc" | ConvertFrom-Json
if ($Config.name -ne $ExpectedWorker) {
    throw "Worker target mismatch. This reviewed deployment expects '$ExpectedWorker'; wrangler.jsonc currently says '$($Config.name)'. No deployment was started."
}

Write-Host "Checking Node and npm versions..." -ForegroundColor Cyan
node --version
if ($LASTEXITCODE -ne 0) { throw "Node.js is not available." }
npm --version
if ($LASTEXITCODE -ne 0) { throw "npm is not available." }

Write-Host "Installing locked dependencies..." -ForegroundColor Cyan
npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci failed. Deployment stopped." }

Write-Host "Running ESLint..." -ForegroundColor Cyan
npm run lint
if ($LASTEXITCODE -ne 0) { throw "ESLint failed. Deployment stopped." }

Write-Host "Running Next.js and OpenNext Cloudflare production builds..." -ForegroundColor Cyan
npm run cf:build
if ($LASTEXITCODE -ne 0) { throw "Cloudflare production build failed. Deployment stopped." }

Write-Host "Checking the authenticated Cloudflare account..." -ForegroundColor Cyan
npx wrangler whoami
if ($LASTEXITCODE -ne 0) { throw "Wrangler authentication check failed. Deployment stopped." }

Write-Host ""
Write-Host "Target Worker: $ExpectedWorker" -ForegroundColor Yellow
Write-Host "This is the production deployment step." -ForegroundColor Yellow
$Confirmation = Read-Host "Type DEPLOY $ExpectedWorker to continue"
if ($Confirmation -cne "DEPLOY $ExpectedWorker") {
    Write-Host "Deployment cancelled. No production deployment was started." -ForegroundColor Yellow
    exit 0
}

npm run deploy
if ($LASTEXITCODE -ne 0) { throw "Cloudflare deployment command failed." }

Write-Host "Wrangler deployment command completed. Run the post-deployment acceptance checks in POWERSHELL-CLOUDFLARE-DEPLOY.md." -ForegroundColor Green
