// Google Reviews integration — BUILD-TIME fetch, server-side only.
//
// Why build-time instead of a client-side widget or an always-on API route:
//   • The API key never ships to the browser (it's read from process.env
//     during `astro build`, on your CI/host, not in any shipped JS).
//   • The site stays fully static (best CWV, works on any static host),
//     rather than requiring a live server just to render a star rating.
//   • Reviews refresh whenever the site is rebuilt — pair with a daily
//     scheduled rebuild (cron on your host, or a CI schedule) if you want
//     them to drift less than "last deploy".
//
// If GOOGLE_PLACE_ID / GOOGLE_PLACES_API_KEY are unset, or the request
// fails for any reason, this returns `{ available: false }` and the
// GoogleReviews component renders the honest "Integration Pending" state —
// it NEVER falls back to a fabricated rating or invented reviews.
//
// Docs: https://developers.google.com/maps/documentation/places/web-service/place-details

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  relativeTime: string;
  text: string;
  reviewUrl?: string;
}

export interface GoogleReviewsResult {
  available: boolean;
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
  profileUrl?: string;
  fetchedAt?: string;
}

export async function getGoogleReviews(): Promise<GoogleReviewsResult> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId || !apiKey) {
    return { available: false };
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,googleMapsUri,reviews`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
        },
      },
    );

    if (!res.ok) {
      console.warn(`[googleReviews] Places API responded ${res.status}; rendering placeholder instead.`);
      return { available: false };
    }

    const data = await res.json();

    return {
      available: true,
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      profileUrl: data.googleMapsUri,
      fetchedAt: new Date().toISOString(),
      reviews: (data.reviews ?? []).slice(0, 6).map((r: any) => ({
        authorName: r.authorAttribution?.displayName ?? 'Google user',
        authorPhotoUrl: r.authorAttribution?.photoUri,
        rating: r.rating,
        relativeTime: r.relativePublishTimeDescription ?? '',
        text: r.text?.text ?? '',
        reviewUrl: r.googleMapsUri,
      })),
    };
  } catch (err) {
    console.warn('[googleReviews] Fetch failed; rendering placeholder instead.', err);
    return { available: false };
  }
}
