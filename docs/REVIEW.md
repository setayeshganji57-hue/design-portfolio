# Review pack

This document covers how to open the site, the current project status, the screenshots and recording, what was verified, and what needs your decision.

## 1. How to open the site

There are three different things. Only the first exists today.

### A. Local preview (you run it on your own computer)

Requirements: Node.js 20.3 or newer (22 recommended), and npm.

```bash
git clone -b claude/setayesh-portfolio-site-smiwyr https://github.com/setayeshganji57-hue/design-portfolio.git
cd design-portfolio
npm install
```

| What you want to see | Command | Then open |
| --- | --- | --- |
| Working site with all drafts visible | `npm run dev` | http://localhost:4321 |
| What the public would see (published pages only) | `npm run build && npm run preview` | http://localhost:4321 |
| Private review build (all drafts, marked noindex) | `npm run build:drafts && npm run preview` | http://localhost:4321 |

The dev server runs on your machine only. Stop it with Ctrl+C.

### B. Deployed preview (a hosted URL you can open from anywhere)

**None exists.** The site has not been deployed to any host. The dev server runs inside this cloud session's container, so there is no URL you can open.

When you approve it, the recommended option is a **private** Cloudflare Pages preview behind Cloudflare Access (free tier, no custom domain needed). I will not create it until you say so.

### C. Public production website

**None exists.** It is not deployed, not published, and no domain has been bought.

## 2. Project status

Approved launch list, from your message:

| Project | Discipline | Status now | Why |
| --- | --- | --- | --- |
| myMAXXI Welcome Days | Graphic & Illustration | **Published** | Complete: images, text, year, context |
| Life Below Water | Graphic & Illustration | **Published** | Complete: images, text, year, context |
| Sunny Days Between Cubes | Motion & Film | Draft | The finished film is not attached |
| ChronoLens: Unveiling Temporal Mysteries | Interactive & 3D | Draft | Contribution details and gameplay link needed |
| Illustrated Book Covers | Graphic & Illustration | Draft | Selection and details needed |
| Illustration Collection | Graphic & Illustration | Draft | Illustrations needed |
| Calligraphy & Typography | Graphic & Illustration | Draft | Pieces and details needed |
| Roman Typography | Graphic & Illustration | Draft | Images and text needed |
| Poster Collection | Graphic & Illustration | Draft | Final selection needed |
| Dream Toy / DRYMTO | Brand Identity | Draft | Final title pending; assets needed |
| PFC — Brand & Visual Identity | Brand Identity | Draft | Assets and details needed |

Kept as drafts pending your selection (in the PDF, but not on the approved list):

- Final Studio / A3 thesis poster
- Woman, Life, Freedom Exhibition
- Track La Sapienza
- Fruits in Love

Digital & UI has no approved projects. Its page shows the honest "in preparation" state.

Changes from the previous build, to follow your instructions:
- **Final Studio**, **Woman, Life, Freedom Exhibition** and **Track La Sapienza** were moved back to draft. They are not on the approved list.
- **Sunny Days Between Cubes** moved from published to draft, because the finished film is not yet attached.
- **Fruits in Love** remains a draft.

Currently published: myMAXXI Welcome Days and Life Below Water.

The manifest in `tests/launch-manifest.json` records this list. Tests fail if a project is missing, mis-filed, or published without approval.

## 3. Screenshots and recording

Public screenshots come from the production build. The essay screenshots come from the draft build, because the only essay is a labelled layout specimen, which is not published.

| File | What it shows |
| --- | --- |
| `screenshots/01-desktop-homepage-1440x900.png` | Desktop homepage with the left navigation |
| `screenshots/02-category-graphic-illustration-1440x900.png` | Category page |
| `screenshots/03-project-life-below-water-1440x900.png` | Project page (top of page) |
| `screenshots/04-about-1440x900.png` | About page |
| `screenshots/05-mobile-homepage-390x844.png` | Mobile homepage, first screen |
| `screenshots/05-mobile-homepage-390x844-full.png` | Mobile homepage, full length |
| `screenshots/06-mobile-open-navigation-390x844.png` | Mobile navigation open |
| `screenshots/07-essays-listing-1440x900.png` | Essays listing (draft build) |
| `screenshots/08-essay-reading-layout-1440x900.png` | Essay reading layout, labelled specimen (draft build) |
| `screenshots/09-essay-reading-layout-mobile-390x844.png` | Essay reading layout, mobile (draft build) |
| `recording/cut-and-reveal.mp4` | Cut-and-reveal transition, 5.8 s: homepage → Graphic & Illustration → project → back |

About the recording: it was captured from headless Chromium 141 at 1280×800, at about 20 frames per second during the transition. It shows the rendering accurately, but timing on your own hardware may feel slightly different.

## 4. What was verified

### Automated checks (all passing)

| Check | Result |
| --- | --- |
| Type checking and content schema (`astro check`) | 0 errors, 0 warnings |
| Unit tests (`npm test`) | 48 passed: logic, design tokens, launch list |
| Browser checks, production build (`npm run e2e`) | All checks passed |
| Browser checks, draft build | All checks passed |

Browser checks cover: every built route, no horizontal overflow at 360, 768, 1280 and 1440 px, and a short 1280×600 screen; every sidebar link reachable; a 404 for an unknown URL; category-to-category and category-to-project transitions; rapid clicks, back and forward; reduced motion; the mobile menu's focus handling; and no third-party video loading before a play click.

Launch checks (new): compare each build with the manifest. They fail if an expected project page is missing, if an unexpected one is built, if a project is not listed in its category, or if any draft is linked from production output.

**Verified by deliberately breaking it:** I temporarily marked Sunny Days as published in the manifest. The e2e suite then failed with "missing: sunny-days-between-cubes" and "not listed in motion-film". The manifest was reverted afterwards.

### Approved design

| Requirement | Result |
| --- | --- |
| Paper `#F3F0E9`, ink `#242424`, stone `#D8D2C8`, burgundy `#682F3F` | Defined as tokens on `:root`; checked by a test |
| Ink on paper | 13.6 : 1 (WCAG AA passes) |
| Secondary text (`#57524c`) on paper | 6.8 : 1 (passes) |
| Burgundy text on paper | 8.9 : 1 (passes) |
| Stone | 1.3 : 1 on paper. Used only for dividers and crop marks, never for text; a test enforces this |
| Bold, expressive display type | Fraunces, with a readable body and interface face, Instrument Sans |
| Five discipline categories | Present in the sidebar, homepage, footer and category pages |
| No "Selected Work" or "Featured" wording | Checked by a test across all source files |
| No separate photography section | None; checked by a test |
| Essays, About, Contact | Present in navigation, and each has a page |
| Cut-and-reveal | Works, with a fix described below |
| Accessible mobile navigation | Native dialog: focus moves in, Esc closes, focus returns to the menu button |
| Reduced motion | The transition is disabled and animations are minimised; checked in the browser |

Text sizes: the smallest labels were around 11 px (placeholder captions). I raised them to about 12.8 px. Body text is around 16 to 18 px.

### Cut-and-reveal: problem found and fixed

Reviewing frame-by-frame, I found that the outgoing page's text ghosted through the incoming page during the second half of the transition. The cause was a fade on the outgoing layer. I removed that fade, so the outgoing page now stays at full opacity while the incoming page is revealed behind the moving line. 
## 5. Comparison with the reference (palomarincon.com)

I could open the reference this session, and I looked at its structure and screenshot. I did not copy any of its assets, code or colours. The comparison:

| Aspect | Reference | This site | Assessment |
| --- | --- | --- | --- |
| Category navigation | A vertical strip of rotated category labels on the left, each with its own colour band | A horizontal, numbered text list in a sidebar | **Gap.** The approved direction names this navigation as the primary inspiration. See decision 1 below. |
| Divider and scissors | A dotted vertical line with a scissors icon, separating the category strip from the work | A solid border; the cut line and scissors appear only during the transition | **Partial.** A persistent scissors divider would match the reference more closely. |
| Work grid | Large images in a stepped two-column grid, with a "Selected Work" title | Discipline previews in a composed layout, with no "Selected Work" title | Matches your brief. |
| Secondary navigation | Shop, About, Contact at the top right; social links vertically on the right edge | About, Contact and Essays in the sidebar; Behance in the sidebar footer | Acceptable. |
| Colour | Many saturated pastel bands | Warm neutral, with burgundy used sparingly | Matches the approved palette. Bands are intentionally not imported. |

I could not retrieve the reference's transition script, so I could not compare its timing with mine.

## 6. Decisions I need from you

1. **Category navigation.** Should I rebuild the sidebar's discipline list as a vertical strip of rotated labels, with a dashed divider and scissors as in the reference, but in our palette? This is a visual change, so I have not made it.
2. **Dream Toy title.** "Dream Toy", "DRYMTO", or "Dream Talk" as the page title.
3. **Sunny Days.** Keep as draft until the film link arrives, or publish now with stills?
4. **Digital & UI selection.** Which nine Behance UI projects, if any, belong here?

## 7. Not verified

- Safari and Firefox. Firefox does not yet support cross-document View Transitions, so there, navigation is instant and the cut is skipped.
- Screen readers, and touch behaviour on physical devices. Mobile was tested with emulated viewports only.
- Behance project galleries. They refuse automated access, so I used only the profile page.
- Timing of the reference's transition.
