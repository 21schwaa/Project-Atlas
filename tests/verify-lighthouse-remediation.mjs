import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, "index.html"), "utf8");
const failures = [];

if (!/<title>[^<]*Atlas Barbell Club[^<]*<\/title>/i.test(html)) {
  failures.push("index.html title does not identify Atlas Barbell Club");
}
if (!html.includes('<meta property="og:site_name" content="Atlas Barbell Club" />')) {
  failures.push("index.html is missing the Atlas Barbell Club Open Graph site name");
}
if (!html.includes('<meta property="og:url" content="https://atlasbarbellclub.com/" />')) {
  failures.push("index.html is missing the production Open Graph URL");
}
if (!html.includes('<link rel="canonical" href="https://atlasbarbellclub.com/" />')) {
  failures.push("index.html is missing the production canonical URL");
}

const structuredEntities = [];
for (const block of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
  try {
    const data = JSON.parse(block[1]);
    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
      if (Array.isArray(item?.["@graph"])) structuredEntities.push(...item["@graph"]);
      else structuredEntities.push(item);
    }
  } catch {
    failures.push("index.html contains invalid JSON-LD");
  }
}

const websiteEntities = structuredEntities.filter((entry) => {
  const types = Array.isArray(entry?.["@type"]) ? entry["@type"] : [entry?.["@type"]];
  return types.includes("WebSite");
});
if (websiteEntities.length !== 1) {
  failures.push(`index.html must contain exactly one WebSite entity (found ${websiteEntities.length})`);
} else {
  const website = websiteEntities[0];
  if (website.name !== "Atlas Barbell Club") failures.push("WebSite name must be Atlas Barbell Club");
  if (website.alternateName !== "Atlas Barbell") failures.push("WebSite alternateName must be Atlas Barbell");
  if (website.url !== "https://atlasbarbellclub.com/") failures.push("WebSite URL must be the production homepage");
}

const gymEntities = structuredEntities.filter((entry) => {
  const types = Array.isArray(entry?.["@type"]) ? entry["@type"] : [entry?.["@type"]];
  return types.includes("SportsActivityLocation");
});
if (gymEntities.length !== 1 || gymEntities[0].name !== "Atlas Barbell Club") {
  failures.push("index.html must preserve the Atlas Barbell Club SportsActivityLocation entity");
}

const headerBrand = html.match(/<nav\b[^>]*class="[^"]*atlas-topline[^"]*"[\s\S]*?<\/nav>/i)?.[0] || "";
const primaryHeading = html.match(/<h1\b[\s\S]*?<\/h1>/i)?.[0] || "";
if (!headerBrand.includes("Atlas Barbell Club")) failures.push("visible header branding is missing Atlas Barbell Club");
if (!primaryHeading || /Kilo Barbell Club/i.test(primaryHeading)) failures.push("primary H1 branding conflicts with Atlas Barbell Club");

const csp = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"\s*\/?>/i)?.[1];
for (const directive of [
  "default-src 'self'",
  "script-src 'self' https://cdnjs.cloudflare.com",
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
]) {
  if (!csp?.includes(directive)) failures.push(`index.html CSP is missing: ${directive}`);
}
if (csp?.includes("frame-ancestors")) failures.push("frame-ancestors is ineffective in a meta-delivered CSP");

const equipmentStrip = html.match(/<div\b[^>]*class="[^"]*\bequipment-side-strip\b[^"]*"[^>]*>/i)?.[0];
if (!equipmentStrip) {
  failures.push("index.html is missing the equipment side strip");
} else if (/\baria-(?:label|labelledby)\s*=/i.test(equipmentStrip)) {
  failures.push("equipment-side-strip has a prohibited accessible-name attribute");
}

const imageElements = Array.from(html.matchAll(/<img\b[^>]*>/gi), (match) => match[0]);
if (imageElements.length === 0) failures.push("index.html contains no image elements");

for (const image of imageElements) {
  const source = image.match(/\bsrc="([^"]+)"/i)?.[1] || "unknown image";
  const width = Number(image.match(/\bwidth="([0-9]+)"/i)?.[1]);
  const height = Number(image.match(/\bheight="([0-9]+)"/i)?.[1]);
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    failures.push(`${source} is missing positive integer width and height attributes`);
  }
}

const svgRequirements = {
  "teamicon.svg": { viewBox: "0 0 302.55069 227.48407", maxBytes: 348_891 },
  "platformlogo.svg": { viewBox: "0 0 133.32056 132.34734", maxBytes: 324_077 },
  "stopwatchicon.svg": { viewBox: "0 0 162.31342 197.50305", maxBytes: 258_876 },
  "clean.svg": { viewBox: "0 0 103.40235 102.77289", maxBytes: 201_951 },
  "opengym.svg": { viewBox: "0 0 192.98302 193.54576", maxBytes: 192_789 },
  "snatch.svg": { viewBox: "0 0 125.04612 120.83425", maxBytes: 191_928 },
  "squat.svg": { viewBox: "0 0 110.06628 110.0363", maxBytes: 161_196 },
  "planicon.svg": { viewBox: "0 0 122.06868 185.68492", maxBytes: 127_012 },
  "jerk.svg": { viewBox: "0 0 102.72478 139.88411", maxBytes: 129_755 },
};

for (const [file, requirement] of Object.entries(svgRequirements)) {
  const path = join(root, file);
  const source = readFileSync(path, "utf8");
  const viewBox = source.match(/\bviewBox="([^"]+)"/i)?.[1];
  if (!/^<svg\b|<svg\b/i.test(source.trim().replace(/^<\?xml[^>]*>\s*/i, "").replace(/^<!--.*?-->\s*/s, ""))) {
    failures.push(`${file} is not an SVG document`);
  }
  if (viewBox !== requirement.viewBox) failures.push(`${file} changed viewBox (${viewBox || "missing"})`);
  if (/<image\b/i.test(source)) failures.push(`${file} contains embedded raster content`);
  if (/<(?:metadata|sodipodi:namedview)\b|\b(?:inkscape|sodipodi):/i.test(source)) {
    failures.push(`${file} retains editor-only metadata`);
  }
  const bytes = statSync(path).size;
  if (bytes > requirement.maxBytes) failures.push(`${file} is ${bytes} bytes (budget ${requirement.maxBytes})`);
}

if (failures.length > 0) {
  failures.forEach((failure) => console.error(`FAIL: ${failure}`));
  process.exit(1);
}

assert.ok(imageElements.length > 0);
console.log("Lighthouse remediation checks passed.");
