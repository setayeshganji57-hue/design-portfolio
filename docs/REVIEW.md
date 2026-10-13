# Review pack

Current as of the latest round of UI changes. It covers how to open the site, what changed, project status, the screenshots and recording, what was verified, and what I need from you.

## 1. How to open the site

Three different things. Only the first exists today.

### A. Local preview (on your own computer)

Requires Node.js 20.3 or newer (22 recommended) and npm.

```bash
git clone -b claude/setayesh-portfolio-site-smiwyr https://github.com/setayeshganji57-hue/design-portfolio.git
cd design-portfolio
npm install
```

| What you want to see | Command | Then open |
| --- | --- | --- |
| Working site, with all drafts visible | `npm run dev` | http://localhost:4321 |
| What the public would see (published pages only) | `npm run build && npm run preview` | http://localhost:4321 |
| Private review build (all drafts, marked noindex) | `npm run build:drafts && npm run preview` | http://localhost:4321 |

The local server runs on your machine only. Stop it with Ctrl+C.

### B. Deployed preview (a hosted, private URL)

**None exists.** The site has not been deployed. The dev server only runs inside this cloud session's container, so there is no URL you can open.

When you approve it, I recommend a private Cloudflare Pages preview behind Cloudflare Access. It is free and needs no domain. I will not create it until you say so.

### C. Public production website

**None exists.** Not deployed, not published, and no domain has been bought.

## 2. What changed in this round

| Your feedback | What I did |
| --- | --- |
| "Too monochrome; add more colour" | Each discipline has its own colour band: Brand Identity (vermilion), Graphic & Illustration (saffron), Digital & UI (sage), Motion & Film (rose), Interactive & 3D (cornflower). They are my own choices, not Paloma's palette. The bands appear in the navigation, on the homepage tiles, on category headers, and as project chips. Burgundy stays the accent for active links. |
| "Don't like the scissors/cut idea" | Removed the animated sweeping line. The scissors now sit on a dashed divider between the discipline rail and the content, as a fixed detail. Page moves use a short fade and rise (420 ms). |
| "Use the Paloma idea" | A persistent vertical strip of the five disciplines on the left, with rotated labels, and the content to its right. The active discipline has a dark bar on top. Essays, About and Contact sit at the top right, as on the reference. |
| "Headers a bit more basic" | Headings, the name and the interface now use Instrument Sans, which is a plain grotesque. Fraunces is kept only for the essay reading text. |
| "Essays, About and Contact to the right side" | Each of these pages has its title on the left and its content in a right-hand column. The essay reading view follows the same arrangement. |
| "Sunny Days should be published with stills" | Published, using its still photographs and plan diagrams. Its film link is optional and can be added later. |
| Mobile | Unchanged for now. The vertical discipline strip for mobile is the next step, as you said. |

## 3. Project status

**Published (in the production build):**
- myMAXXI Welcome Days (Graphic & Illustration)
- Life Below Water (Graphic & Illustration)
- Sunny Days Between Cubes (Motion & Film), with stills

**Draft, on the approved launch list:**
- ChronoLens: Unveiling Temporal Mysteries (Interactive & 3D). Your contribution details are needed.
- Illustrated Book Covers, Illustration Collection, Calligraphy & Typography, Roman Typography, Poster Collection (all Graphic & Illustration). Selections and details are needed.
- Dream Toy (Brand Identity). Final title pending.
- PFC (Brand Identity). Details needed.

**Draft, not on the approved launch list (kept as drafts until you select them):**
- Final Studio / A3 thesis poster
- Woman, Life, Freedom Exhibition
- Track La Sapienza
- Fruits in Love

**Digital & UI:** no approved projects yet. Trade Memory and Hamlogme are waiting for references from you.

The manifest in `tests/launch-manifest.json` records this list. The tests fail if a project is missing, mis-filed, or published without approval.

## 4. Screenshots and recording

Public screenshots come from the production build. Essay screenshots come from the draft build, because the only essay is a labelled layout specimen, which is not published.

| File | What it shows |
| --- | --- |
| `screenshots/01-desktop-homepage-1440x900.png` | Desktop homepage with the discipline rail |
| `screenshots/02-category-graphic-illustration-1440x900.png` | Category page with its colour band |
| `screenshots/03-project-life-below-water-1440x900.png` | Project page, top of page |
| `screenshots/04-about-1440x900.png` | About, content on the right |
| `screenshots/05-mobile-homepage-390x844.png` | Mobile homepage, first screen |
| `screenshots/05-mobile-homepage-390x844-full.png` | Mobile homepage, full length |
| `screenshots/06-mobile-open-navigation-390x844.png` | Mobile navigation open |
| `screenshots/07-essays-listing-1440x900.png` | Essays listing, draft build |
| `screenshots/08-essay-reading-layout-1440x900.png` | Essay reading layout, labelled specimen, draft build |
| `screenshots/09-essay-reading-layout-mobile-390x844.png` | Essay reading layout, mobile, draft build |
| `recording/page-transition.mp4` | Page transition, 5.2 s: homepage → Graphic & Illustration → project → back |

About the recording: captured from headless Chromium at 1280×800, at about 20 frames per second. It is an accurate capture of the rendering, but on your own machine the timing may feel slightly different.

## 5. What was verified

| Check | Result |
| --- | --- |
| Type checking and content schema (`astro check`) | 0 errors |
| Unit tests (`npm test`) | 48 passed. Covers ordering, reading time, video URLs, palette tokens, text contrast, forbidden headings, the launch list |
| Browser checks, production build | All checks passed |
| Browser checks, draft build | All checks passed (29 checks) |

The browser checks cover every built route, no horizontal overflow at 360, 768, 1280 and 1440 px and at 1280×600, reachability of every discipline and page link, a 404 page, transitions between work pages, rapid clicks, back and forward, reduced motion, the mobile menu's focus handling, and the launch list.

Launch checks compare each build with the manifest. They fail if an expected project page is missing, if an unexpected one is built, if a project is not listed in its category, or if a draft is linked from production output.

**Verified by deliberately breaking it (previous round):** marking an unapproved project as published caused the browser checks to fail, and the change was reverted.

### Colour and contrast

Ink text on each discipline colour:

| Discipline | Colour | Ink text contrast |
| --- | --- | --- |
| Brand Identity | `#E0764F` | 5.1 : 1 |
| Graphic & Illustration | `#F0C75E` | 9.6 : 1 |
| Digital & UI | `#7FB7A4` | 6.8 : 1 |
| Motion & Film | `#E9A0B0` | 7.5 : 1 |
| Interactive & 3D | `#7D9CC7` | 5.5 : 1 |

Ink on paper is 13.6 : 1. Every discipline colour carries ink text, never paper text, so every label meets WCAG AA for normal text.

### Transition

Reviewed frame by frame. The earlier ghosting of the outgoing page is gone with the sweeping line. The new fade shows the content settle without any other movement. Reduced motion turns it off.

## 6. Decisions I need from you

1. **Colours.** Do the five discipline colours work for you? They are my choices. I can shift any of them.
2. **Dream Toy.** Which title should the page show: "Dream Toy", "DRYMTO" or "Dream Talk"? You mentioned a second name that already exists on Behance. Please confirm which name that is.
3. **Digital & UI.** Send the references for Trade Memory and Hamlogme, plus the two or three further projects, when you have them.
4. **Mobile.** Shall I build the vertical discipline strip for mobile next?

## 7. Not verified

- Safari and Firefox. Firefox does not support cross-document View Transitions, so there, navigation is instant and the fade is skipped.
- Screen readers, and touch behaviour on real devices. Mobile was checked in emulated viewports only.
- The reference's category transition. The reference site did not respond reliably to my automated clicks, so I designed from its structure and its screenshot, not its timing.
