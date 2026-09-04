import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// PBJ Infra — production site config.
//
// Rendering strategy: output stays 'static' (every page is prerendered to
// plain HTML at build time — best possible Core Web Vitals + full
// crawlability, no server needed to serve the site).
//
// The two exceptions are src/pages/api/lead.ts and src/pages/api/reviews.ts,
// which set `export const prerender = false` so they run on-demand via the
// Node adapter below. That keeps secrets (Google API key, lead-notification
// credentials) server-side and out of the shipped JS bundle. See
// docs/technical-seo-plan.md ("Google Reviews integration") and
// docs/content-model.md ("Lead form backend") for the operational details.
export default defineConfig({
  site: 'https://www.pbjinfra.com',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // Keep noindex / non-content routes out of the sitemap. The 404 route
      // is prerendered by Astro but must never be submitted for indexing.
      filter: (page) => !page.includes('/thank-you') && !page.endsWith('/404') && !page.endsWith('/404/'),
    }),
  ],
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'pbjinfra.com' }],
  },
});
