import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { execFile } from 'node:child_process'
import { tmpdir } from 'node:os'
import { mkdir, writeFile, appendFile, readFile, mkdtemp, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import dotenv from 'dotenv'
import yaml from 'js-yaml'
import { chromium } from 'playwright'
import { NAICS_722_LEAF_CODES, NAICS_722_LEAF_CODE_MAP } from '../src/data/naics722LeafCodes.js'
import { buildVoiceBusinessPrefillPrompt } from '../src/utils/voiceBusinessPrefill.js'

const SERVER_FILE = fileURLToPath(import.meta.url)
const SERVER_DIR = path.dirname(SERVER_FILE)
const APP_ROOT = path.resolve(SERVER_DIR, '..')

dotenv.config({ path: path.join(APP_ROOT, '.env.server.local') })
dotenv.config({ path: path.join(APP_ROOT, '.env.local'), override: false })
dotenv.config()

const PORT = Number(process.env.VOICE_PREFILL_PORT || 3000)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-3.1-pro-preview'
const TRACE_DIR = path.resolve(process.cwd(), '..', '..', '.context')
const TRACE_LATEST_FILE = path.join(TRACE_DIR, 'voice-prefill-latest.json')
const TRACE_HISTORY_FILE = path.join(TRACE_DIR, 'voice-prefill-traces.ndjson')
const SCORING_FRAMEWORK_PATH = path.resolve(process.cwd(), 'src/data/insuranceReadinessFramework.yaml')
const SCORING_FRAMEWORK_ROUTE = '/scoring-framework'
const FRAMEWORK_REFERENCE_ROUTE = '/framework'
const DEFAULT_FRONTEND_ORIGIN = process.env.SCORING_FRAMEWORK_APP_ORIGIN || 'http://127.0.0.1:5173'
const execFileAsync = promisify(execFile)

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

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === 'string' && value.trim())?.trim() || ''
}

function formatResolvedAddress(address) {
  const street = [address.house_number, address.road].filter(Boolean).join(' ').trim()
  const locality = firstNonEmpty(address.city, address.town, address.village, address.hamlet, address.municipality)
  const stateCode = address['ISO3166-2-lvl4']?.split('-')?.[1] || ''
  const state = stateCode || address.state_code || address.state || ''
  const postalCode = address.postcode || ''

  return [street, locality, [state, postalCode].filter(Boolean).join(' ')].filter(Boolean).join(', ')
}

function dedupeAreas(values) {
  const seen = new Set()

  return values.filter((value) => {
    if (!value) return false
    const normalized = value.toLowerCase()
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

async function resolveNeighborhood(searchParams) {
  const addressQuery = searchParams.get('address')?.trim()

  if (!addressQuery) {
    throw new Error('Missing address')
  }

  const geocodeUrl = new URL('https://nominatim.openstreetmap.org/search')
  geocodeUrl.searchParams.set('format', 'jsonv2')
  geocodeUrl.searchParams.set('addressdetails', '1')
  geocodeUrl.searchParams.set('limit', '1')
  geocodeUrl.searchParams.set('q', addressQuery)

  const geocodeResponse = await fetch(geocodeUrl, {
    headers: {
      'User-Agent': 'bozeman-v2-address-lookup/1.0',
      Accept: 'application/json',
    },
  })

  if (!geocodeResponse.ok) {
    const errorText = await geocodeResponse.text()
    throw new Error(`Address lookup failed: ${errorText}`)
  }

  const payload = await geocodeResponse.json()
  const match = payload?.[0]

  if (!match?.address) {
    throw new Error('Address lookup returned no results')
  }

  const formattedAddress = formatResolvedAddress(match.address)
  const areaCandidates = dedupeAreas([
    match.address.neighbourhood,
    match.address.quarter,
    match.address.suburb,
    match.address.city_district,
  ])

  return {
    formattedAddress: formattedAddress || match.display_name || addressQuery,
    postalCode: match.address.postcode || '',
    neighborhood: areaCandidates[0] || '',
    secondaryArea: areaCandidates[1] || '',
    areas: areaCandidates,
    latitude: match.lat || '',
    longitude: match.lon || '',
  }
}

async function readScoringFramework() {
  const document = await readFile(SCORING_FRAMEWORK_PATH, 'utf8')
  return yaml.load(document)
}

function getScoringFrameworkOrigin(request) {
  const referer = request.headers.referer

  if (referer) {
    try {
      return new URL(referer).origin
    } catch {
      return DEFAULT_FRONTEND_ORIGIN
    }
  }

  return DEFAULT_FRONTEND_ORIGIN
}

async function renderScoringFrameworkPdf(url, request) {
  return renderRoutePdf(url, request, SCORING_FRAMEWORK_ROUTE)
}

async function renderScoringFrameworkRasterPdf(url, request) {
  const pdf = await renderRoutePdf(url, request, SCORING_FRAMEWORK_ROUTE)

  return rasterizePdf(pdf)
}

async function renderFrameworkReferencePdf(url, request) {
  return renderRoutePdf(url, request, FRAMEWORK_REFERENCE_ROUTE, {
    landscape: true,
    optimize: true,
    viewport: { width: 1500, height: 1100 },
  })
}

async function renderFrameworkReferenceRasterPdf(url, request) {
  const pdf = await renderRoutePdf(url, request, FRAMEWORK_REFERENCE_ROUTE, {
    landscape: true,
    optimize: false,
    viewport: { width: 1500, height: 1100 },
  })

  return rasterizePdf(pdf)
}

async function renderRoutePdf(url, request, route, options = {}) {
  const pageUrl = new URL(route, getScoringFrameworkOrigin(request))
  const search = url.searchParams.get('search')
  const pillar = url.searchParams.get('pillar')

  pageUrl.searchParams.set('pdf', '1')

  if (search) {
    pageUrl.searchParams.set('search', search)
  }

  if (pillar) {
    pageUrl.searchParams.set('pillar', pillar)
  }

  const browser = await launchBrowser()
  const page = await browser.newPage({ viewport: options.viewport || { width: 1100, height: 1500 } })

  try {
    await page.emulateMedia({ media: 'screen' })
    await page.goto(pageUrl.toString(), { waitUntil: 'networkidle' })
    await page.waitForFunction(() => document.body.dataset.ready === 'true')

    if (options.landscape) {
      await page.addStyleTag({ content: '@page { size: A4 landscape; margin: 10mm; }' })
    }

    const pageScale = await getPdfScale(page, options.landscape)

    const pdf = await page.pdf({
      ...(options.landscape ? { width: '297mm', height: '210mm' } : { format: 'A4', landscape: false }),
      scale: pageScale,
      printBackground: options.printBackground ?? true,
      preferCSSPageSize: options.landscape || false,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    })

    return options.optimize ? await optimizePdf(pdf) : pdf
  } finally {
    await browser.close()
  }
}

async function optimizePdf(pdf) {
  const directory = await mkdtemp(path.join(tmpdir(), 'framework-pdf-'))
  const inputPath = path.join(directory, 'input.pdf')
  const outputPath = path.join(directory, 'output.pdf')

  try {
    await writeFile(inputPath, pdf)
    await execFileAsync('gs', [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.7',
      '-dPDFSETTINGS=/printer',
      '-dNOPAUSE',
      '-dBATCH',
      '-dQUIET',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ])

    return await readFile(outputPath)
  } catch {
    return pdf
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

async function rasterizePdf(pdf) {
  const directory = await mkdtemp(path.join(tmpdir(), 'framework-raster-pdf-'))
  const inputPath = path.join(directory, 'input.pdf')
  const outputPath = path.join(directory, 'output.pdf')

  try {
    await writeFile(inputPath, pdf)
    await execFileAsync('gs', [
      '-sDEVICE=pdfimage24',
      '-r360',
      '-dTextAlphaBits=4',
      '-dGraphicsAlphaBits=4',
      '-dJPEGQ=95',
      '-dNOPAUSE',
      '-dBATCH',
      '-dQUIET',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ])

    return await readFile(outputPath)
  } catch {
    return pdf
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

async function getPdfScale(page, landscape = false) {
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const a4WidthInches = landscape ? 11.69 : 8.27
  const horizontalMarginInches = 20 / 25.4
  const printableWidthPx = (a4WidthInches - horizontalMarginInches) * 96
  const scale = printableWidthPx / pageWidth

  return Math.max(0.1, Math.min(1, scale))
}

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'chrome' })
  } catch {
    return chromium.launch()
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

  if (url.pathname === '/api/resolve-neighborhood' && request.method === 'GET') {
    try {
      const result = await resolveNeighborhood(url.searchParams)
      sendJson(response, 200, result)
    } catch (error) {
      sendJson(response, /Missing address|no results/i.test(error.message) ? 400 : 500, {
        error: error.message || 'Neighborhood lookup failed',
      })
    }
    return
  }

  if (url.pathname === '/api/scoring-framework' && request.method === 'GET') {
    try {
      const framework = await readScoringFramework()
      sendJson(response, 200, framework)
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Failed to load scoring framework',
      })
    }
    return
  }

  if (url.pathname === '/api/scoring-framework/pdf' && request.method === 'GET') {
    try {
      const pdf = await renderScoringFrameworkPdf(url, request)
      response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="insurance-readiness-framework.pdf"',
      })
      response.end(pdf)
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Failed to render scoring PDF',
      })
    }
    return
  }

  if (url.pathname === '/api/scoring-framework/pdf-raster' && request.method === 'GET') {
    try {
      const pdf = await renderScoringFrameworkRasterPdf(url, request)
      response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="insurance-readiness-framework-image.pdf"',
      })
      response.end(pdf)
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Failed to render raster scoring PDF',
      })
    }
    return
  }

  if (url.pathname === '/api/framework/pdf' && request.method === 'GET') {
    try {
      const pdf = await renderFrameworkReferencePdf(url, request)
      response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="insurance-readiness-framework-reference.pdf"',
      })
      response.end(pdf)
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Failed to render framework PDF',
      })
    }
    return
  }

  if (url.pathname === '/api/framework/pdf-raster' && request.method === 'GET') {
    try {
      const pdf = await renderFrameworkReferenceRasterPdf(url, request)
      response.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="insurance-readiness-framework-reference-image.pdf"',
      })
      response.end(pdf)
    } catch (error) {
      sendJson(response, 500, {
        error: error instanceof Error ? error.message : 'Failed to render raster framework PDF',
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
      console.error(`[voice-prefill] trace ${traceId} failed:`, error)

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
