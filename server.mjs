import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

const ROOT_DIR = resolve(__dirname, "docs");
const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

function sendError(res, statusCode, message) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(message);
}

function toSafePath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname);
  const normalized = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
  return normalized.startsWith("/") ? normalized.slice(1) : normalized;
}

async function resolveFilePath(urlPathname) {
  const safePath = toSafePath(urlPathname);
  const requestedPath = resolve(ROOT_DIR, safePath);

  if (!requestedPath.startsWith(ROOT_DIR)) {
    return null;
  }

  const candidates = [];

  if (urlPathname.endsWith("/")) {
    candidates.push(join(requestedPath, "index.html"));
  } else {
    candidates.push(requestedPath);
    candidates.push(join(requestedPath, "index.html"));
    candidates.push(`${requestedPath}.html`);
  }

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendError(res, 400, "Bad request");
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendError(res, 405, "Method Not Allowed");
    return;
  }

  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host ?? `${HOST}:${PORT}`}`);
    const filePath = await resolveFilePath(requestUrl.pathname);

    if (!filePath) {
      sendError(res, 404, "Not Found");
      return;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    const stream = createReadStream(filePath);
    stream.on("error", () => sendError(res, 500, "Internal Server Error"));
    stream.pipe(res);
  } catch {
    sendError(res, 500, "Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Serving docs at http://${HOST}:${PORT}`);
});
