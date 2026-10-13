# Content & asset checklist

Everything the site still needs, grouped by where it goes. Nothing listed here is invented on the site in the meantime. Missing items show as labelled placeholders (in draft preview), or are simply left out.

Each project's own `todo:` list (in its YAML file) repeats its open items. That list appears on the project page in draft preview only.

**General rules for all media**
- Use **original files**, not screenshots of PDF pages. The sharpest export works best; the build generates the smaller sizes.
- Add `alt` text to every image that conveys content.
- Add a `credit` wherever someone else made or photographed the work.
- Mark posters, book covers, calligraphy and typography `fit: contain`, or leave out `aspect`, so they are never cropped.

## Site-wide (`src/config/site.ts`)

- [ ] **Public email address** (`email`). The Contact page shows an honest "to be added" note until then.
- [ ] Further **professional links** (`links`). Behance is listed: https://www.behance.net/setayeshganji1
- [ ] **CV PDF** in `public/documents/` (the path is already set to `/documents/setayesh-ganji-cv.pdf`).
- [ ] **Portrait** in `src/assets/media/about/`, plus `portrait: { file, alt }`.
- [ ] Review the **About wording** (first person, facts only). Is the bachelor's field name exactly right? Should years be shown for either degree?
- [ ] Production **domain**, set as `SITE_URL` at deploy.

## Homepage (`src/config/categories.ts`)

- [ ] Optional dedicated `homePreview` image for each discipline. Without one, the first project cover in that discipline is used once covers exist.
- [ ] Review the one-line discipline **intros**. They are generic descriptions, so edit them freely.

## Brand Identity

- [ ] **Dream Toy** (`dream-toy.yaml`)
  - [ ] **Confirm the final spelling.** Behance lists it as **"DRYMTO"**; "Dream Toy" is a provisional display title.
  - [ ] Cover, logo, applications (original files)
  - [ ] Context (academic, commissioned or independent), year, overview, role
- [ ] **PFC — Brand & Visual Identity** (`pfc-brand-identity.yaml`)
  - [ ] Should "PFC" be spelled out?
  - [ ] Context, year, overview, role
  - [ ] Identity files and applications

## Graphic & Illustration

- [ ] **myMAXXI Welcome Days** (academic, Sapienza)
  - [ ] Cover and identity applications
  - [ ] Optional motion piece (link or file)
  - [ ] Year, course name, overview, role, collaborators
- [ ] **Life Below Water** (academic, Sapienza)
  - [ ] Cover and visuals
  - [ ] Overview, role, year, course, collaborators
- [ ] **Illustrated Book Covers**
  - [ ] Curated selection from the earlier Iranian portfolio (original files)
  - [ ] Captions (book title, author, publisher), only if verified
  - [ ] Context and years
- [ ] **Illustration Collection**
  - [ ] Additional illustrations. Don't repeat images used in Illustrated Book Covers.
- [ ] **Calligraphy & Typography**
  - [ ] Existing pieces now; more later
- [ ] **Roman Typography**
  - [ ] Images, description, context, year
- [ ] **Poster Collection**
  - [ ] Final selection and original files
  - [ ] Captions, only if verified

## Digital & UI

- [ ] **Which projects belong here.** No projects have been created, by design. The category page shows an "in preparation" state until the first one is published.

## Motion & Film

- [ ] **Sunny Days Between Cubes** (academic, Sapienza)
  - [ ] **Vimeo or YouTube link** to the finished film (`hero.video.url`)
  - [ ] Poster frame and stills
  - [ ] Year, course, credits, role

## Interactive & 3D

- [ ] **ChronoLens: Unveiling Temporal Mysteries** (academic game-design project)
  - [ ] **Contribution details:** which models, characters and assets are Setayesh's own, and credits for the rest
  - [ ] Gameplay video link and original assets
  - [ ] Institution, course, team, year (institution not yet stated, so it's left blank)
  - [ ] Confirm the spelling (taken from the portfolio PDF)

## Essays (`src/content/essays/`)

No titles or texts have been provided, so no essay records exist yet.

- [ ] **Master's thesis**: title, abstract, year, language, full text (Markdown), optional PDF
- [ ] **Essay 2** (completed): as above
- [ ] **Essay 3** (completed): as above
- [ ] **Essay 4** (in progress): title and abstract, if it should be listed as "In progress"
- [ ] **Essay 5** (in progress): as above
- [ ] References and image credits for each
- [ ] Delete `specimen-reading-layout.md` once the first real essay is added

## Before publishing a project

1. Media are in `src/assets/media/<slug>/` and referenced in the YAML.
2. Text is verified: no invented clients, results or dates.
3. Set `status: published`.
4. Run `npm run check && npm test && npm run build`.
5. Check the page in `npm run preview`.
