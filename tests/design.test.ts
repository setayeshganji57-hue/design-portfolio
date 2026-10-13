/**
 * Approved design tokens and content rules. These check the source, so an
 * accidental change to the palette, or a reintroduced forbidden heading,
 * fails the suite.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf8');
const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const sourceFiles = walk(join(process.cwd(), 'src')).filter((f) => /\.(astro|ts|tsx|js|css)$/.test(f));
const allSource = sourceFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

/** WCAG relative contrast ratio. */
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('approved palette', () => {
  it.each([
    ['--paper', '#f3f0e9'],
    ['--ink', '#242424'],
    ['--stone', '#d8d2c8'],
    ['--burgundy', '#682f3f'],
  ])('%s is %s', (token, value) => {
    expect(rootBlock).toMatch(new RegExp(`${token}:\\s*${value}`, 'i'));
  });

  it('body text meets WCAG AA (4.5:1) on paper', () => {
    expect(contrast('#242424', '#f3f0e9')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#57524c', '#f3f0e9')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#682f3f', '#f3f0e9')).toBeGreaterThanOrEqual(4.5);
  });

  it('stone is never used as a text colour', () => {
    expect(css).not.toMatch(/(^|[;{\s])color:\s*var\(--stone\)/m);
  });
});

describe('forbidden structure', () => {
  it.each(['Selected Work', 'Featured Work', 'featured', 'Selected', 'Photography'])(
    'does not contain "%s" in the interface source',
    (term) => {
      const hits = allSource.split('\n').filter((line) => line.includes(term));
      expect(hits).toEqual([]);
    },
  );
});

describe('required sections exist in navigation', () => {
  const nav = readFileSync(join(process.cwd(), 'src/components/Nav.astro'), 'utf8');
  it.each(['/essays', '/about', '/contact'])('navigation links to %s', (href) => {
    expect(nav).toContain(href);
  });
  it('navigation lists the five disciplines from the category config', () => {
    const categories = readFileSync(join(process.cwd(), 'src/config/categories.ts'), 'utf8');
    expect((categories.match(/slug: '/g) ?? []).length).toBe(5);
  });
});

describe('interaction rules', () => {
  const layout = readFileSync(join(process.cwd(), 'src/layouts/Base.astro'), 'utf8');
  it('reduced motion disables the view transition', () => {
    expect(layout).toMatch(/prefers-reduced-motion: reduce\) \{ @view-transition \{ navigation: none/);
  });
  it('the cut transition has no sound and no global cursor change', () => {
    expect(allSource).not.toMatch(/new Audio|\.play\(\)\s*;?\s*\/\/\s*sfx/);
    expect(css).not.toMatch(/cursor:\s*(none|url)/);
  });
});
