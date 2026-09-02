import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(".");
const clientRoot = join(root, "dist", "client");
const serverEntry = pathToFileURL(join(root, "dist", "server", "index.js")).href;
const { default: worker } = await import(`${serverEntry}?local=${Date.now()}`);
const handleRequest =
  typeof worker === "function" ? worker : typeof worker?.fetch === "function" ? worker.fetch.bind(worker) : null;

if (!handleRequest) {
  throw new Error("Local build did not expose a compatible request handler.");
}

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function safeAssetPath(pathname) {
  const decoded = decodeURIComponent(pathname.split("?")[0]);
  const normalizedPath = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(clientRoot, normalizedPath);
  return filePath.startsWith(clientRoot) ? filePath : null;
}

async function assetResponse(pathname) {
  const filePath = safeAssetPath(pathname);
  if (!filePath || !existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers({
    "content-length": String(fileStat.size),
    "content-type": mimeTypes.get(extname(filePath).toLowerCase()) ?? "application/octet-stream",
  });

  return new Response(createReadStream(filePath), { headers });
}

const env = {
  ASSETS: {
    fetch: async (request) => assetResponse(new URL(request.url).pathname),
  },
  IMAGES: {
    input() {
      return {
        transform() {
          return {
            async output() {
              return {
                response: () => new Response("Image optimization is not available in local preview.", { status: 501 }),
              };
            },
          };
        },
      };
    },
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

async function findPort(startPort) {
  for (let port = startPort; port < startPort + 20; port += 1) {
    const available = await new Promise((resolvePort) => {
      const probe = createServer();
      probe.once("error", () => resolvePort(false));
      probe.once("listening", () => probe.close(() => resolvePort(true)));
      probe.listen(port, "127.0.0.1");
    });
    if (available) return port;
  }
  throw new Error("No local preview port available.");
}

const port = await findPort(Number(process.env.PORT ?? 4173));

const server = createServer(async (incoming, outgoing) => {
  try {
    const host = incoming.headers.host ?? `127.0.0.1:${port}`;
    const url = new URL(incoming.url ?? "/", `http://${host}`);

    const request = new Request(url, {
      method: incoming.method,
      headers: incoming.headers,
      body: incoming.method === "GET" || incoming.method === "HEAD" ? undefined : incoming,
      duplex: incoming.method === "GET" || incoming.method === "HEAD" ? undefined : "half",
    });

    const isStatic =
      url.pathname.startsWith("/assets/") ||
      url.pathname.startsWith("/_next/") ||
      url.pathname === "/favicon.svg" ||
      url.pathname === "/og.png" ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".png");

    const response = isStatic ? await assetResponse(url.pathname) : await handleRequest(request, env, ctx);

    outgoing.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    if (incoming.method === "HEAD") {
      outgoing.end();
      return;
    }
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        outgoing.write(Buffer.from(value));
      }
    }
    outgoing.end();
  } catch (error) {
    outgoing.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    outgoing.end(error instanceof Error ? error.stack : String(error));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serenity local preview: http://127.0.0.1:${port}`);
});
