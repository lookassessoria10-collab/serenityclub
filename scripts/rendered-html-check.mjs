import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const templateRoot = new URL("../", import.meta.url);
const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

assert.match(html, /Serenity/);
assert.match(html, /Entre devagar/);
assert.match(html, /O toque comeca antes da pele/);
assert.match(html, /serenity-logo-white\.png/);
assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);

const [page, ageGate, museData, museProfilePage, layout, packageJson, vercelConfig] = await Promise.all([
  readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/components/AgeGate.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/musas/[slug]/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
  readFile(new URL("../vercel.json", import.meta.url), "utf8"),
]);

assert.match(page, /Entre devagar/);
assert.match(page, /\/musas\/\$\{muse\.slug\}/);
assert.match(page, /hero-carousel|app-muse-card/);
assert.match(page, /museSlowFade|muse-slideshow/);
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
assert.match(layout, /export const metadata/);
assert.match(packageJson, /"next": "16\.2\.6"/);
assert.match(vercelConfig, /"outputDirectory": "out"/);
assert.doesNotMatch(packageJson, /react-loading-skeleton|vinext|wrangler|drizzle/);

await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", templateRoot)));
await assert.rejects(access(new URL("app/_sites-preview/preview.css", templateRoot)));

console.log("Rendered Serenity checks passed.");
