# smb_hackathon

## Voice Intake

The voice intake page now uses Deepgram live transcription with the `nova-3` model.

### Local setup

From `frontend/ui/`:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set `DEEPGRAM_API_KEY` in `.env.local` before starting the Vite server. This hackathon version sends the Deepgram API key directly from the browser over the WebSocket subprotocol, so it is only appropriate for a throwaway demo.
