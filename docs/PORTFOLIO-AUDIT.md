# Portfolio audit

Date: 16 October 2026. Branch: `claude/setayesh-portfolio-site-smiwyr`.

## How this was checked

- **Visual review:** local production build (`npm run build`), served locally. Every public page was screenshotted at 1440×900 and 390×844: home, the five disciplines, the five published projects, About, Contact, Essays, the thesis page and the 404 page. Results were checked for overflow, broken images and "Coming soon" states.
- **Live links:** `hamloqmeh-website.vercel.app` returned 200. `hamloqmeh-app.vercel.app` returned 307 to `/sign-in`. `tradememory-sigma.vercel.app` returned 200. `littledetour.vercel.app` returned 404 (Little Detour has no public link in the site).
- **Protection:** the protected preview returns 302 to Vercel single sign-on. This confirms recruiters cannot open it without signing in. I did not use credentials or change any setting.
- **Thesis:** cover, contents and chapter 4 were read from the PDF with `pdftotext`. The PDF has no abstract.
- **Not tested:** Safari and Firefox, a screen reader, the live production deployment (none exists yet).

## The 15-second test

The homepage reads clearly: *Visual and multimedia design across identity, illustration, interfaces, motion and film, and 3D.* The design is distinctive and the navigation works on desktop and phone.

The weakness is that the first promise is not backed by published work. Two of the five disciplines the homepage names, **identity** and **3D**, lead to "Coming soon" pages. Five projects are published: two graphic, two digital, one motion. A hiring manager who clicks "identity" first reaches an empty page.

## A. Fix before sending applications

| # | Issue | Evidence or page | Hiring impact | Exact fix | Effort | Needs your input? |
|---|---|---|---|---|---|---|
| A1 | Brand Identity and Interactive & 3D have no published projects, but the homepage names both. | `/work/brand-identity`, `/work/interactive-3d`; hero statement | High. Brand is the most common junior design listing I found, so the empty category is the largest gap. | Publish one brand case study. Best candidate: Dreamto (listed as DRYMTO on Behance). The thesis brand chapter is a second option, as an academic project. | 2–4 h | Yes: role, context (commissioned, independent or academic), year, originals |
| A2 | No public address exists. | Preview returns 302 to Vercel SSO | Blocking. Recruiters cannot open the site. | You decide when production goes live and whether to add a domain you own. Drafts stay out of the production build. | 1 h decision, then setup | Yes |
| A3 | Three published projects have no role line. | myMAXXI, Life Below Water, Sunny Days: no `role:` field, so the role row is hidden | High. Recruiters look for your role first, and without it your ownership is unclear. | Add one line each: your role and collaborators | 15 min | Yes |
| A4 | No CV and no portrait. | About shows "Portrait to come". The CV link is hidden because no file exists in `public/documents/`. | High. A CV is the default attachment for applications. The placeholder looks unfinished. | Send a CV PDF and a portrait. The code already supports both. | 20 min | Yes |
| A5 | The thesis title and the name on its PDF differ from the site. | Site title: *The Influence of AI in Startups Communication*. PDF cover: *The Role of Artificial Intelligence in Enhancing Startup Communication*. Candidate on the PDF: *Setayesh Shahsavandganji*. | High. A recruiter who opens the PDF sees a different title and surname. | Decide which title the site uses. Decide whether the PDF name is acceptable publicly, or whether a different PDF is needed. | 5 min | Yes (decision) |
| A6 | Unverified personal claim. | TradeMemory overview said "drawing on my own experience as a trader". | Medium to high. An unsupported claim in a finance-related product. | **Fixed:** sentence removed. Restore only if it is true. | done | No |
| A7 | "Open app" leads to a sign-in page. | Hamloqmeh app returns 307 to `/sign-in` | Medium. A recruiter hits a login wall with no warning. | **Fixed:** label now reads "Open app (log-in required)". | done | No |

## B. Improve during the next two weeks

| # | Issue | Evidence or page | Hiring impact | Exact fix | Effort | Needs your input? |
|---|---|---|---|---|---|---|
| B1 | Sunny Days uses small images as its hero. | `still-1.jpg` is 699×674 px and is shown at desktop width | Medium. The motion work looks softer than it is. | Send stills at 2000 px or more, or a film link | 30 min | Yes |
| B2 | Sunny Days is tagged "4D video", which is misleading. | Tag list | Low to medium. Reads as a technical claim. | **Fixed:** tag now reads "Projection" | done | No |
| B3 | Whether the myMAXXI campaign was a real museum brief or a studio brief is unconfirmed. | Overview and open to-do | High if asked in an interview and answered wrongly. | Confirm, then adjust the wording | 5 min | Yes |
| B4 | The "robotic sphere" wording in Life Below Water is unconfirmed. | Overview and open to-do | Medium. A detail a reviewer may question. | Confirm, or remove the phrase | 5 min | Yes |
| B5 | TradeMemory's product screens sit behind a login, so only the landing page is visible. | Project blocks | Medium. The UI claim is not visible on the site. | Two or three logged-in screenshots. Send screenshots only, never a password. | 30 min | Yes |
| B6 | Track La Sapienza is still a draft, although it is the strongest candidate for a third UI case. | Status: draft. Four content blocks. | Medium to high for UI roles. | Confirm your role and the brief, then publish | 1 h | Yes |
| B7 | The thesis essay has no abstract, so the listing is thin. | Essays index | Low to medium | Draft an abstract from the contents, for your approval. The PDF has none. | 20 min | Yes (approval) |
| B8 | About says "my eight-year journey through design education and practice". | `src/config/site.ts` | Medium. Could be read as eight years of practice. You asked that education years not be presented as employment. | Keep your text, or use one of the options in APPLICATION-MATERIALS | 5 min | Yes (choice) |
| B9 | Little Detour is a draft with no public link. | Draft; `littledetour.vercel.app` returns 404 | Low. Do not cite it as launched. | Keep as draft until a link or screens are verified | — | Yes, if you want it shown |

## C. Optional polish

- The desktop hero statement wraps to three lines. Shortening it is optional.
- Hamloqmeh's logged-in app screens are not shown. Add them only if you have permission to show them.
- Interactive & 3D has no published case. ChronoLens needs a video or stills first. Not a priority unless you target games or 3D.
- The Contact page is complete: email, phone, Behance, LinkedIn.

## Five changes most likely to make the site more convincing

1. **A published brand case study.** It closes the largest visible gap, and the homepage already promises it.
2. **A role line and one-sentence learning on every published project.** Recruiters look for ownership first.
3. **A public address a recruiter can open** (after your decision on production and domain).
4. **A CV and a portrait.** Both are currently missing.
5. **One title and one name across the site and the thesis PDF.** At the moment they disagree.

I'm not giving conversion estimates. None of these changes can be measured here.

## What already works (keep)

- A distinctive visual system with restrained colour, bold type and clear navigation.
- Honest project status. Hamloqmeh is described as in trial with a waiting list. TradeMemory is described as private beta.
- Clear authorship on the digital projects. The "AI-assisted development" credit sits next to your design role, which is accurate.
- Persian right-to-left interface work on Hamloqmeh. This is a real differentiator for some roles and clients. Confirm your Persian and English levels before claiming them.
- Accessibility basics: a skip link, reduced-motion support, and new-tab warnings on external links.
- Build hygiene: drafts are excluded from the production build, the preview is protected, and the test suite passes.

## Project status at a glance

| Project | Status | Category | Role line | Main gap |
|---|---|---|---|---|
| Hamloqmeh | Published (trial) | Digital & UI | Yes | App behind login |
| TradeMemory | Published (private beta) | Digital & UI | Yes | Screens behind login |
| myMAXXI Welcome Days | Published | Graphic & Illustration | **No** | Role, brief confirmation |
| Life Below Water | Published | Graphic & Illustration | **No** | Role, "robotic sphere" wording |
| Sunny Days Between Cubes | Published (stills) | Motion & Film | **No** | Role, film link, sharper stills |
| Dreamto | Draft | Brand Identity | Missing | Entire case: role, context, description, images |
| Track La Sapienza | Draft | Digital & UI | Missing | Role, brief confirmation |
| Little Detour | Draft | Digital & UI | Yes | No public link |
| ChronoLens | Draft | Interactive & 3D | Missing | Video, your contribution |
| Other drafts (Final Studio, Fruits in Love, Woman Life Freedom, illustration, typography, posters, PFC) | Draft | Various | Missing | Content not yet selected or verified |

## Evidence files

- Screenshots from this audit: `/tmp/claude-0/-home-user-design-portfolio/d81b9e12-d2e9-53c6-858e-2c4669dc276d/scratchpad/audit/`
- Image sizes checked: `src/assets/media/*` (covers and heroes are mostly 1,000–2,400 px; the Sunny Days stills are about 700 px)
