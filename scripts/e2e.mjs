/**
 * Browser checks against a built site (run `npm run build:drafts` or `npm run build` first).
 *
 *   npm run e2e
 *
 * Starts `astro preview`, drives Chromium with Playwright and checks routes,
 * overflow, navigation/transition behaviour, the homepage statement, the
 * discipline pager, the image viewer, reduced motion, the mobile menu and video
 * loading. Set CHROMIUM_PATH to use a specific browser binary.
 */
import { spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4329;
const BASE = `http://localhost:${PORT}`;
// Routes come from the build output, so the suite follows whatever is published.
const htmlSlugs = dir => (existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, '')) : []);
const projectSlugs = htmlSlugs('dist/projects');
const essaySlugs = htmlSlugs('dist/essays');
// Draft preview builds mark every page noindex; the production homepage never is.
const drafts = readFileSync('dist/index.html', 'utf8').includes('noindex');

const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(Boolean);
const executablePath = candidates.find((p) => existsSync(p));

let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? '  ✓' : '  ✗'} ${msg}`);
  if (!cond) failures++;
};

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('preview server did not start')), 20000);
  server.stdout.on('data', (d) => {
    if (String(d).includes(String(PORT))) {
      clearTimeout(t);
      resolve();
    }
  });
});

const browser = await chromium.launch(executablePath ? { executablePath } : {});

try {
  const routes = ['/', '/work/brand-identity', '/work/graphic-illustration', '/work/digital-ui', '/work/motion-film', '/work/interactive-3d', '/essays', '/about', '/contact'];
  routes.push(...projectSlugs.map(s => `/projects/${s}`), ...essaySlugs.map(s => `/essays/${s}`));

  console.log(`\nRoutes and overflow (${drafts ? 'draft preview build' : 'production build'})`);
  for (const [w, h] of [[360, 740], [768, 1024], [1280, 800], [1440, 900], [1280, 600]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    let bad = [];
    for (const r of routes) {
      const res = await page.goto(BASE + r);
      if (!res || res.status() !== 200) bad.push(`${r} → ${res?.status()}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) bad.push(`${r} overflows by ${overflow}px`);
      // Images without a src (the empty image viewer) are not loaded yet, so they don't count.
      const broken = await page.evaluate(() => [...document.images].filter((i) => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length);
      if (broken) bad.push(`${r} has ${broken} broken image(s)`);
    }
    ok(bad.length === 0, `${w}×${h}: all routes load, no horizontal overflow, no broken images ${bad.join('; ')}`);
    if (w >= 1024) {
      // Every discipline and page link must be reachable on desktop.
      const reachable = await page.evaluate(() => {
        const links = [...document.querySelectorAll('a.band, .page-nav a')];
        return links.every((a) => {
          // Bands run the full height of the page, so check the label rather than the band.
          const target = a.querySelector('.band-label') ?? a;
          target.scrollIntoView({ block: 'nearest' });
          const r = target.getBoundingClientRect();
          return r.height > 0 && r.bottom <= window.innerHeight + 1 && r.top >= 0;
        });
      });
      ok(reachable, `${w}×${h}: every discipline and page link is reachable`);
    }
    await page.close();
  }

  const res404 = await (await browser.newPage()).goto(BASE + '/does-not-exist');
  ok(res404?.status() === 404, 'unknown route returns the 404 page');

  console.log('\nLaunch list (compared with tests/launch-manifest.json)');
  {
    const { readFileSync } = await import('node:fs');
    const manifest = JSON.parse(readFileSync('tests/launch-manifest.json', 'utf8'));
    const built = new Set(projectSlugs);
    // In a production build only approved, published projects exist. In a draft build every record exists.
    const expected = drafts
      ? [...manifest.launch, ...manifest.excluded].map(p => p.slug)
      : manifest.launch.filter(p => p.status === 'published').map(p => p.slug);
    const missing = expected.filter(slug => !built.has(slug));
    const extra = [...built].filter(slug => !expected.includes(slug));
    ok(missing.length === 0, `every expected project page is built${missing.length ? ` (missing: ${missing.join(', ')})` : ''}`);
    ok(extra.length === 0, `no unexpected project pages are built${extra.length ? ` (extra: ${extra.join(', ')})` : ''}`);

    // Each expected project is linked from its primary category page.
    const { readFileSync: rf } = await import('node:fs');
    const linkProblems = [];
    for (const p of manifest.launch.filter(p => expected.includes(p.slug))) {
      const html = rf(`dist/work/${p.category}.html`, 'utf8');
      if (!html.includes(`href="/projects/${p.slug}"`)) linkProblems.push(`${p.slug} not listed in ${p.category}`);
    }
    ok(linkProblems.length === 0, `expected projects are listed in their categories ${linkProblems.join('; ')}`);

    // Excluded projects must not appear in production output at all.
    if (!drafts) {
      const { execSync } = await import('node:child_process');
      const leaks = manifest.excluded.concat(manifest.launch.filter(p => p.status === 'draft')).filter(p => {
        try { execSync(`grep -rl "/projects/${p.slug}" dist --include=*.html --include=*.xml --include=*.txt`, { stdio: 'pipe' }); return true; } catch { return false; }
      });
      ok(leaks.length === 0, `no draft project is linked anywhere in the production output ${leaks.map(p => p.slug).join(', ')}`);
    }

    // A category with no approved projects shows the honest empty state.
    for (const cat of manifest.categoriesWithNoApprovedProjects) {
      const html = rf(`dist/work/${cat}.html`, 'utf8');
      const approvedHere = manifest.launch.filter(p => p.category === cat && expected.includes(p.slug)).length;
      // Production: no approved project means the honest empty state. Draft builds list their drafts instead.
      if (!drafts && approvedHere === 0) ok(html.includes('Coming soon'), `${cat} shows a coming-soon state`);
    }
  }

  console.log('\nPage transition');
  // Record, for each page reveal, whether the browser ran a view transition.
  const recordReveals = async (context) => context.addInitScript(() => {
    addEventListener('pagereveal', (e) => {
      sessionStorage.setItem('lastReveal', JSON.stringify({ vt: !!e.viewTransition, url: location.pathname }));
    });
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await recordReveals(ctx);
  const page = await ctx.newPage();
  const lastReveal = () => page.evaluate(() => JSON.parse(sessionStorage.getItem('lastReveal') || '{}'));
  await page.goto(BASE + '/work/brand-identity');
  await page.waitForLoadState('load');
  await page.evaluate(() => document.fonts.ready);
  await page.click('a.band[href="/work/motion-film"]');
  await page.waitForURL('**/work/motion-film');
  await page.waitForFunction(() => (sessionStorage.getItem('lastReveal') || '').includes('"url":"/work/motion-film"'));
  const r1 = await lastReveal();
  ok(r1.vt, 'discipline → discipline runs a view transition (the bands slide into place)');
  await page.waitForTimeout(900);
  ok((await page.evaluate(() => document.querySelector('.band[aria-current]')?.textContent?.trim())) === 'Motion & Film', 'the open discipline is marked current after the move');

  // Browsers may skip a transition when the previous one is still settling, so this move is only checked for its destination.
  await page.click('.page-nav a[href="/essays"]');
  await page.waitForURL('**/essays');
  await page.waitForLoadState('load');
  ok((await page.textContent('h1'))?.trim() === 'Essays', 'the Essays link opens the Essays page');

  // Rapid repeated navigation: the final URL and content must match the last click.
  await page.goto(BASE + '/work/brand-identity');
  const order = ['graphic-illustration', 'digital-ui', 'motion-film', 'interactive-3d'];
  for (const slug of order) {
    await page.locator(`a.band[href="/work/${slug}"]`).click({ noWaitAfter: true }).catch(() => {});
    await page.waitForTimeout(60);
  }
  await page.waitForURL('**/work/interactive-3d');
  await page.waitForTimeout(1200);
  const h1 = (await page.textContent('h1'))?.replace(/\s+/g, ' ').trim();
  ok(h1 === 'Interactive & 3D', `rapid clicks end on the last category (h1: "${h1}")`);
  const current = await page.evaluate(() => document.querySelector('.band[aria-current]')?.textContent?.trim());
  ok(current === 'Interactive & 3D', 'no stuck state: the open band matches the URL');

  await page.goBack();
  await page.waitForTimeout(800);
  ok(page.url().endsWith('/work/brand-identity') || page.url().endsWith('/work/motion-film'), `back navigates to a previous page (${page.url()})`);
  const backH1 = (await page.textContent('h1'))?.replace(/\s+/g, ' ').trim();
  const backCurrent = await page.evaluate(() => document.querySelector('.band[aria-current]')?.textContent?.trim());
  ok(backCurrent === backH1, `after back, heading and open band agree (${backH1})`);
  await page.goForward();
  await page.waitForTimeout(800);
  ok(page.url().endsWith('/work/interactive-3d'), 'forward returns to the last category');
  await ctx.close();

  console.log('\nHomepage, discipline pager and image viewer');
  const fx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const fp = await fx.newPage();
  await fp.goto(BASE + '/');
  const heroLinks = await fp.$$eval('.hero-statement a', (as) => as.map((a) => a.getAttribute('href')));
  const expectedHero = ['/work/brand-identity', '/work/graphic-illustration', '/work/digital-ui', '/work/motion-film', '/work/interactive-3d'];
  ok(JSON.stringify(heroLinks) === JSON.stringify(expectedHero), 'homepage statement links each discipline in band order');
  ok((await fp.locator('.deck .band').count()) === 5, 'the five discipline bands are on the homepage');
  ok((await fp.locator('.page-nav a[href="/contact"]').count()) === 1, 'Contact is in the header');

  // Discipline pager wraps around: 01 → 05 and 05 → 01.
  const disciplines = ['brand-identity', 'graphic-illustration', 'digital-ui', 'motion-film', 'interactive-3d'];
  const pagerProblems = [];
  for (const [i, slug] of disciplines.entries()) {
    await fp.goto(BASE + `/work/${slug}`);
    const prev = await fp.getAttribute('.cat-pager a[rel="prev"]', 'href');
    const next = await fp.getAttribute('.cat-pager a[rel="next"]', 'href');
    const wantPrev = `/work/${disciplines[(i + 4) % 5]}`;
    const wantNext = `/work/${disciplines[(i + 1) % 5]}`;
    if (prev !== wantPrev || next !== wantNext) pagerProblems.push(`${slug} (prev ${prev}, next ${next})`);
  }
  ok(pagerProblems.length === 0, `each discipline links to its neighbours, wrapping at the ends ${pagerProblems.join('; ')}`);

  // The image viewer: open from a zoom button, step with the arrow keys, close with Escape, the button and the backdrop.
  let zoomSlug = null;
  for (const slug of projectSlugs) {
    await fp.goto(BASE + `/projects/${slug}`);
    if ((await fp.locator('[data-zoom]').count()) > 0) {
      zoomSlug = slug;
      break;
    }
  }
  if (!zoomSlug) {
    ok(false, 'at least one project page offers the image viewer');
  } else {
    await fp.goto(BASE + `/projects/${zoomSlug}`);
    const total = await fp.locator('[data-zoom]').count();
    const isOpen = () => fp.evaluate(() => document.getElementById('lightbox').open);
    const counter = () => fp.textContent('.lightbox-count');
    await fp.locator('[data-zoom]').first().click();
    await fp.waitForFunction(() => document.getElementById('lightbox').open);
    await fp.waitForFunction(() => document.querySelector('.lightbox-img').complete && document.querySelector('.lightbox-img').naturalWidth > 0);
    ok((await counter()) === `1 of ${total}`, `the image viewer opens on the clicked image (${await counter()})`);
    if (total > 1) {
      await fp.keyboard.press('ArrowRight');
      ok((await counter()) === `2 of ${total}`, 'ArrowRight moves to the next image');
      await fp.keyboard.press('ArrowLeft');
      ok((await counter()) === `1 of ${total}`, 'ArrowLeft moves back');
      await fp.keyboard.press('ArrowLeft');
      ok((await counter()) === `${total} of ${total}`, 'ArrowLeft from the first image wraps to the last');
    }
    await fp.keyboard.press('Escape');
    ok(!(await isOpen()), 'Escape closes the image viewer');

    await fp.locator('[data-zoom]').first().click();
    await fp.click('[data-lightbox-close]');
    ok(!(await isOpen()), 'the Close button closes the image viewer');

    await fp.locator('[data-zoom]').first().click();
    await fp.mouse.click(3, 3);
    ok(!(await isOpen()), 'a click on the backdrop closes the image viewer');
  }
  await fx.close();

  console.log('\nReduced motion');
  const rm = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  await recordReveals(rm);
  const rp = await rm.newPage();
  await rp.goto(BASE + '/work/brand-identity');
  await rp.click('a.band[href="/work/graphic-illustration"]');
  await rp.waitForURL('**/work/graphic-illustration');
  await rp.waitForTimeout(60);
  ok(!(await rp.evaluate(() => JSON.parse(sessionStorage.getItem('lastReveal') || '{}').vt)), 'no view transition with prefers-reduced-motion');
  await rm.close();

  console.log('\nMobile menu');
  const mp = await browser.newPage({ viewport: { width: 375, height: 740 } });
  await mp.goto(BASE + '/work/digital-ui');
  await mp.click('[data-menu-open]');
  ok(await mp.evaluate(() => document.getElementById('menu').open), 'menu opens');
  ok((await mp.getAttribute('[data-menu-open]', 'aria-expanded')) === 'true', 'aria-expanded is true when open');
  const focusInMenu = await mp.evaluate(() => document.getElementById('menu').contains(document.activeElement));
  ok(focusInMenu, 'focus moves into the menu');
  await mp.keyboard.press('Escape');
  ok(!(await mp.evaluate(() => document.getElementById('menu').open)), 'Escape closes the menu');
  ok(await mp.evaluate(() => document.activeElement?.hasAttribute('data-menu-open')), 'focus returns to the menu button');
  await mp.click('[data-menu-open]');
  await mp.click('#menu a[href="/about"]');
  await mp.waitForURL('**/about');
  ok(!(await mp.evaluate(() => document.getElementById('menu').open)), 'menu is closed after navigating');
  await mp.close();

  if (drafts) {
    console.log('\nVideo');
    const vp = await browser.newPage();
    await vp.goto(BASE + '/projects/chronolens');
    ok((await vp.locator('iframe').count()) === 0, 'no third-party player loads on page load');
    ok((await vp.locator('.video-play').count()) === 0, 'no play button while the video link is missing');
    await vp.close();
  }
} finally {
  await browser.close();
  server.kill();
}

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
