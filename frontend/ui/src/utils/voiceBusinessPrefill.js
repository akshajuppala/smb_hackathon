const STREET_SUFFIX =
  '(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|way|court|ct|place|pl|parkway|pkwy)'

const OWNER_ROLE_PATTERNS = [
  /\b(?:my role is|i(?:'m| am)|as the)\s+(owner|co-owner|founder|manager|general manager|operator|chef owner|chef-owner|chef|cfo|ceo)\b/i,
]

const BUSINESS_NAME_PATTERNS = [
  /\b(?:business|restaurant|company|place)\s+(?:is called|called|name is)\s+([a-z0-9 '&-]{2,60})/i,
  /\bwe(?:'re| are)\s+(?:called|known as)\s+([a-z0-9 '&-]{2,60})/i,
]

const OWNER_NAME_PATTERNS = [
  /\bmy name is\s+([a-z]+(?: [a-z]+){0,2})\b/i,
  /\bthis is\s+([a-z]+(?: [a-z]+){0,2})\b/i,
  /\bi(?:'m| am)\s+([a-z]+(?: [a-z]+){0,2})\b(?:,| and|\.|$)/i,
]

const ADDRESS_PATTERNS = [
  new RegExp(`\\b\\d{1,5}\\s+[a-z0-9.'#-]+(?:\\s+[a-z0-9.'#-]+){0,7}\\s${STREET_SUFFIX}\\b(?:,?\\s+[a-z.\\s]+,\\s*(?:[a-z]{2}|[a-z]+)(?:\\s+\\d{5})?)?`, 'i'),
  new RegExp(`\\b(?:address is|located at|we(?:'re| are) at)\\s+([^.!?]{8,110}?\\b${STREET_SUFFIX}\\b(?:[^.!?]{0,40})?)`, 'i'),
]

const CUISINE_PATTERNS = [
  /\b(?:type of cuisine|cuisine|concept) is\s+([a-z][a-z /&-]{2,40})\b/i,
  /\b(?:we are|we're|it's|it is|this is)\s+(?:an?|the)?\s*([a-z][a-z /&-]{2,40})\s+(?:restaurant|spot|concept|taqueria|trattoria|bistro|bakery|cafe)\b/i,
]

const CUISINE_KEYWORDS = [
  'mexican',
  'italian',
  'pizza',
  'sushi',
  'japanese',
  'burger',
  'bbq',
  'barbecue',
  'seafood',
  'thai',
  'indian',
  'mediterranean',
  'bakery',
  'cafe',
  'coffee',
  'taqueria',
  'ramen',
  'chinese',
  'korean',
  'vegan',
  'steakhouse',
]

function cleanValue(value) {
  return value?.replace(/\s+/g, ' ').trim().replace(/^[,.:;\s-]+|[,.:;\s-]+$/g, '') || ''
}

function titleCase(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

function extractFirst(patterns, text, formatter = cleanValue) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1] || match?.[0]) {
      return formatter(match[1] || match[0])
    }
  }

  return ''
}

function extractPhone(text) {
  const match = text.match(/(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/)
  return cleanValue(match?.[0])
}

function extractEmail(text) {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return cleanValue(match?.[0]?.toLowerCase())
}

function extractCuisine(text) {
  const explicitCuisine = extractFirst(CUISINE_PATTERNS, text)
  if (explicitCuisine) return explicitCuisine

  const foundKeyword = CUISINE_KEYWORDS.find((keyword) => new RegExp(`\\b${keyword}\\b`, 'i').test(text))
  return foundKeyword ? titleCase(foundKeyword) : ''
}

function extractOwnerName(text) {
  const ownerName = extractFirst(OWNER_NAME_PATTERNS, text)
  if (!ownerName) return ''

  if (/\b(owner|manager|founder|restaurant|business)\b/i.test(ownerName)) {
    return ''
  }

  return titleCase(ownerName)
}

function extractOwnerRole(text) {
  const role = extractFirst(OWNER_ROLE_PATTERNS, text)
  return role ? titleCase(role) : ''
}

function extractBusinessName(text) {
  const name = extractFirst(BUSINESS_NAME_PATTERNS, text)
  return name ? titleCase(name) : ''
}

function extractAddress(text) {
  return extractFirst(ADDRESS_PATTERNS, text)
}

function extractBuildingYear(text) {
  const match = text.match(/\b(?:built in|constructed in|building (?:was )?(?:built|constructed) in|year(?: of building)? is)\s+(19\d{2}|20[0-2]\d)\b/i)
  return cleanValue(match?.[1])
}

function extractSquareFootage(text) {
  const match = text.match(/\b(\d{3,6})\s*(?:square feet|square foot|sq ft|sq\. ft\.)\b/i)
  return cleanValue(match?.[1])
}

function detectBoolean(text, pattern) {
  return pattern.test(text)
}

export function buildVoiceBusinessPrefill(transcript) {
  const normalizedTranscript = cleanValue(transcript)
  if (!normalizedTranscript) return {}

  const servesAlcohol = detectBoolean(normalizedTranscript, /\b(alcohol|beer|wine|cocktails|full bar|liquor|spirits)\b/i)
  const hasCatering = detectBoolean(normalizedTranscript, /\b(catering|cater events|private events)\b/i)
  const hasFoodTruck = detectBoolean(normalizedTranscript, /\b(food truck|mobile kitchen|truck)\b/i)
  const hasDelivery = detectBoolean(normalizedTranscript, /\b(delivery|doordash|uber eats|grubhub)\b/i)

  const prefill = {
    ownerName: extractOwnerName(normalizedTranscript),
    ownerRole: extractOwnerRole(normalizedTranscript),
    businessName: extractBusinessName(normalizedTranscript),
    businessDescription: normalizedTranscript,
    address: extractAddress(normalizedTranscript),
    cuisineType: extractCuisine(normalizedTranscript),
    email: extractEmail(normalizedTranscript),
    phone: extractPhone(normalizedTranscript),
    buildingYear: extractBuildingYear(normalizedTranscript),
    squareFootage: extractSquareFootage(normalizedTranscript),
    serveAlcohol: servesAlcohol || undefined,
    hasCatering: hasCatering || undefined,
    hasFoodTruck: hasFoodTruck || undefined,
    hasDelivery: hasDelivery || undefined,
    ownOrLease: /\b(lease|rent)\b/i.test(normalizedTranscript)
      ? 'lease'
      : /\b(own|owner occupied)\b/i.test(normalizedTranscript)
      ? 'own'
      : '',
    voiceIntakeTranscript: normalizedTranscript,
    voicePrefillApplied: true,
  }

  return Object.fromEntries(
    Object.entries(prefill).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  )
}
