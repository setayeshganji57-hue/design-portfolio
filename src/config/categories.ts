/**
 * The five disciplines. Order here is the order used in navigation and on the
 * homepage. Intros are short, editable descriptions of the discipline itself —
 * they make no claims about specific projects.
 */

export const CATEGORY_SLUGS = [
  'brand-identity',
  'graphic-illustration',
  'digital-ui',
  'motion-film',
  'interactive-3d',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/**
 * Layout used for the project previews on a category page.
 * - stack:  one large preview per row, metadata beside it (identity, film, 3D)
 * - mosaic: two staggered columns that respect each cover's own proportions
 *           (posters, book covers, illustration, typography)
 * - grid:   an even two-column rhythm for screen-based work
 */
export type CategoryLayout = 'stack' | 'mosaic' | 'grid';

export interface Category {
  slug: CategorySlug;
  title: string;
  /** Title split into lines for the large display heading. */
  displayLines: string[];
  intro: string;
  layout: CategoryLayout;
  /**
   * Optional homepage preview, relative to src/assets/media (e.g. "home/brand.jpg").
   * When empty, the homepage uses the cover of the first visible project,
   * and otherwise a clearly labelled temporary visual.
   */
  homePreview?: { file: string; alt: string; position?: string };
  /** Aspect ratio of the homepage tile, e.g. "4/5". */
  homeAspect: string;
}

export const categories: Category[] = [
  {
    slug: 'brand-identity',
    title: 'Brand Identity',
    displayLines: ['Brand', 'Identity'],
    intro: 'Identity systems, marks and the visual language that carries them across print, screen and space.',
    layout: 'stack',
    homeAspect: '4/3',
  },
  {
    slug: 'graphic-illustration',
    title: 'Graphic & Illustration',
    displayLines: ['Graphic &', 'Illustration'],
    intro: 'Posters, book covers, illustration, calligraphy and type — printed matter and drawn work.',
    layout: 'mosaic',
    homeAspect: '1/1',
  },
  {
    slug: 'digital-ui',
    title: 'Digital & UI',
    displayLines: ['Digital', '& UI'],
    intro: 'Interfaces and screen-based design.',
    layout: 'grid',
    homeAspect: '4/3',
  },
  {
    slug: 'motion-film',
    title: 'Motion & Film',
    displayLines: ['Motion', '& Film'],
    intro: 'Moving image: animation, motion design and short film.',
    layout: 'stack',
    homeAspect: '16/9',
  },
  {
    slug: 'interactive-3d',
    title: 'Interactive & 3D',
    displayLines: ['Interactive', '& 3D'],
    intro: 'Games, interactive experiences and three-dimensional worlds.',
    layout: 'stack',
    homeAspect: '16/9',
  },
];

export const categoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
