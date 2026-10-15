import { describe, expect, it } from 'vitest';
import { categories } from '../src/config/categories';
import { bandNameOffset, deckLayout } from '../src/lib/deck';

// Every layout must use each track once: five bands and one page, with no gaps.
describe('desktop deck layout', () => {
  const cases = [undefined, ...categories.map((c) => c.slug)];

  it.each(cases)('places the bands and the page on distinct tracks (%s)', (section) => {
    const layout = deckLayout(section);
    const tracks = [...layout.bandTracks, layout.stageTrack].sort((a, b) => a - b);
    expect(tracks).toEqual([1, 2, 3, 4, 5, 6]);
    expect(layout.columns.split(' ').filter(Boolean).length).toBeGreaterThanOrEqual(6);
  });

  it('puts an open discipline directly left of the page', () => {
    categories.forEach((c, i) => {
      const layout = deckLayout(c.slug);
      expect(layout.bandTracks[i]).toBe(layout.stageTrack - 1);
    });
  });

  it('keeps the bands in order around the page', () => {
    categories.forEach((c) => {
      const layout = deckLayout(c.slug);
      const ordered = layout.bandTracks.map((t, i) => ({ t, i })).sort((a, b) => a.t - b.t).map((x) => x.i);
      expect(ordered).toEqual([0, 1, 2, 3, 4]);
    });
  });

  it('closed: the page is the last track and all bands are measured from the left', () => {
    const layout = deckLayout(undefined);
    expect(layout.stageTrack).toBe(6);
    expect(bandNameOffset(layout, 4).left).toBeDefined();
    expect(bandNameOffset(layout, 4).right).toBeUndefined();
  });

  it('open: bands after the page are measured from the right edge', () => {
    const layout = deckLayout(categories[1].slug);
    expect(bandNameOffset(layout, 0).left).toBeDefined();
    expect(bandNameOffset(layout, 4).right).toBeDefined();
    expect(bandNameOffset(layout, 4).left).toBeUndefined();
  });
});
