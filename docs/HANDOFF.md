# Handoff: Phase 1 (interface)

## How to review

```bash
npm install
npm run dev                 # http://localhost:4321, with drafts visible and a "Preview · drafts visible" tag
```

To see exactly what the public would get, which today is the disciplines, About, Contact and the empty states, with every draft hidden:

```bash
npm run build && npm run preview
```

Pages to look at:
- `/`
- `/work/graphic-illustration` (mosaic layout)
- `/work/brand-identity` (stack layout)
- `/work/digital-ui` (empty state)
- `/projects/dream-toy`
- `/projects/sunny-days-between-cubes` (video placeholder)
- `/projects/illustrated-book-covers` (uncropped grid)
- `/essays` and `/essays/specimen-reading-layout`
- `/about`, `/contact`, and any unknown URL (the 404 page)

**To see the page transition:** click between disciplines in the colour rail, or from a discipline into a project. Chrome, Edge and Safari 18.2+ show the fade; Firefox navigates instantly.

> **Superseded in part.** The design was revised in the latest round (colour rail, right-hand pages, a fade instead of the sweeping line). `docs/REVIEW.md` is current. The bullets below describe the earlier version.

## What works

- **All routes** are built as static files:
  - `/`
  - `/work/<discipline>` (5)
  - `/projects/<slug>`
  - `/essays` and `/essays/<slug>`
  - `/about` and `/contact`
  - a designed 404 page
  - `sitemap.xml` and `robots.txt`

  Direct loading, normal links and browser history all behave normally, because these are ordinary pages.
- **Layout:** a persistent left sidebar from 1024 px up, with the five disciplines numbered and separated from Essays, About and Contact. On short screens it tightens, and scrolls if needed.
  - Below 1024 px there's a compact top bar with a full-screen menu built on a native `<dialog>`. Focus moves in, Esc closes it, focus returns to the button, and `aria-expanded` is kept in sync.
  - The footer navigation works without JavaScript.
- **Homepage:** a one-line introduction, then an asymmetric composition of the five discipline previews. Each one has a number, name, project count and a visible "View …" link. On mobile the previews stack with alternating indents, plus a compact discipline index under the intro.
- **Category pages:** a large display title, an editable intro and a count. There are three preview layouts (`stack`, `mosaic`, `grid`), chosen per discipline in config, and an honest empty state.
- **Project template:** title, facts table (discipline links, year, context, role, collaborators, tags), overview, image or video hero, and flexible blocks (text, image full/wide/inset, pair, grid with 2–4 columns, video). It ends with related projects and a return link to the category.
  - Drafts show a preview banner with that project's open questions.
- **Essays:** a listing and a calm reading template with abstract, metadata, a reading time calculated from the real text, references, image credits and a PDF button (shown only if the file exists). It supports draft, in-progress and published states, plus `lang`/RTL.
- **About:** a portrait placeholder, a first-person introduction limited to the facts you gave, Education, Practice, CV & links (the CV link appears only once the file exists), and Contact.
- **Contact:** a configurable email and links. With no email it shows an honest "will be listed shortly" note, and there's no fake form.
- **Content model:** typed schemas validated at build. Adding a project means adding one YAML file plus images; no component edits are needed.
- **Drafts:**
  - Visible in `npm run dev` and `npm run build:drafts` (which also adds `noindex` everywhere and `Disallow: /`).
  - Excluded from production pages, listings, the homepage counts, metadata and the sitemap. I checked this by grepping the production `dist/` for draft titles and found none.
- **Media:**
  - Responsive WebP `srcset` is generated locally with sharp.
  - Frames are stable through `aspect-ratio`, so there's no layout shift.
  - Each image has its own `fit`/`position`/`background` settings.
  - Artwork keeps its own proportions unless you set a frame.
  - Missing files become labelled placeholders, never broken images.
- **Video:** YouTube, Vimeo (including unlisted hashes) and local files are supported. It's click-to-load (a poster plus a Play link that works without JS), and nothing third-party loads before the click.
- **Earlier version, replaced:** cut-and-reveal, 560 ms. A 1.5 px burgundy line with a small drawn pair of scissors travels left to right while the incoming content is revealed behind it, and titles and intros settle in.
  - It runs only between the homepage, disciplines and projects. Essays, About and Contact open instantly.
  - It's built on cross-document View Transitions. The browser owns URLs, history and interruption, so there's no overlay in the DOM to get stuck.
  - Reduced motion turns it off completely.

## Checks run in this session

| Check | Result |
| --- | --- |
| `npm run check` (astro check / TypeScript, content schemas) | 0 errors, 0 warnings |
| `npm test` (vitest) | 12 / 12 passed |
| `npm run build` and `npm run build:drafts` | both succeed |
| `npm run e2e` on the draft build **and** the production build | all checks passed |

What the `npm run e2e` checks cover (headless Chromium 141):
- every route at 360×740, 768×1024, 1280×800, 1440×900 and 1280×600, with no horizontal overflow and no broken images
- every discipline and page link reachable on desktop sizes
- a 404 for an unknown URL
- category → category triggers the transition, and Essays doesn't
- rapid clicks across four categories end on the right URL, heading and active nav, with no leftover transition state
- back and forward
- reduced motion disables the cut
- mobile menu focus, Esc and close-on-navigate
- no video iframe on load

**Manual visual review:** I looked at screenshots of the homepage (1440, 1280, 360), category pages (1440, 1280×600), project pages (1440, 768), the essay specimen, About, Contact (768), Essays (360), 404, and the mobile menu. I also captured the transition mid-way with slowed-down animations to confirm the line, scissors and reveal direction.

**Also verified with temporary content, then reverted:** a real image renders with its own colours and a full srcset, a missing image file falls back to a placeholder with a build warning, and a Vimeo URL produces the correct embed only after Play is pressed.

**Not verified:** Safari and Firefox were not available here, so I didn't test them. Firefox doesn't support cross-document View Transitions yet, so there navigation is simply instant. I didn't run a screen reader.

## Provisional / decisions to confirm

- **Every project is a draft**, because none has assets yet. That means the production homepage shows "In preparation" counts and temporary visuals, and discipline pages show empty states. Publish projects one by one as their content arrives.
- **"Dream Toy"** is provisional, since Behance says "DRYMTO". The ChronoLens spelling and contribution details also need confirming (see the checklist).
- **Discipline intros** and the homepage line are my wording, describing the disciplines generally. Please edit them.
- **About** is written in the first person, so no pronoun is assumed. Degree entries say "Master's studies" and "Bachelor's studies", with no dates and no completion claims.
- **Essays:** "in-progress" essays are listed publicly with title and abstract only. Set them to `draft` instead if you'd rather hide them.
- **Typefaces:** Instrument Sans for headings, name and interface (latest round); Fraunces for essay reading text only. Both are OFL and self-hosted.
- **Stack:** Astro 5.18 (the mature 5.x line), not the newest major (7.x). I chose it for stability and verified compatibility; upgrading later is optional.
- **Fix found during testing:** the `@view-transition` opt-in is inlined in `<head>`. When it only lived in the external stylesheet, Chromium skipped about half of the transitions; inlined, they were 100% reliable in testing.

## Source material

- **Google Drive PDF** (58 pages, "Portfolio"): read and used as the primary source for the published projects. It contains the project briefs, descriptions, dates and 153 embedded images. Nothing from it was used without a text reading.
- **Behance profile**: readable. Its project pages return errors to automated access, so only the project titles from the profile are used, in `docs/CONTENT-CHECKLIST.md`.
- **Reference sites** (palomarincon.com, sic-est.com, eliapelle.com): still not reviewed in this session.

Access to Drive and Behance was enabled during this session. The review pack (`docs/REVIEW.md`) has the current access instructions for local preview, and states that no deployed or public URL exists. If you change the network settings again, the steps are in the previous version of this file (Option A: allow the domains).

## Publishing status

Current status: **two projects are published** (myMAXXI Welcome Days, Life Below Water). Everything else is a draft. The full list, with reasons, is in `docs/REVIEW.md` section 2.

Production builds exclude drafts. Draft pages are visible only in `npm run dev` and `npm run build:drafts`.

## Not done in this phase (by design)

- no deployment or domain
- no contact form backend
- no CMS
- no dark mode
- no real project media or essay text
