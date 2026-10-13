import { describe, expect, it } from 'vitest';
import {
  countWords,
  isEssayListed,
  isEssayReadable,
  isPublic,
  paragraphs,
  parseVideo,
  readingMinutes,
  relatedFor,
  sortForCategory,
} from '../src/lib/logic';

const p = (id: string, order: number, categories: string[], extra: Record<string, unknown> = {}) => ({
  id,
  data: { title: id, order, categories, related: [] as string[], ...extra },
});

describe('publication filtering', () => {
  it('hides drafts in production and shows them in preview', () => {
    expect(isPublic('published', false)).toBe(true);
    expect(isPublic('draft', false)).toBe(false);
    expect(isPublic('draft', true)).toBe(true);
  });

  it('lists in-progress essays publicly but only makes published essays readable', () => {
    expect(isEssayListed('in-progress', false, false)).toBe(true);
    expect(isEssayReadable('in-progress', false, false)).toBe(false);
    expect(isEssayReadable('published', false, false)).toBe(true);
    expect(isEssayListed('draft', false, false)).toBe(false);
  });

  it('never exposes layout specimens in production', () => {
    expect(isEssayListed('published', true, false)).toBe(false);
    expect(isEssayReadable('published', true, false)).toBe(false);
    expect(isEssayListed('draft', true, true)).toBe(true);
  });
});

describe('editorial order', () => {
  const items = [
    p('b', 20, ['graphic-illustration']),
    p('a', 10, ['graphic-illustration', 'motion-film'], { categoryOrder: { 'motion-film': 50 } }),
    p('c', 5, ['motion-film']),
    p('d', 20, ['graphic-illustration']),
  ];

  it('sorts by order then title and filters by category', () => {
    expect(sortForCategory(items, 'graphic-illustration').map((x) => x.id)).toEqual(['a', 'b', 'd']);
  });

  it('applies per-category order overrides', () => {
    expect(sortForCategory(items, 'motion-film').map((x) => x.id)).toEqual(['c', 'a']);
  });

  it('picks related projects from the primary category, manual picks first', () => {
    expect(relatedFor(items[1], items).map((x) => x.id)).toEqual(['b', 'd']);
    const manual = { ...items[1], data: { ...items[1].data, related: ['c', 'missing'] } };
    expect(relatedFor(manual, items).map((x) => x.id)).toEqual(['c', 'b']);
    expect(relatedFor(items[2], items).map((x) => x.id)).toEqual(['a']);
  });
});

describe('reading time', () => {
  it('counts words, ignoring markup and links', () => {
    expect(countWords('## Heading\n\nOne [two](https://x.y/z) **three** ![alt](i.png)')).toBe(4);
    expect(countWords('')).toBe(0);
  });

  it('rounds to whole minutes with a minimum of one', () => {
    expect(readingMinutes('')).toBe(0);
    expect(readingMinutes('word '.repeat(50))).toBe(1);
    expect(readingMinutes('word '.repeat(1100))).toBe(5);
  });
});

describe('video URLs', () => {
  it('parses YouTube links into privacy-enhanced embeds', () => {
    for (const url of ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtu.be/dQw4w9WgXcQ', 'https://youtube.com/shorts/dQw4w9WgXcQ']) {
      expect(parseVideo('youtube', url)?.embedUrl).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0');
    }
  });

  it('parses Vimeo links, including unlisted hashes', () => {
    expect(parseVideo('vimeo', 'https://vimeo.com/123456789')?.embedUrl).toContain('player.vimeo.com/video/123456789');
    expect(parseVideo('vimeo', 'https://vimeo.com/123456789/abcdef1234')?.embedUrl).toContain('h=abcdef1234');
  });

  it('returns null for missing or mismatched links', () => {
    expect(parseVideo('vimeo', '')).toBeNull();
    expect(parseVideo('youtube', undefined)).toBeNull();
    expect(parseVideo('youtube', 'https://vimeo.com/123')).toBeNull();
    expect(parseVideo('vimeo', 'not a url')).toBeNull();
    expect(parseVideo('local', 'video.mp4')).toBeNull();
    expect(parseVideo('local', '/video/film.mp4')?.embedUrl).toBe('/video/film.mp4');
  });
});

describe('paragraphs', () => {
  it('splits on blank lines and joins wrapped lines', () => {
    expect(paragraphs('One\nline\n\nTwo')).toEqual(['One line', 'Two']);
    expect(paragraphs(undefined)).toEqual([]);
  });
});
