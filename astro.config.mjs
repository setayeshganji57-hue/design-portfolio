// @ts-check
import { defineConfig } from 'astro/config';

// Set SITE_URL when the production domain is known (used for canonical URLs and the sitemap).
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
