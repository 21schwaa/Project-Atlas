import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(root, "public");

const files = [
  "index.html",
  "atlasbarbellnowords.svg",
  "platformlogo.svg",
  "coachicon.svg",
  "planicon.svg",
  "stopwatchicon.svg",
  "leaficon.svg",
  "stretchicon.svg",
  "bullseyeicon.svg",
  "charticon.svg",
  "dumbellicon.svg",
  "teamicon.svg",
  "mainlandingpageimage.webp",
  "firstcardimage.webp",
  "secondcardimage.webp",
  "thirdcardimage.webp",
  "hero-card-generated-v1.png",
];

const directories = [
  "dist",
  "src",
  "assets",
];

mkdirSync(publicDir, { recursive: true });

for (const entry of readdirSync(publicDir)) {
  rmSync(join(publicDir, entry), {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 100,
  });
}

for (const file of files) {
  const source = join(root, file);
  if (!existsSync(source)) {
    throw new Error(`Missing deploy asset: ${file}`);
  }
  cpSync(source, join(publicDir, file));
}

for (const directory of directories) {
  const source = join(root, directory);
  if (!existsSync(source)) {
    throw new Error(`Missing deploy directory: ${directory}`);
  }
  cpSync(source, join(publicDir, directory), { recursive: true });
}

console.log("DigitalOcean static build prepared in public/");
