import { VOICE_PREFILL_FIELDS } from '../data/businessInfoFields.js'

function buildSchemaProperty(field) {
  if (field.input === 'checkbox') {
    return {
      type: 'boolean',
      description: field.voiceDescription,
    }
  }

  const property = {
    type: 'string',
    description: field.voiceDescription,
  }

  if (field.input === 'select') {
    property.enum = field.options.map((option) => option.value).filter(Boolean)
  }

  if (field.schema?.pattern) {
    property.pattern = field.schema.pattern
  }

  if (field.schema?.minLength) {
    property.minLength = field.schema.minLength
  }

  if (field.schema?.maxLength) {
    property.maxLength = field.schema.maxLength
  }

  return property
}

export const VOICE_BUSINESS_PREFILL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: Object.fromEntries(VOICE_PREFILL_FIELDS.map((field) => [field.key, buildSchemaProperty(field)])),
}

export function buildVoiceBusinessPrefillPrompt(transcript) {
  const trimmedTranscript = transcript.trim()

  return {
    system: [
      'You are an information extraction model.',
      'Extract only explicitly stated facts from the transcript into the provided schema.',
      'Omit unknown fields.',
      'Do not guess.',
      'Return only JSON.',
    ].join(' '),
    user: [
      'Extract business intake fields from this transcript.',
      '',
      'Transcript:',
      '<transcript>',
      trimmedTranscript,
      '</transcript>',
      '',
      'Fill only the fields that are explicitly supported by the transcript.',
      'If a field is not stated, omit it.',
      'Do not guess.',
      'Do not copy an address into phone.',
      'Do not copy an address into squareFootage.',
      'Do not reuse one value across multiple fields unless the transcript clearly states that same value for each field.',
      'Use the exact business name, address, email, and phone number from the transcript when present.',
      'For booleans, include the field only when the transcript clearly indicates the answer is true. Otherwise omit the field.',
      'For ownOrLease, return only "own" or "lease".',
      'For ownerRole, return a concise role title such as "Owner", "Manager", "Founder", or "Operator".',
      '',
      'Fields:',
      ...VOICE_PREFILL_FIELDS.map((field) => `- ${field.key}: ${field.voiceDescription}`),
      '',
      'Return exactly one JSON object matching the schema.',
      'Return no prose.',
    ].join('\n'),
    schema: {
      name: 'voice_business_prefill',
      strict: true,
      schema: VOICE_BUSINESS_PREFILL_SCHEMA,
    },
  }
}
