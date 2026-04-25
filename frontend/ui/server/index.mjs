import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { mkdir, writeFile, appendFile } from 'node:fs/promises'
import dotenv from 'dotenv'
import { buildVoiceBusinessPrefillPrompt } from '../src/utils/voiceBusinessPrefill.js'

dotenv.config({ path: '.env.server.local' })
dotenv.config({ path: '.env.local', override: false })
dotenv.config()

const PORT = Number(process.env.VOICE_PREFILL_PORT || 3000)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-3-flash-preview'
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

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    response.end()
    return
  }

  if (request.url === '/api/health' && request.method === 'GET') {
    sendJson(response, 200, {
      ok: true,
      model: OPENROUTER_MODEL,
    })
    return
  }

  if (request.url === '/api/voice-intake/prefill' && request.method === 'POST') {
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
