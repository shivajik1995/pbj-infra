# PBJ Infra — Website

Astro + TypeScript + Tailwind CSS rebuild of pbjinfra.com: SEO-led, trust-first, project-driven. See `/docs` for the planning deliverables and architecture decisions behind this build.

## Docs
- [`docs/website-audit.md`](docs/website-audit.md) — every verified fact this build is based on, plus the two gaps/conflicts found on the source site
- [`docs/seo-architecture.md`](docs/seo-architecture.md) — keyword clusters, URL architecture, internal linking map
- [`docs/content-model.md`](docs/content-model.md) — the CMS content model (Service/Project/Location/Team/Testimonial/FAQ/Article)
- [`docs/technical-seo-plan.md`](docs/technical-seo-plan.md) — metadata, schema, sitemap, robots, canonicals, CWV, image SEO, accessibility
- [`docs/conversion-plan.md`](docs/conversion-plan.md) — CTA placement, lead form, WhatsApp, analytics

## Getting started
```bash
npm install
cp .env.example .env   # fill in only what you have; every integration degrades gracefully when unset
npm run dev             # http://localhost:4321
```

```bash
npm run build            # → dist/ (static) + dist/server/ (the two on-demand API routes)
npm run preview           # serve the production build locally via the Node adapter
npm run check             # astro check (TypeScript + template diagnostics)
```

## What's live right now
Homepage, About, Services hub, Projects hub, Locations hub, Resources hub, Contact — plus **one fully-built example of every repeatable page type**, as agreed for this phase:
- `/services/swimming-pool-construction/`
- `/projects/adventure-waterpark-latur/`
- `/locations/pune/`
- `/resources/how-long-does-swimming-pool-construction-take/`

Every other genuinely-offered service, signature project, and claimed location exists in the content collections as `status: "draft"` — visible on the relevant hub page as a non-linked, honestly-labeled card, but without a routed URL (see docs/content-model.md for why).

## Shipping the next page
1. Open the entry in `src/content/{services,projects,locations,articles}/`.
2. Write the missing narrative content (the markdown body, plus any optional fields like a project's `challenge`/`approach`).
3. Flip `status: "draft"` → `status: "published"`.
4. `npm run build`. The page is now routed, in the sitemap, and linked from every hub/related-content block that already references it — no template code changes needed.

Suggested order (based on which drafts already have the most real evidence — see docs/website-audit.md): **Latur** (location — has two real projects already), **Rabbit Dome House** / **Ferrocement Dome** (project + service — Pune, verified), then the remaining aquatic services (already share most of their content with the published Swimming Pool Construction page).

## Configuration reference
See `.env.example` for the full list. Nothing in this app requires secrets to run — every integration (Google Reviews, lead-form email notification, GA4, Turnstile) renders its honest "not configured" state when unset, per the brief's "never fabricate, never break" requirement.

## Known follow-ups (documented, not silent)
- Fonts load from Google Fonts CDN today; self-hosting is queued as the next CWV increment (docs/technical-seo-plan.md).
- The Google Reviews integration is build-time (rating refreshes on redeploy, not live) — documented trade-off, see `src/lib/googleReviews.ts`.
- The "Luxury Infinity Pool" project has a location conflict on the source site (Pune vs. Mumbai/2024) that needs PBJ confirmation before that project gets a published case study (docs/website-audit.md).
