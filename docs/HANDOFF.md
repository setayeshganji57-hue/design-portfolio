# Handoff

Status at 16 October 2026. Branch: `claude/setayesh-portfolio-site-smiwyr`. Do not merge into `main` without an explicit decision.

Read in this order:
1. `docs/PORTFOLIO-AUDIT.md`: what works, what doesn't, and the fixes ranked by priority.
2. `docs/CONTENT-NEEDED.md`: what the owner must provide before the next application round.
3. `docs/JOB-SEARCH-PLAN.md`: positioning, the two tracks, the shortlist and the ten-day schedule.
4. `docs/APPLICATION-MATERIALS.md`: drafts for About, LinkedIn, CV, notes and messages. Nothing has been sent.
5. `docs/JOB-TRACKER.csv`: one row per role or target, with checked status.

The older `docs/CONTENT-CHECKLIST.md` and `docs/REVIEW.md` still describe the earlier state. Use `CONTENT-NEEDED.md` for the current work.

## Where things stand

- **Published (visible in production):** Hamloqmeh, TradeMemory, myMAXXI Welcome Days, Life Below Water, Sunny Days Between Cubes, and the thesis essay.
- **Drafts (preview only):** everything else in `src/content/projects/`.
- **Empty categories:** Brand Identity and Interactive & 3D show "Coming soon". The homepage statement still names both, so brand work is the most urgent content gap.
- **Public address:** none. The protected preview returns a redirect to Vercel sign-in, which is the intended state. Recruiters cannot open it until the owner decides on production.
- **Blocked on the owner:** section A of `docs/CONTENT-NEEDED.md`, which covers roles, CV, portrait, right to work, the public-address decision, and the thesis title and surname.

Changes made in the most recent round:
- TradeMemory: removed the unverified sentence about the owner's trading experience.
- Sunny Days: tag changed from "4D video" to "Projection".
- Hamloqmeh: "Open app" is now labelled "Open app (log-in required)".

## Run it locally

Node 22 is recommended (20.3 or later works).

```bash
npm install
npm run dev          # http://localhost:4321, drafts visible
npm run build        # production build in dist/, drafts excluded
npm run build:drafts # review build with drafts, noindex
npm run preview      # serve the last build at http://localhost:4321
npm run check        # Astro and TypeScript checks, including content schemas
npm test             # unit tests (vitest)
npm run e2e          # browser checks on the last build (run after a build)
npm run check:links  # checks each published project link
```

Run `npm run e2e` after both `npm run build` and `npm run build:drafts`. The production build must not contain draft slugs. The suite checks this.

If Playwright can't find a browser, set `CHROMIUM_PATH` to a Chromium binary.

## Edit the content

**Projects:** `src/content/projects/<slug>.yaml`. Start from `_template.yaml`.
- `status`: `draft` or `published`. Only published projects appear in production.
- `categories`: the first listed is the primary category, used for navigation and related work.
- `role`, `development`, `collaborators`: fill these in. The role row appears on the page only when `role` is set.
- `links`: add a link only after checking that it responds publicly. Keep the label honest, for example "(log-in required)".
- `cover`, `hero`, `blocks`: images are referenced by path relative to `src/assets/media/<slug>/`.
- Run `npm run check` after every change. It reports the file and line of any schema error.

**Essays:** `src/content/essays/<slug>.md`. `status` is `draft`, `in-progress` or `published`. The PDF goes in `public/documents/` and is referenced by its `pdf:` path.

**Site facts:** `src/config/site.ts`.
- `about`: the About paragraphs, in the owner's words.
- `email`, `phone`, `links`: contact details and profiles.
- `cv`: the About page shows a download link automatically once `public/documents/setayesh-ganji-cv.pdf` exists.
- `portrait`: currently `null`, so a placeholder shows. To add one, place the image at `src/assets/media/about/portrait.jpg` and set `portrait: { file: 'about/portrait.jpg', alt: '…' }`.

**Disciplines:** `src/config/categories.ts` holds titles, intros and layouts. Categories without published projects show "Coming soon" automatically.

## Drafts

- A project with `status: draft` appears in `npm run dev` and `npm run build:drafts` only.
- The production build excludes drafts from pages, listings, metadata and the sitemap. The end-to-end suite checks this.
- The preview deployment sets `PUBLIC_SHOW_DRAFTS=true`. The production build refuses to run with that setting (`astro.config.mjs`).

## Deployment

**Current setup (Vercel, preview only):**
- The project is imported. Deployment Protection is set to All Deployments with Vercel Authentication. This was configured by the owner and must not be changed without a decision.
- `vercel.json` runs `scripts/vercel-gate.mjs` before the build. The build fails unless `PORTFOLIO_PREVIEW_GATE=open` is set in Vercel. Preview is open; production is still gated.
- `cleanUrls: true` is set, so `/about`, `/contact`, `/essays`, `/work/…` and `/projects/…` resolve. Without it, Vercel returns 404 for them.
- No custom domain is connected.

**Before any public launch (only with the owner's explicit decision):**
1. Decide the production branch and whether to remove the gate for production.
2. Set `SITE_URL` to the final address. It drives canonical URLs and the sitemap.
3. Confirm `PUBLIC_SHOW_DRAFTS` is not set for production.
4. Run `npm run check:links` and `npm run e2e` on the production build.
5. Check the public address in a private window, and check it on a phone.

The full steps are in `docs/DEPLOY-VERCEL.md`.

## Known gaps and what is not verified

- Safari and Firefox are not tested. Safari has previously collapsed vertical text in flex layouts, so check the band labels there.
- No screen-reader test has been run.
- The thesis PDF's cover title and candidate name differ from the site (see the audit, A5).
- Behance blocks automated access, so project text cannot be checked against it.
- The draft-build transition check in `scripts/e2e.mjs` can fail intermittently, because Chromium sometimes skips a view transition. Rerun before treating it as a regression.
- Job listings in `docs/JOB-TRACKER.csv` were checked on 16 October 2026. Re-check each one before you apply.

## Rules that apply to anyone continuing this work

- Do not publish the site, change its access protection, merge into `main`, submit applications, or message anyone, without explicit instruction from the owner.
- Do not put passwords, tokens or other secrets in the repository or in chat.
- Keep factual claims tied to a source: the owner's own statement, the thesis, the project record, or a page you checked. Mark everything else as unverified.
