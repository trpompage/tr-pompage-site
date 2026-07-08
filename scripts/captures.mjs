/* Captures d'écran des 4 pages (desktop 1440 + mobile 390) via Playwright.
   Usage : npm run build && npm run preview -- --port 4173 & puis `npm run captures`.
   Les pages sont capturées en `prefers-reduced-motion` pour révéler tout le
   contenu (reveals visibles, hero en frame statique), plus une capture du
   hero animé en conditions réelles. */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const OUT = process.env.OUT_DIR ?? "docs/captures/p0";
const ARGS = ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"];

const ROUTES = [
  ["/", "accueil"],
  ["/preparation", "preparation"],
  ["/poncage", "poncage"],
  ["/sinistres", "sinistres"],
];

/* DSF mobile 1,5 (pas 2) : au-delà de 16384 px de hauteur physique,
   Chromium bascule en scroll+stitch et corrompt la capture fullPage. */
const VIEWPORTS = [
  ["desktop", { width: 1440, height: 900 }, 1],
  ["mobile", { width: 390, height: 844 }, 1.5],
];

mkdirSync(OUT, { recursive: true });

async function launch() {
  try {
    return await chromium.launch({ args: ARGS });
  } catch {
    return await chromium.launch({
      executablePath: "/opt/pw-browsers/chromium",
      args: ARGS,
    });
  }
}

const browser = await launch();

for (const [vpName, viewport, scale] of VIEWPORTS) {
  /* pas d'isMobile:true — ce flag corrompt les captures fullPage
     (duplication du contenu au stitching Chromium) */
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: scale,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const [path, name] of ROUTES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForSelector("#loader", { state: "detached", timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${name}-${vpName}.png`, fullPage: true });
    console.log(`✓ ${name}-${vpName}.png`);
  }
  await ctx.close();
}

// hero animé, conditions réelles (sans reduced-motion)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForSelector("#loader", { state: "detached", timeout: 15000 }).catch(() => {});
  // swiftshader est lent : on laisse les reveals se terminer avant la capture
  await page.waitForSelector("h1.in", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/accueil-hero-anime.png` });
  console.log("✓ accueil-hero-anime.png");
  await ctx.close();
}

await browser.close();
console.log("Captures terminées →", OUT);
