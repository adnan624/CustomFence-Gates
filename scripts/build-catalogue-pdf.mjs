/**
 * Builds a print-ready catalogue PDF from the live catalogue data.
 *
 * 1. Imports CATALOGUE / SERVICES straight from the TS config (no drift).
 * 2. Renders a branded, A4 print HTML to `dist/catalogue.html`.
 * 3. Shells out to headless Google Chrome to print it to `dist/catalogue.pdf`.
 *
 * Run:  node scripts/build-catalogue-pdf.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { CATALOGUE } from "../src/config/catalogue.ts";
import { SERVICES } from "../src/config/services.ts";
import { ENQUIRY_EMAIL, PHONE_DISPLAY } from "../src/config/site.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = resolve(ROOT, "public");
const OUT_DIR = resolve(ROOT, "dist");
const HTML_PATH = resolve(OUT_DIR, "catalogue.html");
const PDF_PATH = resolve(OUT_DIR, "catalogue.pdf");

const BRAND = "Custom Fence & Gates";
const C = {
  cream: "#f7f5f0",
  creamDark: "#efeae2",
  ink: "#121110",
  muted: "#5f5c56",
  border: "#e4dfd4",
  brand: "#1a3c2f",
  gold: "#a67c52",
  amber: "#e0a82e",
  night: "#0c1612",
};

const pad = (n) => String(n).padStart(2, "0");
const titleFor = (slug) => SERVICES.find((s) => s.slug === slug)?.title ?? slug;
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
/** Resolve a /public asset to an absolute file:// URL so Chrome can embed it. */
const asset = (src) => pathToFileURL(resolve(PUBLIC, "." + src)).href;

function chips(specs) {
  return `<ul class="chips">${specs.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;
}

function coverPage() {
  return `
  <section class="page cover" style="background-image:url('${asset(CATALOGUE[0].hero.src)}')">
    <div class="cover-scrim"></div>
    <div class="cover-inner">
      <header class="cover-top">
        <div>
          <p class="cover-brand">${esc(BRAND)}</p>
          <p class="cover-sub">King County · Pierce County</p>
        </div>
        <p class="cover-count">${pad(CATALOGUE.length)} Collections</p>
      </header>
      <div class="cover-title">
        <p class="eyebrow gold">The Catalogue</p>
        <h1>Fence &amp; gate collections.</h1>
        <p class="cover-lede">Cedar, vinyl, composite, chain-link, aluminum, repairs, and custom
          gates — ${CATALOGUE.length} collections of styles, finishes, and specifications.</p>
      </div>
      <p class="cover-foot">${esc(PHONE_DISPLAY)} · Free, no-obligation estimates</p>
    </div>
  </section>`;
}

function contentsPage() {
  const rows = CATALOGUE.map(
    (c, i) => `
      <li>
        <span class="toc-num">${pad(i + 1)}</span>
        <span class="toc-rule"></span>
        <span class="toc-body">
          <span class="toc-title">${esc(titleFor(c.slug))}</span>
          <span class="toc-eyebrow">${esc(c.eyebrow)}</span>
        </span>
      </li>`,
  ).join("");
  return `
  <section class="page light">
    <div class="pad">
      <p class="eyebrow gold">Contents</p>
      <h2 class="h-contents">The collections</h2>
      <ol class="toc">${rows}</ol>
      ${footer("Contents")}
    </div>
  </section>`;
}

function chapterOpener(c, ci) {
  const meta = c.meta
    .map(
      (m) => `<div class="meta-cell"><p class="meta-label">${esc(m.label)}</p><p class="meta-value">${esc(m.value)}</p></div>`,
    )
    .join("");
  return `
  <section class="page chapter" style="background-image:url('${asset(c.hero.src)}')">
    <div class="chapter-scrim"></div>
    <div class="chapter-inner">
      <header class="chapter-top">
        <p class="eyebrow gold">Chapter ${pad(ci + 1)}</p>
        <span class="chapter-big">${pad(ci + 1)}</span>
      </header>
      <div>
        <p class="eyebrow gold">${esc(c.eyebrow)}</p>
        <h2 class="chapter-title">${esc(titleFor(c.slug))}</h2>
        <p class="chapter-lede">${esc(c.lede)}</p>
        <div class="meta-row">${meta}</div>
      </div>
      <p class="chapter-foot">${esc(BRAND)}</p>
    </div>
  </section>`;
}

function stylePage(c, style, si) {
  const media = style.image
    ? `<div class="style-img" style="background-image:url('${asset(style.image.src)}')"></div>`
    : `<div class="style-img placeholder"><span>${pad(si + 1)}</span></div>`;
  const tag = style.tag ? `<span class="tag">${esc(style.tag)}</span>` : "";
  return `
  <section class="page light">
    <div class="pad">
      <div class="style-head">
        <span class="style-num">${pad(si + 1)}</span>
        <span class="style-rule"></span>
        ${tag}
      </div>
      <h3 class="style-name">${esc(style.name)}</h3>
      ${media}
      <p class="style-blurb">${esc(style.blurb)}</p>
      ${chips(style.specs)}
      ${footer(c.eyebrow)}
    </div>
  </section>`;
}

function specsPage(c) {
  const swatches = c.finishes.swatches
    .map(
      (sw) => `<div class="swatch"><span class="dot" style="background:${esc(sw.hex)}"></span><span>${esc(sw.name)}</span></div>`,
    )
    .join("");
  const rows = c.specSheet
    .map((r) => `<div class="spec-row"><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`)
    .join("");
  return `
  <section class="page light">
    <div class="pad">
      <p class="eyebrow gold">Finishes &amp; specifications</p>
      <h3 class="finishes-title">${esc(c.finishes.label)}</h3>
      <div class="swatches">${swatches}</div>
      <dl class="specs">${rows}</dl>
      ${footer(c.eyebrow)}
    </div>
  </section>`;
}

function backPage() {
  return `
  <section class="page back">
    <div class="pad back-inner">
      <p class="eyebrow gold">Let&rsquo;s build it</p>
      <div>
        <h2 class="back-title">Request a free estimate.</h2>
        <p class="back-lede">Tell us your yard size, the collection you like, and a height.
          We&rsquo;ll reply with a clear, no-obligation estimate.</p>
        <div class="back-contact">
          <div><p class="back-label">Call</p><p class="back-value">${esc(PHONE_DISPLAY)}</p></div>
          <div><p class="back-label">Email</p><p class="back-value">${esc(ENQUIRY_EMAIL)}</p></div>
        </div>
      </div>
      <p class="back-foot">${esc(BRAND)} · Seattle Metro</p>
    </div>
  </section>`;
}

function footer(label) {
  return `<div class="footer"><span>${esc(BRAND)}</span><span>${esc(label)}</span></div>`;
}

function buildHtml() {
  const body = [coverPage(), contentsPage()];
  CATALOGUE.forEach((c, ci) => {
    body.push(chapterOpener(c, ci));
    c.styles.forEach((style, si) => body.push(stylePage(c, style, si)));
    body.push(specsPage(c));
  });
  body.push(backPage());

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(BRAND)} — The Catalogue</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html { font-family: "Helvetica Neue", Arial, sans-serif; color: ${C.ink}; }
  h1,h2,h3 { font-family: Georgia, "Times New Roman", serif; letter-spacing: -0.01em; }

  .page { position: relative; width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; background: ${C.cream}; }
  .page:last-child { page-break-after: auto; }
  .pad { position: relative; display: flex; flex-direction: column; height: 100%; padding: 22mm 20mm; }
  .light { background: linear-gradient(170deg, #fff, ${C.cream} 60%, ${C.creamDark}); }

  .eyebrow { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.28em; }
  .gold { color: ${C.gold}; }

  .footer { margin-top: auto; display: flex; justify-content: space-between; padding-top: 10mm;
    font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: ${C.muted}; }

  /* Cover */
  .cover, .chapter { background-size: cover; background-position: center; color: #fff; }
  .cover-scrim { position: absolute; inset: 0; background: linear-gradient(to top, ${C.night}, ${C.night}cc 45%, ${C.night}59); }
  .cover-inner { position: relative; display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 24mm 20mm; }
  .cover-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .cover-brand { font-family: Georgia, serif; font-size: 22px; font-weight: 700; }
  .cover-sub { margin-top: 4px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; color: #ffffffaa; }
  .cover-count { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.25em; color: ${C.gold}; }
  .cover-title h1 { margin-top: 10px; font-size: 54px; font-weight: 700; line-height: 1.02; }
  .cover-lede { margin-top: 14px; max-width: 46ch; font-size: 13px; line-height: 1.7; color: #ffffffdd; }
  .cover-foot { font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; color: #ffffffaa; }

  /* Contents */
  .h-contents { margin-top: 8px; font-size: 32px; font-weight: 700; }
  .toc { list-style: none; margin-top: 10mm; }
  .toc li { display: flex; align-items: center; gap: 14px; padding: 7px 0; }
  .toc-num { width: 34px; font-family: "Arial Black", Arial, sans-serif; font-size: 22px; color: ${C.gold}; }
  .toc-rule { width: 20px; height: 1px; background: ${C.gold}99; flex: none; }
  .toc-body { flex: 1; }
  .toc-title { display: block; font-family: Georgia, serif; font-size: 16px; font-weight: 700; }
  .toc-eyebrow { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: ${C.muted}; }

  /* Chapter opener */
  .chapter-scrim { position: absolute; inset: 0; background: linear-gradient(to top, ${C.night}, ${C.night}b3 40%, ${C.night}40); }
  .chapter-inner { position: relative; display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 24mm 20mm; }
  .chapter-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .chapter-big { font-family: "Arial Black", Arial, sans-serif; font-size: 72px; line-height: 1; color: #ffffff40; }
  .chapter-title { margin-top: 10px; font-size: 44px; font-weight: 700; line-height: 1.05; }
  .chapter-lede { margin-top: 14px; max-width: 54ch; font-size: 13px; line-height: 1.7; color: #ffffffdd; }
  .meta-row { margin-top: 20px; display: flex; gap: 40px; border-top: 1px solid #ffffff33; padding-top: 14px; }
  .meta-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.15em; color: #ffffff99; }
  .meta-value { margin-top: 5px; font-size: 14px; font-weight: 700; }
  .chapter-foot { font-size: 8px; text-transform: uppercase; letter-spacing: 0.2em; color: #ffffff99; }

  /* Style page */
  .style-head { display: flex; align-items: center; gap: 12px; }
  .style-num { font-family: "Arial Black", Arial, sans-serif; font-size: 30px; color: ${C.gold}; }
  .style-rule { flex: 1; height: 1px; background: ${C.border}; }
  .tag { border-radius: 999px; background: ${C.night}; color: #fff; padding: 5px 11px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
  .style-name { margin-top: 12px; font-size: 28px; font-weight: 700; }
  .style-img { margin-top: 14px; height: 105mm; width: 100%; border-radius: 14px; background-size: cover; background-position: center; border: 1px solid ${C.border}; }
  .style-img.placeholder { display: flex; align-items: center; justify-content: center; background: ${C.brand}; }
  .style-img.placeholder span { font-family: "Arial Black", Arial, sans-serif; font-size: 72px; color: #ffffff33; }
  .style-blurb { margin-top: 16px; font-size: 13px; line-height: 1.7; color: ${C.muted}; }
  .chips { list-style: none; margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; }
  .chips li { display: inline-flex; align-items: center; gap: 7px; border-radius: 999px; background: #ffffffb3; border: 1px solid ${C.border}; padding: 6px 12px; font-size: 11px; font-weight: 500; }
  .chips li::before { content: ""; width: 5px; height: 5px; border-radius: 999px; background: ${C.gold}; }

  /* Specs page */
  .finishes-title { margin-top: 8px; font-size: 24px; font-weight: 700; }
  .swatches { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 22px; }
  .swatch { display: flex; flex-direction: column; align-items: center; gap: 7px; }
  .swatch .dot { width: 46px; height: 46px; border-radius: 999px; border: 1px solid #0000001a; box-shadow: inset 0 2px 6px #00000026; }
  .swatch span { font-size: 10px; color: ${C.muted}; }
  .specs { margin-top: 22px; border-top: 1px solid ${C.border}; }
  .spec-row { display: flex; align-items: baseline; gap: 16px; border-bottom: 1px solid ${C.border}; padding: 10px 0; }
  .spec-row dt { width: 110px; flex: none; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: ${C.muted}; }
  .spec-row dd { font-size: 13px; color: ${C.ink}; }

  /* Back cover */
  .back { background: ${C.night}; color: #fff; }
  .back-inner { justify-content: space-between; }
  .back-title { font-size: 34px; font-weight: 700; line-height: 1.1; }
  .back-lede { margin-top: 14px; max-width: 48ch; font-size: 13px; line-height: 1.7; color: #ffffffbf; }
  .back-contact { margin-top: 26px; display: flex; flex-direction: column; gap: 16px; }
  .back-label { font-size: 8px; text-transform: uppercase; letter-spacing: 0.2em; color: #ffffff80; }
  .back-value { margin-top: 3px; font-size: 18px; font-weight: 700; color: ${C.amber}; }
  .back-foot { font-size: 8px; text-transform: uppercase; letter-spacing: 0.2em; color: #ffffff99; }
</style></head>
<body>${body.join("\n")}</body></html>`;
}

function findChrome() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  return candidates.find((p) => {
    try {
      execFileSync("test", ["-x", p]);
      return true;
    } catch {
      return false;
    }
  });
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(HTML_PATH, buildHtml());
console.log("HTML →", HTML_PATH);

const chrome = findChrome();
if (!chrome) {
  console.error("No Chrome/Chromium/Edge found — open the HTML and print to PDF manually.");
  process.exit(1);
}

execFileSync(chrome, [
  "--headless",
  "--no-sandbox",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${PDF_PATH}`,
  pathToFileURL(HTML_PATH).href,
]);
console.log("PDF  →", PDF_PATH);
