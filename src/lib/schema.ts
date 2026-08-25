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
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    foundingDate: SITE.founded,
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
    areaServed: 'Maharashtra, India',
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

export function serviceSchema(opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: opts.name,
    description: opts.description,
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: 'Maharashtra, India',
    url: `${SITE.url}${opts.url}`,
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
    name: SITE.name,
    url: SITE.url,
  };
}
