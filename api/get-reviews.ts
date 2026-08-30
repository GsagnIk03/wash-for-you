// @ts-nocheck
// Fetches the business's live Google rating + up to 5 reviews via the
// Places API (New) "Place Details" endpoint and returns a shape the
// Reviews component can render directly.
//
// Setup required (see README):
//   1. Create a Google Cloud project, enable "Places API (New)", create an
//      API key (restrict it to Places API + your server's IP/HTTP referrer).
//   2. Find your Business Profile's Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
//   3. Set env vars GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID (locally in
//      .env.local, in production in the Vercel project settings).
//
// Google's Places API only ever returns up to 5 reviews for a place — that
// is a platform limit, not something this endpoint can work around.

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;

module.exports = async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Cache at the CDN edge for an hour, serve stale for a day while
  // revalidating — reviews change rarely, no need to hit Google every load.
  res.setHeader(
    "Cache-Control",
    "s-maxage=3600, stale-while-revalidate=86400",
  );

  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
    // Not configured yet — respond with an empty (not error) payload so the
    // frontend falls back to its own placeholder instead of showing an error.
    return res.status(200).json({ reviews: [], configured: false });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`;
    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Places API error:", errText);
      return res.status(200).json({ reviews: [], configured: true });
    }

    const place = await response.json();

    const reviews = (place.reviews || []).map((r: any) => ({
      author: r.authorAttribution?.displayName || "Google User",
      rating: r.rating || 5,
      text: r.text?.text || r.originalText?.text || "",
      relativeTime: r.relativePublishTimeDescription || "",
      profilePhotoUrl: r.authorAttribution?.photoUri,
    }));

    return res.status(200).json({
      rating: place.rating,
      userRatingCount: place.userRatingCount,
      reviews,
    });
  } catch (err: any) {
    console.error("get-reviews failed:", err);
    return res.status(200).json({ reviews: [], configured: true });
  }
};
