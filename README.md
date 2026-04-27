# smb_hackathon
our name: Simply Covered

Winner of SMB Hackathon: https://cerebralvalley.ai/events/~/e/test-hackathon-25f870ea

## Framework Viewer

The framework viewer is now part of the main frontend app at `/scoring-framework`.

### Files

- `frontend/ui/src/data/insuranceReadinessFramework.yaml`: canonical source of truth
- `frontend/ui/src/pages/PageScoringFramework.jsx`: framework route UI
- `frontend/ui/server/index.mjs`: scoring API and PDF export endpoints

### Run

From `frontend/ui/`:

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:5173/scoring-framework`.

If PDF export needs a local browser binary:

```bash
npx playwright install chromium
```
