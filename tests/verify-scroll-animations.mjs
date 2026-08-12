import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const headerHtml = html.slice(html.indexOf("<header"), html.indexOf("</header>"));
const heroHtml = html.slice(html.indexOf('id="home"'), html.indexOf("</section>", html.indexOf('id="home"')));
const trainingOptionsHtml = html.slice(html.indexOf('id="training-options"'), html.indexOf('id="equipment"'));
const googleFloatingStart = html.indexOf('class="floating-google-review"');
const googleFloatingEnd = html.indexOf("</aside>", googleFloatingStart);
const googleFloatingFound = googleFloatingStart >= 0 && googleFloatingEnd > googleFloatingStart;
const googleFloatingHtml = html.slice(googleFloatingStart, googleFloatingEnd);
const persistentCtaMarker = html.indexOf("data-floating-training-cta");
const persistentCtaStart = persistentCtaMarker >= 0 ? html.lastIndexOf("<a", persistentCtaMarker) : -1;
const persistentCtaEnd = html.indexOf("</a>", persistentCtaStart);
const persistentCtaHtml = html.slice(persistentCtaStart, persistentCtaEnd);
const footerHtml = html.slice(html.indexOf("<footer"), html.indexOf("</footer>"));
const testimonialsHtml = html.slice(html.indexOf('id="testimonials"'), html.indexOf("marquee-track"));
const offeringsHtml = html.slice(html.indexOf('id="offerings"'), html.indexOf('id="coach"'));
const teamHtml = html.slice(html.indexOf('id="team"'), html.indexOf('id="coaching"'));
const coachingHtml = html.slice(html.indexOf('id="coaching"'), html.indexOf('id="open-gym"'));
const openGymHtml = html.slice(html.indexOf('id="open-gym"'), html.indexOf('id="coach"'));
const coachHtml = html.slice(html.indexOf('id="coach"'), html.indexOf('id="testimonials"'));
const coachText = coachHtml
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .replace(/\s+([.,])/g, "$1");
const coachProfileGridIndex = coachHtml.indexOf("coach-profile-grid");
const coachBridgeIndex = coachHtml.indexOf("coach-transition-header");
const coachSupportGridIndex = coachHtml.indexOf("coach-support-grid");
const coachBridgeHtml = coachBridgeIndex >= 0
  ? coachHtml.slice(coachBridgeIndex, coachHtml.indexOf("</div>", coachBridgeIndex))
  : "";
const testimonialSlideCount = (js.match(/quote: "/g) || []).length;
const marqueeHtml = html.slice(html.indexOf("marquee-track"), html.indexOf('id="contact"'));
const marqueeContentCount = (marqueeHtml.match(/class="marquee-content"/g) || []).length;
const loadedSource = `${html}\n${css}\n${js}`;
const fabricatedTestimonialPhrases = [
  "Technique cues are specific",
  "Programming, coaching, and open gym access can live",
  "Open gym still feels intentional here",
  "The attached therapy office adds useful access nearby",
];

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
  'href="#equipment"',
  'href="#offerings"',
  'href="#coach"',
  'href="#testimonials"',
  'href="#contact"',
];

const removedTargets = [
  'id="welcome"',
  'href="#welcome"',
];

const anchorIds = [
  "home",
  "training-options",
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
  ["Hero has three intentional paths", heroHtml.includes('href="#contact"') && heroHtml.includes("Start training") && heroHtml.includes('href="#equipment"') && heroHtml.includes("See the floor") && heroHtml.includes('href="#training-options"') && heroHtml.includes("Get started") && heroHtml.includes("Choose how you want to train.")],
  ["Hero action links use the compact tertiary CTA treatment", heroHtml.includes('href="#contact" class="hero-tertiary-link hero-action-link"') && heroHtml.includes('href="#equipment" class="hero-tertiary-link hero-action-link"') && !heroHtml.includes("rounded-full bg-white") && !heroHtml.includes("rounded-full bg-zinc-950/85")],
  ["Hero no longer contains Google Reviews", !heroHtml.includes("Google reviews") && !heroHtml.includes("hero-review-card") && !heroHtml.includes("google.com/search")],
  ["HTML has accurate Glendale and Phoenix-area hero body", heroHtml.includes("Olympic weightlifting in the Phoenix area") && heroHtml.includes("Atlas Barbell Club is a Glendale weightlifting gym serving athletes across the Phoenix area") && heroHtml.includes("bring your own plan")],
  ["Floating Google Reviews placeholder is truthful", googleFloatingFound && googleFloatingHtml.includes("Google Reviews") && googleFloatingHtml.includes("Reviews coming soon") && googleFloatingHtml.includes("./goolgelogo.svg") && !googleFloatingHtml.includes(">G<") && html.includes("TODO: Replace Google Reviews placeholder with verified production rating, review count, and business URL")],
  ["Floating Google Reviews has no fake public review data", googleFloatingFound && !googleFloatingHtml.includes("4.9") && !googleFloatingHtml.includes("27 Google Reviews") && !googleFloatingHtml.includes(String.fromCharCode(0x2605)) && !googleFloatingHtml.includes(String.fromCharCode(0x2606)) && !googleFloatingHtml.includes("data-rating") && !googleFloatingHtml.includes("data-review-count") && !googleFloatingHtml.includes("google.com/search")],
  ["No prohibited Google review integrations are loaded", !["places.googleapis.com", "maps.googleapis.com/maps/api/js", "GooglePlaces", "google.maps.places", "review-widget", "elfsight"].some((marker) => loadedSource.includes(marker))],
  ["HTML removes retired Welcome flow", removedTargets.every((target) => !html.includes(target)) && !html.includes("Welcome to Atlas") && !html.includes("welcome-editorial") && !html.includes("welcome-origin-note") && !html.includes("welcome-principles")],
  ["HTML has compact training selector after hero", trainingOptionsHtml.includes("Choose how you train") && trainingOptionsHtml.includes("Three ways to train at Atlas.") && trainingOptionsHtml.includes("training-selector") && html.indexOf('id="home"') < html.indexOf('id="training-options"') && html.indexOf('id="training-options"') < html.indexOf('id="equipment"')],
  ["Training selector links to all training options", trainingOptionsHtml.includes('href="#team"') && trainingOptionsHtml.includes("Team Programming") && trainingOptionsHtml.includes("Follow a shared weekly track.") && trainingOptionsHtml.includes('href="#coaching"') && trainingOptionsHtml.includes("Coaching") && trainingOptionsHtml.includes("Get a closer eye on the lift.") && trainingOptionsHtml.includes('href="#open-gym"') && trainingOptionsHtml.includes("Open Gym") && trainingOptionsHtml.includes("Bring your own plan.")],
  ["Training selector groups lane intro with equal-height flow buttons", trainingOptionsHtml.includes("training-selector-intro") && trainingOptionsHtml.includes("training-flow-button") && trainingOptionsHtml.includes("flow-arrow-left") && trainingOptionsHtml.includes("flow-arrow-right") && trainingOptionsHtml.includes("training-flow-orb") && css.includes(".training-selector-intro") && css.includes(".training-flow-button") && css.includes("height: 4.35rem") && css.includes(".training-flow-button:hover .flow-arrow-left") && css.includes(".training-flow-button:hover .flow-arrow-right") && css.includes(".training-flow-button:hover .training-flow-orb") && css.includes("border-radius: 100px")],
  ["HTML has updated platform card", html.includes("Built around Olympic weightlifting.") && html.includes("Platforms, bars, open floor space")],
  ["Header has new desktop nav targets", navTargets.every((target) => headerHtml.includes(target)) && !headerHtml.includes('href="#welcome"') && !headerHtml.includes(">Welcome<")],
  ["Header has mobile nav", headerHtml.includes("mobile-nav") && headerHtml.includes("<summary")],
  ["Header social links remain visible", headerHtml.includes("aria-label=\"Instagram\"") && headerHtml.includes("aria-label=\"Facebook\"")],
  ["Header CTA uses flow button and says Start Now", headerHtml.includes('href="#contact"') && headerHtml.includes("Start Now") && headerHtml.includes("training-flow-button header-flow-button") && !headerHtml.includes(">Trial<")],
  ["HTML follows new landing hierarchy", appearsInOrder(['id="home"', 'id="training-options"', 'id="equipment"', 'id="offerings"', 'id="team"', 'id="coaching"', 'id="open-gym"', 'id="coach"', 'id="testimonials"', 'id="contact"'])],
  ["HTML removes retired standalone anchors", !html.includes('id="training"') && !html.includes('id="visit"') && !html.includes('id="offers"') && !html.includes('id="technique-mobility"')],
  ["Equipment section shows actual floor intent", html.includes("What we have") && html.includes("A room set up for Olympic weightlifting") && html.includes("snatch, clean and jerk, squats, pulls")],
  ["Equipment section lists specific Atlas equipment without rehab or unverified plate brand", html.includes("Rogue Fitness rig") && html.includes("Maintained Olympic bars") && html.includes("standard strength bars") && html.includes("Plates are available in both pounds and kilograms") && html.includes("GHD machine") && html.includes("single cable machine") && html.includes("Bands, dumbbells, and kettlebells support warm-ups, accessory strength work, mobility work, and supplemental training.") && !html.includes("rehab-style") && !html.includes("Rogue and American plates")],
  ["Equipment section is photo-led and avoids visible uncertainty copy", html.includes("equipment-hero") && html.includes("equipment-list") && !html.includes("Inventory details to be confirmed") && !html.includes("Rack details to be confirmed") && !html.includes("Accessory and mobility inventory to be confirmed")],
  ["Equipment introduction uses visitor-facing facility copy", html.includes("Atlas keeps the room stocked for Olympic lifting") && !html.includes("this section should show visitors")],
  ["Equipment section mentions PT correctly", html.includes("A separate physical therapy practice") && html.includes("independently operated") && html.includes("not part of Atlas Barbell Club")],
  ["Offerings section includes three services", html.includes("Three ways to train at Atlas") && html.includes('id="team"') && html.includes('id="coaching"') && html.includes('id="open-gym"')],
  ["Team programming copy is present", html.includes("Atlas team programming provides a shared weekly structure") && html.includes("For competitive lifters") && html.includes("For developing lifters")],
  ["Coaching service copy is present", html.includes("Coaching when you want a closer look at the lift") && html.includes("Competition preparation")],
  ["Open gym supports online coaches and independent lifters", html.includes("outside coach or online coach") && html.includes("Your programming can still have a home at Atlas")],
  ["Open gym uses dedicated access icon set", openGymHtml.includes("./coachicon.svg") && openGymHtml.includes("./planicon.svg") && openGymHtml.includes("./opengym.svg") && !openGymHtml.includes("./stopwatchicon.svg")],
  ["Coach section has Coach Shen and qualifications", html.includes("Meet Coach Shen") && html.includes("COACH SHEN") && html.includes("USAW L1") && html.includes("OPEX CCP") && html.includes("Biomechanics RTS LV1") && html.includes("coaching since 2021") && html.includes("fitness industry since 2018")],
  ["Coach section removes medical promise copy", !html.includes("pain free") && !html.includes("holistic healing") && !html.includes("longetivity")],
  ["Coach section frames technique as Shen's teaching process", coachText.includes("Technique and positions") && coachText.includes("Teach the position. Then teach the athlete to use it.") && coachText.includes("Coach Shen teaches the Olympic lifts by breaking down the positions, timing, and movement patterns") && coachText.includes("The goal is to give the athlete a position they understand and can reproduce")],
  ["Coach Shen section avoids male pronouns", !/\b(he|him|his)\b/i.test(coachText)],
  ["Coach technique cards are specific to her decisions", coachText.includes("Create access to the position.") && coachText.includes("Coach Shen addresses that limitation as part of the training session") && coachText.includes("Use drills to solve what she sees.") && coachText.includes("Technical variations are selected around the problem in front of her")],
  ["Coach technique process uses Position Practice Apply", coachText.includes("01 Position") && coachText.includes("Find the position the athlete needs.") && coachText.includes("02 Practice") && coachText.includes("Give the athlete opportunities to repeat it.") && coachText.includes("03 Apply") && coachText.includes("Bring it back into the full lift.")],
  ["Coach section uses training approach language", coachText.includes("Training approach") && coachText.includes("Why Atlas uses a Chinese-influenced approach.") && !coachText.includes("Training influences") && !coachText.includes("Three lenses. One Atlas approach.")],
  ["Training methodology uses country flag assets", coachHtml.includes("./bulgarianflag.svg") && coachHtml.includes("./americanflag.svg") && coachHtml.includes("./chineseflag.svg") && css.includes(".lifting-method-flag")],
  ["Technique and mobility use custom movement icons", coachHtml.includes("./clean.svg") && coachHtml.includes("./snatch.svg") && coachHtml.includes("./squat.svg") && coachHtml.includes("./jerk.svg")],
  ["Training approach distinguishes comparison systems from Atlas method", coachText.includes("Bulgarian approach") && coachText.includes("Heavy, specific, and high intensity.") && coachText.includes("American approaches") && coachText.includes("More varied and periodized.") && coachText.includes("Chinese-influenced approach") && coachText.includes("Technique, positions, mobility, and supporting strength.") && coachText.includes("ATLAS METHOD")],
  ["Coach Shen application block resolves the method", coachText.includes("How Coach Shen applies it") && coachText.includes("Chinese-influenced technique, adapted to the athlete.") && coachText.includes("Coach Shen uses Chinese-influenced principles as the foundation of her coaching") && coachText.includes("Repeatable technical positions.") && coachText.includes("Mobility that supports the lifts.") && coachText.includes("Accessory work chosen for a purpose.") && coachText.includes("Strength developed around the demands of weightlifting.")],
  ["Method cards reveal details accessibly across desktop and mobile", css.includes(".lifting-method-card:hover .lifting-method-drawer") && css.includes(".lifting-method-card:focus .lifting-method-drawer") && css.includes(".lifting-method-card:focus-within .lifting-method-drawer") && css.includes(".lifting-method-card:focus-visible") && css.includes("outline: 2px solid") && css.includes("grid-template-rows: 0fr") && css.includes("grid-template-rows: 1fr") && css.includes("@media (max-width: 1023px)") && css.includes(".lifting-method-drawer") && css.includes("transform: none")],
  ["Testimonials section uses member story language", testimonialsHtml.includes("testimonial-editorial") && testimonialsHtml.includes("Atlas Barbell Club member testimonial carousel") && testimonialsHtml.includes("Member stories") && testimonialsHtml.includes("What lifters say about training at Atlas.") && testimonialsHtml.includes("Testimonial controls") && !testimonialsHtml.includes(">Reviews<") && !testimonialsHtml.includes("Review controls")],
  ["Testimonials carousel has five placeholder member stories", testimonialSlideCount === 5 && testimonialsHtml.includes("data-testimonial-dots") && testimonialsHtml.includes("01 / 05") && js.includes("Replace placeholder testimonial content with verified quotes") && (js.includes("Placeholder member story") || js.includes("Verified member story coming soon")) && !fabricatedTestimonialPhrases.some((phrase) => js.includes(phrase) || testimonialsHtml.includes(phrase))],
  ["Testimonials carousel has generated controls and vanilla JS state", html.includes("Previous testimonial") && html.includes("Next testimonial") && js.includes("Show testimonial") && html.includes("data-testimonial-prev") && html.includes("data-testimonial-next") && js.includes("document.createElement(\"button\")") && js.includes("dataset.testimonialDot") && js.includes("changeSlide")],
  ["Header labels testimonials as lifters", headerHtml.includes('href="#testimonials"') && headerHtml.includes(">Lifters<") && !headerHtml.includes(">Reviews<")],
  ["Header navigation highlights active sections", headerHtml.includes("data-nav-link") && css.includes('[data-nav-link].is-active') && css.includes('aria-current="true"') && js.includes("setActiveNavLink") && js.includes("navObserver") && js.includes('link.setAttribute("aria-current", "true")')],
  ["Training paths are grouped in order", offeringsHtml.includes("Team Programming") && offeringsHtml.includes("Coaching") && offeringsHtml.includes("Open Gym") && offeringsHtml.indexOf("Team Programming") < offeringsHtml.indexOf("Coaching") && offeringsHtml.indexOf("Coaching") < offeringsHtml.indexOf("Open Gym")],
  ["Training paths have contextual contact CTAs", teamHtml.includes('href="#contact"') && teamHtml.includes('data-training-interest="team"') && teamHtml.includes("Start Team Programming") && teamHtml.includes("Ask about joining the Atlas training track.") && coachingHtml.includes('href="#contact"') && coachingHtml.includes('data-training-interest="coaching"') && coachingHtml.includes("Ask About Coaching") && coachingHtml.includes("Tell us what you want help with.") && openGymHtml.includes('href="#contact"') && openGymHtml.includes('data-training-interest="open-gym"') && openGymHtml.includes("Start Open Gym") && openGymHtml.includes("Ask about access and getting started.")],
  ["Coach section keeps Shen group labels", coachHtml.includes("Qualifications") && coachHtml.includes("Coaching Philosophy") && coachHtml.includes("Technique and positions") && coachHtml.includes("Training approach")],
  ["Coach section has transition bridge before technique support", coachProfileGridIndex >= 0 && coachBridgeIndex > coachProfileGridIndex && coachSupportGridIndex > coachBridgeIndex && coachBridgeHtml.includes("MEET COACH SHEN") && coachBridgeHtml.includes("How the approach shows up in training.") && coachBridgeHtml.includes("data-reveal") && !coachBridgeHtml.includes("<h2") && css.includes(".coach-transition-header") && css.includes(".coach-transition-line")],
  ["Contact section merges hours, contact, and map", html.includes("final-contact-panel") && html.includes("Start training") && html.includes("Monday-Friday") && html.includes("By appointment") && html.includes("Google Maps location for Atlas Barbell Club") && html.includes("17437 N 71st Dr Ste 103") && html.includes("Glendale, AZ 85308")],
  ["Contact section uses compact isolated footer-panel layout", css.includes(".contact-section") && css.includes("isolation: isolate") && css.includes("padding-block: clamp(1.4rem, 3.5vw, 3.25rem)") && css.includes("min-height: clamp(15rem, 30svh, 20rem)")],
  ["Contact section avoids white-on-yellow and cramped mobile cards", css.includes(".final-contact-panel .section-kicker") && css.includes("color: #f7d64a") && css.includes("background: #f7d64a") && css.includes("grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr))") && css.includes("grid-template-columns: 1fr !important")],
  ["Footer has required identity and links", footerHtml.includes("2026 Atlas Barbell Club") && footerHtml.includes("Olympic Weightlifting in Glendale, Arizona") && footerHtml.includes("Instagram") && footerHtml.includes("Facebook") && footerHtml.includes("Contact")],
  ["Footer avoids decorative middle-dot separators", !footerHtml.includes("\u00B7") && footerHtml.includes("Olympic Weightlifting in Glendale, Arizona")],
  ["HTML removes placeholder photo service", !html.includes("picsum.photos")],
  ["HTML has no unfinished stock copy", !html.includes("when finalized") && !html.includes("To be announced")],
  ["HTML has continuous marquee row", marqueeContentCount >= 4],
  ["HTML loads GSAP and ScrollTrigger", html.includes("gsap.min.js") && html.includes("ScrollTrigger.min.js")],
  ["HTML uses all current Atlas visual assets", ["./mainlandingpageimage.webp", "./firstcardimage.webp", "./secondcardimage.webp", "./thirdcardimage.webp", "./hero-card-generated-v1.png", "./platformlogo.svg", "./coachicon.svg", "./planicon.svg", "./opengym.svg", "./clean.svg", "./snatch.svg", "./squat.svg", "./jerk.svg", "./dumbellicon.svg"].every((asset) => html.includes(asset))],
  ["CSS defines new hierarchy sections", css.includes(".training-options-section") && css.includes(".equipment-section") && css.includes(".offerings-section") && css.includes(".testimonials-section") && css.includes(".contact-section")],
  ["CSS defines mobile nav", css.includes(".mobile-nav") && css.includes(".mobile-nav-panel")],
  ["CSS defines section typography without negative tracking", css.includes(".section-heading") && css.includes("letter-spacing: 0")],
  ["Offerings section uses stacked training paths", html.includes("training-path-stack") && html.includes("training-path-team") && html.includes("training-path-coaching") && html.includes("training-path-open-gym")],
  ["CSS defines equipment and path cleanup", css.includes(".equipment-hero") && css.includes(".equipment-list") && css.includes(".training-path-stack") && css.includes(".training-path")],
  ["CSS removes obsolete Open Gym layout rules", ![".open-gym-shell", ".open-gym-copy", ".open-gym-media", ".open-gym-media-stage", ".open-gym-photo-frame", ".open-gym-photo-core", ".open-gym-statement-card", ".open-gym-headline", ".open-gym-heading", ".open-gym-eyebrow", ".open-gym-body"].some((selector) => css.includes(selector))],
  ["CSS defines coach profile, technique, and method architecture", css.includes(".coach-profile-section") && css.includes(".technique-gallery-section") && css.includes(".lifting-method-section")],
  ["CSS defines quieter coach, review carousel, and final contact systems", css.includes(".coach-support-grid") && css.includes(".testimonial-editorial") && css.includes(".final-contact-panel")],
  ["CSS defines conversion selector and floating CTA systems", css.includes(".training-options-section") && css.includes(".training-selector") && css.includes(".training-path-cta") && css.includes(".floating-training-cta") && css.includes(".floating-training-cta.is-visible")],
  ["CSS removes retired Welcome-only systems", ![".welcome-grid", ".welcome-copy", ".welcome-editorial", ".welcome-origin-note", ".welcome-principles"].some((selector) => css.includes(selector))],
  ["CSS respects responsive collapse", css.includes("@media (max-width: 1023px)") && css.includes(".training-selector") && css.includes("@media (max-width: 640px)")],
  ["CSS defines reveal states", css.includes("[data-reveal]") && css.includes(".is-visible")],
  ["HTML marks every major section as anchor-safe", anchorIds.every((id) => html.includes(`id="${id}"`) && html.includes(`id="${id}" class="`) && html.slice(html.indexOf(`id="${id}"`), html.indexOf(">", html.indexOf(`id="${id}"`))).includes("anchor-section"))],
  ["CSS adds scroll margin for anchored sections", css.includes(".anchor-section") && css.includes("scroll-margin-top")],
  ["CSS keeps no-JS content visible", css.includes("[data-reveal]") && css.includes("opacity: 1") && css.includes(".js-enabled [data-reveal]")],
  ["JS reveals hash targets on load and hashchange", js.includes("revealHashTarget") && js.includes("window.location.hash") && js.includes("hashchange")],
  ["JS documents placeholder testimonials and closes mobile nav", js.includes("Replace placeholder testimonial content with verified quotes") && js.includes("mobileNav.open = false")],
  ["JS smoothly scrolls nav clicks below the fixed header", js.includes("alignHashTarget") && js.includes('document.querySelector(".atlas-topline")') && js.includes("header.getBoundingClientRect().height") && js.includes('document.addEventListener("click"') && js.includes("event.preventDefault()") && js.includes("window.history.pushState") && js.includes('window.scrollTo({ top: targetTop, behavior })') && js.includes('"smooth"')],
  ["Persistent Start Training CTA exists", persistentCtaStart >= 0 && persistentCtaHtml.includes('href="#contact"') && persistentCtaHtml.includes("Start Training") && persistentCtaHtml.includes("Find your next step") && persistentCtaHtml.includes("aria-label")],
  ["Persistent Start Training CTA observes hero and contact", js.includes("floatingTrainingCta") && js.includes("heroVisible") && js.includes("contactVisible") && js.includes("shouldShow = !heroVisible && !contactVisible") && js.includes('document.getElementById("home")') && js.includes('document.getElementById("contact")') && js.includes("IntersectionObserver")],
  ["CSS fully disables reduced-motion transitions and interaction transforms", (() => {
    const reducedMotionCss = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    return reducedMotionCss.includes("*::before")
      && reducedMotionCss.includes("animation: none !important")
      && reducedMotionCss.includes("transition: none !important")
      && reducedMotionCss.includes(".google-review-card:hover")
      && reducedMotionCss.includes(".coach-photo-card:hover .coach-photo")
      && reducedMotionCss.includes(".training-flow-button:hover");
  })()],
  ["CSS marquee is continuous linear", css.includes("linear infinite") && css.includes("translateX(-25%)")],
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
