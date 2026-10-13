/**
 * Browser checks against a built site (run `npm run build:drafts` or `npm run build` first).
 *
 *   npm run e2e
 *
 * Starts `astro preview`, drives Chromium with Playwright and checks routes,
 * overflow, navigation/transition behaviour, reduced motion, the mobile menu
 * and video loading. Set CHROMIUM_PATH to use a specific browser binary.
 */
import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4329;
const BASE = `http://localhost:${PORT}`;
// Routes come from the build output, so the suite follows whatever is published.
const htmlSlugs = dir => (existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, '')) : []);
const projectSlugs = htmlSlugs('dist/projects');
const essaySlugs = htmlSlugs('dist/essays');
const drafts = existsSync('dist/projects/dream-toy.html'); // only draft builds contain this draft record

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
      const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length);
      if (broken) bad.push(`${r} has ${broken} broken image(s)`);
    }
    ok(bad.length === 0, `${w}×${h}: all routes load, no horizontal overflow, no broken images ${bad.join('; ')}`);
    if (w >= 1024) {
      // Every sidebar link must be reachable (scrolling the sidebar if needed).
      const reachable = await page.evaluate(() => {
        const links = [...document.querySelectorAll('.sidebar .brand, .sidebar .nav a')];
        return links.every((a) => {
          a.scrollIntoView({ block: 'nearest' });
          const r = a.getBoundingClientRect();
          return r.height > 0 && r.bottom <= window.innerHeight + 1 && r.top >= 0;
        });
      });
      ok(reachable, `${w}×${h}: every sidebar link is reachable`);
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
      if (!drafts && approvedHere === 0) ok(html.includes('In preparation'), `${cat} shows its in-preparation state`);
    }
  }

  console.log('\nCut-and-reveal transition');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => {
    window.__reveals = [];
    addEventListener('pagereveal', (e) => {
      sessionStorage.setItem('lastReveal', JSON.stringify({ vt: !!e.viewTransition, cut: document.documentElement.classList.contains('vt-cut') }));
    });
  });
  const page = await ctx.newPage();
  const lastReveal = () => page.evaluate(() => JSON.parse(sessionStorage.getItem('lastReveal') || '{}'));
  await page.goto(BASE + '/work/brand-identity');
  await page.click('.sidebar a[href="/work/motion-film"]');
  await page.waitForURL('**/work/motion-film');
  await page.waitForTimeout(50);
  const r1 = await lastReveal();
  ok(r1.vt, 'category → category uses a view transition');
  await page.waitForTimeout(900);
  ok(!(await page.evaluate(() => document.documentElement.classList.contains('vt-cut'))), 'transition classes are removed afterwards');

  await page.click('.sidebar a[href="/essays"]');
  await page.waitForURL('**/essays');
  await page.waitForTimeout(50);
  ok(!(await page.evaluate(() => document.documentElement.classList.contains('vt-cut'))), 'navigating to Essays does not cut (instant)');

  // Rapid repeated navigation: the final URL and content must match the last click.
  await page.goto(BASE + '/work/brand-identity');
  const order = ['graphic-illustration', 'digital-ui', 'motion-film', 'interactive-3d'];
  for (const slug of order) {
    await page.locator(`.sidebar a[href="/work/${slug}"]`).click({ noWaitAfter: true }).catch(() => {});
    await page.waitForTimeout(60);
  }
  await page.waitForURL('**/work/interactive-3d');
  await page.waitForTimeout(1200);
  const h1 = (await page.textContent('h1'))?.replace(/\s+/g, ' ').trim();
  ok(h1 === 'Interactive & 3D', `rapid clicks end on the last category (h1: "${h1}")`);
  const stuck = await page.evaluate(() => ({
    cut: document.documentElement.className,
    current: document.querySelector('.sidebar a[aria-current="page"]')?.getAttribute('href'),
  }));
  ok(stuck.cut.trim() === '' && stuck.current === '/work/interactive-3d', 'no stuck overlay, nav state matches URL');

  await page.goBack();
  await page.waitForTimeout(800);
  ok(page.url().endsWith('/work/brand-identity') || page.url().endsWith('/work/motion-film'), `back navigates to a previous page (${page.url()})`);
  const backH1 = (await page.textContent('h1'))?.replace(/\s+/g, ' ').trim();
  const backCurrent = await page.evaluate(() => document.querySelector('.sidebar a[aria-current="page"]')?.textContent?.replace(/\s+/g, ' ').trim());
  ok(backCurrent?.endsWith(backH1 ?? '—'), `after back, heading and active nav agree (${backH1})`);
  await page.goForward();
  await page.waitForTimeout(800);
  ok(page.url().endsWith('/work/interactive-3d'), 'forward returns to the last category');
  await ctx.close();

  console.log('\nReduced motion');
  const rm = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const rp = await rm.newPage();
  await rp.goto(BASE + '/work/brand-identity');
  await rp.click('.sidebar a[href="/work/graphic-illustration"]');
  await rp.waitForURL('**/work/graphic-illustration');
  await rp.waitForTimeout(30);
  ok(!(await rp.evaluate(() => document.documentElement.classList.contains('vt-cut'))), 'no cut animation with prefers-reduced-motion');
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
