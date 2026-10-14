# Setayesh Ganji — Portfolio

Personal portfolio of Setayesh Ganji, Visual & Multimedia Designer.
It's a static site built with [Astro](https://astro.build) 5 and TypeScript. It has no database, CMS, backend or paid service.

- **Content** lives in `src/content/` (YAML for projects, Markdown for essays) and `src/config/` (site facts and disciplines).
- **Layout** lives in `src/components/`, `src/layouts/` and `src/pages/`. Adding or changing content never requires editing these.
- **Discipline colours and rail:** the category bands use the `--c-*` tokens in `src/styles/global.css`. The rail is `src/components/Rail.astro`.
- **Page transition:** a short fade and rise between work pages, in `src/styles/global.css` (section "Page transition") and `src/scripts/cut.js`.

See also:
- [`docs/CONTENT-CHECKLIST.md`](docs/CONTENT-CHECKLIST.md): every missing asset, text and confirmation.
- [`docs/HANDOFF.md`](docs/HANDOFF.md): what works, what's provisional, and how to review it.

---

## 1. Install and run

Requirements: **Node.js 20.3+ or 22+** (developed on Node 22) and npm.

```bash
npm install          # install dependencies (fonts are bundled from npm, so the build downloads nothing)
npm run dev          # local development at http://localhost:4321 (draft projects are visible)
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build into `dist/`. **Drafts are excluded** from pages, listings, metadata and the sitemap. |
| `npm run build:drafts` | Private review build. Drafts are included, every page is `noindex`, and `robots.txt` disallows all. |
| `npm run preview` | Serves the last build at http://localhost:4321 |
| `npm run check` | Astro + TypeScript type checking (also validates every content file against its schema) |
| `npm test` | Unit tests for ordering, draft filtering, reading time and video URL parsing |
| `npm run e2e` | Browser checks against the last build: routes, overflow at 360/768/1280/1440 px and a short 1280×600 screen, transitions, rapid clicks, back/forward, reduced motion, mobile menu, video loading |

`npm run e2e` uses Playwright's Chromium. If no browser is installed, run `npx playwright install chromium` once, or set `CHROMIUM_PATH` to an existing Chrome/Chromium binary.

### Environment variables (optional)

Copy `.env.example` to `.env`:

- `SITE_URL`: the final domain, e.g. `https://example.com`. It enables canonical URLs, `og:url` and sitemap entries. Without it the sitemap is empty, which is fine for previews.
- `PUBLIC_SHOW_DRAFTS=true`: the same as `npm run build:drafts`.

---

## 2. Content

### Projects

Each project is one file: `src/content/projects/<slug>.yaml`. The filename becomes the URL `/projects/<slug>`.
Start from `src/content/projects/_template.yaml`. Files beginning with `_` are ignored.

**Add a project**
1. Put its images in `src/assets/media/<slug>/` (JPG/PNG/WebP, at full resolution; responsive sizes are generated at build).
2. Copy `_template.yaml` to `<slug>.yaml`, then fill in `title`, `categories`, `cover` and any `blocks`.
3. Keep `status: draft` while working. Change it to `status: published` when it's ready.
4. Run `npm run check` to validate the file. A typo in a field name or category is reported with the file and line.

**Remove a project:** delete its YAML file (and its media folder). Or set `status: draft` to hide it from production without deleting it.

**Categorise:** `categories` lists every discipline the project appears in. The **first** one is the primary category, which is used for the "Back to …" link and for related projects. There is still only one project page, whatever the number of categories.

```yaml
categories: [graphic-illustration, motion-film]
```

Valid slugs: `brand-identity`, `graphic-illustration`, `digital-ui`, `motion-film`, `interactive-3d`.

**Reorder:** lower `order` numbers come first, and ties are sorted alphabetically. Leaving gaps (10, 20, 30…) makes inserting easy. To place a project differently in a secondary category:

```yaml
order: 10
categoryOrder: { motion-film: 5 }
```

No project is ever labelled "featured" or "selected". The order is the only editorial signal.

**Fields** (everything except `title`, `status` and `categories` is optional; empty fields are simply not shown):

| Field | Notes |
| --- | --- |
| `year` | e.g. `2024` or `"2023–24"` |
| `context` | `{ type: academic \| commissioned \| independent, institution, course }`. Add it **only once verified**. |
| `summary` | One line, shown on category pages and used as the page description |
| `overview` | Short text. Separate paragraphs with a blank line. |
| `role`, `collaborators` | Credits |
| `development` | Credit for development, kept apart from the design role, e.g. "AI-assisted development. Concept and interface design by …" |
| `links` | Buttons such as Visit website or Open app. Add a link only after it responds publicly. Run `npm run check:links` before each release. |
| `tags` | Free-text discipline tags shown under the title |
| `cover` | The image used on category pages and in related links |
| `hero` | `kind: image` + `media`, or `kind: video` + `video` |
| `blocks` | Any combination of the blocks below, in any order |
| `related` | Slugs to show under "More work". The default is the neighbours in the primary category. |
| `todo` | Internal checklist. It's shown only in draft preview and never in production. |

**Images (`media`)**

```yaml
file: dream-toy/logo.png     # relative to src/assets/media/
alt: Describe what the image shows
caption: Optional caption
credit: Optional credit line
aspect: "4/5"                # frame ratio; OMIT to keep the artwork's own proportions
fit: contain                 # contain = never crop (posters, covers, typography); cover = fill and crop
position: "50% 20%"          # crop focus when fit is cover
background: "#ffffff"        # colour behind contained artwork
loop: /video/preview.mp4     # optional short muted loop (file in public/video/)
```

Images keep their original colours. Nothing is desaturated or recoloured.
If `file` is empty or missing, a labelled placeholder appears instead of a broken image. The build also logs a `[media] Missing image` warning.

**Blocks**

```yaml
blocks:
  - type: text
    heading: Optional heading
    body: |
      Paragraph one.

      Paragraph two.
  - type: image
    size: full          # full | wide | inset
    media: { file: x/a.jpg, alt: … }
  - type: pair
    align: start        # start | center | end
    items:
      - { file: x/b.jpg, alt: … }
      - { file: x/c.jpg, alt: … }
    caption: Optional
  - type: grid          # detail images, poster series, book covers…
    columns: 3          # 2 | 3 | 4
    items: [ { file: x/d.jpg, alt: … }, … ]
  - type: video
    video: { provider: vimeo, url: "https://vimeo.com/…", title: …, poster: { file: x/poster.jpg } }
```

### Video

- `provider: youtube` or `vimeo`, with `url` set to the normal page URL (watch, youtu.be, shorts, or Vimeo links including unlisted `/id/hash` links).
- `provider: local`, with `url: /video/file.mp4` and the file placed in `public/video/`.
- Third-party players load **only after the visitor presses Play**. Before that, only the poster image is shown. YouTube uses the privacy-enhanced `youtube-nocookie.com` domain and Vimeo uses `dnt=1`.
- No URL yet means a "Video to come" placeholder with no play button.
- No video ever autoplays with sound. Short `loop` previews are muted, play only without reduced motion, play on hover inside links, and otherwise have a visible "Pause motion" button.

### Essays

Each essay is a Markdown file in `src/content/essays/<slug>.md`. Start from `_template.md`.

- `status: draft` keeps it hidden in production.
- `status: in-progress` lists the title, abstract and metadata publicly, with no reading page.
- `status: published` gives it a full reading page.
- Reading time is calculated from the actual text.
- `pdf: /documents/<file>.pdf`: put the file in `public/documents/`. The download button appears only if the file exists.
- `references` and `imageCredits` are lists rendered at the end of the page.
- `lang` (e.g. `it`, `fa`) sets the text language. Right-to-left scripts get `dir="rtl"`. Note that the display fonts cover Latin scripts only, so Persian text falls back to the system's Persian font.
- `specimen-reading-layout.md` is a **development specimen**, not real writing. It's never published. Delete it when the first real essay arrives.

### Site facts, About and Contact

Everything is in `src/config/site.ts`:

- `email`: leave it empty until confirmed. The Contact page then says honestly that an address will be added.
- `links`: professional profiles (Behance is already listed).
- `cv`: CV files in `public/documents/`. The link appears only once the file exists.
- `portrait`: `{ file: 'about/portrait.jpg', alt: '…' }`, with the image in `src/assets/media/about/`. Until then a designed placeholder is shown.
- `about`, `education`, `practice`, `intro`: verified wording only.

### Disciplines and homepage previews

`src/config/categories.ts` holds each discipline's title, intro, page layout (`stack`, `mosaic` or `grid`) and an optional `homePreview` image.
Without a `homePreview`, the homepage uses the first project cover in that discipline that has an image, and otherwise shows a labelled temporary visual.

---

## 3. Fonts and licences

Fonts are self-hosted. They are installed from npm (`@fontsource-variable/*`), bundled into `dist/` at build time, and never requested from Google or any CDN.

| Role | Font | Licence | Source |
| --- | --- | --- | --- |
| Essay reading text only | **Fraunces** (variable) by Undercase Type | SIL Open Font License 1.1 | https://github.com/undercasetype/Fraunces · npm `@fontsource-variable/fraunces` |
| Interface / body | **Instrument Sans** (variable: weight, width) by Instrument | SIL Open Font License 1.1 | https://github.com/Instrument/instrument-sans · npm `@fontsource-variable/instrument-sans` |

Fallbacks: Iowan Old Style / Palatino / Georgia for the serif, and Helvetica Neue / Arial / system-ui for the sans. Only the Latin subsets download in practice, through `unicode-range`.

---

## 4. Deployment

The recommended host is Vercel with protected previews. See `docs/DEPLOY-VERCEL.md` for the exact steps. Protection is configured before any content is served.

The output is plain static files in `dist/`, so any static host works. **Cloudflare Pages** or **Netlify** are recommended. Both have free tiers, serve `about.html` at `/about` automatically, and support private preview deployments.

**Cloudflare Pages**
1. Connect the GitHub repository.
2. Set the build command to `npm run build`, the output directory to `dist`, and the environment variable `NODE_VERSION=22`.
3. Add `SITE_URL=https://your-domain` once the domain is chosen.
4. For private draft reviews, use a separate project or branch with the build command `npm run build:drafts`, and protect it with Cloudflare Access.

**Netlify**: use the build command `npm run build`, publish directory `dist`, and `NODE_VERSION=22` in the environment. Use password-protected deploy previews for draft builds.

**Before going public:**
- set `SITE_URL`
- publish only finished projects (`status: published`)
- run `npm run check && npm test && npm run build`
- confirm the content checklist

Never deploy a `build:drafts` output publicly.

---

## 5. Project structure

```
src/
  config/            site.ts (facts, contact) · categories.ts (the five disciplines)
  content/           projects/*.yaml · essays/*.md  (+ _template files)
  content.config.ts  typed schemas for all content
  assets/media/      project images (processed into responsive sizes)
  components/        Nav, Media, Placeholder, VideoEmbed, Blocks, ProjectPreview, Footer
  layouts/Base.astro page shell: discipline rail, page header, mobile menu, metadata
  components/Rail.astro  the five discipline bands with the scissors divider
  lib/               content.ts (queries, draft filtering, media resolution) · logic.ts (pure, tested)
  pages/             routes: / · /work/[category] · /projects/[slug] · /essays · /essays/[slug] · /about · /contact · 404 · sitemap.xml · robots.txt
  scripts/           cut.js (transition logic) · ui.ts (menu, video, loops)
  styles/global.css  tokens, layout and the signature transition
public/              favicon · documents/ (PDFs, CV) · video/ (local video files)
scripts/e2e.mjs      browser checks
tests/               unit tests
```
