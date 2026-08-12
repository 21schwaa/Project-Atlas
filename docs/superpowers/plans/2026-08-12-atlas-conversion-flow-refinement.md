# Atlas Conversion Flow Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the oversized Welcome section with a compact training choice flow, add contextual conversion CTAs, and add a persistent Start Training control without disturbing the current Atlas visual system.

**Architecture:** Keep this as a static HTML/CSS/vanilla JS change. Update the existing static verification test first, then adjust `index.html`, `src/styles.css`, `src/main.js`, and rebuild `dist/styles.css` from source. Preserve the current active navigation highlighting, smooth anchor scrolling, fixed header, truthful Google Reviews element, and existing section designs.

**Tech Stack:** Static HTML, Tailwind v4 CSS source in `src/styles.css`, generated CSS in `dist/styles.css`, vanilla JavaScript in `src/main.js`, Node static verification in `tests/verify-scroll-animations.mjs`, npm build scripts.

## Global Constraints

- The final main order is `#home`, `#training-options`, `#equipment`, `#offerings`, `#team`, `#coaching`, `#open-gym`, `#coach`, `#testimonials`, `#contact`, footer.
- Remove the large `#welcome` section and remove every `href="#welcome"` reference.
- Desktop and mobile nav labels are exactly: The Floor, Training, Coach, Lifters, Contact.
- The hero tertiary action targets `#training-options` and says `Get Started` with `Choose how you want to train.`
- Add contextual CTAs for Team Programming, Coaching, and Open Gym, all targeting `#contact` with `data-training-interest`.
- Add a persistent right-side Start Training anchor that is hidden while `#home` is visible, visible through middle content, and hidden when `#contact` enters view.
- Persistent CTA state uses `heroVisible`, `contactVisible`, `shouldShow = !heroVisible && !contactVisible`, and `IntersectionObserver`.
- Google Reviews remains bottom-left, truthful, and contains no fake rating, stars, counts, quotes, scores, Google review links, or external widgets.
- Preserve the dark industrial Atlas design language and avoid broad redesigns of unrelated sections.
- Motion respects `prefers-reduced-motion`.
- Verification before completion: `npm test`, `npm run build`, `npm run build:digitalocean`, `npm run verify:digitalocean`.

---

## File Structure

- Modify `tests/verify-scroll-animations.mjs`: update the static test contract so the old Welcome flow fails and the new conversion flow is required.
- Modify `index.html`: remove Welcome markup, add the compact training selector section, update nav and hero tertiary links, add contextual CTAs, and add the persistent Start Training anchor.
- Modify `src/styles.css`: remove retired Welcome-only selectors, add compact `#training-options` styling, add contextual CTA styling, add persistent Start Training styling, and update responsive/reduced-motion coverage.
- Modify `src/main.js`: add IntersectionObserver visibility logic for the persistent Start Training anchor while preserving active nav and smooth anchor behavior.
- Regenerate `dist/styles.css`: run the existing build command after source CSS changes.

---

### Task 1: Update The Static Conversion Contract

**Files:**
- Modify: `tests/verify-scroll-animations.mjs`

**Interfaces:**
- Consumes: `index.html`, `src/styles.css`, `src/main.js`
- Produces: A failing test suite that defines the new conversion flow before production edits.

- [ ] **Step 1: Edit the expected section slices**

Replace the old section extraction near the top of `tests/verify-scroll-animations.mjs` with this structure:

```js
const headerHtml = html.slice(html.indexOf("<header"), html.indexOf("</header>"));
const heroHtml = html.slice(html.indexOf('id="home"'), html.indexOf("</section>", html.indexOf('id="home"')));
const trainingOptionsHtml = html.slice(html.indexOf('id="training-options"'), html.indexOf('id="equipment"'));
const offeringsHtml = html.slice(html.indexOf('id="offerings"'), html.indexOf('id="coach"'));
const teamHtml = html.slice(html.indexOf('id="team"'), html.indexOf('id="coaching"'));
const coachingHtml = html.slice(html.indexOf('id="coaching"'), html.indexOf('id="open-gym"'));
const openGymHtml = html.slice(html.indexOf('id="open-gym"'), html.indexOf('id="coach"'));
const coachHtml = html.slice(html.indexOf('id="coach"'), html.indexOf('id="testimonials"'));
const googleFloatingStart = html.indexOf('class="floating-google-review"');
const googleFloatingEnd = html.indexOf("</aside>", googleFloatingStart);
const googleFloatingFound = googleFloatingStart >= 0 && googleFloatingEnd > googleFloatingStart;
const googleFloatingHtml = html.slice(googleFloatingStart, googleFloatingEnd);
const persistentCtaStart = html.indexOf('data-floating-training-cta');
const persistentCtaEnd = html.indexOf("</a>", persistentCtaStart);
const persistentCtaHtml = html.slice(persistentCtaStart, persistentCtaEnd);
const footerHtml = html.slice(html.indexOf("<footer"), html.indexOf("</footer>"));
const testimonialsHtml = html.slice(html.indexOf('id="testimonials"'), html.indexOf("marquee-track"));
const marqueeHtml = html.slice(html.indexOf("marquee-track"), html.indexOf('id="contact"'));
```

- [ ] **Step 2: Replace navigation and anchor arrays**

Replace the `navTargets` and `anchorIds` arrays with:

```js
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
```

- [ ] **Step 3: Replace the hero, welcome, nav, CTA, hierarchy, CSS, and JS checks**

Update the affected `checks` entries so they require the new conversion flow. The exact checks to add are:

```js
["Hero has three intentional paths", heroHtml.includes('href="#contact"') && heroHtml.includes("Start training") && heroHtml.includes('href="#equipment"') && heroHtml.includes("See the floor") && heroHtml.includes('href="#training-options"') && heroHtml.includes("Get started") && heroHtml.includes("Choose how you want to train.")],
["HTML removes retired Welcome flow", removedTargets.every((target) => !html.includes(target)) && !html.includes("Welcome to Atlas") && !html.includes("welcome-editorial") && !html.includes("welcome-origin-note") && !html.includes("welcome-principles")],
["HTML has compact training selector after hero", trainingOptionsHtml.includes("Choose how you train") && trainingOptionsHtml.includes("Three ways to train at Atlas.") && trainingOptionsHtml.includes("training-selector") && html.indexOf('id="home"') < html.indexOf('id="training-options"') && html.indexOf('id="training-options"') < html.indexOf('id="equipment"')],
["Training selector links to all training options", trainingOptionsHtml.includes('href="#team"') && trainingOptionsHtml.includes("Team Programming") && trainingOptionsHtml.includes("Follow a shared weekly track.") && trainingOptionsHtml.includes('href="#coaching"') && trainingOptionsHtml.includes("Coaching") && trainingOptionsHtml.includes("Get a closer eye on the lift.") && trainingOptionsHtml.includes('href="#open-gym"') && trainingOptionsHtml.includes("Open Gym") && trainingOptionsHtml.includes("Bring your own plan.")],
["Header has new desktop nav targets", navTargets.every((target) => headerHtml.includes(target)) && !headerHtml.includes('href="#welcome"') && !headerHtml.includes(">Welcome<")],
["HTML follows new landing hierarchy", appearsInOrder(['id="home"', 'id="training-options"', 'id="equipment"', 'id="offerings"', 'id="team"', 'id="coaching"', 'id="open-gym"', 'id="coach"', 'id="testimonials"', 'id="contact"'])],
["Training paths have contextual contact CTAs", teamHtml.includes('href="#contact"') && teamHtml.includes('data-training-interest="team"') && teamHtml.includes("Start Team Programming") && teamHtml.includes("Ask about joining the Atlas training track.") && coachingHtml.includes('href="#contact"') && coachingHtml.includes('data-training-interest="coaching"') && coachingHtml.includes("Ask About Coaching") && coachingHtml.includes("Tell us what you want help with.") && openGymHtml.includes('href="#contact"') && openGymHtml.includes('data-training-interest="open-gym"') && openGymHtml.includes("Start Open Gym") && openGymHtml.includes("Ask about access and getting started.")],
["Persistent Start Training CTA exists", persistentCtaStart >= 0 && persistentCtaHtml.includes('href="#contact"') && persistentCtaHtml.includes("Start Training") && persistentCtaHtml.includes("Find your next step") && persistentCtaHtml.includes("aria-label")],
["Persistent Start Training CTA observes hero and contact", js.includes("floatingTrainingCta") && js.includes("heroVisible") && js.includes("contactVisible") && js.includes("shouldShow = !heroVisible && !contactVisible") && js.includes("document.getElementById(\"home\")") && js.includes("document.getElementById(\"contact\")") && js.includes("IntersectionObserver")],
["CSS defines conversion selector and floating CTA systems", css.includes(".training-options-section") && css.includes(".training-selector") && css.includes(".training-path-cta") && css.includes(".floating-training-cta") && css.includes(".floating-training-cta.is-visible")],
["CSS removes retired Welcome-only systems", ![".welcome-grid", ".welcome-copy", ".welcome-editorial", ".welcome-origin-note", ".welcome-principles"].some((selector) => css.includes(selector))],
```

Remove the old checks that require:

```js
'href="#welcome"'
"HTML uses welcome editorial selector"
"CSS defines welcome cleanup system"
"Welcome selector links read as visible action buttons"
"Welcome section has non-fabricated origin placeholder"
"Welcome section has calm training selector"
css.includes(".welcome-section")
css.includes(".welcome-grid")
```

- [ ] **Step 4: Run the test and confirm it fails for missing new flow**

Run:

```bash
npm test
```

Expected result: FAIL lines include the new conversion checks, especially the removed Welcome flow, compact training selector, persistent CTA, contextual CTAs, and updated hero target.

- [ ] **Step 5: Commit only the test contract**

Run:

```bash
git add tests/verify-scroll-animations.mjs
git commit -m "test: update Atlas conversion flow contract"
```

---

### Task 2: Restructure HTML Anchors, Selector, Navigation, And CTAs

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 1 static checks.
- Produces: Updated anchors and markup required by CSS and JavaScript.

- [ ] **Step 1: Remove Welcome from desktop navigation**

Delete this desktop header link:

```html
<a class="transition-colors duration-500 hover:text-amber-200" href="#welcome" data-nav-link>Welcome</a>
```

Leave these desktop links, in this order:

```html
<a class="transition-colors duration-500 hover:text-amber-200" href="#equipment" data-nav-link>The Floor</a>
<a class="transition-colors duration-500 hover:text-amber-200" href="#offerings" data-nav-link>Training</a>
<a class="transition-colors duration-500 hover:text-amber-200" href="#coach" data-nav-link>Coach</a>
<a class="transition-colors duration-500 hover:text-amber-200" href="#testimonials" data-nav-link>Lifters</a>
<a class="transition-colors duration-500 hover:text-amber-200" href="#contact" data-nav-link>Contact</a>
```

- [ ] **Step 2: Remove Welcome from mobile navigation**

Delete this mobile link:

```html
<a href="#welcome" data-nav-link>Welcome</a>
```

Leave the same five final nav targets used by desktop navigation.

- [ ] **Step 3: Add the persistent Start Training anchor after the Google Reviews element**

Insert this immediately after the closing `</aside>` for `.floating-google-review` and before `.hero-rail`:

```html
<a
  href="#contact"
  class="floating-training-cta"
  data-floating-training-cta
  aria-label="Start Training at Atlas Barbell Club"
>
  <span>
    <strong>Start Training</strong>
    <small>Find your next step</small>
  </span>
  <i class="gg-arrow-right" aria-hidden="true"></i>
</a>
```

- [ ] **Step 4: Update the hero tertiary CTA**

Replace:

```html
<a href="#welcome" class="hero-tertiary-link">
  <span>Get started</span>
  <small>Learn what Atlas is about.</small>
  <i class="gg-arrow-right" aria-hidden="true"></i>
</a>
```

with:

```html
<a href="#training-options" class="hero-tertiary-link">
  <span>Get started</span>
  <small>Choose how you want to train.</small>
  <i class="gg-arrow-right" aria-hidden="true"></i>
</a>
```

- [ ] **Step 5: Replace the old Welcome section with compact training options**

Delete the full section beginning:

```html
<section id="welcome" class="anchor-section welcome-section section-rhythm">
```

and ending at its matching `</section>` before `#equipment`.

Insert this in the same location:

```html
<section id="training-options" class="anchor-section training-options-section section-rhythm-tight">
  <div class="page-shell">
    <div class="training-options-header" data-reveal>
      <p class="section-kicker">Choose how you train</p>
      <h2 class="section-heading">Three ways to train at Atlas.</h2>
    </div>

    <nav class="training-selector" aria-label="Choose how Atlas fits your training" data-reveal data-reveal-delay="80">
      <p><span>Choose your lane</span><strong>Jump to the training option that fits.</strong></p>
      <a href="#team"><span>Team Programming</span><strong>Follow a shared weekly track.</strong><em aria-hidden="true"></em></a>
      <a href="#coaching"><span>Coaching</span><strong>Get a closer eye on the lift.</strong><em aria-hidden="true"></em></a>
      <a href="#open-gym"><span>Open Gym</span><strong>Bring your own plan.</strong><em aria-hidden="true"></em></a>
    </nav>
  </div>
</section>
```

- [ ] **Step 6: Add Team Programming contextual CTA**

Inside `#team`, after `.training-path-details` and before the closing `</section>` for `#team`, add:

```html
<a
  class="training-path-cta"
  href="#contact"
  data-training-interest="team"
  data-reveal
  data-reveal-delay="180"
>
  <span>
    <strong>Start Team Programming</strong>
    <small>Ask about joining the Atlas training track.</small>
  </span>
  <i class="gg-arrow-right" aria-hidden="true"></i>
</a>
```

- [ ] **Step 7: Add Coaching contextual CTA**

Inside `#coaching`, after `.training-path-details` and before the closing `</section>` for `#coaching`, add:

```html
<a
  class="training-path-cta"
  href="#contact"
  data-training-interest="coaching"
  data-reveal
  data-reveal-delay="220"
>
  <span>
    <strong>Ask About Coaching</strong>
    <small>Tell us what you want help with.</small>
  </span>
  <i class="gg-arrow-right" aria-hidden="true"></i>
</a>
```

- [ ] **Step 8: Add Open Gym contextual CTA**

Inside `#open-gym`, place this after `.training-path-note` and before the closing `</div>` for `.training-path-body`:

```html
<a
  class="training-path-cta"
  href="#contact"
  data-training-interest="open-gym"
  data-reveal
  data-reveal-delay="230"
>
  <span>
    <strong>Start Open Gym</strong>
    <small>Ask about access and getting started.</small>
  </span>
  <i class="gg-arrow-right" aria-hidden="true"></i>
</a>
```

- [ ] **Step 9: Verify the HTML now matches the expected anchor list**

Run:

```bash
npm test
```

Expected result: HTML-related checks pass or move forward; CSS and JS checks for the new floating CTA may still fail until later tasks are complete.

- [ ] **Step 10: Commit the HTML restructure**

Run:

```bash
git add index.html tests/verify-scroll-animations.mjs
git commit -m "feat: restructure Atlas conversion anchors"
```

---

### Task 3: Add Conversion Flow CSS And Remove Retired Welcome Styles

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: Markup from Task 2.
- Produces: Styled compact training selector, contextual CTAs, and persistent Start Training control.

- [ ] **Step 1: Remove retired Welcome-only selectors**

Delete CSS blocks whose selectors are only:

```css
.welcome-section
.welcome-grid
.welcome-copy
.welcome-editorial
.welcome-origin-note
.welcome-principles
```

Also remove these selectors from responsive grouped rules:

```css
.welcome-grid,
.welcome-editorial,
```

Keep `.training-selector` styles because the new section reuses them.

- [ ] **Step 2: Add compact training options section styles**

Add this near the current selector styles, before `.training-selector`:

```css
@layer components {
  .training-options-section {
    position: relative;
    isolation: isolate;
    padding-block: clamp(1.6rem, 4vw, 3.5rem);
  }

  .training-options-section::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 5rem;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(247, 214, 74, 0.24), transparent);
    pointer-events: none;
  }

  .training-options-header {
    display: grid;
    gap: clamp(0.75rem, 1.5vw, 1rem);
    margin-bottom: clamp(1rem, 2.4vw, 1.75rem);
    max-width: 42rem;
  }

  .training-options-header .section-heading {
    max-width: 12ch;
  }
}
```

- [ ] **Step 3: Add contextual CTA styles**

Add this near the existing `.training-path` styles:

```css
@layer components {
  .training-path-cta {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.1rem;
    align-self: start;
    min-width: min(100%, 21rem);
    max-width: 28rem;
    margin-top: clamp(0.6rem, 1.6vw, 1rem);
    border: 1px solid rgba(247, 214, 74, 0.42);
    background:
      linear-gradient(135deg, rgba(247, 214, 74, 0.16), rgba(255, 255, 255, 0.045) 42%, rgba(0, 0, 0, 0.42)),
      #141414;
    color: #fff8e6;
    padding: 0.9rem 1rem 0.9rem 1.1rem;
    text-decoration: none;
    clip-path: polygon(0 0, calc(100% - 1rem) 0, 100% 1rem, 100% 100%, 0 100%);
    transition:
      border-color 240ms ease,
      background-color 240ms ease,
      transform 240ms ease;
  }

  .training-path-cta strong,
  .training-path-cta small {
    display: block;
  }

  .training-path-cta strong {
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .training-path-cta small {
    margin-top: 0.35rem;
    color: rgba(244, 244, 245, 0.68);
    font-size: 0.84rem;
    line-height: 1.45;
  }

  .training-path-cta .gg-arrow-right {
    color: #f7d64a;
    flex: 0 0 auto;
  }

  .training-path-cta:hover,
  .training-path-cta:focus-visible {
    border-color: rgba(247, 214, 74, 0.78);
    transform: translateY(-2px);
  }
}
```

- [ ] **Step 4: Add persistent Start Training CTA styles**

Add this near `.floating-google-review`:

```css
@layer components {
  .floating-training-cta {
    position: fixed;
    right: max(0.85rem, env(safe-area-inset-right));
    top: 50%;
    z-index: 24;
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    border: 1px solid rgba(247, 214, 74, 0.72);
    background: #f7d64a;
    color: #060607;
    padding: 0.85rem 0.8rem 0.85rem 1rem;
    text-decoration: none;
    box-shadow: 0 1.2rem 3rem rgba(0, 0, 0, 0.36);
    opacity: 0;
    pointer-events: none;
    transform: translate(115%, -50%);
    transition:
      opacity 260ms ease,
      transform 360ms cubic-bezier(0.32, 0.72, 0, 1);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0.8rem 100%, 0 50%);
  }

  .floating-training-cta.is-visible {
    opacity: 1;
    pointer-events: auto;
    transform: translate(0, -50%);
  }

  .floating-training-cta strong,
  .floating-training-cta small {
    display: block;
  }

  .floating-training-cta strong {
    font-size: 0.72rem;
    font-weight: 950;
    letter-spacing: 0.14em;
    line-height: 1;
    text-transform: uppercase;
  }

  .floating-training-cta small {
    margin-top: 0.28rem;
    color: rgba(6, 6, 7, 0.72);
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1.1;
  }

  .floating-training-cta .gg-arrow-right {
    color: #060607;
  }
}
```

- [ ] **Step 5: Add responsive and reduced-motion refinements**

Inside the existing `@media (max-width: 640px)` block, add:

```css
.floating-training-cta {
  right: max(0.65rem, env(safe-area-inset-right));
  top: auto;
  bottom: max(0.55rem, env(safe-area-inset-bottom));
  padding: 0.72rem 0.72rem 0.72rem 0.95rem;
  transform: translateX(120%);
}

.floating-training-cta.is-visible {
  transform: translateX(0);
}

.floating-training-cta small {
  display: none;
}
```

Inside the existing `@media (prefers-reduced-motion: reduce)` block, add:

```css
.floating-training-cta,
.floating-training-cta.is-visible {
  transform: none !important;
}
```

- [ ] **Step 6: Run the static test**

Run:

```bash
npm test
```

Expected result: CSS checks pass or move forward; JS checks for floating CTA behavior may still fail until Task 4.

- [ ] **Step 7: Commit the CSS source**

Run:

```bash
git add src/styles.css tests/verify-scroll-animations.mjs
git commit -m "feat: style Atlas conversion CTAs"
```

---

### Task 4: Add Persistent CTA Intersection Logic

**Files:**
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `.floating-training-cta[data-floating-training-cta]`, `#home`, `#contact`
- Produces: Visibility behavior for the persistent Start Training CTA.

- [ ] **Step 1: Define floating CTA constants near the top of `src/main.js`**

After `navLinks`, add:

```js
const floatingTrainingCta = document.querySelector("[data-floating-training-cta]");
const heroSection = document.getElementById("home");
const contactSection = document.getElementById("contact");
let heroVisible = true;
let contactVisible = false;
```

- [ ] **Step 2: Add a visibility helper after `setActiveNavLink`**

Insert:

```js
const updateFloatingTrainingCta = () => {
  if (!floatingTrainingCta) {
    return;
  }

  const shouldShow = !heroVisible && !contactVisible;

  floatingTrainingCta.classList.toggle("is-visible", shouldShow);
  floatingTrainingCta.tabIndex = shouldShow ? 0 : -1;
  floatingTrainingCta.setAttribute("aria-hidden", shouldShow ? "false" : "true");
};
```

- [ ] **Step 3: Initialize the CTA hidden state before observers run**

After the helper, add:

```js
updateFloatingTrainingCta();
```

- [ ] **Step 4: Observe hero and contact visibility inside the existing IntersectionObserver support branch**

Inside `if ("IntersectionObserver" in window) {`, after `navObservedSections.forEach((target) => navObserver.observe(target));`, add:

```js
  if (floatingTrainingCta && heroSection && contactSection) {
    const floatingCtaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroSection) {
            heroVisible = entry.isIntersecting;
          }

          if (entry.target === contactSection) {
            contactVisible = entry.isIntersecting;
          }
        });

        updateFloatingTrainingCta();
      },
      {
        rootMargin: "-10% 0px -20% 0px",
        threshold: 0,
      },
    );

    floatingCtaObserver.observe(heroSection);
    floatingCtaObserver.observe(contactSection);
  }
```

- [ ] **Step 5: Set the non-observer fallback**

Inside the existing `else { revealItems.forEach(revealNow); }`, add after the reveal line:

```js
  heroVisible = false;
  contactVisible = false;
  updateFloatingTrainingCta();
```

- [ ] **Step 6: Run JavaScript syntax and static tests**

Run:

```bash
node --check src/main.js
npm test
```

Expected result: syntax passes and the static conversion checks pass.

- [ ] **Step 7: Commit the JavaScript**

Run:

```bash
git add src/main.js tests/verify-scroll-animations.mjs
git commit -m "feat: add persistent training CTA behavior"
```

---

### Task 5: Build CSS, Verify DigitalOcean Readiness, And Final Commit

**Files:**
- Modify: `dist/styles.css`
- Check: `package.json`, DigitalOcean scripts through npm

**Interfaces:**
- Consumes: `src/styles.css`, `index.html`, `src/main.js`
- Produces: compiled CSS and verified static site output.

- [ ] **Step 1: Build generated CSS**

Run:

```bash
npm run build
```

Expected result: build exits 0 and updates `dist/styles.css`.

- [ ] **Step 2: Run the full local static test**

Run:

```bash
npm test
```

Expected result: output includes:

```text
Landing hierarchy checks passed.
```

- [ ] **Step 3: Run JavaScript syntax verification**

Run:

```bash
node --check src/main.js
```

Expected result: no output and exit code 0.

- [ ] **Step 4: Run DigitalOcean verification scripts**

Run:

```bash
npm run build:digitalocean
npm run verify:digitalocean
```

Expected result: both scripts exit 0.

- [ ] **Step 5: Inspect final diff for scope**

Run:

```bash
git diff --stat
git diff -- index.html src/styles.css src/main.js tests/verify-scroll-animations.mjs
```

Expected result: diff is limited to the conversion flow changes from this plan plus the generated `dist/styles.css`.

- [ ] **Step 6: Commit the compiled CSS and any final test adjustments**

Run:

```bash
git add index.html src/styles.css src/main.js dist/styles.css tests/verify-scroll-animations.mjs
git commit -m "feat: refine Atlas conversion flow"
```

---

## Plan Self-Review

- Spec coverage: The plan covers removing `#welcome`, adding `#training-options`, updating hero and nav links, adding contextual CTAs, adding the persistent Start Training CTA, preserving truthful Google Reviews, CSS cleanup, responsive behavior, reduced motion, active nav preservation, testing, and DigitalOcean verification.
- Placeholder scan: The plan contains no unresolved marker text or omitted implementation steps.
- Interface consistency: The selectors `data-floating-training-cta`, `.floating-training-cta`, `.training-options-section`, `.training-path-cta`, `heroVisible`, and `contactVisible` are introduced before later tasks consume them.
