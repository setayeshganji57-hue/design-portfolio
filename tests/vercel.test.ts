import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The build writes flat pages (about.html, work/brand-identity.html). Vercel serves
// /about only when cleanUrls is on, so without it every link except the homepage 404s.
describe('Vercel routing', () => {
  const config = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8'));

  it('serves extensionless URLs (cleanUrls)', () => {
    expect(config.cleanUrls).toBe(true);
  });

  it('publishes the Astro output folder', () => {
    expect(config.outputDirectory).toBe('dist');
  });
});
