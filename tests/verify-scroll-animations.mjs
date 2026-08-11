import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const headerHtml = html.slice(html.indexOf("<header"), html.indexOf("</header>"));
const footerHtml = html.slice(html.indexOf("<footer"), html.indexOf("</footer>"));
const testimonialsHtml = html.slice(html.indexOf('id="testimonials"'), html.indexOf("marquee-track"));
const testimonialSlideCount = (js.match(/quote: "/g) || []).length;

const appearsInOrder = (needles) => {
  let lastIndex = -1;

  for (const needle of needles) {
    const index = html.indexOf(needle);

    if (index === -1 || index <= lastIndex) {
      return false;
    }

    lastIndex = index;
  }

  return true;
};

const navTargets = [
  'href="#welcome"',
  'href="#equipment"',
  'href="#offerings"',
  'href="#coach"',
  'href="#testimonials"',
  'href="#contact"',
];

const anchorIds = [
  "home",
  "welcome",
  "equipment",
  "offerings",
  "team",
  "coaching",
  "open-gym",
  "coach",
  "testimonials",
  "contact",
];

const checks = [
  ["HTML has scroll reveal targets", html.includes("data-reveal")],
  ["HTML loads the scroll animation script", html.includes("./src/main.js")],
  ["HTML loads local interaction script without module-only file restrictions", html.includes('src="./src/main.js" defer') && !html.includes('type="module" src="./src/main.js"')],
  ["HTML keeps fixed hero rail outside section clipping", html.indexOf("class=\"hero-rail\"") < html.indexOf("<main id=\"main\"")],
  ["HTML keeps reference-style hero", html.includes('id="home"') && html.includes("hero-reference-stage") && html.includes("hero-photo-bezel")],
  ["HTML has anti-guesswork hero message", html.includes("Olympic weightlifting without the guesswork")],
  ["HTML has updated hero body", html.includes("Atlas Barbell Club is a Phoenix gym centered on Olympic") && html.includes("bring your own plan")],
  ["HTML has simplified hero actions", html.includes("Start training") && html.includes("See the floor") && !html.includes("Get started")],
  ["HTML uses welcome editorial selector", html.includes("welcome-editorial") && html.includes("training-selector") && !html.includes("welcome-bento")],
  ["CSS defines welcome cleanup system", css.includes(".welcome-editorial") && css.includes(".training-selector")],
  ["CSS preserves subtle hero review scale on hover", css.includes(".hero-review-card-subtle:hover") && css.includes("scale(0.92) translateY(-2px)")],
  ["HTML has updated platform card", html.includes("Built around Olympic weightlifting.") && html.includes("Platforms, bars, open floor space")],
  ["HTML keeps hero Google review highlight", html.includes("hero-review-card") && html.includes("Google reviews")],
  ["Header has new desktop nav targets", navTargets.every((target) => headerHtml.includes(target))],
  ["Header has mobile nav", headerHtml.includes("mobile-nav") && headerHtml.includes("<summary")],
  ["Header social links remain visible", headerHtml.includes("aria-label=\"Instagram\"") && headerHtml.includes("aria-label=\"Facebook\"")],
  ["Header trial CTA points to contact", headerHtml.includes('href="#contact"') && headerHtml.includes("Trial")],
  ["HTML follows new landing hierarchy", appearsInOrder(['id="home"', 'id="welcome"', 'id="equipment"', 'id="offerings"', 'id="team"', 'id="coaching"', 'id="open-gym"', 'id="coach"', 'id="testimonials"', 'id="contact"'])],
  ["HTML removes retired standalone anchors", !html.includes('id="training"') && !html.includes('id="visit"') && !html.includes('id="offers"') && !html.includes('id="technique-mobility"')],
  ["Welcome section has editorial origin copy", html.includes("Welcome to Atlas") && html.includes("Built for Phoenix weightlifters.") && html.includes("space") && html.includes("centered specifically on the way they train")],
  ["Welcome section has calm training selector", html.includes("Choose how Atlas fits your training") && html.includes('href="#team"') && html.includes('href="#coaching"') && html.includes('href="#open-gym"')],
  ["Equipment section shows actual floor intent", html.includes("What we have") && html.includes("A room set up for Olympic weightlifting") && html.includes("snatch, clean and jerk, squats, pulls")],
  ["Equipment section is photo-led and avoids visible uncertainty copy", html.includes("equipment-hero") && html.includes("equipment-list") && !html.includes("Inventory details to be confirmed") && !html.includes("Rack details to be confirmed") && !html.includes("Accessory and mobility inventory to be confirmed")],
  ["Equipment introduction uses visitor-facing facility copy", html.includes("Atlas is a dedicated place to train the competition lifts") && !html.includes("this section should show visitors")],
  ["Equipment section mentions PT correctly", html.includes("A separate physical therapy practice") && html.includes("independently operated") && html.includes("not part of Atlas Barbell Club")],
  ["Offerings section includes three services", html.includes("Three ways to train at Atlas") && html.includes('id="team"') && html.includes('id="coaching"') && html.includes('id="open-gym"')],
  ["Team programming copy is present", html.includes("Atlas team programming provides a shared weekly structure") && html.includes("For competitive lifters") && html.includes("For developing lifters")],
  ["Coaching service copy is present", html.includes("Coaching when you want a closer look at the lift") && html.includes("Competition preparation")],
  ["Open gym supports online coaches and independent lifters", html.includes("outside coach or online coach") && html.includes("Your programming can still have a home at Atlas")],
  ["Open gym keeps custom icon set", html.includes("./coachicon.svg") && html.includes("./planicon.svg") && html.includes("./stopwatchicon.svg")],
  ["Coach section has Coach Shen and qualifications", html.includes("Meet Coach Shen") && html.includes("COACH SHEN") && html.includes("USAW L1") && html.includes("OPEX CCP") && html.includes("Biomechanics RTS LV1") && html.includes("coaching since 2021") && html.includes("fitness industry since 2018")],
  ["Coach section removes medical promise copy", !html.includes("pain free") && !html.includes("holistic healing") && !html.includes("longetivity")],
  ["Coach section includes technique and mobility", html.includes("Technique and positions") && html.includes("Build positions you can repeat") && html.includes("front rack") && html.toLowerCase().includes("overhead stability")],
  ["Coach section includes training methodology", html.includes("Training influences") && html.includes("Bulgarian-influenced training") && html.includes("American approaches") && html.includes("Chinese-influenced training")],
  ["Methodology uses careful Atlas position", html.includes("Atlas is primarily Chinese-influenced") && !html.includes("We use the Chinese method.") && !html.includes("raw intensity")],
  ["Testimonials section uses editorial carousel with no Google link", testimonialsHtml.includes("testimonial-editorial") && testimonialsHtml.includes("data-testimonial-carousel") && testimonialsHtml.includes("What lifters notice in the room.") && !testimonialsHtml.includes("Google Reviews") && !testimonialsHtml.includes("google.com")],
  ["Testimonials carousel has five review entries", testimonialSlideCount === 5 && testimonialsHtml.includes("data-testimonial-dots") && testimonialsHtml.includes("01 / 05")],
  ["Testimonials carousel has generated controls and vanilla JS state", html.includes("data-testimonial-prev") && html.includes("data-testimonial-next") && js.includes("document.createElement(\"button\")") && js.includes("dataset.testimonialDot") && js.includes("changeSlide")],
  ["Contact section merges hours, contact, and map", html.includes("final-contact-panel") && html.includes("Start training") && html.includes("Monday-Friday") && html.includes("By appointment") && html.includes("Google Maps location for Atlas Barbell Club")],
  ["Contact section uses compact isolated footer-panel layout", css.includes(".contact-section") && css.includes("isolation: isolate") && css.includes("padding-block: clamp(1.4rem, 3.5vw, 3.25rem)") && css.includes("min-height: clamp(15rem, 30svh, 20rem)")],
  ["Footer has required identity and links", footerHtml.includes("2026 Atlas Barbell Club") && footerHtml.includes("Olympic Weightlifting") && footerHtml.includes("Phoenix, Arizona") && footerHtml.includes("Instagram") && footerHtml.includes("Facebook") && footerHtml.includes("Contact")],
  ["Footer avoids decorative middle-dot separators", !footerHtml.includes("\u00B7") && footerHtml.includes("Olympic Weightlifting") && footerHtml.includes("Phoenix, Arizona")],
  ["HTML removes placeholder photo service", !html.includes("picsum.photos")],
  ["HTML has no unfinished stock copy", !html.includes("when finalized") && !html.includes("To be announced")],
  ["HTML has continuous marquee row", html.includes("marquee-content")],
  ["HTML loads GSAP and ScrollTrigger", html.includes("gsap.min.js") && html.includes("ScrollTrigger.min.js")],
  ["HTML uses all current Atlas visual assets", ["./mainlandingpageimage.webp", "./firstcardimage.webp", "./secondcardimage.webp", "./thirdcardimage.webp", "./hero-card-generated-v1.png", "./platformlogo.svg", "./coachicon.svg", "./planicon.svg", "./stopwatchicon.svg", "./leaficon.svg", "./stretchicon.svg", "./bullseyeicon.svg", "./charticon.svg", "./dumbellicon.svg"].every((asset) => html.includes(asset))],
  ["CSS defines new hierarchy sections", css.includes(".welcome-section") && css.includes(".equipment-section") && css.includes(".offerings-section") && css.includes(".testimonials-section") && css.includes(".contact-section")],
  ["CSS defines mobile nav", css.includes(".mobile-nav") && css.includes(".mobile-nav-panel")],
  ["CSS defines section typography without negative tracking", css.includes(".section-heading") && css.includes("letter-spacing: 0")],
  ["Offerings section uses stacked training paths", html.includes("training-path-stack") && html.includes("training-path-team") && html.includes("training-path-coaching") && html.includes("training-path-open-gym")],
  ["CSS defines equipment and path cleanup", css.includes(".equipment-hero") && css.includes(".equipment-list") && css.includes(".training-path-stack") && css.includes(".training-path")],
  ["CSS removes obsolete Open Gym layout rules", ![".open-gym-shell", ".open-gym-copy", ".open-gym-media", ".open-gym-media-stage", ".open-gym-photo-frame", ".open-gym-photo-core", ".open-gym-statement-card", ".open-gym-headline", ".open-gym-heading", ".open-gym-eyebrow", ".open-gym-body"].some((selector) => css.includes(selector))],
  ["CSS defines coach profile, technique, and method architecture", css.includes(".coach-profile-section") && css.includes(".technique-gallery-section") && css.includes(".lifting-method-section")],
  ["CSS defines quieter coach, review carousel, and final contact systems", css.includes(".coach-support-grid") && css.includes(".testimonial-editorial") && css.includes(".final-contact-panel")],
  ["CSS respects responsive collapse", css.includes("@media (max-width: 1023px)") && css.includes(".welcome-grid") && css.includes("@media (max-width: 640px)")],
  ["CSS defines reveal states", css.includes("[data-reveal]") && css.includes(".is-visible")],
  ["HTML marks every major section as anchor-safe", anchorIds.every((id) => html.includes(`id="${id}"`) && html.includes(`id="${id}" class="`) && html.slice(html.indexOf(`id="${id}"`), html.indexOf(">", html.indexOf(`id="${id}"`))).includes("anchor-section"))],
  ["CSS adds scroll margin for anchored sections", css.includes(".anchor-section") && css.includes("scroll-margin-top")],
  ["CSS keeps no-JS content visible", css.includes("[data-reveal]") && css.includes("opacity: 1") && css.includes(".js-enabled [data-reveal]")],
  ["JS reveals hash targets on load and hashchange", js.includes("revealHashTarget") && js.includes("window.location.hash") && js.includes("hashchange")],
  ["JS smoothly scrolls nav clicks below the fixed header", js.includes("alignHashTarget") && js.includes('document.querySelector(".atlas-topline")') && js.includes("header.getBoundingClientRect().height") && js.includes('document.addEventListener("click"') && js.includes("event.preventDefault()") && js.includes("window.history.pushState") && js.includes('window.scrollTo({ top: targetTop, behavior })') && js.includes('"smooth"')],
  ["CSS fully disables reduced-motion transitions and interaction transforms", (() => {
    const reducedMotionCss = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    return reducedMotionCss.includes("*::before")
      && reducedMotionCss.includes("animation: none !important")
      && reducedMotionCss.includes("transition: none !important")
      && reducedMotionCss.includes(".google-review-card:hover")
      && reducedMotionCss.includes(".coach-photo-card:hover .coach-photo")
      && reducedMotionCss.includes(".training-selector a:hover");
  })()],
  ["CSS marquee is continuous linear", css.includes("linear infinite") && css.includes("translateX(-50%)")],
  ["JS registers ScrollTrigger when GSAP exists", js.includes("ScrollTrigger")],
  ["JS supports scroll image hooks", js.includes("[data-scroll-image]")],
];

const failed = checks.filter(([, passed]) => !passed);

if (failed.length > 0) {
  for (const [label] of failed) {
    console.error(`FAIL: ${label}`);
  }
  process.exit(1);
}

console.log("Landing hierarchy checks passed.");
