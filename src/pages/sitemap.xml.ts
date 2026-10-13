import type { APIRoute } from 'astro';
import { categories } from '../config/categories';
import { getProjects, getReadableEssays, SHOW_DRAFTS } from '../lib/content';

/** Lists only public pages. Drafts never appear; preview builds produce an empty sitemap. */
export const GET: APIRoute = async ({ site }) => {
  const paths: string[] = [];
  if (site && !SHOW_DRAFTS) {
    paths.push('/', '/essays', '/about', '/contact', ...categories.map((c) => `/work/${c.slug}`));
    for (const p of await getProjects()) paths.push(`/projects/${p.id}`);
    for (const e of await getReadableEssays()) paths.push(`/essays/${e.id}`);
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
