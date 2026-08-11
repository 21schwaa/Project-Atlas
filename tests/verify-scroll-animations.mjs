import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const headerHtml = html.slice(html.indexOf("<header"), html.indexOf("</header>"));
const footerHtml = html.slice(html.indexOf("<footer"), html.indexOf("</footer>"));

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

const checks = [
  ["HTML has scroll reveal targets", html.includes("data-reveal")],
  ["HTML loads the scroll animation script", html.includes("./src/main.js")],
  ["HTML keeps fixed hero rail outside section clipping", html.indexOf("class=\"hero-rail\"") < html.indexOf("<main id=\"main\"")],
  ["HTML keeps reference-style hero", html.includes('id="home"') && html.includes("hero-reference-stage") && html.includes("hero-photo-bezel")],
  ["HTML has anti-guesswork hero message", html.includes("Olympic weightlifting without the guesswork")],
  ["HTML has updated hero body", html.includes("Atlas Barbell Club is a Phoenix gym centered on Olympic") && html.includes("bring your own plan")],
  ["HTML has three hero actions", html.includes('href="#contact"') && html.includes('href="#equipment"') && html.includes('href="#welcome"') && html.includes("Get started")],
  ["HTML has updated platform card", html.includes("Built around Olympic weightlifting.") && html.includes("Platforms, bars, open floor space")],
  ["HTML keeps hero Google review highlight", html.includes("hero-review-card") && html.includes("Google reviews")],
  ["Header has new desktop nav targets", navTargets.every((target) => headerHtml.includes(target))],
  ["Header has mobile nav", headerHtml.includes("mobile-nav") && headerHtml.includes("<summary")],
  ["Header social links remain visible", headerHtml.includes("aria-label=\"Instagram\"") && headerHtml.includes("aria-label=\"Facebook\"")],
  ["Header trial CTA points to contact", headerHtml.includes('href="#contact"') && headerHtml.includes("Trial")],
  ["HTML follows new landing hierarchy", appearsInOrder(['id="home"', 'id="welcome"', 'id="equipment"', 'id="offerings"', 'id="team"', 'id="coaching"', 'id="open-gym"', 'id="coach"', 'id="testimonials"', 'id="contact"'])],
  ["HTML removes retired standalone anchors", !html.includes('id="training"') && !html.includes('id="visit"') && !html.includes('id="offers"') && !html.includes('id="technique-mobility"')],
  ["Welcome section has required story copy", html.includes("Welcome to Atlas") && html.includes("How Atlas started") && html.includes("space centered specifically on the way they train")],
  ["Welcome section keeps founder TODO", html.includes("TODO: Replace with verified Atlas founder story")],
  ["Welcome section has offer quick links", html.includes("Choose how you want Atlas involved") && html.includes("Team Programming") && html.includes("Get a closer eye on the details") && html.includes("Bring your own plan.")],
  ["Equipment section shows actual floor intent", html.includes("What we have") && html.includes("A room set up for Olympic weightlifting") && html.includes("snatch, clean and jerk, squats, pulls")],
  ["Equipment section avoids fabricated inventory", html.includes("TODO: Add verified plate inventory") && html.includes("TODO: Add verified rack count") && html.includes("TODO: Add verified accessory")],
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
  ["Testimonials section uses placeholders only", html.includes("Member stories") && html.includes("Member testimonial will appear here") && html.includes("TODO: Replace with verified member testimonial")],
  ["Contact section merges hours, contact, and map", html.includes("Start training") && html.includes("Want to see if Atlas fits your training") && html.includes("Monday-Friday") && html.includes("By appointment") && html.includes("Google Maps location for Atlas Barbell Club")],
  ["Footer has required identity and links", footerHtml.includes("2026 Atlas Barbell Club") && footerHtml.includes("Olympic Weightlifting") && footerHtml.includes("Phoenix, Arizona") && footerHtml.includes("Instagram") && footerHtml.includes("Facebook") && footerHtml.includes("Contact")],
  ["HTML removes placeholder photo service", !html.includes("picsum.photos")],
  ["HTML has no unfinished stock copy", !html.includes("when finalized") && !html.includes("To be announced")],
  ["HTML has continuous marquee row", html.includes("marquee-content")],
  ["HTML loads GSAP and ScrollTrigger", html.includes("gsap.min.js") && html.includes("ScrollTrigger.min.js")],
  ["HTML uses all current Atlas visual assets", ["./mainlandingpageimage.webp", "./firstcardimage.webp", "./secondcardimage.webp", "./thirdcardimage.webp", "./hero-card-generated-v1.png", "./platformlogo.svg", "./teamicon.svg", "./coachicon.svg", "./planicon.svg", "./stopwatchicon.svg", "./leaficon.svg", "./stretchicon.svg", "./bullseyeicon.svg", "./charticon.svg", "./dumbellicon.svg"].every((asset) => html.includes(asset))],
  ["CSS defines new hierarchy sections", css.includes(".welcome-section") && css.includes(".equipment-section") && css.includes(".offerings-section") && css.includes(".testimonials-section") && css.includes(".contact-section")],
  ["CSS defines mobile nav", css.includes(".mobile-nav") && css.includes(".mobile-nav-panel")],
  ["CSS defines section typography without negative tracking", css.includes(".section-heading") && css.includes("letter-spacing: 0")],
  ["CSS defines equipment gallery and inventory", css.includes(".equipment-gallery") && css.includes(".equipment-inventory")],
  ["CSS defines service architecture", css.includes(".service-block") && css.includes(".service-info-card") && css.includes(".coaching-focus-grid")],
  ["CSS keeps open gym visual architecture", css.includes(".open-gym-section") && css.includes(".open-gym-photo-frame::before") && css.includes(".open-gym-statement-card::after")],
  ["CSS defines coach profile, technique, and method architecture", css.includes(".coach-profile-section") && css.includes(".technique-gallery-section") && css.includes(".lifting-method-section")],
  ["CSS defines testimonials and contact", css.includes(".testimonial-grid") && css.includes(".contact-layout") && css.includes(".contact-map-card")],
  ["CSS respects responsive collapse", css.includes("@media (max-width: 1023px)") && css.includes(".welcome-grid") && css.includes("@media (max-width: 640px)")],
  ["CSS defines reveal states", css.includes("[data-reveal]") && css.includes(".is-visible")],
  ["CSS respects reduced motion", css.includes("prefers-reduced-motion")],
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
