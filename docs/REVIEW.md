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
| Add Hamloqmeh (website and app as one case study) | Published. Two buttons: Visit website, Open app. Both links return 200 from this environment. Role and development credit are separate. |
| Add TradeMemory | Published. Open app button (returns 200). The site says it is in private beta, and I state that. |
| Add Little Detour | **Draft.** Its website returns a log-in page (HTTP 401), so it isn't publicly viewable, and no Visit website button is added. |
| Contact details | Email, phone and LinkedIn are on the Contact page. LinkedIn is also in the About page and footer. |
| Mobile discipline strip | Built. The same five colour bands run as a row of columns under the top bar, with the dashed divider and scissors along their bottom edge. Labels read horizontally on phones. |
| Dreamto | Title changed to Dreamto, as you wrote. Still a draft: the logo and Behance say DRYMTO, and the full Behance description was cut off in your screenshot. |
| Thesis as an essay | Added as a draft entry. No abstract exists in the PDF, so none is written. See decisions. |
| Colours | Kept as they are for now. |

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

1. **Hamloqmeh spelling.** You wrote "Hamloghme". The live website and app spell it Hamloqmeh, and the brand's Persian name is هم‌لقمه. I used Hamloqmeh. Tell me if you want your spelling.
2. **Dreamto spelling.** The title is Dreamto, as you wrote. The logo and Behance say DRYMTO. Which should the page show? Please also send the full Behance description.
3. **Little Detour.** Make the site publicly viewable, or send screenshots. Then I can add the Visit website button.
4. **Thesis.** The PDF is the master's thesis, titled "The Role of Artificial Intelligence in Enhancing Startup Communication". Your message called it an essay and used the title "…in Startups Communication". Which title should appear? Should the site show the full text, a PDF download, or the abstract only? The thesis names five real companies in its case studies, and it reproduces figures from other sources. Both need your decision before publishing. I have not written an abstract, because the thesis has none.
5. **Email address.** You gave Setayesh.ganji@gmail.com, which differs from the address on your account (setayeshganji57@gmail.com). I published the one you gave. Confirm which to use.
6. **Surname.** The thesis title page reads "Setayesh Shahsavandganji". The site uses Setayesh Ganji. Please confirm.
7. **Mobile labels.** Horizontal labels on phones are my call for legibility. Tell me if you want vertical text there too.

## 7. Not verified

- Safari and Firefox. Firefox does not support the page-transition fade, so navigation there is instant.
- Screen readers, and touch behaviour on real devices. Mobile was checked in emulated viewports only.
- The Hamloqmeh app's customer and business journeys. Only the log-in screen is captured, because the rest sits behind a login.
