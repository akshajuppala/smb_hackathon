import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { mkdir, writeFile, appendFile } from 'node:fs/promises'
import dotenv from 'dotenv'
import { NAICS_722_LEAF_CODES, NAICS_722_LEAF_CODE_MAP } from '../src/data/naics722LeafCodes.js'
import { buildVoiceBusinessPrefillPrompt } from '../src/utils/voiceBusinessPrefill.js'

dotenv.config({ path: '.env.server.local' })
dotenv.config({ path: '.env.local', override: false })
dotenv.config()

const PORT = Number(process.env.VOICE_PREFILL_PORT || 3000)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-3.1-pro-preview'
const TRACE_DIR = path.resolve(process.cwd(), '..', '..', '.context')
const TRACE_LATEST_FILE = path.join(TRACE_DIR, 'voice-prefill-latest.json')
const TRACE_HISTORY_FILE = path.join(TRACE_DIR, 'voice-prefill-traces.ndjson')

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
  })
  response.end(JSON.stringify(payload))
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk

      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'))
        request.destroy()
      }
    })

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })

    request.on('error', reject)
  })
}

function extractJsonContent(content) {
  if (typeof content === 'string') {
    return JSON.parse(content)
  }

  if (Array.isArray(content)) {
    const textPayload = content
      .filter((item) => item?.type === 'text' && typeof item.text === 'string')
      .map((item) => item.text)
      .join('')

    if (textPayload) {
      return JSON.parse(textPayload)
    }
  }

  throw new Error('OpenRouter returned an unsupported response format')
}

function buildPrefillResponse(prefillCandidate, transcript) {
  return {
    ...(prefillCandidate || {}),
    voiceIntakeTranscript: transcript.trim(),
    voicePrefillApplied: true,
  }
}

function buildTraceId() {
  return `${new Date().toISOString()}-${Math.random().toString(36).slice(2, 10)}`
}

async function writeTrace(trace) {
  await mkdir(TRACE_DIR, { recursive: true })
  const serialized = JSON.stringify(trace, null, 2)
  await writeFile(TRACE_LATEST_FILE, `${serialized}\n`)
  await appendFile(TRACE_HISTORY_FILE, `${JSON.stringify(trace)}\n`)
}

async function fetchVoicePrefillFromOpenRouter(transcript) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('Missing OPENROUTER_API_KEY')
  }

  const prompt = buildVoiceBusinessPrefillPrompt(transcript)
  const requestBody = {
    model: OPENROUTER_MODEL,
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    reasoning: {
      max_tokens: 100,
    },
    temperature: 0.1,
    response_format: {
      type: 'json_schema',
      json_schema: prompt.schema,
    },
    plugins: [
      {
        id: 'response-healing',
      },
    ],
    provider: {
      require_parameters: true,
    },
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter request failed with status ${response.status}: ${errorText}`)
  }

  const payload = await response.json()
  const content = payload?.choices?.[0]?.message?.content
  const prefillCandidate = extractJsonContent(content)

  return {
    prompt,
    requestBody,
    rawResponse: payload,
    rawContent: content,
    prefillCandidate,
  }
}

function sanitizeBusinessPayload(payload) {
  return {
    businessName: payload.businessName?.trim() || '',
    businessDescription: payload.businessDescription?.trim() || '',
    websiteUrl: payload.websiteUrl?.trim() || '',
    address: payload.address?.trim() || '',
    cuisineType: payload.cuisineType?.trim() || '',
    serveAlcohol: Boolean(payload.serveAlcohol),
    hasCatering: Boolean(payload.hasCatering),
    hasFoodTruck: Boolean(payload.hasFoodTruck),
    hasDelivery: Boolean(payload.hasDelivery),
  }
}

function buildNaicsPrompt(input) {
  const allowedCodesText = NAICS_722_LEAF_CODES.map(
    (entry) => `- ${entry.code} | ${entry.name} | ${entry.officialScope}`
  ).join('\n')

  return [
    'Classify the business into exactly one 2022 NAICS code from the allowed list below.',
    'Use the business primary activity only.',
    'Do not invent a code outside this list.',
    '',
    'Allowed codes:',
    allowedCodesText,
    '',
    'Business:',
    `- Business name: ${input.businessName || 'Unknown'}`,
    `- Description: ${input.businessDescription || 'Unknown'}`,
    `- Website URL: ${input.websiteUrl || 'Unknown'}`,
    `- Address: ${input.address || 'Unknown'}`,
    `- Cuisine / concept: ${input.cuisineType || 'Unknown'}`,
    `- Serves alcohol: ${input.serveAlcohol ? 'Yes' : 'No'}`,
    `- Catering: ${input.hasCatering ? 'Yes' : 'No'}`,
    `- Food truck: ${input.hasFoodTruck ? 'Yes' : 'No'}`,
    `- Delivery: ${input.hasDelivery ? 'Yes' : 'No'}`,
    '',
    'Return only the schema fields.',
  ].join('\n')
}

async function fetchNaicsClassification(payload) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('Missing OPENROUTER_API_KEY')
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You classify restaurant and food-service businesses into one allowed 2022 NAICS code. Always respond via the provided JSON schema.',
        },
        {
          role: 'user',
          content: buildNaicsPrompt(payload),
        },
      ],
      reasoning: {
        effort: 'low',
      },
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'naics_classification',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                enum: NAICS_722_LEAF_CODES.map((entry) => entry.code),
              },
              confidence: {
                type: 'number',
                minimum: 0,
                maximum: 1,
              },
              reason: {
                type: 'string',
              },
            },
            required: ['code', 'confidence', 'reason'],
            additionalProperties: false,
          },
        },
      },
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result?.error?.message || result?.error || 'OpenRouter classification failed')
  }

  const content = result?.choices?.[0]?.message?.content
  const parsed = typeof content === 'string' ? JSON.parse(content) : content
  const matchedCode = NAICS_722_LEAF_CODE_MAP[parsed?.code]

  if (!matchedCode) {
    throw new Error('Model returned an invalid NAICS code')
  }

  return {
    code: matchedCode.code,
    name: matchedCode.name,
    officialScope: matchedCode.officialScope,
    confidence: parsed.confidence,
    reason: parsed.reason,
    model: OPENROUTER_MODEL,
  }
}

async function fetchPlaceWebsite(searchParams) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Missing GOOGLE_PLACES_API_KEY')
  }

  const businessName = searchParams.get('businessName')?.trim()
  const address = searchParams.get('address')?.trim()

  if (!businessName || !address) {
    throw new Error('Missing businessName or address')
  }

  const googleResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.websiteUri,places.googleMapsUri',
    },
    body: JSON.stringify({
      textQuery: `${businessName}, ${address}`,
    }),
  })

  if (!googleResponse.ok) {
    const errorText = await googleResponse.text()
    throw new Error(`Google Places lookup failed: ${errorText}`)
  }

  const payload = await googleResponse.json()
  const place = payload.places?.[0]

  return {
    websiteUrl: place?.websiteUri || '',
    googlePlaceUrl: place?.googleMapsUri || '',
    placeName: place?.displayName?.text || '',
    formattedAddress: place?.formattedAddress || '',
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', 'http://127.0.0.1')

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    response.end()
    return
  }

  if (url.pathname === '/api/health' && request.method === 'GET') {
    sendJson(response, 200, {
      ok: true,
      model: OPENROUTER_MODEL,
    })
    return
  }

  if (url.pathname === '/api/place-website' && request.method === 'GET') {
    try {
      const result = await fetchPlaceWebsite(url.searchParams)
      sendJson(response, 200, result)
    } catch (error) {
      sendJson(response, /Missing businessName or address|Missing GOOGLE_PLACES_API_KEY/.test(error.message) ? 400 : 500, {
        error: error.message || 'Lookup request failed',
      })
    }
    return
  }

  if (url.pathname === '/api/naics-classify' && request.method === 'POST') {
    try {
      const payload = sanitizeBusinessPayload(await readJsonBody(request))

      if (!payload.businessName || !payload.businessDescription) {
        sendJson(response, 400, { error: 'Missing businessName or businessDescription' })
        return
      }

      const result = await fetchNaicsClassification(payload)
      sendJson(response, 200, result)
    } catch (error) {
      sendJson(response, /Missing OPENROUTER_API_KEY|invalid NAICS code/.test(error.message) ? 500 : 500, {
        error: error.message || 'Classification request failed',
      })
    }
    return
  }

  if (url.pathname === '/api/voice-intake/prefill' && request.method === 'POST') {
    const traceId = buildTraceId()

    try {
      const { transcript } = await readJsonBody(request)

      if (!transcript?.trim()) {
        sendJson(response, 400, { error: 'Transcript is required.' })
        return
      }

      const llmTrace = await fetchVoicePrefillFromOpenRouter(transcript)
      const prefill = buildPrefillResponse(llmTrace.prefillCandidate, transcript)

      await writeTrace({
        traceId,
        timestamp: new Date().toISOString(),
        transcript,
        model: OPENROUTER_MODEL,
        prompt: llmTrace.prompt,
        requestBody: llmTrace.requestBody,
        rawContent: llmTrace.rawContent,
        rawResponse: llmTrace.rawResponse,
        prefillCandidate: llmTrace.prefillCandidate,
        prefill,
      })

      sendJson(response, 200, { prefill })
    } catch (error) {
      await writeTrace({
        traceId,
        timestamp: new Date().toISOString(),
        model: OPENROUTER_MODEL,
        error: error instanceof Error ? error.message : 'Voice prefill failed.',
      })

      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Voice prefill failed.',
      })
    }
    return
  }

  sendJson(response, 404, { error: 'Not found' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Voice prefill server listening on http://127.0.0.1:${PORT}`)
})
