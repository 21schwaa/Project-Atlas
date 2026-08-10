import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(root, "public");
const indexPath = join(publicDir, "index.html");

const requiredPaths = [
  "index.html",
  "dist/styles.css",
  "src/main.js",
  "atlasbarbellnowords.svg",
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
    "./mainlandingpageimage.webp",
    "./hero-card-generated-v1.png",
  ];

  for (const reference of requiredReferences) {
    if (!html.includes(reference)) {
      failures.push(`public/index.html does not reference ${reference}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exit(1);
}

console.log("DigitalOcean build checks passed.");
