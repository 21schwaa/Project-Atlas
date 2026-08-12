# Atlas Hierarchy Polish and Google Reviews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the approved Atlas landing page hierarchy with accurate Glendale/Phoenix-area language, a truthful floating Google Reviews placeholder, clearer testimonial terminology, softened training-method copy, and mobile navigation close behavior.

**Architecture:** This remains a static one-page HTML site with Tailwind v4 source CSS, compiled CSS in `dist/styles.css`, and one vanilla JS entry file. Most work is content and markup in `index.html`, visual styling in `src/styles.css`, small behavior in `src/main.js`, and contract coverage in `tests/verify-scroll-animations.mjs`.

**Tech Stack:** Static HTML, Tailwind CSS v4 via `@tailwindcss/cli`, vanilla JavaScript, GSAP and ScrollTrigger from CDN, CSS.gg icons, existing local Atlas image and SVG assets.

## Global Constraints

- Do not redesign the website from scratch.
- Do not rearrange major sections.
- Preserve anchors: `#home`, `#welcome`, `#equipment`, `#offerings`, `#team`, `#coaching`, `#open-gym`, `#coach`, `#testimonials`, `#contact`.
- Keep What We Offer hierarchy: Team Programming, Coaching, Open Gym.
- Keep Meet Coach Shen grouping: Qualifications, Coaching Philosophy, Technique and Positions, Training Influences.
- Do not fake Google rating, stars, review count, quotes, or Google score.
- Do not link Google Reviews placeholder to an irrelevant Google search while no verified production review URL exists.
- Do not invent founder story, founding year, founder biography, equipment brand details, Google review data, or member testimonials.
- Do not add Google Places JS, Maps review API, external review widget SDK, or a new npm review package.
- Keep the existing dark Atlas identity, amber accent, custom assets, and current overall hierarchy.
- Use `apply_patch` for manual file edits.
- Verify with `npm test`, `npm run build`, `npm run build:digitalocean`, and `npm run verify:digitalocean`.

---

## File Structure

- Modify `tests/verify-scroll-animations.mjs`: update the page contract before implementation so the old hero Google Reviews and Reviews labels fail.
- Modify `index.html`: update hero actions, remove hero Google Reviews, add floating Google Reviews placeholder, update copy/location/equipment/method/testimonial labels.
- Modify `src/styles.css`: add fixed floating Google Reviews styling and remove hero-review reduced-motion references if no longer used.
- Modify `src/main.js`: add testimonial TODO comment, rename dot labels, close mobile nav after valid anchor selection.
- Regenerate `dist/styles.css`: produced by `npm run build`.
- Regenerate `public/`: produced by `npm run build:digitalocean`, but do not commit generated `public/` unless already tracked.

---

### Task 1: Update Verification Contract First

**Files:**
- Modify: `tests/verify-scroll-animations.mjs`

**Interfaces:**
- Consumes: existing `html`, `css`, `js`, `headerHtml`, `footerHtml`, `testimonialsHtml`, `anchorIds`, and `checks`.
- Produces: failing assertions for the approved polish contract.

- [ ] **Step 1: Add focused constants near the current top-level constants**

Insert after `marqueeContentCount`:

```js
const heroHtml = html.slice(html.indexOf('id="home"'), html.indexOf('id="welcome"'));
const googleFloatingHtml = html.slice(
  html.indexOf("floating-google-review"),
  html.indexOf('id="welcome"'),
);
```

- [ ] **Step 2: Replace stale hero Google assertions**

Remove checks that require `.hero-review-card` or hero Google review content.

Add:

```js
["Hero has three intentional paths", heroHtml.includes('href="#contact"') && heroHtml.includes("Start training") && heroHtml.includes('href="#equipment"') && heroHtml.includes("See the floor") && heroHtml.includes('href="#welcome"') && heroHtml.includes("Get started") && heroHtml.includes("Learn what Atlas is about.")],
["Hero no longer contains Google Reviews", !heroHtml.includes("Google reviews") && !heroHtml.includes("hero-review-card") && !heroHtml.includes("google.com/search")],
["Floating Google Reviews placeholder is truthful", html.includes("floating-google-review") && html.includes("Google Reviews") && html.includes("Reviews coming soon") && html.includes("TODO: Replace Google Reviews placeholder with verified production rating, review count, and business URL")],
["Floating Google Reviews has no fake public review data", !googleFloatingHtml.includes("4.9") && !googleFloatingHtml.includes("27 Google Reviews") && !googleFloatingHtml.includes("rating") && !googleFloatingHtml.includes("stars") && !googleFloatingHtml.includes("google.com/search")],
```

- [ ] **Step 3: Update location, equipment, testimonial, and methodology checks**

Replace current Phoenix-specific checks with:

```js
["HTML has accurate Glendale and Phoenix-area hero body", html.includes("Olympic weightlifting in the Phoenix area") && html.includes("Atlas Barbell Club is a Glendale weightlifting gym serving athletes across the Phoenix area") && html.includes("bring your own plan")],
["Welcome section has non-fabricated origin placeholder", html.includes("Welcome to Atlas") && html.includes("Built for Glendale and Phoenix-area weightlifters.") && html.includes("TODO: Replace with verified Atlas founder/origin story") && html.includes("centered specifically on the way they train")],
["Equipment section lists specific Atlas equipment without rehab or unverified plate brand", html.includes("Rogue Fitness rig") && html.includes("Maintained Olympic bars") && html.includes("standard strength bars") && html.includes("Plates are available in both pounds and kilograms") && html.includes("GHD machine") && html.includes("single cable machine") && html.includes("Bands, dumbbells, and kettlebells support warm-ups, accessory strength work, mobility work, and supplemental training.") && !html.includes("rehab-style") && !html.includes("Rogue and American plates")],
["Methodology uses softened Atlas approach", html.includes("Three lenses. One Atlas approach.") && html.includes("Atlas approach") && html.includes("Often associated with frequent heavy practice and high specificity.") && html.includes("Often associated with planned training blocks and broader exercise variation.") && html.includes("Technical choices can be adjusted around individual proportions and positions.") && html.includes("Technical positions you can repeat.") && !html.includes("Atlas bias")],
["Technique proof copy is educational rather than absolute", html.includes("Mobility can help athletes access the positions required by the lifts.") && html.includes("Technical repetitions give athletes more opportunities to practice a position consistently.") && html.includes("Repeatable positions make it easier to evaluate what changes as speed or load increases.") && !html.includes("Quality reps build long-term strength.") && !html.includes("Training transfers when positions are repeatable.")],
["Testimonials section uses member story language", testimonialsHtml.includes("testimonial-editorial") && testimonialsHtml.includes("Atlas Barbell Club member testimonial carousel") && testimonialsHtml.includes("Member stories") && testimonialsHtml.includes("What lifters say about training at Atlas.") && testimonialsHtml.includes("Testimonial controls") && !testimonialsHtml.includes(">Reviews<") && !testimonialsHtml.includes("Review controls")],
["Header labels direct testimonials as lifters", headerHtml.includes('href="#testimonials"') && headerHtml.includes(">Lifters<") && !headerHtml.includes(">Reviews<")],
["Footer uses Glendale identity", footerHtml.includes("2026 Atlas Barbell Club") && footerHtml.includes("Olympic Weightlifting in Glendale, Arizona") && footerHtml.includes("Instagram") && footerHtml.includes("Facebook") && footerHtml.includes("Contact")],
["JS documents placeholder testimonials and closes mobile nav", js.includes("Replace placeholder testimonial content with verified quotes") && js.includes("mobileNav.open = false")],
```

- [ ] **Step 4: Update testimonial control checks**

Change existing carousel control assertion to require testimonial labels:

```js
["Testimonials carousel has generated controls and vanilla JS state", html.includes("data-testimonial-prev") && html.includes("data-testimonial-next") && html.includes("Previous testimonial") && html.includes("Next testimonial") && js.includes("document.createElement(\"button\")") && js.includes("Show testimonial") && js.includes("dataset.testimonialDot") && js.includes("changeSlide")],
```

- [ ] **Step 5: Run test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL on the new polish checks because implementation has not happened yet.

- [ ] **Step 6: Commit only if this task is implemented separately**

If using independent task commits:

```bash
git add tests/verify-scroll-animations.mjs
git commit -m "Update polish verification contract"
```

---

### Task 2: Hero, Google Reviews Placeholder, Location, Equipment, Testimonials, and Method Copy

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing approved section order, anchors, imagery, and current CSS classes.
- Produces: updated markup and copy that satisfies the Task 1 HTML contract.

- [ ] **Step 1: Update meta and navigation labels**

In `<head>`, update descriptions:

```html
<meta
  name="description"
  content="Atlas Barbell Club is a Glendale Olympic weightlifting gym serving the Phoenix area with team programming, coaching, open gym training, and technique-focused lifting."
/>
<meta
  property="og:description"
  content="Olympic weightlifting in Glendale and the Phoenix area: team programming, coaching, open gym, technique work, and a floor built around the snatch and clean and jerk."
/>
```

Change desktop and mobile nav link text for `#testimonials` from `Reviews` to `Lifters`.

- [ ] **Step 2: Update hero location, body, and CTA cluster**

Change the hero eyebrow to:

```html
Olympic weightlifting in the Phoenix area
```

Change the hero body to:

```html
Atlas Barbell Club is a Glendale weightlifting gym serving athletes
across the Phoenix area. Train with Atlas programming, work directly
with a coach, or bring your own plan and use a space built around the
snatch and clean and jerk.
```

Remove the hero Google Reviews `<a class="google-review-card hero-review-card hero-review-card-subtle" ...>...</a>`.

After the two existing hero CTA anchors, add a lighter tertiary link inside the same CTA wrapper:

```html
<a
  href="#welcome"
  class="hero-tertiary-link"
>
  <span>Get started</span>
  <small>Learn what Atlas is about.</small>
  <i class="gg-arrow-right" aria-hidden="true"></i>
</a>
```

- [ ] **Step 3: Add floating Google Reviews placeholder after the header**

Place this immediately after `</header>` and before `<main>`:

```html
<!-- TODO: Replace Google Reviews placeholder with verified production rating, review count, and business URL -->
<aside
  class="floating-google-review"
  aria-label="Google Reviews placeholder for Atlas Barbell Club"
>
  <span class="floating-google-review-mark" aria-hidden="true">G</span>
  <span>
    <strong>Google Reviews</strong>
    <span>Reviews coming soon</span>
  </span>
</aside>
```

- [ ] **Step 4: Update Welcome location and founder placeholder**

Change the welcome body copy to start:

```html
Atlas Barbell Club is a Glendale training space serving weightlifters
across the Phoenix area, centered on the way Olympic lifting is trained.
```

Change the origin heading to:

```html
<h3>Built for Glendale and Phoenix-area weightlifters.</h3>
```

Add the founder TODO comment immediately before the origin paragraph:

```html
<!-- TODO: Replace with verified Atlas founder/origin story -->
```

Change the origin paragraph to:

```html
Atlas was created to give Olympic weightlifters in Glendale and the
Phoenix area a space centered specifically on the way they train.
```

- [ ] **Step 5: Update equipment copy**

Change Plates article copy to:

```html
<article><h3>Plates</h3><p>Plates are available in both pounds and kilograms for Olympic lifting and strength work.</p></article>
```

Change Accessories article copy to:

```html
<article><h3>Accessories</h3><p>Bands, dumbbells, and kettlebells support warm-ups, accessory strength work, mobility work, and supplemental training.</p></article>
```

- [ ] **Step 6: Update technique proof strip copy**

Replace the three proof `strong` strings:

```html
<strong>Mobility can help athletes access the positions required by the lifts.</strong>
<strong>Technical repetitions give athletes more opportunities to practice a position consistently.</strong>
<strong>Repeatable positions make it easier to evaluate what changes as speed or load increases.</strong>
```

- [ ] **Step 7: Update training influence copy**

Change method heading:

```html
<h3 id="method-heading">Three lenses. One Atlas approach.</h3>
```

Bulgarian card:

```html
<p class="lifting-method-summary">
  Often associated with frequent heavy practice and high specificity.
</p>
<li>Heavy classical lifts may appear frequently.</li>
<li>Exercise selection is often relatively narrow in the best-known versions of the system.</li>
<li>Frequent high-intensity exposure can place substantial demands on recovery.</li>
```

American card:

```html
<p class="lifting-method-summary">
  Often associated with planned training blocks and broader exercise variation.
</p>
<li>Loading changes across longer cycles.</li>
<li>Volume and intensity are commonly adjusted across a training cycle.</li>
<li>Strength work supports the lifts.</li>
```

Chinese card third bullet:

```html
<li>Technical choices can be adjusted around individual proportions and positions.</li>
```

Atlas choice block:

```html
<p>Atlas approach</p>
<h4>Chinese-influenced technique, adapted to the athlete.</h4>
...
<p>
  Atlas is primarily influenced by the technical detail, positional work,
  mobility, and accessory training commonly associated with Chinese
  weightlifting systems. Those ideas are adapted around the athlete's
  experience, proportions, goals, and training needs rather than copied as a
  single fixed model.
</p>
```

Choice list:

```html
<li>Technical positions you can repeat.</li>
<li>Mobility where the lift requires it.</li>
<li>Drills chosen for a specific purpose.</li>
<li>Strength work that supports the lifts.</li>
```

- [ ] **Step 8: Update testimonial visible and aria language**

Change section carousel attributes and labels:

```html
aria-label="Atlas Barbell Club member testimonial carousel"
...
<p class="section-kicker">Member stories</p>
<h2 class="testimonial-editorial-heading">What lifters say about training at Atlas.</h2>
...
<div class="testimonial-editorial-controls" aria-label="Testimonial controls">
...
<button type="button" data-testimonial-prev aria-label="Previous testimonial">
...
<button type="button" data-testimonial-next aria-label="Next testimonial">
```

- [ ] **Step 9: Update footer location**

Change:

```html
<span>Olympic Weightlifting in Glendale, Arizona</span>
```

- [ ] **Step 10: Run tests**

Run:

```bash
npm test
```

Expected: Some tests may still fail because CSS and JS are not updated yet. Failures should be limited to styles and mobile-nav behavior.

---

### Task 3: CSS for Tertiary Hero Link and Floating Google Reviews

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.hero-tertiary-link`, `.floating-google-review`, `.floating-google-review-mark`.
- Produces: compact responsive styling and reduced-motion cleanup.

- [ ] **Step 1: Add hero tertiary link styles inside `@layer components` near hero review/card styles**

Add:

```css
  .hero-tertiary-link {
    position: relative;
    display: inline-grid;
    grid-template-columns: auto auto;
    align-items: center;
    gap: 0.35rem 0.8rem;
    width: fit-content;
    padding: 0.35rem 0;
    color: rgba(244, 242, 237, 0.82);
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.16em;
    line-height: 1;
    text-transform: uppercase;
    transition:
      color 700ms cubic-bezier(0.32,0.72,0,1),
      transform 700ms cubic-bezier(0.32,0.72,0,1);
  }

  .hero-tertiary-link::after {
    content: "";
    position: absolute;
    left: 0;
    right: 1.85rem;
    bottom: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(245, 201, 40, 0.78), transparent);
    transform: scaleX(0.42);
    transform-origin: left;
    transition: transform 700ms cubic-bezier(0.32,0.72,0,1);
  }

  .hero-tertiary-link small {
    grid-column: 1 / -1;
    color: rgba(244, 242, 237, 0.54);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1.4;
    text-transform: none;
  }

  .hero-tertiary-link i {
    color: #f5c928;
  }

  .hero-tertiary-link:hover,
  .hero-tertiary-link:focus-visible {
    color: #f4efe6;
    outline: 0;
    transform: translateY(-0.08rem);
  }

  .hero-tertiary-link:hover::after,
  .hero-tertiary-link:focus-visible::after {
    transform: scaleX(1);
  }
```

- [ ] **Step 2: Add floating Google Reviews styles near `.google-review-card`**

Add:

```css
  .floating-google-review {
    position: fixed;
    z-index: 18;
    left: max(1rem, env(safe-area-inset-left));
    bottom: max(1rem, env(safe-area-inset-bottom));
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.75rem;
    width: min(17rem, calc(100vw - 2rem));
    padding: 0.72rem 0.86rem;
    border: 1px solid rgba(245, 201, 40, 0.24);
    border-radius: 1rem;
    color: #f4efe6;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025)),
      #0d0d0e;
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.08),
      0 18px 48px rgba(0, 0, 0, 0.28);
    pointer-events: none;
  }

  .floating-google-review-mark {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    color: #09090b;
    background: #f4efe6;
    font-size: 0.95rem;
    font-weight: 950;
    line-height: 1;
  }

  .floating-google-review strong,
  .floating-google-review span span {
    display: block;
  }

  .floating-google-review strong {
    color: #f6d96f;
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    line-height: 1;
    text-transform: uppercase;
  }

  .floating-google-review span span {
    margin-top: 0.28rem;
    color: rgba(244, 242, 237, 0.82);
    font-size: 0.82rem;
    font-weight: 800;
    line-height: 1.2;
  }
```

- [ ] **Step 3: Add responsive mobile placement**

Inside `@media (max-width: 640px)`, add:

```css
  .floating-google-review {
    left: max(0.75rem, env(safe-area-inset-left));
    bottom: max(0.75rem, env(safe-area-inset-bottom));
    width: min(13.5rem, calc(100vw - 1.5rem));
    gap: 0.58rem;
    padding: 0.58rem 0.64rem;
    border-radius: 0.85rem;
  }

  .floating-google-review-mark {
    width: 1.9rem;
    height: 1.9rem;
    font-size: 0.82rem;
  }

  .floating-google-review strong {
    font-size: 0.54rem;
  }

  .floating-google-review span span {
    font-size: 0.72rem;
  }
```

- [ ] **Step 4: Remove stale hero-review reduced-motion selectors if safe**

In `@media (prefers-reduced-motion: reduce)`, remove `.hero-review-card-subtle:hover` and `.hero-review-card-subtle:focus-visible` from the transform-reset selector if no `.hero-review-card-subtle` remains in `index.html`.

- [ ] **Step 5: Run test**

Run:

```bash
npm test
```

Expected: CSS-related checks pass or failures point only to remaining JS behavior.

---

### Task 4: JavaScript Testimonial Comment, Dot Labels, and Mobile Nav Close

**Files:**
- Modify: `src/main.js`

**Interfaces:**
- Consumes: existing delegated click handler, `.mobile-nav` details element, testimonial carousel data.
- Produces: `mobileNav.open = false` after valid mobile anchor selection; testimonial TODO comment and labels.

- [ ] **Step 1: Add testimonial placeholder comment**

Immediately before `const testimonialSlides = [` add:

```js
// TODO: Replace placeholder testimonial content with verified quotes
// collected directly from Atlas Barbell Club lifters before production.
```

- [ ] **Step 2: Close mobile nav after valid anchor click**

Inside the existing document click handler, after `const target = getHashTarget(hash);` succeeds and before `event.preventDefault();`, add:

```js
  const mobileNav = link.closest(".mobile-nav");
```

After `alignHashTarget(target, getAnchorScrollBehavior());`, add:

```js
  if (mobileNav) {
    mobileNav.open = false;
  }
```

The full relevant block should become:

```js
  const hash = link.getAttribute("href");
  const target = getHashTarget(hash);

  if (!target) {
    return;
  }

  const mobileNav = link.closest(".mobile-nav");

  event.preventDefault();
  revealWithin(target);
  window.history.pushState(null, "", hash);
  alignHashTarget(target, getAnchorScrollBehavior());

  if (mobileNav) {
    mobileNav.open = false;
  }
```

- [ ] **Step 3: Rename testimonial dot labels**

Change:

```js
dot.setAttribute("aria-label", `Show review ${index + 1}`);
```

to:

```js
dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
```

- [ ] **Step 4: Run test**

Run:

```bash
npm test
```

Expected: PASS if Tasks 1 to 4 are complete.

---

### Task 5: Build, Generated CSS, Self-Review, and Commit

**Files:**
- Modify: `dist/styles.css`
- Review: `index.html`
- Review: `src/styles.css`
- Review: `src/main.js`
- Review: `tests/verify-scroll-animations.mjs`

**Interfaces:**
- Consumes: completed source changes.
- Produces: compiled CSS and verified deploy-ready output.

- [ ] **Step 1: Run source test**

Run:

```bash
npm test
```

Expected: `Landing hierarchy checks passed.`

- [ ] **Step 2: Build compiled CSS**

Run:

```bash
npm run build
```

Expected: Tailwind writes `dist/styles.css` with no errors.

- [ ] **Step 3: Build DigitalOcean output**

Run:

```bash
npm run build:digitalocean
```

Expected: Tailwind build completes and `DigitalOcean static build prepared in public/`.

- [ ] **Step 4: Verify DigitalOcean output**

Run:

```bash
npm run verify:digitalocean
```

Expected: `DigitalOcean build checks passed.`

- [ ] **Step 5: Run diff hygiene**

Run:

```bash
git diff --check
git diff --stat
git status --short
```

Expected: no whitespace errors; changed files are limited to `index.html`, `src/styles.css`, `src/main.js`, `tests/verify-scroll-animations.mjs`, and `dist/styles.css`.

- [ ] **Step 6: Copy and accessibility self-review**

Manually inspect the final diff and verify:

- No `hero-review-card` remains in `index.html`.
- `floating-google-review` contains no fake rating, fake stars, review count, or Google search URL.
- Testimonials no longer use visible `Reviews` labeling.
- Google Reviews and testimonials are distinct.
- Glendale/Phoenix-area wording is accurate.
- Equipment copy does not contain `rehab-style` or `Rogue and American plates`.
- `Atlas bias` no longer appears.
- Existing anchors remain present.
- Mobile nav close code exists.
- No new dependency was added.

- [ ] **Step 7: Commit implementation**

Run:

```bash
git add index.html src/styles.css src/main.js tests/verify-scroll-animations.mjs dist/styles.css
git commit -m "Polish Atlas hierarchy and reviews"
```

- [ ] **Step 8: Push**

Run:

```bash
git push
```

Expected: remote `main` updates successfully.

---

## Self-Review Notes

- Spec coverage: The plan covers hero CTA, hero Google removal, floating Google placeholder, testimonial terminology and JS comment, Glendale/Phoenix location language, founder TODO, equipment wording, training-method tone, technique proof copy, mobile-nav close behavior, accessibility constraints, and verification.
- Placeholder scan: The only TODO strings are the exact source comments required by the approved spec.
- Type consistency: The plan uses existing static-site class and data attributes. New classes are `.hero-tertiary-link`, `.floating-google-review`, and `.floating-google-review-mark`. JavaScript uses the existing delegated click handler and native `HTMLDetailsElement.open`.
