const VOICE_PREFILL_ENDPOINT = '/api/voice-intake/prefill'

export async function resolveVoiceBusinessPrefill(transcript) {
  if (!transcript?.trim()) return {}

  const response = await fetch(VOICE_PREFILL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript,
    }),
  })

  if (!response.ok) {
    throw new Error(`Voice prefill request failed with status ${response.status}`)
  }

  const payload = await response.json()
  return payload.prefill ?? payload.fields ?? payload
}
