# PBJ Infra — Existing Website Audit

Source analyzed: **pbjinfra.com** (homepage + portfolio page, as provided). This audit lists only facts that could be directly sourced from that site — nothing here is estimated or inferred.

> **August 2026 update:** the SEO rebuild (`docs/seo-rebuild-2026.md`) published all 10 remaining verified services, 3 project case studies (Rabbit Dome House, Natural Lagoon Pool, Farm House) and `/locations/latur/`, with content grounded in the verified facts below plus clearly-general construction guidance. `*Content required:*` notes are rendered on-page wherever a PBJ-specific fact is still missing. **Luxury Infinity Pool remains draft** pending the location confirmation flagged below.

## Verified company facts

| Fact | Value | Source location |
|---|---|---|
| Legal/trading name | PBJ Infra | sitewide |
| Founded | 2009 | hero, trust strip, footer |
| Founder | Padmasinha Bapurao Jadhav | Team section |
| HQ address | Flat No. 101, Shantai Niwas, Phursungi, Pune 412308 | Footer |
| Phone | +91 73505 57979 | Footer, planner CTA |
| General email | pbjinfra2025@gmail.com | Footer |
| Founder email | padamjadhav1000@gmail.com | Team section |
| Hours | Mon–Sat 9–7, Sun 10–5, 24/7 Emergency | Footer |
| GST | 27BQRPJ7692F2Z4 | Trust strip, footer |
| UDYAM | UDYAM-MH-26-0101863 | Trust strip |
| Warranty | 5-yr structural, 2-yr equipment | Trust strip, evidence wall |
| Major hub (besides HQ) | Latur | Locations section |

## Verified services (source of truth for /services/)

**Aquatic:** Swimming Pool Construction (Infinity / Glass / Indoor), Pool Filtration Systems, Swimming Pool Tiles (Ceramic / Glass Mosaic / Stone), Trusted Lagoon (natural lagoon pools).
**Hospitality & Leisure:** Waterpark Construction, Resort Construction.
**Residential:** Farmhouse Construction, Cob House Construction.
**Specialized:** Ferro Concrete Design, Ferrocement Dome, Land Development.

11 services total — all real and offered by PBJ Infra. Only **Swimming Pool Construction** currently has a fully written, unique landing page (see docs/content-model.md for why the rest ship as `status: draft`).

## Verified signature projects

1. **Luxury Infinity Pool** — location inconsistent on source site (see "Data conflict" below).
2. **Adventure Waterpark** — Pune–Latur corridor, 2023. Has the most detail of any project (case-study section on source site). **Chosen as the flagship /projects/ page.**
3. **Rabbit Dome House** — Pune (ferrocement dome).
4. **Natural Lagoon Pool** — Chatrapati Sambhaji Nagar.
5. **Farm House** — Latur.

### Data conflict found (flagged, not silently resolved)
The "Luxury Infinity Pool" project is attributed to **"Pune Residence"** in the projects grid but tagged **"Mumbai / 2024"** in the case-study section of the same source page. This site preserves both mentions and flags the conflict on `/locations/mumbai/`'s coverage note and in the project's own draft entry (`src/content/projects/luxury-infinity-pool.md`) rather than guessing which is correct. **Action needed from PBJ:** confirm the real location before this project gets a published case-study page.

## Verified clients (logos on source site)
Majestique Landmarks, Ajmera Group, Panchshil Realty, Nyati Group, Godrej Properties, Mahindra Lifespaces, D.Y. Patil, Kolte Patil Developers.

## Testimonials vs. reviews — important distinction
Two testimonials (Rajesh Sharma, Priya Patel) appear on pbjinfra.com's own portfolio page. **These are not confirmed Google reviews.** The source site did not style them as verified Google social proof either. This build preserves that distinction explicitly — see `src/content/testimonials/` (`verifiedGoogleReview: false` on every entry) and `GoogleReviews.astro` vs `TestimonialCard.astro` as two separate, never-conflated components.

## Locations claimed
Pune (HQ), Latur (major hub), Mumbai, Hyderabad, Nagpur, Bengaluru, Indore, Ahmedabad, Goa, Vishakapatnam, Lakshadweep, Andaman Islands. The source site itself labels its own map as "illustrative" and its pins as "approximate" — this build inherits that honesty rather than treating the list as verified per-city presence. See docs/seo-architecture.md § Location SEO for how that's handled (real page only for Pune; Latur documented as the next candidate; the rest shown as a coverage list, not pages).

## Gaps identified on the source site (carried forward as visible content requirements, not hidden)
- No Google Business Profile integration (no real rating/review count anywhere).
- No before/during-construction photography — every project is shown only as a finished shot.
- No published client briefs, challenges, or approach narratives for any project.
- No team members published beyond the founder.
- No blog/resource content.
- No individual project detail pages (all project info lives in homepage cards + two short case-study blurbs).

This rebuild does not invent content to fill these gaps — each one is either left as a structured, visible "content required" note (see contentGaps arrays in the projects collection) or addressed with a real, narrow piece of new content that's honestly derived from verified facts (e.g. the /resources/ article on pool timelines, built entirely from the 4–8 week figure and four-stage process already stated on the source site).
