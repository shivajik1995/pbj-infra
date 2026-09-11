import { defineCollection, reference, z } from 'astro:content';

// ─────────────────────────────────────────────────────────────────────────
// PBJ INFRA — CONTENT MODEL
//
// This is the CMS content model referenced in docs/content-model.md.
// Every collection below is a structured entity a non-developer can edit as
// a markdown file (frontmatter + body) without touching component code.
// `status` on the "repeatable" entities (service/project/location/article)
// gates whether a page is actually built/linked/indexed — see each field's
// comment. This is what keeps the site from publishing thin/duplicate pages
// as the catalog grows: adding a collection entry with status:"draft"
// documents intent without creating a crawlable URL.
// ─────────────────────────────────────────────────────────────────────────

const seo = z.object({
  title: z.string().max(60),
  description: z.string().max(160),
  ogImage: z.string().optional(),
});

const media = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().default(1600),
  height: z.number().default(1000),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    status: z.enum(['published', 'draft']),
    // "draft" = genuinely offered by PBJ (verified on pbjinfra.com) but this
    // site doesn't yet have unique, human-written page content for it.
    // Rendered as a non-linked card on /services/ instead of a thin page.
    name: z.string(),
    // `slug` is intentionally NOT a schema field: for `type: 'content'`
    // collections, Astro reserves a frontmatter key named `slug` as a
    // slug override and strips it out of `data` before validation — it's
    // still present in every entry's frontmatter (see the .md files) and
    // available at render time as `entry.slug`.
    category: z.enum(['Aquatic', 'Hospitality & Leisure', 'Residential', 'Specialized']),
    // Optional clean on-page H1. Falls back to `name` in the template — set
    // this where "<name> Company in Pune & Maharashtra" reads awkwardly.
    h1: z.string().optional(),
    shortDescription: z.string(),
    heroImage: media,
    solutions: z.array(z.object({ name: z.string(), description: z.string() })),
    whyPbj: z.array(z.string()), // evidence bullets — no unverifiable superlatives
    process: z.array(z.object({ step: z.string(), description: z.string() })),
    relatedServices: z.array(reference('services')).optional(),
    relatedProjects: z.array(reference('projects')).optional(),
    relatedLocations: z.array(reference('locations')).optional(),
    faq: z.array(reference('faq')).optional(),
    ctaLabel: z.string(),
    whatsappMessage: z.string(),
    seo,
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    // "published" = completed, full case-study page built and linked.
    // "in-progress" = live project; case-study page is built and linked, but
    //   labelled "In progress" rather than "Completed".
    // "draft" = documented intent only; non-linked card on /projects/, no page.
    status: z.enum(['published', 'draft', 'in-progress']),
    name: z.string(),
    projectType: z.string(),
    location: z.string(),
    locationVerified: z.boolean(), // false = location as stated on source site could not be cross-confirmed; documented, not hidden
    year: z.string().optional(), // completion year, e.g. "2024" — drives the hero meta line and the "Completed" fact
    duration: z.string().optional(), // build duration, e.g. "9 months" — shown on the case-study fact strip
    category: z.enum(['Aquatic', 'Hospitality & Leisure', 'Residential', 'Specialized']).optional(),
    scope: z.string().optional(), // short phrase for the /projects/ card, e.g. "Site works, buildings, infinity pool & landscaping"
    shortDescription: z.string().optional(), // one-line summary for the /projects/ card (distinct from the longer `overview`)
    heroImage: media,
    gallery: z.array(media).default([]),
    overview: z.string(),
    clientRequirement: z.string().optional(), // omit entirely if not available — never fabricated
    challenge: z.string().optional(),
    approach: z.string().optional(),
    execution: z.string().optional(),
    result: z.string(),
    contentGaps: z.array(z.string()).default([]), // explicit "content required" notes rendered on-page
    relatedService: reference('services'),
    relatedLocation: reference('locations').optional(),
    relatedProjects: z.array(reference('projects')).optional(),
    seo,
  }),
});

const locations = defineCollection({
  type: 'content',
  schema: z.object({
    status: z.enum(['published', 'draft']),
    name: z.string(),
    role: z.string(), // e.g. "Headquarters", "Major Operational Hub", "Service Coverage"
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
    address: z.string().optional(),
    intro: z.string(),
    servicesOffered: z.array(reference('services')),
    relatedProjects: z.array(reference('projects')).optional(),
    localNotes: z.array(z.string()).default([]),
    faq: z.array(reference('faq')).optional(),
    seo,
  }),
});

const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: media,
    bio: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }),
});

// Site testimonials sourced from pbjinfra.com's own portfolio page. These
// are explicitly NOT verified Google reviews and must never be rendered
// with Google branding, star-rating schema, or in the AggregateRating
// component — see GoogleReviews.astro vs TestimonialCard.astro.
const testimonials = defineCollection({
  type: 'content',
  schema: z.object({
    author: z.string(),
    context: z.string(), // e.g. "Homeowner, Mumbai"
    quote: z.string(),
    source: z.string(),
    sourceUrl: z.string().optional(),
    verifiedGoogleReview: z.literal(false),
  }),
});

const faq = defineCollection({
  type: 'data',
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    appliesTo: z.array(z.enum(['home', 'about', 'service', 'project', 'location', 'contact'])),
  }),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    status: z.enum(['published', 'draft']),
    title: z.string(),
    dek: z.string(), // one-line summary shown on /resources/ and as meta description fallback
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: media,
    relatedServices: z.array(reference('services')).optional(),
    relatedProjects: z.array(reference('projects')).optional(),
    seo,
  }),
});

export const collections = { services, projects, locations, team, testimonials, faq, articles };
