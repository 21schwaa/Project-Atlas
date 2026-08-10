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
  ["HTML uses hero image fit class", html.includes("hero-card-image")],
  ["HTML uses non-clipping hero heading", html.includes("hero-headline")],
  ["HTML has choose-your-lane section", html.includes("Choose your training lane")],
  ["HTML has coached open gym language", html.includes("Coached open gym")],
  ["HTML has athlete-focused fit messaging", html.includes("Athlete-focused")],
  ["HTML emphasizes technique", html.includes("Technique work")],
  ["HTML emphasizes mobility", html.includes("Mobility")],
  ["HTML mentions overhead and front rack positions", html.includes("overhead") && html.includes("front rack")],
  ["HTML has fixed Google review highlight", html.includes("google-review-float") && html.includes("Google reviews")],
  ["HTML links to Google reviews", html.includes("Atlas+Barbell+Club+Phoenix+AZ+reviews")],
  ["HTML removes placeholder photo service", !html.includes("picsum.photos")],
  ["HTML removes placeholder bio copy", !html.includes("This section is built")],
  ["HTML removes temporary hours copy", !html.includes("To be announced")],
  ["HTML has local proof strip", html.includes("proof-strip")],
  ["HTML has premium lane cards", html.includes("training-lane-card")],
  ["HTML uses machined panel treatment", html.includes("machined-panel")],
  ["HTML has favicon", html.includes("rel=\"icon\"")],
  ["HTML has social preview metadata", html.includes("og:title") && html.includes("twitter:card")],
  ["HTML avoids unfinished contact copy", !html.includes("when finalized") && !html.includes("being set")],
  ["HTML has continuous marquee row", html.includes("marquee-content")],
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
  ["HTML embeds Google Maps location", html.includes("Google Maps location for Atlas Barbell Club") && html.includes("output=embed")],
  ["HTML has map directions link", html.includes("Location map") && html.includes("maps/search/?api=1")],
  ["HTML uses centered page shell", html.includes("page-shell")],
  ["HTML uses responsive section rhythm", html.includes("section-rhythm")],
  ["HTML has asset slots for future uploads", html.includes("data-asset-slot")],
  ["HTML uses uploaded main landing image", html.includes("mainlandingpageimage.webp")],
  ["HTML uses uploaded first card image", html.includes("firstcardimage.webp")],
  ["HTML uses uploaded second card image", html.includes("secondcardimage.webp")],
  ["HTML uses uploaded third card image", html.includes("thirdcardimage.webp")],
  ["HTML uses generated hero card image", html.includes("hero-card-generated-v1.png")],
  ["HTML uses inline css.gg arrow icon", html.includes("cssgg-arrow-svg")],
  ["HTML uses inline css.gg Instagram icon", html.includes("cssgg-instagram-svg")],
  ["HTML uses inline css.gg Facebook icon", html.includes("cssgg-facebook-svg")],
  ["HTML adds social links", html.includes("aria-label=\"Instagram\"") && html.includes("aria-label=\"Facebook\"")],
  ["Header contains social links", headerHtml.includes("aria-label=\"Instagram\"") && headerHtml.includes("aria-label=\"Facebook\"")],
  ["Footer does not duplicate social links", !footerHtml.includes("aria-label=\"Instagram\"") && !footerHtml.includes("aria-label=\"Facebook\"")],
  ["Arrow icons use explicit contrast classes", html.includes("text-white") && html.includes("text-zinc-950")],
  ["CSS defines page shell", css.includes(".page-shell")],
  ["CSS defines responsive media shell", css.includes(".responsive-media-shell")],
  ["CSS defines machined panel texture", css.includes(".machined-panel")],
  ["CSS defines Google review float", css.includes(".google-review-float") && css.includes(".google-review-card")],
  ["CSS defines map frame", css.includes(".map-frame") && css.includes(".map-caption")],
  ["CSS defines reveal base state", css.includes("[data-reveal]")],
  ["CSS defines revealed state", css.includes(".is-visible")],
  ["CSS respects reduced motion", css.includes("prefers-reduced-motion")],
  ["CSS uses custom motion curve", css.includes("cubic-bezier(0.32,0.72,0,1)")],
  ["CSS marquee is continuous linear", css.includes("linear infinite") && css.includes("translateX(-50%)")],
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
