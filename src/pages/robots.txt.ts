import type { APIRoute } from 'astro';
import { SHOW_DRAFTS } from '../lib/content';

export const GET: APIRoute = ({ site }) => {
  const lines = SHOW_DRAFTS
    ? ['User-agent: *', 'Disallow: /']
    : ['User-agent: *', 'Allow: /', ...(site ? [`Sitemap: ${new URL('/sitemap.xml', site).href}`] : [])];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
