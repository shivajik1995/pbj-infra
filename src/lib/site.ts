// Single source of truth for verified NAP / business facts, referenced by
// components and schema so nothing drifts out of sync across pages.
// Every value here is sourced from pbjinfra.com — nothing invented.
// See docs/website-audit.md for the source-by-source breakdown.

export const SITE = {
  name: 'PBJ Infra',
  legalName: 'PBJ Infra',
  url: 'https://www.pbjinfra.com',
  founded: '2009',
  description:
    'PBJ Infra is a construction and infrastructure company headquartered in Pune, building swimming pools, waterparks, resorts, farmhouses and specialized structures across Maharashtra and India since 2009.',
  phone: '+917350557979',
  phoneDisplay: '+91 73505 57979',
  email: 'pbjinfra2025@gmail.com',
  founderEmail: 'padamjadhav1000@gmail.com',
  whatsappNumber: '917350557979',
  address: {
    streetAddress: 'Flat No. 101, Shantai Niwas, Phursungi',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    postalCode: '412308',
    addressCountry: 'IN',
  },
  hours: 'Mon–Sat 9–7, Sun 10–5 · 24/7 Emergency',
  gst: '27BQRPJ7692F2Z4',
  udyam: 'UDYAM-MH-26-0101863',
  warranty: { structural: '5-year', equipment: '2-year' },
  coordinates: { lat: 18.4702, lng: 73.9758 },
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function telLink(): string {
  return `tel:${SITE.phone}`;
}

export function mailtoLink(address: string = SITE.email): string {
  return `mailto:${address}`;
}
