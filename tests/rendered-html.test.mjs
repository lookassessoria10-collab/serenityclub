import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const handleRequest =
    typeof worker === "function" ? worker : typeof worker?.fetch === "function" ? worker.fetch.bind(worker) : null;

  assert.ok(handleRequest, "Local build should expose a request handler.");

  return handleRequest(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Serenity age gate", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Serenity \| Seu tempo\. Seus sentidos\. Sua experiência\./);
  assert.match(html, /Entre devagar/);
  assert.match(html, /O toque comeca antes da pele/);
  assert.match(html, /serenity-logo-white\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("starter preview files and dependency are removed", async () => {
  const [page, ageGate, museData, museProfilePage, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AgeGate.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/musas/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Um convite aos sentidos/);
  assert.match(page, /\/musas\/\$\{muse\.slug\}/);
  assert.match(page, /museCrossfade|muse-slideshow/);
  assert.match(ageGate, /Espaco reservado para adultos/);
  assert.match(ageGate, /Validar acesso/);
  assert.match(ageGate, /Privacidade primeiro/);
  assert.match(museData, /name: "Clara"/);
  assert.match(museData, /clara-free-1\.jpeg/);
  assert.match(museData, /clara-premium-6\.jpeg/);
  assert.match(museData, /name: "Isabela"/);
  assert.match(museData, /isabela-free-1\.jpeg/);
  assert.match(museData, /isabela-premium-8\.jpeg/);
  assert.match(museData, /name: "Patr/);
  assert.match(museData, /patricia-free-1\.jpeg/);
  assert.match(museData, /patricia-premium-2\.jpeg/);
  assert.match(museData, /Personagem digital criada por IA/);
  assert.match(museProfilePage, /assine premiums/);
  assert.match(museProfilePage, /generateStaticParams/);
  assert.match(layout, /generateMetadata/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", templateRoot)));
  await assert.rejects(access(new URL("app/_sites-preview/preview.css", templateRoot)));
});
