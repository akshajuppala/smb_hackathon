import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const frameworkPath = path.join(__dirname, "insurance_readiness_framework.yaml");
const port = Number(process.env.PORT ?? 4173);

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === "/api/framework") {
      const document = await readFile(frameworkPath, "utf8");
      const payload = yaml.load(document);

      respondJson(response, 200, payload);
      return;
    }

    if (pathname === "/api/pdf") {
      const pdf = await renderPdf(url, request.headers.host ?? `127.0.0.1:${port}`);

      response.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="insurance-readiness-framework.pdf"',
      });
      response.end(pdf);
      return;
    }

    const requestedPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const normalizedPath = path.normalize(requestedPath);
    const assetPath = path.join(publicDir, normalizedPath);

    if (!assetPath.startsWith(publicDir)) {
      respondText(response, 403, "Forbidden");
      return;
    }

    const body = await readFile(assetPath);
    const extension = path.extname(assetPath);
    const contentType = contentTypes[extension] ?? "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    response.end(body);
  } catch (error) {
    const status = isNotFound(error) ? 404 : 500;
    const message = isNotFound(error) ? "Not Found" : "Internal Server Error";

    if (status === 500) {
      console.error(error);
    }

    respondText(response, status, message);
  }
}).listen(port, () => {
  console.log(`Insurance readiness viewer running at http://127.0.0.1:${port}`);
});

function respondJson(response: import("node:http").ServerResponse, status: number, payload: unknown) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload, null, 2));
}

function respondText(response: import("node:http").ServerResponse, status: number, message: string) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(message);
}

async function renderPdf(url: URL, host: string) {
  const pageUrl = new URL(`http://${host}/`);
  const search = url.searchParams.get("search");
  const pillar = url.searchParams.get("pillar");

  pageUrl.searchParams.set("pdf", "1");

  if (search) {
    pageUrl.searchParams.set("search", search);
  }

  if (pillar) {
    pageUrl.searchParams.set("pillar", pillar);
  }

  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1100, height: 1500 } });

  try {
    await page.emulateMedia({ media: "screen" });
    await page.goto(pageUrl.toString(), { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.body.dataset.ready === "true");

    const pageScale = await getPdfScale(page);

    return await page.pdf({
      format: "A4",
      landscape: false,
      scale: pageScale,
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });
  } finally {
    await browser.close();
  }
}

async function getPdfScale(page: import("playwright").Page) {
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const a4PortraitWidthInches = 8.27;
  const horizontalMarginInches = 20 / 25.4;
  const printableWidthPx = (a4PortraitWidthInches - horizontalMarginInches) * 96;
  const scale = printableWidthPx / pageWidth;

  return Math.max(0.1, Math.min(1, scale));
}

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (error) {
    console.warn("Bundled Playwright Chromium is unavailable; falling back to local Chrome.");
    return chromium.launch({ channel: "chrome" });
  }
}

function isNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
