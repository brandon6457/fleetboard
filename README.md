# Down to Earth Fleet Management

A realtime fleet dashboard built with Next.js App Router, TypeScript,
Tailwind CSS, and Convex.

## Getting Started

Install dependencies and start the local development servers:

```bash
npm install
npx convex dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see
the dashboard.

Convex writes the local deployment values to `.env.local`. See `.env.example`
for the required environment variable names.

## Production

Production deployment notes live in
[`docs/PRODUCTION_DEPLOYMENT.md`](docs/PRODUCTION_DEPLOYMENT.md).

The Vercel build command should deploy Convex functions and then build Next.js:

```bash
npx convex deploy --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL --cmd 'npm run build'
```

Required Vercel environment variables:

- `CONVEX_DEPLOY_KEY`
- `NEXT_PUBLIC_CONVEX_URL`

## Verification

```bash
npm run lint
npm run build
```
