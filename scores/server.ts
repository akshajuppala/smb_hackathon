import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

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

function isNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
