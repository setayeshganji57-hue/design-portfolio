/**
 * Launch-list checks. These do not discover routes: they compare the content
 * files with tests/launch-manifest.json, so a missing project, a wrong
 * category or an accidental publish fails even if every existing route passes.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import yaml from 'js-yaml';
import manifest from './launch-manifest.json';

const DIR = join(process.cwd(), 'src/content/projects');
const files = readdirSync(DIR).filter((f) => f.endsWith('.yaml') && !f.startsWith('_'));
const read = (slug: string) => {
  const path = join(DIR, `${slug}.yaml`);
  return yaml.load(readFileSync(path, 'utf8')) as { status: string; categories: string[]; title: string };
};

describe('approved launch list', () => {
  it.each(manifest.launch)('$slug exists with status $status in $category', ({ slug, status, category }) => {
    const data = read(slug);
    expect(data.status).toBe(status);
    expect(data.categories[0]).toBe(category);
  });
});

describe('excluded projects stay drafts', () => {
  it.each(manifest.excluded)('$slug is a draft and not published', ({ slug, status }) => {
    expect(read(slug).status).toBe(status);
  });
});

describe('no unlisted projects', () => {
  it('every project file is listed in the manifest', () => {
    const listed = new Set([...manifest.launch, ...manifest.excluded].map((p) => p.slug));
    const unlisted = files.map((f) => f.replace(/\.yaml$/, '')).filter((slug) => !listed.has(slug));
    expect(unlisted).toEqual([]);
  });

  it('only manifest-approved projects are published', () => {
    const published = files
      .map((f) => f.replace(/\.yaml$/, ''))
      .filter((slug) => read(slug).status === 'published')
      .sort();
    const expected = manifest.launch
      .filter((p) => p.status === 'published')
      .map((p) => p.slug)
      .sort();
    expect(published).toEqual(expected);
  });
});

describe('categories', () => {
  it('all five disciplines are in the manifest, in order', () => {
    expect(manifest.categories).toEqual([
      'brand-identity',
      'graphic-illustration',
      'digital-ui',
      'motion-film',
      'interactive-3d',
    ]);
  });

  it('digital & UI publishes exactly the projects the owner added', () => {
    const published = manifest.launch
      .filter((p) => p.category === 'digital-ui' && p.status === 'published')
      .map((p) => p.slug)
      .sort();
    expect(published).toEqual(['hamloqmeh', 'parkscanner', 'parsitalk', 'tradememory']);
  });
});
