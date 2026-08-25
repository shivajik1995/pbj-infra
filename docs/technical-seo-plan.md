# PBJ Infra — Technical SEO Plan

## Cinematic hero (`src/components/CinematicHero.astro`)
GSAP + ScrollTrigger, homepage only — the only page that imports GSAP, so no other route pays for it. Implementation contract:
- **H1/copy/CTAs/trust strip are plain HTML, always in the DOM, never hidden by default CSS.** A synchronous inline script flags the section `.js-ready` pre-paint; only then, and only under `prefers-reduced-motion: no-preference`, does a CSS rule hide anything — so no-JS and reduced-motion visitors both get the complete static hero immediately. Verified with Playwright: JS disabled, reduced-motion, desktop, and mobile all render the real H1 text and a working CTA (see the launch-day test run for this feature).
- **Headline reveal is load-triggered, not scroll-gated** — a visitor who never scrolls still sees the full above-fold pitch within ~1.5s. The scroll-pinned image/linework sequence (real PBJ project photos: resort → pool → dome → waterpark construction → finished infinity pool) is a separate, purely decorative background layer (`aria-hidden`) that only affects imagery, never the text.
- **Failure modes are covered, not assumed away**: the whole script is wrapped in try/catch, plus a 4s timeout, both calling the same `clearEverything()` that clears every inline style GSAP may have set — the same defensive pattern as `RevealScript.astro`'s no-JS/failure fallback.
- Mobile (<900px) skips `ScrollTrigger.pin` entirely (known jank source on mobile viewports) and instead autoplays a shorter 3-image version once on load. Mouse parallax is gated to `(hover: hover) and (pointer: fine)` and disabled under reduced motion.
- Animated properties are limited to `opacity`, `transform` (translate/scale), and SVG `stroke-dashoffset` — no `top`/`left`/`width`/`height` animation, no WebGL, no video.

## Metadata
Every page passes `title`, `description`, `path` (→ self-referencing canonical), and an `ogImage` into `BaseLayout.astro`. Titles/descriptions come from each content entry's `seo` block (max 60 / 160 chars, enforced by the zod schema in `src/content/config.ts` — a build fails rather than shipping a truncation-prone tag). Open Graph + Twitter Card tags are derived from the same three fields, so there's one source of truth per page, not a second copy to keep in sync.

## Structured data (`src/lib/schema.ts`)
| Schema | Where | Guardrail |
|---|---|---|
| Organization/LocalBusiness | Every page (BaseLayout) | Built entirely from `src/lib/site.ts` verified NAP — no field is populated with a placeholder |
| BreadcrumbList | Every non-home page | Generated from the same `items` array as the visible `<Breadcrumbs>` component, so JSON-LD and the visible trail can't drift apart |
| Service | Service detail pages | `name`/`description` pulled from the same content entry rendered on-page |
| FAQPage | Any page rendering `<FAQAccordion>` | Only ever built from FAQs actually rendered visibly on that page (brief §10: "FAQPage only for visible FAQ content") |
| Article | Resource articles | Standard Article schema with real publish/update dates |
| AggregateRating / Review | **Nowhere yet** | `aggregateRatingSchema()` exists in schema.ts but is only called when `getGoogleReviews()` returns `available:true` with real data — see below. No page currently emits it because no Google credentials are configured. This is deliberate, not an oversight. |

## Google Reviews integration (brief §14)
Implemented as a **build-time** fetch (`src/lib/googleReviews.ts`), not a client widget and not an always-on API route:
- `GOOGLE_PLACE_ID` + `GOOGLE_PLACES_API_KEY` are read from `process.env` during `astro build` only — never sent to the browser.
- On success: real rating, review count, up to 6 reviews, and the live Google Maps profile URL are rendered by `<GoogleReviews.astro>`, and `aggregateRatingSchema()` becomes eligible to add to the homepage's schema array.
- On missing credentials or a failed/erroring request: the component renders the honest "Integration Pending" state (see the homepage trust strip and social-proof section) — never a fabricated number.
- **Trade-off, documented on purpose:** because this is build-time, the rating only refreshes on redeploy, not live. Pair with a daily scheduled rebuild if that's not fresh enough; the alternative (a live `/api/reviews` SSR route, same pattern as `/api/lead.ts`) is a small change if that trade-off ever needs to flip — see the comment block at the top of `googleReviews.ts`.

## XML Sitemap
`@astrojs/sitemap` generates `sitemap-index.xml` → `sitemap-0.xml` automatically at build time from every prerendered route — confirmed in a real build to contain exactly the 11 published, indexable URLs (no drafts, no `/api/*` routes, since those aren't prerendered pages). `robots.txt` points at it. Add a `filter` entry in `astro.config.mjs` if a future route (e.g. `/thank-you/`) needs excluding.

## robots.txt
`public/robots.txt` allows all crawling and points at the sitemap. Nothing is disallowed — there are no admin/duplicate/thank-you routes yet. **Do not** add a blanket `Disallow: /_astro/`; that directory holds the built CSS/JS every page needs to render correctly for crawlers that execute JS.

## Canonicals
Self-referencing canonical on every page (`BaseLayout`'s `path` prop → `new URL(path, SITE.url)`). No query-parameter or paginated variants exist yet to cause duplicate-content risk.

## Core Web Vitals
- **Output is fully static** (`output: 'static'`) — every page ships as prerendered HTML; only `/api/lead` and the (currently inactive) reviews path are on-demand. This is the single biggest CWV lever available and it's used.
- **LCP:** hero images use `fetchpriority="high"` and are never lazy-loaded; every other image below the fold uses `loading="lazy"`. All images carry explicit `width`/`height` (from the `media` zod schema, which defaults them) to prevent CLS.
- **INP:** JS is minimal and largely per-component (`<script>` tags scoped to Header/FAQAccordion/LeadForm/RevealScript) rather than one large bundle; no animation or UI library is used — the reveal-on-scroll and accordion are ~20-line vanilla implementations.
- **Fonts:** currently loaded from Google Fonts CDN with `<link rel="preconnect">` and `font-display: swap` (see BaseLayout). **Follow-up queued, not yet done:** self-hosting the three faces (Fraunces, Inter, IBM Plex Mono) as subset `.woff2` under `/public/fonts/` removes an external origin entirely and is the next CWV increment — flagged here rather than silently left undocumented.
- **CSS:** Tailwind, purged to used classes only at build time (23KB gzippable in the current build) — no unused framework CSS ships.

## Image SEO
Every image in the content model requires `alt` text at the schema level (`media` object in `config.ts` — `alt: z.string()`, not optional). Filenames on `pbjinfra.com`'s CDN are inherited as-is (this build doesn't control that CDN); once PBJ project photography is hosted directly by this site (see docs/website-audit.md's photography gap), each upload should follow the `descriptive-subject-location.webp` convention from brief §12, converted to WebP/AVIF at upload time.

## Accessibility (WCAG 2.2 AA target)
- Skip-to-content link, visible focus rings (`:focus-visible` in `global.css`), semantic landmarks (`header`/`nav`/`main`/`footer`/`section` throughout).
- FAQ accordion and mobile nav are keyboard-operable buttons with correct `aria-expanded`/`aria-controls`, not div-based fake buttons.
- `.reveal` (scroll-triggered fade-in) has a `<noscript>` CSS override and a 3-second JS timeout fallback so content never depends on scroll/JS to become visible or readable (brief §22: "Do not use animation... as the only way to access information") — this was caught and fixed via a real-browser Playwright check during this build, not left as a theoretical risk.
- `prefers-reduced-motion` disables all transitions/animations globally.
