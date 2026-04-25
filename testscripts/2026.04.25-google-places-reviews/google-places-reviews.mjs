#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(SCRIPT_DIR, '.env');
const OUTPUT_DIR = path.join(SCRIPT_DIR, 'output');
const SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';
const DETAILS_FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'googleMapsUri',
  'websiteUri',
  'nationalPhoneNumber',
  'location',
  'primaryType',
  'types',
  'rating',
  'userRatingCount',
  'reviewSummary',
  'reviews',
].join(',');
const SEARCH_FIELDS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.googleMapsUri',
  'places.location',
  'places.primaryType',
].join(',');

function parseDotEnv(contents) {
  const vars = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    vars[key] = value;
  }

  return vars;
}

async function loadLocalEnv() {
  try {
    const contents = await readFile(ENV_PATH, 'utf8');
    const vars = parseDotEnv(contents);

    for (const [key, value] of Object.entries(vars)) {
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

function usage() {
  console.error(
    'Usage: node google-places-reviews.mjs "1600 Amphitheatre Parkway, Mountain View, CA" [--business "Google"]',
  );
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function requestJson(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Places API ${response.status}: ${body}`);
  }

  return response.json();
}

function parseArgs(argv) {
  const args = [...argv];
  const businessParts = [];
  const addressParts = [];

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (current === '--business') {
      const next = args[index + 1];
      if (next) {
        businessParts.push(next);
        index += 1;
      }
      continue;
    }

    if (current.startsWith('--business=')) {
      businessParts.push(current.slice('--business='.length));
      continue;
    }

    addressParts.push(current);
  }

  return {
    address: addressParts.join(' ').trim(),
    businessHint: businessParts.join(' ').trim(),
  };
}

async function searchPlace({ textQuery, apiKey, languageCode, regionCode }) {
  const body = {
    textQuery,
    languageCode,
    regionCode,
    maxResultCount: 5,
  };

  const data = await requestJson(SEARCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': SEARCH_FIELDS,
    },
    body: JSON.stringify(body),
  });

  const places = data.places ?? [];
  if (!places.length) {
    throw new Error(`No Google place match found for query: ${textQuery}`);
  }

  return {
    candidates: places,
    chosen: places[0],
  };
}

async function fetchPlaceDetails({ placeId, apiKey }) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  return requestJson(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': DETAILS_FIELDS,
    },
  });
}

async function writeOutput(address, payload) {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${timestamp}-${slugify(address) || 'place'}.json`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return outputPath;
}

async function main() {
  await loadLocalEnv();

  const { address, businessHint } = parseArgs(process.argv.slice(2));
  if (!address) {
    usage();
    process.exitCode = 1;
    return;
  }

  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      `Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACES_API_KEY in ${ENV_PATH}`,
    );
    process.exitCode = 1;
    return;
  }

  const languageCode = process.env.GOOGLE_PLACES_LANGUAGE_CODE?.trim() || 'en';
  const regionCode = process.env.GOOGLE_PLACES_REGION_CODE?.trim() || 'US';
  const textQuery = businessHint ? `${businessHint} ${address}` : address;

  const search = await searchPlace({
    textQuery,
    apiKey,
    languageCode,
    regionCode,
  });
  const details = await fetchPlaceDetails({
    placeId: search.chosen.id,
    apiKey,
  });

  const payload = {
    requestedAt: new Date().toISOString(),
    query: {
      address,
      businessHint,
      textQuery,
      languageCode,
      regionCode,
    },
    search,
    details,
  };
  const outputPath = await writeOutput(address, payload);

  console.log(`Matched place: ${details.displayName?.text ?? search.chosen.displayName?.text ?? 'Unknown'}`);
  console.log(`Formatted address: ${details.formattedAddress ?? search.chosen.formattedAddress ?? 'Unknown'}`);
  console.log(`Rating: ${details.rating ?? 'n/a'} from ${details.userRatingCount ?? 0} ratings`);
  console.log(`Reviews returned: ${details.reviews?.length ?? 0}`);
  if (!businessHint && !details.rating && !(details.reviews?.length > 0)) {
    console.log('Hint: rerun with --business "<name>" when an address-only lookup resolves to a non-reviewable place.');
  }
  console.log(`Saved output: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
