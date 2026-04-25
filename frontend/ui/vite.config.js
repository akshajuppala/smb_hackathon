import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    envPrefix: ['VITE_', 'DEEPGRAM_'],
    plugins: [react(), googlePlacesWebsitePlugin(env)],
  }
})
