# smb_hackathon

## Voice Intake

The voice intake page now uses Deepgram live transcription with the `nova-3` model.

### Local setup

From `frontend/ui/`:

```bash
npm install
npm run dev
```

Set `DEEPGRAM_API_KEY` in `.env.local` before starting the dev server. The app now starts both:

- the Vite frontend
- the local API server on `http://127.0.0.1:3000`

For server-side voice mapping, copy `.env.server.example` to `.env.server.local` and set:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`

The current default model is `google/gemini-3-flash-preview`.

`npm run dev` proxies `/api/*` from Vite to the local server automatically.

## Voice Prefill Architecture

The business intake form fields now live in `ui/src/data/businessInfoFields.js`. That file is intended to be the single source of truth for:

- the form UI labels, placeholders, and field types
- which fields are eligible for voice prefill
- the schema and descriptions sent to an LLM mapper

The frontend posts the final transcript to the local server route `/api/voice-intake/prefill`.

Suggested server flow:

1. Receive `{ transcript }` from the client.
2. Build the prompt and JSON schema from the shared field registry on the server.
3. Call OpenRouter server-side with a fast model that supports structured outputs.
4. Return `{ prefill: <model_json> }` to the browser.
5. Let the client run the shared normalizer before merging the fields into form state.

That keeps model credentials off the client and lets you change the mapping by editing the field schema rather than rewriting prompt logic in multiple places.
