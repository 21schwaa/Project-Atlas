# Atlas Front Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Atlas Barbell Club front page into a premium, eye-catching Olympic weightlifting website.

**Architecture:** Keep the current static-site architecture: `index.html` owns semantic content, `src/styles.css` owns Tailwind and custom motion utilities, and `src/main.js` owns reveal plus GSAP-enhanced scroll behavior. GSAP is loaded from CDN scripts in the page so no framework or bundler change is required.

**Tech Stack:** HTML5, Tailwind CSS 4 CLI, vanilla JavaScript, GSAP CDN.

## Global Constraints

Keep the site static: HTML, Tailwind CSS, and vanilla JavaScript only.
Do not add a JavaScript framework.
Use `Geist` as the primary type direction through CSS font stacks.
Remove old generic content labels: `Powerlifting`, `Strength Basics`, and raw hero stat blocks.
Use a wide 2-3 line hero headline, dense bento layout, restrained visual richness, accessible contrast, and reduced-motion handling.

---

### Task 1: Redesign Markup And Motion Hooks

**Files:**
- Modify: `tests/verify-scroll-animations.mjs`
- Modify: `index.html`
- Modify: `src/styles.css`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: existing Tailwind CLI build and current `data-reveal` behavior.
- Produces: redesigned static front page with Olympic weightlifting copy, GSAP CDN scripts, `data-scroll-image`, `data-scrub-word`, and `grid-flow-dense` markup.

- [x] **Step 1: Write the failing test**

```js
const checks = [
  ["HTML speaks to Olympic weightlifting", html.includes("Olympic weightlifting")],
  ["HTML removes old powerlifting card", !html.includes("Powerlifting")],
  ["HTML removes old strength basics card", !html.includes("Strength Basics")],
  ["HTML loads GSAP", html.includes("gsap.min.js")],
  ["HTML loads ScrollTrigger", html.includes("ScrollTrigger.min.js")],
  ["HTML has dense bento grid", html.includes("grid-flow-dense")],
  ["HTML has scroll image hooks", html.includes("data-scroll-image")],
  ["HTML has scrub text hooks", html.includes("data-scrub-word")],
  ["CSS uses custom motion curve", css.includes("cubic-bezier(0.32,0.72,0,1)")],
  ["JS registers ScrollTrigger when GSAP exists", js.includes("ScrollTrigger")],
];
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because the current page does not yet include the Olympic weightlifting redesign hooks.

- [ ] **Step 3: Replace front-page HTML**

Create the floating nav, artistic asymmetry hero, dense bento section, scroll media section, final CTA, and footer in `index.html`.

- [ ] **Step 4: Update CSS motion utilities**

Add premium font stack, fixed noise overlay, custom reveal cubic-bezier, marquee keyframes, scrub-word defaults, and reduced-motion fallbacks in `src/styles.css`.

- [ ] **Step 5: Update JavaScript motion**

Keep existing reveal behavior. Add guarded GSAP registration for `data-scroll-image` and `data-scrub-word`, with safe fallback when GSAP is unavailable.

- [ ] **Step 6: Run verification**

Run: `npm test`
Expected: PASS with all redesign checks.

Run: `npm run build`
Expected: PASS and regenerate `dist/styles.css`.

## Self-Review

- Spec coverage: The single task covers markup, visual style, motion hooks, and verification.
- Placeholder scan: No placeholder work remains in the plan.
- Type consistency: The produced hooks match the test names exactly.
