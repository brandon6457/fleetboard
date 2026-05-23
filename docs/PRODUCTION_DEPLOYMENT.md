# Production Deployment

This app is ready for Vercel plus Convex production hosting.

## Required Vercel Settings

Use these project settings in Vercel:

- Framework Preset: Next.js
- Install Command: `npm install`
- Build Command: `npx convex deploy --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL --cmd 'npm run build'`
- Output Directory: leave as the Vercel default

These settings are also captured in `vercel.json`.

## Required Environment Variables

Set these in Vercel Project Settings > Environment Variables:

- `CONVEX_DEPLOY_KEY`: production deploy key from the Convex production deployment settings
- `NEXT_PUBLIC_CONVEX_URL`: production Convex deployment URL

For preview deployments, use a Convex preview deploy key for `CONVEX_DEPLOY_KEY`.

## Local Verification

Before opening or merging the deployment PR, run:

```bash
npm run lint
npm run build
```

The app should have no localhost-only runtime assumptions. Local URLs may appear in documentation only.
