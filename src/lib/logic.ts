/**
 * Pure helpers with no Astro dependencies, so they can be unit-tested directly.
 */

export type PublishStatus = 'draft' | 'in-progress' | 'published';

/** Production shows only published work; preview mode also shows drafts. */
export function isPublic(status: PublishStatus, showDrafts: boolean): boolean {
  if (status === 'published') return true;
  return showDrafts;
}

/** Essays that are in progress are listed publicly (title only); drafts are not. */
export function isEssayListed(status: PublishStatus, specimen: boolean, showDrafts: boolean): boolean {
  if (specimen) return showDrafts;
  if (status === 'draft') return showDrafts;
  return true;
}

/** Only published essays (or anything in preview mode) get a reading page. */
export function isEssayReadable(status: PublishStatus, specimen: boolean, showDrafts: boolean): boolean {
  if (showDrafts) return true;
  return status === 'published' && !specimen;
}

interface Orderable {
  id: string;
  data: { title: string; order: number; categories: readonly string[]; categoryOrder?: Partial<Record<string, number>> };
}

export function orderIn<T extends Orderable>(item: T, category?: string): number {
  if (category && item.data.categoryOrder && item.data.categoryOrder[category] !== undefined) {
    return item.data.categoryOrder[category] as number;
  }
  return item.data.order;
}

/** Stable editorial order: explicit order number, then title. */
export function sortForCategory<T extends Orderable>(items: T[], category?: string): T[] {
  return [...items]
    .filter((p) => (category ? p.data.categories.includes(category) : true))
    .sort((a, b) => orderIn(a, category) - orderIn(b, category) || a.data.title.localeCompare(b.data.title));
}

/**
 * Previous/next neighbours inside the primary category, wrapping around,
 * plus any manually listed related slugs first.
 */
export function relatedFor<T extends Orderable & { data: { related?: string[] } }>(
  current: T,
  all: T[],
  limit = 2,
): T[] {
  const manual = (current.data.related ?? [])
    .map((slug) => all.find((p) => p.id === slug))
    .filter((p): p is T => Boolean(p) && p!.id !== current.id);
  const primary = current.data.categories[0];
  const siblings = sortForCategory(all, primary);
  const idx = siblings.findIndex((p) => p.id === current.id);
  const neighbours: T[] = [];
  for (let step = 1; step < siblings.length && neighbours.length < limit; step++) {
    const next = siblings[(idx + step) % siblings.length];
    if (next.id !== current.id) neighbours.push(next);
  }
  const seen = new Set<string>();
  return [...manual, ...neighbours].filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true))).slice(0, limit);
}

/** Words in a Markdown string, ignoring code, URLs and markup. */
export function countWords(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~|-]+/g, ' ');
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
  return words ? words.length : 0;
}

/** Whole minutes at a calm reading pace. Returns 0 for empty text. */
export function readingMinutes(markdown: string, wordsPerMinute = 220): number {
  const words = countWords(markdown);
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export interface ParsedVideo {
  provider: 'youtube' | 'vimeo' | 'local';
  id?: string;
  embedUrl: string;
  watchUrl: string;
}

/** Turns a YouTube/Vimeo page URL (or local path) into embed + watch URLs. Returns null if unusable. */
export function parseVideo(provider: 'youtube' | 'vimeo' | 'local', url?: string): ParsedVideo | null {
  if (!url || !url.trim()) return null;
  const raw = url.trim();
  if (provider === 'local') {
    if (!raw.startsWith('/')) return null;
    return { provider, embedUrl: raw, watchUrl: raw };
  }
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (provider === 'youtube') {
    let id: string | null = null;
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
      id = u.searchParams.get('v');
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/);
      if (!id && m) id = m[1];
    }
    if (!id || !/^[\w-]{6,20}$/.test(id)) return null;
    return {
      provider,
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  }
  // Vimeo: vimeo.com/123456, vimeo.com/123456/abcdef (unlisted hash), player.vimeo.com/video/123456
  if (!/(^|\.)vimeo\.com$/.test(u.hostname)) return null;
  const m = u.pathname.match(/(?:\/video)?\/(\d+)(?:\/([\da-f]+))?/);
  if (!m) return null;
  const [, id, hash] = m;
  const h = hash ?? u.searchParams.get('h') ?? undefined;
  return {
    provider,
    id,
    embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1${h ? `&h=${h}` : ''}`,
    watchUrl: `https://vimeo.com/${id}${h ? `/${h}` : ''}`,
  };
}

/** "16/9" → 1.777… ; invalid → fallback. */
export function ratioValue(aspect: string | undefined, fallback = 4 / 3): number {
  if (!aspect) return fallback;
  const [w, h] = aspect.split('/').map(Number);
  return w > 0 && h > 0 ? w / h : fallback;
}

/** Splits a plain-text body into paragraphs on blank lines. */
export function paragraphs(body: string | undefined): string[] {
  if (!body) return [];
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

/** Two-digit index, e.g. 1 → "01". */
