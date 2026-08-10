import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

const checks = [
  ["HTML has scroll reveal targets", html.includes("data-reveal")],
  ["HTML loads the scroll animation script", html.includes("./src/main.js")],
  ["CSS defines reveal base state", css.includes("[data-reveal]")],
  ["CSS defines revealed state", css.includes(".is-visible")],
  ["CSS respects reduced motion", css.includes("prefers-reduced-motion")],
];

const failed = checks.filter(([, passed]) => !passed);

if (failed.length > 0) {
  for (const [label] of failed) {
    console.error(`FAIL: ${label}`);
  }
  process.exit(1);
}

console.log("Scroll animation checks passed.");
