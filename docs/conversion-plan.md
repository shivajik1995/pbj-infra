# PBJ Infra — Conversion Plan

## CTA placement (every major page reaches contact within 1–2 interactions)
| Page | Primary CTA | Secondary | Notes |
|---|---|---|---|
| Homepage | "Start Your Project →" (hero + final CTA) | "Explore Our Work →", WhatsApp float, mobile sticky bar | 3 independent conversion paths above the fold-equivalent scroll depth |
| Service page | "{Service-specific label} →" e.g. "Get a Pool Consultation" (hero + CTA section) | "WhatsApp Us →" with a pre-filled, service-specific message | `whatsappMessage` is authored per-service in the content entry, not generic |
| Project page | "Start Your Project →" | "WhatsApp Us →" with message referencing the specific project name ("I saw your Adventure Waterpark project…") | Matches brief §20's example verbatim |
| Location page | "Start Your Project →" | WhatsApp with location-specific message | |
| Article | "Start Your Project →" | WhatsApp | Every article ends in a CTA, not just a related-links list |
| Every page | Mobile sticky bar (WhatsApp + Get Quote) | WhatsApp floating button (desktop) | `MobileStickyCTA.astro` / `WhatsAppFloat.astro`, present via `BaseLayout` on literally every page |

## Lead funnel
`SEARCH → landing page → service/project detail → proof (projects, evidence wall, reviews) → /contact/ → form or WhatsApp`. Every internal link in docs/seo-architecture.md's linking map terminates at a page that itself offers the CTA table above — there's no dead end in the site that doesn't route back toward contact.

## Lead form (`src/components/LeadForm.astro`, brief §19)
7 steps exactly as specified: project type → location → size → budget (optional) → timeline → contact details → project details, ending in "Request a Consultation →". Implementation notes:
- **Progressive enhancement:** the underlying `<form>` is real HTML with `required`/`pattern` validation and POSTs to `/api/lead` — it works with JS disabled (single-page submit) or enabled (stepped wizard layered on top via `hidden` toggling, same markup).
- **Accessible errors:** each required field has an adjacent `role="alert"` error paragraph populated from `validationMessage`, not just a native browser tooltip.
- **Spam protection** (brief §19: "add spam protection"): a honeypot field (`company`, visually hidden, bots that autofill every input trip it) plus a time-trap (`renderedAt`, submissions faster than 2.5s rejected server-side) in `src/pages/api/lead.ts`. No CAPTCHA is wired by default — `PUBLIC_TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY` are reserved in `.env.example` if PBJ wants to add Cloudflare Turnstile later.
- **Backend:** `/api/lead.ts` validates, then calls a pluggable `notify()` (Resend email, configured via `.env`) — if unconfigured, the lead is still captured in server logs so nothing is silently lost during setup, but PBJ should configure `RESEND_API_KEY`/`LEAD_NOTIFY_EMAIL` (or swap in their own ESP call) before relying on this in production.

## WhatsApp (brief §20)
`src/lib/site.ts`'s `whatsappLink()` centralizes the number (`SITE.whatsappNumber`, sourced from the verified `+91 73505 57979`) so it's set in exactly one place. Every WhatsApp CTA across the site passes a **contextual, prefilled message** — generic on the homepage/footer, service-specific on service pages (`whatsappMessage` field per service), project-specific on project pages (dynamically includes the project name).

## Analytics (`src/lib/analytics.client.ts`, brief §21)
Named events match the brief exactly: `view_service`/`view_project` (dispatch on page load — wire per-template if/when GA4 is configured), `click_start_project`, `click_whatsapp`, `click_phone`, `click_email`, `click_google_reviews`, `form_start`, `form_submit`, `form_abandon` (fires on `beforeunload` if the form was started but not submitted), `filter_projects` (reserved for when /projects/ gets client-side filtering). Every trackable element in the templates already carries `data-analytics-event`/`data-analytics-params`, picked up by one delegated click listener — adding a new trackable CTA anywhere is a markup attribute, not new JS.
**Privacy-conscious by construction:** the whole module no-ops if `PUBLIC_GA_MEASUREMENT_ID` is unset, and even when set, nothing is sent to GA until `localStorage.pbj_consent === 'granted'` — wire a cookie-consent banner to set that flag. Events still dispatch as DOM `CustomEvent`s regardless of consent, so QA/devtools can verify instrumentation without needing GA wired up.

## What's deliberately NOT here yet
No fixed pricing is published anywhere (verified: pbjinfra.com doesn't publish it either) — every budget-related touchpoint (FAQ, planner, service pages) routes to "consultation for a project-specific quote" rather than inventing a price list.
