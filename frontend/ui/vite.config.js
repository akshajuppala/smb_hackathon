import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { NAICS_722_LEAF_CODES, NAICS_722_LEAF_CODE_MAP } from './src/data/naics722LeafCodes.js'

const OPENROUTER_MODEL = 'google/gemini-3-flash-preview'

function googlePlacesWebsitePlugin(env) {
  const apiKey = env.GOOGLE_PLACES_API_KEY

  async function handleLookup(req, res) {
    if (!apiKey) {
      console.error('[place-website] Missing GOOGLE_PLACES_API_KEY')
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Missing GOOGLE_PLACES_API_KEY' }))
      return
    }

    const url = new URL(req.url, 'http://localhost')
    const businessName = url.searchParams.get('businessName')?.trim()
    const address = url.searchParams.get('address')?.trim()

    if (!businessName || !address) {
      console.warn('[place-website] Missing businessName or address', { businessName, address })
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Missing businessName or address' }))
      return
    }

    try {
      console.log('[place-website] Lookup start', { businessName, address })
      const googleResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.websiteUri,places.googleMapsUri',
        },
        body: JSON.stringify({
          textQuery: `${businessName}, ${address}`,
        }),
      })

      if (!googleResponse.ok) {
        const errorText = await googleResponse.text()
        console.error('[place-website] Google Places lookup failed', errorText)
        res.statusCode = googleResponse.status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Google Places lookup failed', details: errorText }))
        return
      }

      const payload = await googleResponse.json()
      const place = payload.places?.[0]
      console.log('[place-website] Lookup success', {
        placeName: place?.displayName?.text || '',
        websiteUrl: place?.websiteUri || '',
      })

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          websiteUrl: place?.websiteUri || '',
          googlePlaceUrl: place?.googleMapsUri || '',
          placeName: place?.displayName?.text || '',
          formattedAddress: place?.formattedAddress || '',
        })
      )
    } catch (error) {
      console.error('[place-website] Lookup request failed', error)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Lookup request failed', details: error.message }))
    }
  }

  return {
    name: 'google-places-website-proxy',
    configureServer(server) {
      server.middlewares.use('/api/place-website', (req, res, next) => {
        if (req.method !== 'GET') {
          next()
          return
        }

        handleLookup(req, res)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/place-website', (req, res, next) => {
        if (req.method !== 'GET') {
          next()
          return
        }

        handleLookup(req, res)
      })
    },
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(new Error('Invalid JSON body'))
      }
    })

    req.on('error', reject)
  })
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
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

function openRouterNaicsPlugin(env) {
  const apiKey = env.OPENROUTER_API_KEY

  async function handleClassification(req, res) {
    if (!apiKey) {
      console.error('[naics-classify] Missing OPENROUTER_API_KEY')
      sendJson(res, 500, { error: 'Missing OPENROUTER_API_KEY' })
      return
    }

    let payload

    try {
      payload = sanitizeBusinessPayload(await readJsonBody(req))
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Invalid request body' })
      return
    }

    if (!payload.businessName || !payload.businessDescription) {
      sendJson(res, 400, { error: 'Missing businessName or businessDescription' })
      return
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
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
        console.error('[naics-classify] OpenRouter request failed', result)
        sendJson(res, response.status, {
          error: 'OpenRouter classification failed',
          details: result?.error?.message || result?.error || 'Unknown error',
        })
        return
      }

      const content = result?.choices?.[0]?.message?.content
      const parsed = typeof content === 'string' ? JSON.parse(content) : content
      const matchedCode = NAICS_722_LEAF_CODE_MAP[parsed?.code]

      if (!matchedCode) {
        sendJson(res, 502, { error: 'Model returned an invalid NAICS code' })
        return
      }

      sendJson(res, 200, {
        code: matchedCode.code,
        name: matchedCode.name,
        officialScope: matchedCode.officialScope,
        confidence: parsed.confidence,
        reason: parsed.reason,
        model: OPENROUTER_MODEL,
      })
    } catch (error) {
      console.error('[naics-classify] Request failed', error)
      sendJson(res, 500, {
        error: 'Classification request failed',
        details: error.message,
      })
    }
  }

  function register(server) {
    server.middlewares.use('/api/naics-classify', (req, res, next) => {
      if (req.method !== 'POST') {
        next()
        return
      }

      handleClassification(req, res)
    })
  }

  return {
    name: 'openrouter-naics-classifier',
    configureServer: register,
    configurePreviewServer: register,
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    envPrefix: ['VITE_', 'DEEPGRAM_'],
    plugins: [react(), googlePlacesWebsitePlugin(env), openRouterNaicsPlugin(env)],
  }
})
