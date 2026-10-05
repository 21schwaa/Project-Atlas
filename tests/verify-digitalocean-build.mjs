import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(root, "public");
const indexPath = join(publicDir, "index.html");

const requiredPaths = [
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "dist/styles.css",
  "src/main.js",
  "goolgelogo.svg",
  "atlasbarbellnowords.svg",
  "platformlogo.svg",
  "coachicon.svg",
  "planicon.svg",
  "stopwatchicon.svg",
  "charticon.svg",
  "dumbellicon.svg",
  "teamicon.svg",
  "mainlandingpageimage.webp",
  "firstcardimage.webp",
  "secondcardimage.webp",
  "thirdcardimage.webp",
  "hero-card-generated-v1.png",
];

const failures = [];

for (const path of requiredPaths) {
  const fullPath = join(publicDir, path);
  if (!existsSync(fullPath)) {
    failures.push(`Missing public/${path}`);
  } else if (statSync(fullPath).size === 0) {
    failures.push(`Empty public/${path}`);
  }
}

if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, "utf8");
  const requiredReferences = [
    "./dist/styles.css",
    "./src/main.js",
    "./goolgelogo.svg",
    "./platformlogo.svg",
    "./coachicon.svg",
    "./planicon.svg",
    "./stopwatchicon.svg",
    "./charticon.svg",
    "./dumbellicon.svg",
    "./teamicon.svg",
  ];

  for (const reference of requiredReferences) {
    if (!html.includes(reference)) {
      failures.push(`public/index.html does not reference ${reference}`);
    }
  }

  if (!html.includes('<link rel="canonical" href="https://atlasbarbellclub.com/" />')) {
    failures.push("public/index.html is missing the production canonical URL");
  }
  if (!html.includes('<meta property="og:url" content="https://atlasbarbellclub.com/" />')) {
    failures.push("public/index.html is missing the production Open Graph URL");
  }
  if (!/<title>[^<]*Atlas Barbell Club[^<]*<\/title>/i.test(html)) {
    failures.push("public/index.html title does not identify Atlas Barbell Club");
  }
  if (!html.includes('<meta property="og:site_name" content="Atlas Barbell Club" />')) {
    failures.push("public/index.html is missing the Atlas Barbell Club Open Graph site name");
  }
  if (!html.includes('content="https://atlasbarbellclub.com/mainlandingpageimage.webp"')) {
    failures.push("public/index.html is missing the absolute production social image URL");
  }
  if (/\bnoindex\b/i.test(html)) {
    failures.push("public/index.html contains a noindex directive");
  }
  if (/\bnofollow\b/i.test(html)) {
    failures.push("public/index.html contains a nofollow directive");
  }
  const csp = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"\s*\/?>/i)?.[1];
  for (const directive of [
    "default-src 'self'",
    "script-src 'self' https://cdnjs.cloudflare.com",
    "frame-src https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]) {
    if (!csp?.includes(directive)) failures.push(`public/index.html CSP is missing: ${directive}`);
  }
  if (csp?.includes("frame-ancestors")) {
    failures.push("public/index.html puts ineffective frame-ancestors in a meta CSP");
  }
  const imagesWithoutDimensions = Array.from(html.matchAll(/<img\b[^>]*>/gi), (match) => match[0])
    .filter((image) => !/\bwidth="[1-9][0-9]*"/i.test(image) || !/\bheight="[1-9][0-9]*"/i.test(image));
  if (imagesWithoutDimensions.length > 0) {
    failures.push(`public/index.html has ${imagesWithoutDimensions.length} image(s) without explicit dimensions`);
  }
  if (!html.includes('data-equipment-carousel') || !html.includes('src="./assets/atlasimages/gym%20(3).webp"')) {
    failures.push("public/index.html is missing the training floor photo carousel");
  }
  if (html.includes('class="equipment-side-strip"') || html.includes('class="equipment-gallery"')) {
    failures.push("public/index.html still contains the equipment collage");
  }
  if (html.includes("instagram.com/kilobarbellclub") || html.includes("instagram.com/atlasbarbellclub/") || !html.includes("https://www.instagram.com/atlasbarbellclubllc/")) {
    failures.push("public/index.html does not use the verified Atlas Instagram account");
  }
  if (!html.includes('src="https://www.google.com/maps?q=Atlas%20Barbell%20Club%2C%20Glendale%2C%20AZ&output=embed"') || !html.includes('href="https://www.google.com/maps/search/?api=1&query=Atlas%20Barbell%20Club%2C%20Glendale%2C%20AZ"') || html.includes("maps?q=17437") || html.includes("query=17437")) {
    failures.push("public/index.html does not use the Atlas business name for Google Maps");
  }

  const jsonLdBlocks = Array.from(html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi));
  const structuredEntities = [];
  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (Array.isArray(item?.["@graph"])) structuredEntities.push(...item["@graph"]);
        else structuredEntities.push(item);
      }
    } catch {
      failures.push("public/index.html contains invalid JSON-LD");
    }
  }
  const atlasBusiness = structuredEntities.find((entry) => {
    const types = Array.isArray(entry?.["@type"]) ? entry["@type"] : [entry?.["@type"]];
    return types.includes("SportsActivityLocation") && entry?.name === "Atlas Barbell Club";
  });
  if (!atlasBusiness || atlasBusiness.url !== "https://atlasbarbellclub.com/") {
    failures.push("public/index.html is missing Atlas SportsActivityLocation JSON-LD");
  } else {
    if (!Array.isArray(atlasBusiness.sameAs) || !atlasBusiness.sameAs.includes("https://share.google/ATi5f1iM6d3ljoALV")) {
      failures.push("Atlas JSON-LD does not include the verified Google Business profile");
    }
    for (const unverifiedField of ["aggregateRating", "openingHours", "openingHoursSpecification", "priceRange"]) {
      if (unverifiedField in atlasBusiness) failures.push(`Atlas JSON-LD includes unverified ${unverifiedField}`);
    }
  }
  const websiteEntities = structuredEntities.filter((entry) => {
    const types = Array.isArray(entry?.["@type"]) ? entry["@type"] : [entry?.["@type"]];
    return types.includes("WebSite");
  });
  if (websiteEntities.length !== 1) {
    failures.push(`public/index.html must contain exactly one WebSite entity (found ${websiteEntities.length})`);
  } else {
    const website = websiteEntities[0];
    if (website.name !== "Atlas Barbell Club") failures.push("public WebSite name must be Atlas Barbell Club");
    if (website.alternateName !== "Atlas Barbell") failures.push("public WebSite alternateName must be Atlas Barbell");
    if (website.url !== "https://atlasbarbellclub.com/") failures.push("public WebSite URL must be the production homepage");
  }
}

const robotsPath = join(publicDir, "robots.txt");
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, "utf8");
  if (!/^User-agent:\s*\*$/im.test(robots) || !/^Allow:\s*\/$/im.test(robots)) {
    failures.push("public/robots.txt does not allow crawling");
  }
  if (!/^Sitemap:\s*https:\/\/atlasbarbellclub\.com\/sitemap\.xml$/im.test(robots)) {
    failures.push("public/robots.txt does not advertise the production sitemap");
  }
  if (/^Disallow:/im.test(robots)) failures.push("public/robots.txt contains a crawl block");
}

const sitemapPath = join(publicDir, "sitemap.xml");
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, "utf8");
  if (!sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') || !sitemap.includes("<loc>https://atlasbarbellclub.com/</loc>")) {
    failures.push("public/sitemap.xml does not contain the production homepage");
  }
}

const assetReferencePattern = /\.\/([a-z0-9][a-z0-9._/-]*\.(?:svg|png|webp|jpe?g|gif|avif))/gi;
const referencedAssets = new Set();

for (const sourcePath of ["index.html", "src/main.js"]) {
  const fullSourcePath = join(publicDir, sourcePath);
  if (!existsSync(fullSourcePath)) continue;
  const source = readFileSync(fullSourcePath, "utf8");
  for (const match of source.matchAll(assetReferencePattern)) referencedAssets.add(match[1]);
}

for (const assetPath of referencedAssets) {
  const fullAssetPath = join(publicDir, assetPath);
  if (!existsSync(fullAssetPath)) {
    failures.push(`Missing referenced public/${assetPath}`);
  } else if (statSync(fullAssetPath).size === 0) {
    failures.push(`Empty referenced public/${assetPath}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exit(1);
}

console.log("DigitalOcean build checks passed.");
