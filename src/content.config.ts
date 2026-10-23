import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS } from './config/categories';

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

const status = z.enum(['draft', 'published']);

/** Aspect ratio written as "4/5", "16/9", "1/1" … */
const aspect = z
  .string()
  .regex(/^\d+(\.\d+)?\/\d+(\.\d+)?$/, 'Use a ratio such as "4/5" or "16/9"');

/**
 * One image. `file` is relative to src/assets/media (e.g. "dream-toy/cover.jpg").
 * A missing or empty `file` renders a labelled placeholder — never a broken image.
 */
const media = z.object({
  file: z.string().optional(),
  alt: z.string().default(''),
  caption: z.string().optional(),
  credit: z.string().optional(),
  /** Frame ratio. Omit to use the image's own proportions (recommended for artwork). */
  aspect: aspect.optional(),
  /** cover = fill the frame and crop; contain = show the whole artwork. */
  fit: z.enum(['cover', 'contain']).default('cover'),
  /** Crop focus for fit: cover, as CSS object-position, e.g. "50% 20%". */
  position: z.string().optional(),
  /** Background behind contained artwork (any CSS colour). */
  background: z.string().optional(),
  /** Optional short muted loop (file in /public/video). Plays only without reduced motion. */
  loop: z.string().optional(),
});

const video = z.object({
  provider: z.enum(['youtube', 'vimeo', 'local']),
  /** Full YouTube/Vimeo URL, or a path in /public/video for local files. Empty → placeholder. */
  url: z.string().optional(),
  title: z.string(),
  poster: media.optional(),
  aspect: aspect.default('16/9'),
  caption: z.string().optional(),
  credit: z.string().optional(),
});

const block = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    heading: z.string().optional(),
    /** Paragraphs separated by a blank line. */
    body: z.string(),
  }),
  z.object({
    type: z.literal('image'),
    /** full = edge to edge of the content column, wide = slightly inset, inset = narrower and centred. */
    size: z.enum(['full', 'wide', 'inset']).default('full'),
    media,
  }),
  z.object({
    type: z.literal('pair'),
    items: z.tuple([media, media]),
    /** Tile shape in the gallery: landscape (default) or portrait, for phone screens. */
    tiles: z.enum(['landscape', 'portrait']).default('landscape'),
    /** Vertical alignment when the two images differ in height. */
    align: z.enum(['start', 'center', 'end']).default('start'),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal('grid'),
    /** Detail images, series of posters, book covers … */
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    items: z.array(media).min(1),
    tiles: z.enum(['landscape', 'portrait']).default('landscape'),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal('video'),
    video,
  }),
]);

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.yaml', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      status,
      /** Exactly one category per project. */
      categories: z.array(z.enum(CATEGORY_SLUGS)).length(1),
      /** Lower numbers appear first. Override per category with `categoryOrder`. */
      order: z.number().default(100),
      categoryOrder: z.record(z.enum(CATEGORY_SLUGS), z.number()).optional(),
      tags: z.array(z.string()).default([]),
      year: z.union([z.string(), z.number()]).optional(),
      /** Only fill in once verified. */
      context: z
        .object({
          type: z.enum(['academic', 'commissioned', 'independent']),
          institution: z.string().optional(),
          course: z.string().optional(),
        })
        .optional(),
      summary: z.string().optional(),
      overview: z.string().optional(),
      role: z.string().optional(),
      /** Software and techniques used, shown near the top of the project page. */
      tools: z.array(z.string()).default([]),
      /** Credit for development, kept separate from the design role (e.g. "AI-assisted development"). */
      development: z.string().optional(),
      collaborators: z.array(z.string()).default([]),
      /** External links shown as buttons. Add only after checking that the URL responds publicly. */
      links: z
        .array(z.object({ label: z.string(), url: z.union([z.string().url(), z.string().regex(/^\/documents\/[a-zA-Z0-9_-]+\.pdf$/)]) }))
        .default([]),
      cover: media.default({}),
      hero: z
        .union([z.object({ kind: z.literal('image'), media }), z.object({ kind: z.literal('video'), video })])
        .optional(),
      blocks: z.array(block).default([]),
      /** Optional manual related projects (slugs). Otherwise neighbours in the primary category are used. */
      related: z.array(z.string()).default([]),
      /** Internal content checklist. Shown only in draft preview, never in production. */
      todo: z.array(z.string()).default([]),
    })
    .strict(),
});

/* ------------------------------------------------------------------ */
/* Essays                                                              */
/* ------------------------------------------------------------------ */

const essays = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/essays' }),
  schema: z
    .object({
      title: z.string(),
      /** draft = hidden in production; in-progress = listed without a reading page; published = full page. */
      status: z.enum(['draft', 'in-progress', 'published']),
      /** Layout specimens written by the developer. Never published, always labelled. */
      specimen: z.boolean().default(false),
      abstract: z.string().optional(),
      date: z.coerce.date().optional(),
      year: z.union([z.string(), z.number()]).optional(),
      language: z.string().default('English'),
      /** BCP 47 code for the text, e.g. "en", "it", "fa". */
      lang: z.string().default('en'),
      kind: z.enum(['thesis', 'essay']).default('essay'),
      context: z
        .object({
          type: z.enum(['academic', 'independent']),
          institution: z.string().optional(),
          course: z.string().optional(),
        })
        .optional(),
      tags: z.array(z.string()).default([]),
      order: z.number().default(100),
      /** File in /public/documents. The download link only appears if the file exists. */
      pdf: z.string().optional(),
      references: z.array(z.string()).default([]),
      imageCredits: z.array(z.string()).default([]),
    })
    .strict(),
});

export const collections = { projects, essays };
