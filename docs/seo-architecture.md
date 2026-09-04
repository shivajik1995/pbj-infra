# PBJ Infra — SEO Architecture

Companion to docs/website-audit.md (source facts), docs/content-model.md (CMS schema) and docs/technical-seo-plan.md (implementation detail). This document covers the three planning deliverables that shape everything else: keyword architecture, URL architecture, and the internal linking map.

## B. Keyword architecture

No third-party keyword-volume tool was run for this build (that requires live API access — DataForSEO/GSC/Ahrefs-class data). What follows is a **cluster structure**, not volume claims — every cluster is built from real PBJ services/locations so it can be dropped straight into a keyword-research tool later without restructuring.

### Cluster 1 — Swimming pool (highest priority: PBJ's most established, only fully-built service)
- Transactional: "swimming pool construction company pune", "infinity pool builder maharashtra", "pool construction cost pune"
- Informational: "how long does pool construction take", "infinity pool vs skimmer pool", "pool filtration systems explained"
- Supporting: "pool tiles ceramic vs mosaic", "natural lagoon pool construction"

### Cluster 2 — Waterpark / Resort (hospitality, higher ticket size)
- Transactional: "waterpark construction company india", "resort construction contractor pune latur"
- Informational: "waterpark safety systems requirements", "resort construction planning guide"

### Cluster 3 — Residential (farmhouse / cob house)
- Transactional: "farmhouse construction pune", "farmhouse builder latur"
- Informational: "cob house construction india", "eco-friendly farmhouse materials"

### Cluster 4 — Specialized structural (differentiator — few competitors offer this)
- Transactional: "ferrocement dome construction company", "ferro concrete custom structure builder"
- Informational: "ferrocement dome cost", "land development site preparation process"

### Cluster 5 — Location-modified (only for locations with real page-level evidence)
- "construction company pune", "swimming pool contractor pune" → /locations/pune/
- Latur-modified terms queued for when /locations/latur/ ships (see docs/website-audit.md)

### Cluster 6 — Brand / trust
- "pbj infra reviews", "pbj infra pune", "padmasinha jadhav pbj infra"

**Mapping rule applied throughout:** one primary keyword intent per URL. Service pages own transactional service+location intent; /resources/ articles own informational intent and link back to the service page that owns the transactional version of the same topic (see the pool-timeline article → Swimming Pool Construction service page).

## C. URL architecture

```
/                                          Homepage
/about/                                    Company + team + developer proof
/services/                                 Services hub (all 11, grouped by category)
/services/swimming-pool-construction/      ✅ published
/services/pool-filtration-systems/         ✅ published (Aug 2026 rebuild)
/services/swimming-pool-tiles/             ✅ published
/services/lagoon-pool-construction/        ✅ published
/services/waterpark-construction/          ✅ published
/services/resort-construction/             ✅ published
/services/farmhouse-construction/          ✅ published
/services/cob-house-construction/          ✅ published
/services/ferro-concrete-design/           ✅ published
/services/ferrocement-dome/                ✅ published
/services/land-development/                ✅ published
/projects/                                 Projects hub (all 5 signature projects)
/projects/adventure-waterpark-latur/       ✅ published
/projects/rabbit-dome-house/               ✅ published (Aug 2026 rebuild)
/projects/natural-lagoon-pool/             ✅ published
/projects/farm-house-latur/                ✅ published
/projects/luxury-infinity-pool/            draft (Pune/Mumbai location conflict — see audit)
/locations/                                Locations hub (verified / in-progress / coverage-only tiers)
/locations/pune/                           ✅ published
/locations/latur/                          ✅ published (Aug 2026 rebuild)
/resources/                                Resource hub
/resources/how-long-does-swimming-pool-construction-take/   ✅ published
/contact/                                  Contact + lead form
/privacy-policy/                           ✅ published (Aug 2026 rebuild)
/terms/                                    ✅ published
/404                                       noindex, excluded from sitemap
```

**27 indexable URLs** as of the August 2026 SEO rebuild — see `docs/seo-rebuild-2026.md`.

**Rule:** a collection entry only gets a real, routed URL (and a sitemap entry) when `status: "published"`. `draft` entries exist in the CMS for editorial visibility (they render as non-linked cards) but Astro's `getStaticPaths` filters them out entirely — see `src/pages/services/[slug].astro` etc. This is the mechanical enforcement of "quality over page count" (brief §6): a thin page is structurally impossible to publish by accident, since flipping `status` to `published` is the only way a URL is created, and doing that on a stub entry as currently written would just look unfinished — the schema doesn't gate on word count.

No query-parameter or pagination variants exist yet (catalog is small). If /projects/ or /services/ later need filtering, use `?filter=` client-side only (no server route, no canonical needed) or paginate with `rel=canonical` pointing at page 1 — decide when the catalog is actually large enough to need it, not preemptively.

## E. Internal linking map

```
Homepage
 ├─→ Services hub → Swimming Pool Construction (published)
 │                    ├─→ Related project: Adventure Waterpark
 │                    ├─→ Related location: Pune
 │                    └─→ Related service: Ferrocement Dome (draft, links to hub)
 ├─→ Projects hub → Adventure Waterpark (published)
 │                    ├─→ Related service: Waterpark Construction (draft, links to hub)
 │                    └─→ Related location: Latur (draft, links to hub)
 ├─→ Locations hub → Pune (published)
 │                    └─→ Services offered: Swimming Pool Construction
 ├─→ Resources hub → Pool timeline article (published)
 │                    ├─→ Related service: Swimming Pool Construction
 │                    └─→ Related project: Adventure Waterpark
 ├─→ About (team, credentials) → Contact
 └─→ Contact (lead form, WhatsApp, map)
```

Every arrow above is a real `<a href>` in the shipped code (component or content frontmatter `relatedServices`/`relatedProjects`/`relatedLocations`), not aspirational — grep `relatedService` across `src/content/` and `src/pages/` to verify. Anchor text is always the entity's real name ("Swimming Pool Construction", "Adventure Waterpark"), never "click here" or bare "read more".

As more services/projects/locations flip from `draft` to `published`, they slot into this same map automatically — the `relatedServices`/`relatedProjects`/`relatedLocations` reference arrays in `src/content/config.ts` are already wired on every draft entry (e.g. Ferrocement Dome ↔ Rabbit Dome House ↔ Pune), they just render as non-linked hub-pointers until the target page ships.
