# Content & asset checklist

Last updated after publishing from the portfolio PDF ("Portfolio", Setayesh's Drive file, 58 pages) and the Behance profile.

**Publishing status**

| Project | Discipline | Status |
| --- | --- | --- |
| Life Below Water | Graphic & Illustration | **Published** |
| myMAXXI Welcome Days | Graphic & Illustration | **Published** |
| Final Studio (thesis poster) | Graphic & Illustration | **Published** |
| Woman, Life, Freedom Exhibition | Interactive & 3D (also Graphic & Illustration) | **Published**, category to confirm |
| Sunny Days Between Cubes | Motion & Film (also Interactive & 3D) | **Published**, video link pending |
| Track La Sapienza | Digital & UI | **Published**, selection to confirm |
| ChronoLens: Unveiling Temporal Mysteries | Interactive & 3D | Draft: contribution details needed |
| Fruits in Love | Motion & Film | Draft: no video link or usable stills |
| Dream Toy, PFC, Illustrated Book Covers, Illustration Collection, Calligraphy & Typography, Roman Typography, Poster Collection | various | Draft: no assets or text yet |

Every project's wording was drafted from the PDF. It is lightly edited English, so please read each one. Each record's `todo:` list (in its YAML file) shows the open items for that project.

## Decisions to confirm (highest priority)

- [ ] **Dream Toy title.** You said it's pronounced "dream talk." Behance lists it as "DRYMTO." What should the page say?
- [ ] **Name on the PDF cover.** It reads "Setayesh Shahsavandganji." The site uses "Setayesh Ganji," as you asked. Please confirm the public name, and whether you want the surname used anywhere.
- [ ] **Your role and collaborators** for every published project. The PDF gives instructors' names, which I did not list as collaborators.
- [ ] **Contribution to ChronoLens.** Which models, characters and assets are yours? Credits stay out of the site until you confirm.
- [ ] **Institution** for Woman, Life, Freedom; Fruits in Love; Final Studio. The PDF names only the studio, so the page shows "Academic" with no institution.

## Digital & UI selection (Behance)

The Behance profile lists these UI and web projects. I could read the profile but not their gallery pages, which return errors to automated access. Nothing has been published from them. Tell me which to include and I'll write them up from the Behance pages (or from files you upload):

- BiotiFood Website design
- Interactive Landing page design for a juice company
- Credit card design for an online blockchain startup
- Mehr (Your Personal Shopping): Application design
- clothing e-commerce mobile application
- welltrain Sport App Design
- CrediZen AI app UI/UX design
- UI page design for a company powering analytics with AI
- Modern UI Website Design for SaaS Company

Also check: the Behance project "Infographic poster" appears to be the same work as **Final Studio** in the PDF, so I did not create a second entry. Confirm this.

Behance also lists "Roman Typography" and "Game Design ChronoLens". They match the existing draft records, so I did not duplicate them.

## Media

- The images for the published projects were extracted from the PDF at their embedded resolution. Some are smaller than ideal, for example the Final Studio poster (894 px wide). **Replace with original files** where you have them.
- Do not use screenshots of PDF pages.
- Fruits in Love: needs a video link (YouTube or Vimeo), a poster frame, and two or three stills. The PDF's pages for this project show no usable stills.
- Sunny Days Between Cubes: the finished film is not in the PDF. Add its link in a video block. The page currently shows stills and plans.
- ChronoLens: the PDF has 45 images from the game. Select 4 to 6 and add a gameplay link. Each still needs alt text.

## Essays (`src/content/essays/`)

No essay texts or titles have been provided, so no essay records exist.

- [ ] Master's thesis. The PDF's Final Studio poster gives this working title: "Bridging Boundaries: Utilizing Extended Reality (XR) for Virtual Museums (VM) to Foster Art Appreciation and Learning in Persian-Speaking Communities of Three Growing Countries." Confirm the final title, then provide the full text.
- [ ] Two completed essays: title, abstract, year, language, text (Markdown), optional PDF.
- [ ] Two in-progress essays: title and abstract, if they should be listed.
- [ ] References and image credits for each.
- [ ] Delete `specimen-reading-layout.md` once the first real essay is added.

## Site-wide (`src/config/site.ts`)

- [ ] Public email address (`email`). The Contact page shows an honest note until you add one.
- [ ] Further professional links (Behance is listed).
- [ ] CV PDF in `public/documents/`.
- [ ] Portrait in `src/assets/media/about/`, plus `portrait: { file, alt }`.
- [ ] Review the About wording. Is the bachelor's field name exactly right? Should years be shown?
- [ ] Production domain, set as `SITE_URL` at deploy.

## Disciplines and homepage (`src/config/categories.ts`)

- [ ] Review the one-line discipline intros.
- [ ] Optional dedicated `homePreview` image per discipline. Without one, the homepage uses the first project cover in that discipline.

## Before publishing any further project

1. Media are in `src/assets/media/<slug>/` and referenced in the YAML, with alt text.
2. Every fact is verified: no invented clients, results, dates or roles.
3. Set `status: published`.
4. Run `npm run check && npm test && npm run build`, then `npm run e2e`.
