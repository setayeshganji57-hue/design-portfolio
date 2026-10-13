# Review pack

Current as of the latest round: three Digital & UI projects, contact details, the mobile discipline strip, and the thesis entry.

## 1. How to open the site

There are three different things. Only the first exists today.

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

### B. Deployed preview (a hosted, private URL)

**None exists.** Not deployed. The dev server only runs inside this cloud session's container, so there is no URL you can open.

I recommend a private Cloudflare Pages preview behind Cloudflare Access when you are ready. I will not create it until you approve.

### C. Public production website

**None exists.** Not deployed, not published, and no domain has been bought.

## 2. What changed in this round

| Request | What I did |
| --- | --- |
| Hamloqmeh: stop work on it | No further changes. It stays published as it is, with its spelling confirmed. |
| Dreamto | Stays a draft. I can't open its Behance page from this environment (Behance blocks the project page here), so the description is still missing. The spelling question is closed: the title is Dreamto. |
| Publish the thesis in full | Published as an essay: "The Influence of AI in Startups Communication". The full 99-page PDF is in `public/documents/`, with Open PDF and Download PDF buttons. The PDF's cover reads "The Role of Artificial Intelligence in Enhancing Startup Communication." |
| Email | Setayeesh.gannji@gmail.com on the Contact page, confirmed by the owner. |
| Surname | Unchanged. The site uses Ganji. |
| Reading time | Hidden for essays under three minutes, so the thesis no longer says "1 min read". |

## 3. Project status

**Published:**
- Hamloqmeh (Digital & UI)
- TradeMemory (Digital & UI)
- myMAXXI Welcome Days (Graphic & Illustration)
- Life Below Water (Graphic & Illustration)
- Sunny Days Between Cubes (Motion & Film), with stills

**Draft, on the approved launch list:**
- Dreamto (Brand Identity). Title and spelling to confirm.
- PFC (Brand Identity)
- ChronoLens: Unveiling Temporal Mysteries (Interactive & 3D)
- Illustrated Book Covers, Illustration Collection, Calligraphy & Typography, Roman Typography, Poster Collection (Graphic & Illustration)

**Draft, not on the approved list:**
- Little Detour (Digital & UI). Login-protected.
- Final Studio / A3 thesis poster
- Woman, Life, Freedom Exhibition
- Track La Sapienza
- Fruits in Love

**Essays:** the thesis entry is a draft. Specimen layout is labelled and not published.

The manifest in `tests/launch-manifest.json` records this list. The tests fail if a project is missing, mis-filed, or published without approval.

## 4. Screenshots

Public screenshots come from the production build. Essay screenshots come from the draft build.

| File | What it shows |
| --- | --- |
| `screenshots/01-desktop-homepage-1440x900.png` | Homepage with the discipline rail |
| `screenshots/02-category-graphic-illustration-1440x900.png` | Category page |
| `screenshots/03-project-life-below-water-1440x900.png` | Project page |
| `screenshots/04-about-1440x900.png` | About |
| `screenshots/05-mobile-homepage-390x844-full.png` | Mobile homepage, full length |
| `screenshots/06-mobile-open-navigation-390x844.png` | Mobile menu open |
| `screenshots/10-category-digital-ui-1440x900.png` | Digital & UI category |
| `screenshots/11-project-hamloqmeh-1440x900.png` | Hamloqmeh case study, desktop |
| `screenshots/12-project-hamloqmeh-mobile-390x844.png` | Hamloqmeh case study, mobile |
| `screenshots/13-project-tradememory-1440x900.png` | TradeMemory case study |
| `screenshots/14-contact-1440x900.png` | Contact |
| `screenshots/15-mobile-category-graphic-illustration-390x844.png` | Mobile category page |
| `screenshots/07-essays-listing-1440x900.png` | Essays listing (draft build) |
| `screenshots/08-essay-reading-layout-1440x900.png` | Essay reading layout, labelled specimen (draft build) |
| `screenshots/09-essay-reading-layout-mobile-390x844.png` | Essay reading layout, mobile (draft build) |

The Hamloqmeh and TradeMemory interface images were captured from the live sites. TradeMemory's logging, review and analytics screens sit behind a log-in, so they aren't included yet.

## 5. Verification

| Check | Result |
| --- | --- |
| Type checking and content schema | 0 errors |
| Unit tests | 51 passed |
| Browser checks, production build | All checks passed |
| Browser checks, draft build | All checks passed |
| Project links (`npm run check:links`) | Hamloqmeh (website and app) and TradeMemory return 200. Little Detour isn't checked because it is a draft. |

The link check uses curl. It fails if a published project's link doesn't respond with a success status, so a login-protected site can't go live with a Visit button by mistake.

The mobile discipline strip was checked at 390 px. The labels are horizontal on phones because a 72 px column is too narrow for vertical text to read well. The vertical text stays on desktop.

## 6. Decisions I need from you

1. **Mobile labels.** Horizontal labels on phones are my call for legibility. Tell me if you want vertical text there too.

## 7. Not verified

- Safari and Firefox. Firefox does not support the page-transition fade, so navigation there is instant.
- Screen readers, and touch behaviour on real devices. Mobile was checked in emulated viewports only.
- The Hamloqmeh app's customer and business journeys (not needed for now, per your message).
- Dreamto's Behance description and images, which Behance blocks from this environment.
