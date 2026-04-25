# Insurance Readiness Scoring

Everything for the framework viewer is contained in this `scores/` directory.

## Source of Truth

- `insurance_readiness_framework.yaml`: canonical scoring framework
- `server.ts`: simple TypeScript server
- `public/`: browser UI for navigating the framework

## Run

From inside `scores/`:

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:4173`.

If that port is already in use:

```bash
PORT=4174 npm run dev
```

PDF export uses Chrome or Playwright Chromium. If neither is available:

```bash
npm run install:pdf-browser
```

## Notes

- The browser UI fetches `/api/framework`.
- The server reads the YAML directly on each request, so there is no generated JSON file to keep in sync.
