// Schema.org JSON-LD builders. Every builder here only emits fields backed
// by verified data (src/lib/site.ts or the calling page's content
// collection entry) — nothing is populated with placeholder or invented
// values. In particular: no AggregateRating/Review schema is ever emitted
// unless real Google review data was returned by getGoogleReviews().
import { SITE } from './site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: SITE.logoUrl,
    image: SITE.logoUrl,
    telephone: SITE.phone,
    email: SITE.email,
    foundingDate: SITE.founded,
    foundingLocation: SITE.foundingLocation,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.coordinates.lat,
      longitude: SITE.coordinates.lng,
    },
    areaServed: SITE.serviceAreas.map((name) => ({ '@type': 'AdministrativeArea', name })),
    knowsAbout: SITE.knowsAbout,
    openingHoursSpecification: SITE.hoursSpec.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  };
}

export function localBusinessSchema() {
  return {
    ...organizationSchema(),
    '@type': 'LocalBusiness',
    priceRange: '$$',
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  solutions?: { name: string; description: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    provider: { '@id': `${SITE.url}/#organization`, name: SITE.name },
    areaServed: SITE.serviceAreas.map((name) => ({ '@type': 'AdministrativeArea', name })),
    url: `${SITE.url}${opts.url}`,
    ...(opts.solutions?.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${opts.name} options`,
            itemListElement: opts.solutions.map((s) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: s.name, description: s.description },
            })),
          },
        }
      : {}),
  };
}

/** ItemList of the primary service pages — used on the homepage. */
export function serviceItemListSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE.name} construction services`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${SITE.url}${item.url}`,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    image: [opts.image],
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}${opts.url}`,
  };
}

/** Only call this when reviews.available is true — never with placeholder data. */
export function aggregateRatingSchema(opts: { rating: number; count: number }) {
  return {
    '@type': 'AggregateRating',
    ratingValue: opts.rating,
    reviewCount: opts.count,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}
