import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { categories, type CategorySlug } from '../config/categories';
import { isEssayListed, isEssayReadable, isPublic, readingMinutes, sortForCategory } from './logic';

export type Project = CollectionEntry<'projects'>;
export type Essay = CollectionEntry<'essays'>;
export type Media = Project['data']['cover'];
export type Video = Extract<NonNullable<Project['data']['hero']>, { kind: 'video' }>['video'];

/**
 * Drafts are visible while developing (`npm run dev`) and in private review
 * builds (`npm run build:drafts`). Regular production builds exclude them
 * from every page, listing, metadata and the sitemap.
 */
export const SHOW_DRAFTS: boolean = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

/* ---------------- Images ---------------- */

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/media/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

const warned = new Set<string>();

/** Resolve a path relative to src/assets/media. Missing files return undefined (and warn once). */
export function resolveImage(file?: string): ImageMetadata | undefined {
  if (!file) return undefined;
  const key = `/src/assets/media/${file.replace(/^\/+/, '')}`;
  const mod = imageModules[key];
  if (!mod && !warned.has(key)) {
    warned.add(key);
    console.warn(`[media] Missing image "${file}" — showing a placeholder instead.`);
  }
  return mod?.default;
}

/** True when a file exists under /public (used to hide download links for absent files). */
export function publicFileExists(path?: string): boolean {
  if (!path || !path.startsWith('/')) return false;
  return existsSync(join(process.cwd(), 'public', path));
}

/* ---------------- Projects ---------------- */

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return sortForCategory(all.filter((p) => isPublic(p.data.status, SHOW_DRAFTS)));
}

export async function getProjectsIn(category: CategorySlug): Promise<Project[]> {
  return sortForCategory(await getProjects(), category);
}

export const primaryCategory = (p: Project) => categories.find((c) => c.slug === p.data.categories[0])!;

/** "Academic · Sapienza University of Rome" style label, only from verified data. */
export function contextLabel(ctx: Project['data']['context'] | Essay['data']['context']): string | undefined {
  if (!ctx) return undefined;
  const type = ctx.type.charAt(0).toUpperCase() + ctx.type.slice(1);
  return [type, ctx.institution].filter(Boolean).join(', ');
}

/* ---------------- Essays ---------------- */

export async function getListedEssays(): Promise<Essay[]> {
  const all = await getCollection('essays');
  return all
    .filter((e) => isEssayListed(e.data.status, e.data.specimen, SHOW_DRAFTS))
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getReadableEssays(): Promise<Essay[]> {
  const all = await getCollection('essays');
  return all.filter((e) => isEssayReadable(e.data.status, e.data.specimen, SHOW_DRAFTS));
}

export const essayReadingMinutes = (e: Essay) => readingMinutes(e.body ?? '');

export function essayYear(e: Essay): string | undefined {
  if (e.data.date) return String(e.data.date.getFullYear());
  return e.data.year !== undefined ? String(e.data.year) : undefined;
}
