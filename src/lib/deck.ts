import { categories } from '../config/categories';

/**
 * Desktop layout of the discipline bands and the page, as grid tracks.
 *
 * Closed (no discipline open): five bands, then the page on the right.
 * Open: the open discipline becomes a narrow strip, and the page sits directly
 * to its right. The bands after it move one track further along. Phones ignore
 * this and show the bands in one row.
 */
export interface DeckLayout {
  /** grid-template-columns for desktop: the bands and the page, in track order. */
  columns: string;
  /** 1-based track that holds the page. */
  stageTrack: number;
  /** 1-based track of each band, by category index. */
  bandTracks: number[];
  /** Category index of the open discipline, or -1. */
  open: number;
}

export function deckLayout(section?: string): DeckLayout {
  const open = categories.findIndex((c) => c.slug === section);
  const stageTrack = open < 0 ? categories.length + 1 : open + 2;
  const bandTracks = categories.map((_, i) => (open >= 0 && i > open ? i + 2 : i + 1));
  const columns = Array.from({ length: categories.length + 1 }, (_, t) =>
    t + 1 === stageTrack ? 'minmax(0, 1fr)' : 'var(--band-w)',
  ).join(' ');
  return { columns, stageTrack, bandTracks, open };
}

/**
 * Position of a band's name on desktop. Bands left of the page are measured from
 * the left edge of the window, bands right of it from the right edge. The name
 * is centred in its band.
 */
export function bandNameOffset(layout: DeckLayout, index: number): { left?: string; right?: string } {
  const track = layout.bandTracks[index];
  const centre = '(var(--band-w) - 1.35rem) / 2';
  if (layout.open >= 0 && index > layout.open) {
    return { right: `calc(${categories.length + 1 - track} * var(--band-w) + ${centre})` };
  }
  return { left: `calc(${track - 1} * var(--band-w) + ${centre})` };
}
