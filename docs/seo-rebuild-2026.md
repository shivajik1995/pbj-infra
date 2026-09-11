# PBJ Infra — SEO Rebuild Report (August 2026)

Companion to `docs/website-audit.md` (source facts), `docs/seo-architecture.md` (clusters + URL map), `docs/content-model.md` (CMS), `docs/technical-seo-plan.md` (implementation contracts). This report covers the content + information-architecture rebuild carried out in August 2026.

---

## A. SEO problems found (pre-rebuild)

| # | Problem | Severity |
|---|---|---|
| 1 | Only 11 URLs published. 10 of 11 verified services, 4 of 5 signature projects and the Latur hub were `status: draft` with placeholder bodies — no landing pages to rank for the core commercial terms. | P0 |
| 2 | `Header.astro` had an empty `nav` array. Desktop = logo only; mobile hamburger opened an empty dialog. No sitewide internal-linking structure. | P0 |
| 3 | Homepage rendered two `<footer>` elements (inline + `BaseLayout`), duplicating the contentinfo landmark and shipping dead `/privacy-policy/` and `/terms/` links. | P1 |
| 4 | Homepage `<title>` ~89 chars, `<meta description>` ~200 chars — both truncated in SERPs. | P1 |
| 5 | Homepage emitted no `Service` / `ItemList` structured data. | P1 |
| 6 | `Organization` schema had no `logo`, `image`, `openingHoursSpecification`, `knowsAbout`, `areaServed` array, `foundingLocation`. `areaServed` was a bare string. | P1 |
| 7 | No `/privacy-policy/`, `/terms/`, or `404` route. | P1 |
| 8 | `/services/`, `/projects/`, `/locations/` titles > 60 chars; `/locations/` had "PBJ Infra" twice. | P2 |
| 9 | Verified developer/client names (Panchshil, Godrej, Nyati, Kolte Patil, Ajmera, Mahindra Lifespaces, D.Y. Patil, Majestique) surfaced only in one prose line on `/locations/pune/`. | P2 |
| 10 | Generic, near-duplicate image alt text ("Waterpark construction by PBJ Infra") across many files; `swimming-pool-construction` hero declared `1600×2000` for a landscape asset; no `decoding` attribute anywhere. | P2 |
| 11 | Every image hotlinked from non-www `pbjinfra.com` while the canonical host is `www` — cosmetically inconsistent, and a control/optimisation gap (no WebP, filenames not owned). | P2 |

Still-correct foundations kept as-is: static output, self-referencing canonicals, `@astrojs/sitemap`, `robots.txt`, build-time-only Google reviews with an honest "Integration Pending" state, progressively-enhanced GSAP hero, `reference()` + zod content integrity, WCAG skip-link/focus/reduced-motion handling.

---

## B. Keyword strategy

One primary search intent per URL. Service pages own transactional *service (+ location)* intent; `/locations/*` own *"construction company in <city>"*; `/resources/*` own informational intent and link down to the service that owns the transactional version. Clusters (full reasoning in `docs/seo-architecture.md §B`):

- **Brand** — `pbj infra`, `pbj infra pune`, `pbj infra reviews`, `padmasinha jadhav`
- **Primary commercial / local** — `construction company in pune`, `construction company latur`, `builder pune`
- **Aquatic services** — `swimming pool construction company pune`, `infinity pool builder maharashtra`, `pool filtration system installation`, `swimming pool tiling`, `natural lagoon pool construction`
- **Hospitality services** — `waterpark construction company india`, `resort construction contractor pune`
- **Residential services** — `farmhouse construction pune`, `farmhouse builder latur`, `cob house construction india`
- **Specialised services** — `ferrocement dome construction`, `ferro concrete design`, `thin shell construction`, `land development site preparation`
- **Project-type / proof** — `adventure waterpark`, `ferrocement dome house`, `lagoon pool project`
- **Informational (topical authority)** — `how long does pool construction take` (live), plus the roadmap set in §O
- **Supporting entities woven into copy** — turnover rate, backwash recovery, vanishing edge, shotcrete, waterproofing, thermal mass, cob "good hat and good boots", 5-year structural warranty, GST/UDYAM, design-build

No keyword stuffing: each page names its primary term in the H1 and first paragraph once, then uses natural supporting vocabulary.

---

## C. Keyword → URL map

| Primary keyword (intent) | Target URL | Primary/Secondary | H1 | `<title>` | Owning section |
|---|---|---|---|---|---|
| construction company in pune (commercial) | `/` | Primary | *Whatever you imagine, we build it.* (creative) — entity carried by hero sub-copy | Construction Company in Pune & Latur \| PBJ Infra | Hero |
| construction company in pune (local) | `/locations/pune/` | Primary | Construction Company in Pune | Construction Company in Pune \| PBJ Infra | Hero + "What PBJ builds in Pune" |
| construction company latur (local) | `/locations/latur/` | Primary | Construction Company in Latur | Construction Company in Latur \| PBJ Infra | Hero + "Verified Latur project history" |
| swimming pool construction company pune | `/services/swimming-pool-construction/` | Primary | Swimming Pool Construction in Pune, Latur & Maharashtra | Swimming Pool Construction Company in Pune \| PBJ Infra | Hero + Overview |
| pool filtration system installation | `/services/pool-filtration-systems/` | Primary | Pool Filtration Systems — Design, Installation & Commissioning | Pool Filtration Systems \| PBJ Infra | Overview + Technical considerations |
| swimming pool tiling / pool finishing | `/services/swimming-pool-tiles/` | Primary | Pool Tiling & Finishing | Swimming Pool Tiling & Finishing \| PBJ Infra | Overview |
| natural lagoon pool construction | `/services/lagoon-pool-construction/` | Primary | Lagoon Pool Construction in Pune & Maharashtra | Lagoon Pool Construction \| Pune & Maharashtra \| PBJ Infra | Overview + "What lagoon pools cover" |
| waterpark construction company india | `/services/waterpark-construction/` | Primary | Waterpark Construction in Pune, Latur & Maharashtra | Waterpark Construction Company \| Pune & Latur \| PBJ Infra | Overview + Technical considerations |
| resort construction contractor | `/services/resort-construction/` | Primary | Resort Construction in Pune, Latur & Maharashtra | Resort Construction Company in Maharashtra \| PBJ Infra | Overview |
| farmhouse construction pune / latur | `/services/farmhouse-construction/` | Primary | Farmhouse Construction in Pune, Latur & Maharashtra | Farmhouse Construction in Pune & Latur \| PBJ Infra | Overview |
| cob house construction india | `/services/cob-house-construction/` | Primary | Cob House Construction in Maharashtra | Cob House Construction \| Maharashtra \| PBJ Infra | Overview + Technical considerations |
| ferrocement dome construction | `/services/ferrocement-dome/` | Primary | Ferrocement Dome Construction in Pune & Maharashtra | Ferrocement Dome Construction \| Pune \| PBJ Infra | Overview |
| ferro concrete design / thin-shell | `/services/ferro-concrete-design/` | Primary | Ferro Concrete Design & Thin-Shell Construction | Ferro Concrete Design & Construction \| PBJ Infra | Overview |
| land development site preparation | `/services/land-development/` | Primary | Land Development & Site Preparation in Maharashtra | Land Development & Site Preparation \| PBJ Infra | Overview |
| adventure waterpark (proof) | `/projects/adventure-waterpark-ahilyanagar/` | Secondary | Adventure Waterpark | Adventure Waterpark, Ahilyanagar \| PBJ Infra Project | Case study |
| ferrocement dome house (proof) | `/projects/rabbit-dome-house/` | Secondary | Rabbit Dome House | Rabbit Dome House, Pune \| PBJ Infra Project | Case study |
| lagoon pool project (proof) | `/projects/natural-lagoon-pool/` | Secondary | Natural Lagoon Pool | Natural Lagoon Pool, Chatrapati Sambhaji Nagar \| PBJ Infra | Case study |
| farmhouse project latur (proof) | `/projects/farm-house-latur/` | Secondary | Farm House | Farm House, Latur \| PBJ Infra Project | Case study |
| all construction services pune | `/services/` | Primary | What PBJ Infra builds. | Construction Services in Pune & Maharashtra \| PBJ Infra | Category grid |
| construction projects / case studies | `/projects/` | Primary | We don't just show projects. We show what we've built. | Construction Projects & Case Studies \| PBJ Infra | Project grid |
| pbj infra about / since 2009 | `/about/` | Primary | Built on-site, not on adjectives. | About PBJ Infra \| Construction Company Since 2009 | Company + credentials |
| how long does pool construction take | `/resources/how-long-does-swimming-pool-construction-take/` | Primary | (article H1) | (article title) | Article body |

---

## D. New page architecture

Published URL set went from **11 → 27**. All 16 new URLs are verified PBJ services, projects, a real operational hub, or standard utility pages. See `docs/seo-architecture.md §C` for the full tree (updated). Draft-gate policy unchanged: a page exists only when `status: published` + a written body — `getStaticPaths` filters drafts, so a thin page can't ship by accident.

New: 10 service pages, 3 project case studies, `/locations/latur/`, `/privacy-policy/`, `/terms/`, `404`.
Held back: `/projects/luxury-infinity-pool/` (Pune vs Mumbai conflict — see §N).

---

## E. Homepage heading structure

```
H1  Whatever you imagine, we build it.            (CinematicHero — creative; entity in sub-copy:
                                                   "…PBJ Infra, a Pune-based construction company
                                                    operating since 2009.")
H2  Built environments, not just structures.       (02 — Signature Projects)
    H3  Adventure Waterpark
    H3  Luxury Infinity Pool
    H3  Rabbit Dome House
    H3  Natural Lagoon Pool
    H3  Farm House
H2  Spaces with a purpose. Built with precision.   (03 — What We Build)
    (interactive category stage — Aquatic / Hospitality / Recreation / Specialised)
    nav "Every service PBJ Infra offers" — 11 crawlable links to /services/*
H2  Built right. Trusted by clients.               (04 — Google reviews, honest "pending" state)
H2  Developers PBJ Infra has built for.            (04B — NEW: 8 verified developer names)
H2  From first idea to finished environment.       (05 — How We Build)
    H3  Understand  ·  H3  Engineer  ·  H3  Build  ·  H3  Deliver
H2  Experience you can build on.                   (06 — Why PBJ)
H2  Questions worth answering upfront.             (07 — FAQ, 5 Qs, matches FAQPage JSON-LD)
H2  Have something worth building?                 (08 — Final CTA)
```

One `<h1>`, verified in the build. Section eyebrows ("02 / Signature Projects") are `<span>`, not headings.

---

## F. Title tags (before → after)

| URL | Before | After | Len |
|---|---|---|---|
| `/` | PBJ Infra \| Construction Company for Pools, Resorts & Farmhouses — Pune, Latur, Maharashtra (89) | Construction Company in Pune & Latur \| PBJ Infra | 48 |
| `/services/` | Construction Services \| Pools, Waterparks, Resorts & More \| PBJ Infra (67) | Construction Services in Pune & Maharashtra \| PBJ Infra | 56 |
| `/projects/` | Construction Projects \| Pools, Waterparks, Domes & More \| PBJ Infra (66) | Construction Projects & Case Studies \| PBJ Infra | 49 |
| `/locations/` | Where PBJ Infra Builds \| Pune, Latur & Maharashtra \| PBJ Infra (61, dup brand) | Where PBJ Infra Builds \| Pune, Latur & Maharashtra | 51 |
| 10 new service pages | *(draft placeholders)* | see §C — all ≤ 60, zod-enforced | — |
| 3 new project pages | "Draft case study — pending…" | see §C | — |
| `/locations/latur/` | placeholder | Construction Company in Latur \| PBJ Infra | 41 |
| `/privacy-policy/`, `/terms/`, `404` | — | Privacy Policy / Terms of Service / Page Not Found \| PBJ Infra | — |

Unchanged (already good): `/about/`, `/contact/`, `/resources/`, `/services/swimming-pool-construction/`, `/locations/pune/`, `/projects/adventure-waterpark-ahilyanagar/`, the article.

---

## G. Meta descriptions

Every published page has a unique description ≤ 160 chars (zod-enforced on content collections; hand-checked on static pages). Each states what the page is, names the primary term once, and gives a reason to click (verified project, warranty, since-2009, in-house team). Full list is derivable from the `seo.description` frontmatter + the four static pages' `description` props. No description repeats across pages.

---

## H. Internal linking

New/strengthened link paths (all real `<a href>`, descriptive anchor text = the entity's real name):

- **Global header** → Services, Projects, Locations, About, Resources, Contact + "Start a Project" (every page).
- **Global footer** → 5 named services + All Services, About, Projects, Pune, Latur, Resources, Contact, Privacy, Terms.
- **Homepage → services** — the "Every service PBJ Infra offers" `<nav>` links all 11 service pages; the `ItemList` schema mirrors it.
- **Homepage → projects** — the 5 project cards now resolve to 4 published case studies (was 1).
- **Service ↔ service** — every service's body links 2–4 sibling services (aquatic cluster interlinked; specialised cluster interlinked; residential ↔ land development).
- **Service ↔ project** — each service links its proof project; each project links its `relatedService` + 2 sibling projects.
- **Service ↔ location** — services carry `relatedLocations`; `/locations/latur/` and `/locations/pune/` link every service they offer, plus a new "PBJ Infra projects in <city>" block linking published case studies.
- **About → services** — "How PBJ works" now links 5 services + the hub.
- **Resources article → service + project** — unchanged (already wired).

Anchor-text rule: entity name only ("Swimming Pool Construction", "Adventure Waterpark", "Latur"), never "click here" / bare "read more". Exact-match commercial anchors ("swimming pool construction company pune") are avoided in favour of the natural entity name.

---

## I. Schema implemented

| Schema | Where | Notes |
|---|---|---|
| `GeneralContractor` (Organization) | every page (`BaseLayout`) | **enriched**: `logo`, `image`, `legalName`, `foundingLocation`, `areaServed` array (Pune/Latur/Maharashtra/India as `AdministrativeArea`), `knowsAbout` (12 services), `openingHoursSpecification` (Mo–Sa 09–19, Su 10–17), `geo`, `PostalAddress`. `sameAs` emitted only when populated (currently empty — see §N). `@id` anchor `#organization`. |
| `WebSite` | every page | now carries `@id #website` + `publisher → #organization` |
| `ItemList` | `/` | 11 primary services (name + url), mirrors the on-page nav |
| `FAQPage` | `/`, `/about/`, `/contact/`, service pages with `faq` refs | built only from FAQs visibly rendered on that page |
| `BreadcrumbList` | every non-home page | generated from the same `items` array as the visible `<Breadcrumbs>` |
| `Service` | service detail pages | now includes `name`, `areaServed` array, `provider` name, and `hasOfferCatalog` (`OfferCatalog` → `Offer` → `Service` per `solutions[]` entry) |
| `Article` | resource articles | unchanged |
| `AggregateRating` / `Review` | **nowhere** | `aggregateRatingSchema()` still only fires when `getGoogleReviews()` returns real data. No Google credentials configured → not emitted. Deliberate. |

112 JSON-LD blocks across the build, all parse as valid JSON (checked in the build script). Recommend a pass through Google's Rich Results Test on `/`, one service page and one project page before/after deploy.

---

## J. Local SEO improvements

- `/locations/latur/` published — Latur moves from the "in-progress evidence" tier to the "verified locations" tier on `/locations/`. Backed by the completed Farm House project, the nearby Adventure Waterpark in Ahilyanagar, and the Pune–Latur corridor logistics story.
- `/locations/pune/` expanded: 7 services offered (was 1), links to the Rabbit Dome House case study, honest handling of the Luxury Infinity Pool location conflict, developer names in context.
- `openingHoursSpecification` now in `Organization`/`LocalBusiness` schema (structured, from `SITE.hoursSpec`).
- `areaServed` is now a list of `AdministrativeArea` nodes, not a string.
- Consistent NAP everywhere via `src/lib/site.ts` (unchanged single source of truth).
- Contact page keeps the embedded Google map + full NAP + hours.
- Coverage-only cities (Mumbai, Hyderabad, Nagpur, Bengaluru, Indore, Ahmedabad, Goa, Vishakhapatnam, Lakshadweep, Andaman) remain a coverage *list*, not thin pages — correct until project/office evidence exists.

---

## K. Image SEO improvements

- Rewrote near-duplicate alt text on the homepage capability images and new content entries to describe the actual subject ("A curved ferrocement dome structure built by PBJ Infra", not "Specialized structure built by PBJ Infra").
- Added `decoding="async"` to every content `<img>` (homepage, service/project/resource/about templates, `ServiceCard`, `ProjectCard`).
- Fixed `swimming-pool-construction` hero dimensions (`1600×2000` → `1600×1000`) to match the landscape asset and prevent CLS.
- Hero/LCP images keep `fetchpriority="high"` + eager; all below-fold images `loading="lazy"`. Every `<img>` has explicit `width`/`height` (defaulted by the `media` zod schema).
- Decorative images (`.cta-visual`, grid layers) keep `alt=""`.

**Not done (needs assets from PBJ):** images still hotlink `https://pbjinfra.com/assets/images/*`. See §N.

---

## L. Core Web Vitals

- **Output stays `output: 'static'`** — all 16 new pages are prerendered HTML, no new server routes, no new client JS.
- **LCP** — hero untouched (video + poster fallback, GSAP enhancement only, H1 is plain always-in-DOM HTML). New service/project heroes use `fetchpriority="high"` + `decoding="async"`.
- **CLS** — the new fixed header reserves its own space (it floats; content offset is handled by `Breadcrumbs`' `pt-[110px]` and the hero's own padding — unchanged). All images have intrinsic dimensions. The homepage "developers" and "service index" blocks are static text/lists — no layout shift.
- **INP** — header JS is the existing ~40-line vanilla script (contrast sampling + mobile toggle) plus an Escape-to-close listener; no framework. No new interactive JS elsewhere.
- **Fonts** — still Google Fonts CDN + preconnect + `display=swap`. Self-hosting the three faces remains the next CWV increment (`docs/technical-seo-plan.md`).
- **Images** — WebP/AVIF conversion still pending local hosting (§N).

---

## M. Content gaps (rendered visibly on-page, not hidden)

Each new project page carries `*Content required:*` notes where PBJ-specific facts are unknown:
- **Adventure Waterpark** — client brief; attraction count / water area / daily capacity.
- **Rabbit Dome House** — dome span / floor area / wall thickness / build period; why a dome was chosen.
- **Natural Lagoon Pool** — surface area / volume / depth profile / finish spec; client brief and site context.
- **Farm House (Latur)** — built-up area / plot size / material palette / whether a pool was included; client brief.

Each new service page carries a `*Content required:*` line where a concrete PBJ figure or a named project would strengthen it (e.g. resort — no completed resort project; cob house — no completed cob project; land development — no named site-prep project).

About page: "Who PBJ has built for" flags that written references + completion dates for the developer engagements are still needed.

---

## N. Information required from PBJ

| Item | Unblocks |
|---|---|
| Social profile URLs (Facebook, Instagram, LinkedIn, etc.) | `SITE.sameAs` → `Organization.sameAs` |
| A raster logo (PNG/SVG, square + wide) and a 1200×630 OG image | `Organization.logo/image`, link unfurls, `og:image` |
| Real project photography (before/during/after) | Localise images to `public/images/`, descriptive filenames, WebP/AVIF |
| `GOOGLE_PLACE_ID` + `GOOGLE_PLACES_API_KEY` | Real Google rating + `AggregateRating` schema (currently honest "pending") |
| Luxury Infinity Pool — Pune or Mumbai? | Publish `/projects/luxury-infinity-pool/` |
| Project briefs / challenge narratives for the 4 case studies | Fills the `*Content required:*` sections |
| Confirm `www` vs non-`www` is the canonical host **and that the host 301-redirects the other** | Removes duplicate-host risk (canonical + sitemap are `www`; images are non-`www`) |
| Written confirmation the developer names can be shown (they are already public on pbjinfra.com) | Keeps the "Developers we've built for" sections |
| Named resort, cob-house and land-development project references | Removes those `*Content required:*` lines; adds proof |
| 2–3 more team/site-engineer profiles | Strengthens `/about/` E-E-A-T |

---

## O. Pages to create later (roadmap, not thin pages)

- `/resources/` articles (informational cluster, each links down to its service): *Ferrocement dome cost & when a dome makes sense*; *Waterpark filtration & safety-system requirements*; *Infinity pool vs skimmer pool*; *What "design–build" actually means for a construction contract*; *Farmhouse site infrastructure: water, sewage, power*; *Cob house construction in India — climate, permits, maintenance*.
- `/projects/luxury-infinity-pool/` once location is confirmed.
- `/locations/<city>/` for any coverage city once a project or office is verified there (Chatrapati Sambhaji Nagar is the strongest candidate — it already has the Natural Lagoon Pool).
- `/about/team/` or expanded team section once more profiles exist.
- A `/thank-you/` page for post-lead-form (already anticipated in the sitemap filter).

---

## P. Technical SEO issues remaining

| Issue | Action | Owner |
|---|---|---|
| Images hotlink non-`www` `pbjinfra.com` | Localise once PBJ supplies photography; `astro.config.mjs` `image.remotePatterns` currently whitelists only non-`www` | dev + PBJ |
| `www` vs non-`www` canonical | Confirm choice; ensure host 301 | PBJ / hosting |
| Google Fonts on external origin | Self-host Fraunces / Inter / IBM Plex Mono as subset woff2 | dev |
| No `og:image` sized 1200×630 | Design asset | PBJ |
| `sameAs` empty | Add social URLs | PBJ |
| No Google Business Profile connection | Add API env vars | PBJ |
| `theme-color` / web-app manifest absent | Optional PWA polish | dev (P3) |

---

## Q. Priority roadmap

**P0 — done in this rebuild**
- Publish 10 service pages + 3 project case studies + `/locations/latur/` with real, grounded content.
- Build global header navigation (desktop + mobile) with `aria-current`.
- Remove the duplicate homepage footer; fix homepage title/description length.

**P1 — done in this rebuild**
- `ItemList` on homepage; enriched `Organization` (logo, hours, areaServed, knowsAbout) and `Service` (`hasOfferCatalog`) schema.
- `/privacy-policy/`, `/terms/`, `404` pages.
- "Developers we've built for" sections (homepage + About).
- Internal-linking system across service ↔ project ↔ location ↔ about.
- Title/description cleanup on hub pages.

**P1 — needs PBJ input (see §N)**
- Connect Google Business Profile → real rating + `AggregateRating`.
- Confirm canonical host + redirect.
- Resolve Luxury Infinity Pool location → publish it.

**P2**
- Localise + convert images to WebP/AVIF with descriptive filenames.
- Self-host fonts.
- Fill the `*Content required:*` sections from PBJ interviews.
- Add the first 2–3 `/resources/` articles.

**P3**
- Expand team section.
- `/thank-you/` post-conversion page.
- PWA manifest / `theme-color`.
- Per-city location pages as evidence accrues.
