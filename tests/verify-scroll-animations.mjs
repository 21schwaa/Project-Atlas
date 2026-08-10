import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const headerHtml = html.slice(html.indexOf("<header"), html.indexOf("</header>"));
const footerHtml = html.slice(html.indexOf("<footer"), html.indexOf("</footer>"));

const checks = [
  ["HTML has scroll reveal targets", html.includes("data-reveal")],
  ["HTML loads the scroll animation script", html.includes("./src/main.js")],
  ["HTML speaks to Olympic weightlifting", html.includes("Olympic weightlifting")],
  ["HTML has anti-guesswork hero message", html.includes("without the guesswork")],
  ["HTML has choose-your-lane section", html.includes("Choose your training lane")],
  ["HTML has coached open gym language", html.includes("Coached open gym")],
  ["HTML has athlete-focused fit messaging", html.includes("Athlete-focused")],
  ["HTML removes old powerlifting card", !html.includes("Powerlifting")],
  ["HTML removes old strength basics card", !html.includes("Strength Basics")],
  ["HTML loads GSAP", html.includes("gsap.min.js")],
  ["HTML loads ScrollTrigger", html.includes("ScrollTrigger.min.js")],
  ["HTML has dense bento grid", html.includes("grid-flow-dense")],
  ["HTML has scroll image hooks", html.includes("data-scroll-image")],
  ["HTML has scrub text hooks", html.includes("data-scrub-word")],
  ["HTML has coach profile section", html.includes("Meet the coach")],
  ["HTML promotes team programming", html.includes("Team programming")],
  ["HTML presents open gym option", html.includes("Open gym")],
  ["HTML supports lifters with online coaches", html.includes("online coach")],
  ["HTML supports independent training", html.includes("train on your own")],
  ["HTML explains what the gym offers", html.includes("What the gym offers")],
  ["HTML mentions physical therapy office access", html.includes("physical therapy office")],
  ["HTML clarifies PT office is not associated", html.includes("not formally associated with Atlas")],
  ["HTML mentions therapist is an active gym member", html.includes("active gym member")],
  ["HTML has hours and contact section", html.includes("Hours and contact")],
  ["HTML lists gym hours", html.includes("Gym hours")],
  ["HTML lists contact email", html.includes("hello@atlasbarbellclub.com")],
  ["HTML uses centered page shell", html.includes("page-shell")],
  ["HTML uses responsive section rhythm", html.includes("section-rhythm")],
  ["HTML has asset slots for future uploads", html.includes("data-asset-slot")],
  ["HTML uses uploaded main landing image", html.includes("mainlandingpageimage.webp")],
  ["HTML uses uploaded first card image", html.includes("firstcardimage.webp")],
  ["HTML uses uploaded second card image", html.includes("secondcardimage.webp")],
  ["HTML uses uploaded third card image", html.includes("thirdcardimage.webp")],
  ["HTML uses css.gg arrow icon", html.includes("icon-arrow-right")],
  ["HTML uses css.gg Instagram icon", html.includes("icon-instagram")],
  ["HTML uses css.gg Facebook icon", html.includes("icon-facebook")],
  ["HTML adds social links", html.includes("aria-label=\"Instagram\"") && html.includes("aria-label=\"Facebook\"")],
  ["Header contains social links", headerHtml.includes("aria-label=\"Instagram\"") && headerHtml.includes("aria-label=\"Facebook\"")],
  ["Footer does not duplicate social links", !footerHtml.includes("aria-label=\"Instagram\"") && !footerHtml.includes("aria-label=\"Facebook\"")],
  ["Arrow icons use explicit contrast classes", html.includes("icon-arrow-light") && html.includes("icon-arrow-dark")],
  ["CSS defines page shell", css.includes(".page-shell")],
  ["CSS defines css.gg mask icons", css.includes("cssgg-arrow-right.svg")],
  ["CSS defines responsive media shell", css.includes(".responsive-media-shell")],
  ["CSS defines reveal base state", css.includes("[data-reveal]")],
  ["CSS defines revealed state", css.includes(".is-visible")],
  ["CSS respects reduced motion", css.includes("prefers-reduced-motion")],
  ["CSS uses custom motion curve", css.includes("cubic-bezier(0.32,0.72,0,1)")],
  ["JS registers ScrollTrigger when GSAP exists", js.includes("ScrollTrigger")],
];

const failed = checks.filter(([, passed]) => !passed);

if (failed.length > 0) {
  for (const [label] of failed) {
    console.error(`FAIL: ${label}`);
  }
  process.exit(1);
}

console.log("Scroll animation checks passed.");
