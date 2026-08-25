# PBJ Infra — Content Model (CMS)

Implemented as Astro content collections in `src/content/config.ts`. Every entity is a markdown (or JSON, for FAQ) file a non-developer can edit without touching component code — that's the "CMS" here; see "Upgrading to a real CMS UI" at the bottom if a click-to-edit interface is wanted later.

## Entities

### Service (`src/content/services/*.md`)
| Field | Purpose |
|---|---|
| `status` | `published` \| `draft` — gates routing, see docs/seo-architecture.md |
| `name`, `category`, `shortDescription` | Card + hero copy |
| `heroImage` | `{src, alt, width, height}` — alt text required, dimensions required (CLS prevention) |
| `solutions[]` | The "types/solutions" section — name + description pairs |
| `whyPbj[]` | Evidence bullets — reviewed to ban unverifiable superlatives ("we're the best") |
| `process[]` | Step + description, rendered as the service-specific process section |
| `relatedServices/Projects/Locations` | Typed references (`reference('services')` etc.) — Astro validates the target exists at build time, so a typo 404s the build, not the visitor |
| `faq` | References into the shared `faq` collection |
| `ctaLabel`, `whatsappMessage` | Service-specific CTA copy + prefilled WhatsApp text |
| `seo.title/description/ogImage` | ≤60 / ≤160 chars, enforced by the zod schema |
| Markdown body | The "Overview" narrative section, rendered via `<Content />` |

### Project (`src/content/projects/*.md`)
Adds `projectType`, `location`, **`locationVerified: boolean`** (false = flagged, not hidden, when the source site's own location claim couldn't be cross-confirmed — see the Luxury Infinity Pool entry), `year`, `gallery[]`, and the case-study narrative fields (`overview`, `clientRequirement`, `challenge`, `approach`, `execution`, `result` — all but `overview`/`result` optional, since they're only filled when real information exists) plus `contentGaps[]`, an array of plain-English notes rendered directly on the page wherever information is missing, instead of being silently omitted.

### Location (`src/content/locations/*.md`)
`role` distinguishes "Headquarters" / "Major Operational Hub" / "Service Coverage" — the locations hub (`/locations/`) uses this to sort entries into three visually distinct tiers (verified page / in-progress with evidence / coverage-only list) rather than presenting every claimed city as equally substantiated.

### Team (`src/content/team/*.md`)
Flat entity: name, role, photo, bio, contact. No `status` gate — team members are added as PBJ supplies them.

### Testimonial (`src/content/testimonials/*.md`)
`verifiedGoogleReview` is typed as `z.literal(false)` — a structural guarantee that a testimonial entry can never be mistaken for (or later miscoded as) a Google review. Actual Google reviews never live in this collection; they come from `src/lib/googleReviews.ts` at build time (see docs/technical-seo-plan.md).

### FAQ (`src/content/faq/*.json`, `type: 'data'`)
One question/answer per file, tagged with `appliesTo[]` (`home`/`about`/`service`/`project`/`location`/`contact`) so pages pull only the FAQs relevant to them. Reused by reference (services/locations/articles link to FAQ ids) rather than copy-pasted, so an answer is edited in exactly one place.

### Article (`src/content/articles/*.md`)
Blog/resource entity. `dek` doubles as the card summary and the SEO description fallback. `relatedServices`/`relatedProjects` give every article a mandatory conversion path (brief §17: "clear conversion path").

## Why `status: draft` instead of just not creating the file
Every genuinely-offered PBJ service and every signature project from the source site has a collection entry, even the ones without a page yet. This does two things:
1. **Editorial visibility** — anyone looking at `src/content/services/` sees the complete, real service catalog, not just what happens to be written up.
2. **Honest hub pages** — `/services/` and `/projects/` show the full catalog with unlinked "in development" cards, rather than hiding services PBJ actually offers just because the page isn't written yet.

Flipping an entry to `published` (plus writing its `Content` body and filling any optional narrative fields) is the entire mechanism for shipping the next page — no code change required.

## Reference integrity
`reference('services')` / `reference('projects')` / `reference('locations')` / `reference('faq')` are Astro's typed content references — `astro build` fails if a frontmatter reference points at a non-existent slug, so broken internal links from a content edit are caught at build time, not discovered by a visitor or Google.

## Upgrading to a real CMS UI later
This model maps directly onto a headless CMS (Sanity, Keystatic, Tina, Contentful) if/when PBJ wants a web UI instead of editing markdown files — the collections above are already the schema; a CMS integration would swap `src/content/config.ts`'s `type: 'content'` loaders for that CMS's Astro loader without changing any page template, since pages only consume `getCollection()`/`getEntry()`.
