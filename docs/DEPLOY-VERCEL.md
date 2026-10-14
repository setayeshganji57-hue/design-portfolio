# Deploying the portfolio to Vercel (protected preview first)

This guide sets up a separate Vercel project for the portfolio. It does not touch any other Vercel project.

**Principle:** protection comes before content. The repository contains a build gate (`scripts/vercel-gate.mjs`) that stops every Vercel build until you open it. The gate opens only after Deployment Protection is configured.

## What each piece does

| Piece | Setting | Why |
| --- | --- | --- |
| Deployment Protection | **All Deployments**, with **Vercel Authentication** | Every URL (preview and production) requires you to be signed in to Vercel with access to this project. Per Vercel's documentation, All Deployments is available on all plans, and Vercel Authentication needs no paid add-on. |
| Build gate | `PORTFOLIO_PREVIEW_GATE=open`, Preview only | The build fails until you set it. Before protection is set, no portfolio content can be built or served. |
| Draft switch | `PUBLIC_SHOW_DRAFTS=true`, Preview only | Drafts appear in the preview so you can review the whole layout. Production never receives this variable. The site also refuses a production build that includes drafts (`astro.config.mjs`). |
| Production branch | `main` | A real branch, separate from the preview branch. Production deployments stay closed by the gate until you open it for Production. |
| Preview branch | `claude/setayesh-portfolio-site-smiwyr` | Everything else deploys as a preview. |

**Not enabled, on purpose:** Password Protection (a paid feature), Trusted IPs (Enterprise), Protection Bypass for Automation (not needed), Sharable Links, and any custom domain.

## Steps (in this order)

Labels in the Vercel dashboard may differ slightly from these names. Follow the names you see.

### 1. Import the project

1. Sign in at vercel.com with the account that should own the portfolio.
2. Choose **Add New… → Project**, then **Import** the GitHub repository `setayeshganji57-hue/design-portfolio`. If Vercel asks, connect GitHub and grant the Vercel app access to this repository.
3. **Project name:** `setayesh-portfolio`.
4. **Do not add any environment variables on this screen.** Click **Deploy**.

The first build will **fail** with the message "Build gate closed." This is expected. No portfolio content is served.

### 2. Configure protection (before anything else)

1. Open the project → **Settings → Deployment Protection**.
2. Set the protection level to **All Deployments**.
3. Set the protection method to **Vercel Authentication**.
4. Save. Leave Password Protection off.

### 3. Set the production branch

1. **Settings → Git → Production Branch:** `main`. Save.

### 4. Add the two environment variables (Preview only)

1. **Settings → Environment Variables → Add.**
2. Name `PUBLIC_SHOW_DRAFTS`, value `true`. Under environments, tick **Preview** only. Untick Production and Development.
3. Name `PORTFOLIO_PREVIEW_GATE`, value `open`. Tick **Preview** only.
4. Save.

Production should have neither variable. That keeps production closed by the gate and free of drafts.

### 5. Trigger a fresh Preview deployment

Either:
- open **Deployments**, choose the latest deployment from the `claude/setayesh-portfolio-site-smiwyr` branch, and click **Redeploy**, or
- ask me to push a commit to that branch. Vercel will build it automatically.

Wait for the build to finish with status **Ready**.

### 6. Open the preview

Copy the preview URL from the deployment page. It looks like `setayesh-portfolio-git-claude-setayesh-portfolio-site-smiwyr-<your-team>.vercel.app`.

Send it to me. I'll check from outside your account that it asks for sign-in before showing anything. You can open it yourself as described below.

## Opening the preview while signed in

1. Use the same browser where you're signed in to vercel.com.
2. Open the preview URL. The site should load directly, because Vercel recognises your account.
3. If Vercel shows a sign-in page, choose to continue with your Vercel account. If you see "access denied", the account you're signed in with doesn't belong to the team that owns the project.

Signed out or in a private window, the same URL shows a Vercel sign-in page instead of the site.

## Checks I run from this environment

- Before sharing the URL: request it without signing in. A protected deployment answers with a sign-in page, not the site.
- After you sign in on your side: run the browser checks (homepage, categories, project pages, images, mobile navigation) against the preview. This needs a way past the sign-in page. Your own browser session works for you; for automated checks we'll discuss later options, and I won't ask for a bypass secret unless you choose to set one up.

## If something goes wrong

- **A Production deployment appears and you don't want it:** it stays closed unless you set `PORTFOLIO_PREVIEW_GATE=open` for Production. If one exists, use **Deployments → … → Delete** on it. Tell me, and I'll check that nothing is publicly reachable.
- **Protection not showing as All Deployments:** do not set `PORTFOLIO_PREVIEW_GATE` for any environment, and tell me.
- **A draft appears in production:** this shouldn't happen, because the site refuses that build. If it does, tell me immediately.

## Local equivalents

```bash
npm run build:drafts && npm run preview   # what the preview contains, on your machine
npm run build && npm run preview          # what the public production build contains
```
