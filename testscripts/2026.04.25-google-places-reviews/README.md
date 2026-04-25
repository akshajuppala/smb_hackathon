# Google Places Reviews Prototype

## Goal

Validate the smallest useful workflow for "given a street address, can we fetch Google place details and reviews without scraping?".

## What I Tried And What Failed

- I did not pursue browser scraping here. That path is brittle, harder to maintain, and not needed for a first-pass prototype when Google exposes official place search and details APIs.
- A live run with only `1600 Amphitheatre Parkway, Mountain View, CA` matched the address itself as a `street_address` / `premise` place, not the Google business listing. That returned no rating data and no reviews.
- Address-only lookup is therefore not reliable for review retrieval. A plain address can resolve to a geographic place instead of a reviewable business entity.
- Review retrieval can still return zero reviews for a valid business if Google has no review payload to return for that listing.

## Current Solution

- `google-places-reviews.mjs` is a standalone Node script with no app imports and no external dependencies.
- It resolves an address with `places:searchText`, picks the first match, then fetches place details with `reviews` included in the field mask.
- It also supports an optional `--business` hint so the search query can target a business listing instead of a raw street address.
- When the request succeeds, it writes a timestamped JSON artifact to `output/` so the run can be inspected without rerunning the request.

## Run

```bash
cd testscripts/2026.04.25-google-places-reviews
node google-places-reviews.mjs "1600 Amphitheatre Parkway, Mountain View, CA"
```

With a business hint:

```bash
node google-places-reviews.mjs "1600 Amphitheatre Parkway, Mountain View, CA" --business "Google"
```

Optional local setup:

1. Put a valid Google Maps Platform key in `.env` as either `GOOGLE_MAPS_API_KEY` or `GOOGLE_PLACES_API_KEY`.
2. Adjust `GOOGLE_PLACES_LANGUAGE_CODE` or `GOOGLE_PLACES_REGION_CODE` if needed.

Expected behavior:

- Missing API key: exits early with a clear error.
- Successful request: prints the matched place, rating summary, review count, and output file path.
- Address-only query: may return an address record with no reviews.
- Address plus business hint: usually gives a much better chance of hitting the reviewable listing you actually want.
- No match: exits with a descriptive error after the search step.
