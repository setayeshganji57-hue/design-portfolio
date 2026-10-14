// @ts-check
import { defineConfig } from 'astro/config';

// Set SITE_URL when the production domain is known (used for canonical URLs and the sitemap).
const site = process.env.SITE_URL || undefined;

// Drafts may only be built into Preview or local review builds. A production
// deployment that includes them would publish unfinished work, so refuse to build it.
if (process.env.VERCEL_ENV === 'production' && process.env.PUBLIC_SHOW_DRAFTS === 'true') {
  throw new Error('PUBLIC_SHOW_DRAFTS=true is not allowed for a production deployment. Set it for Preview only.');
}

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
