# Coach Shen Methodology Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the lower Meet Coach Shen content so it clearly explains what Coach Shen teaches, why she teaches it, and why Atlas uses a Chinese-influenced approach.

**Architecture:** This is a targeted static-site content and CSS interaction update. The existing section structure remains in `index.html`, interaction behavior stays CSS-only for method card reveals, and `tests/verify-scroll-animations.mjs` verifies the public-facing copy and responsive reveal rules.

**Tech Stack:** Static HTML, CSS authored in `src/styles.css`, Tailwind v4 build output in `dist/styles.css`, vanilla JS in `src/main.js`, Node-based verification tests.

## Global Constraints

- Do not redesign the entire website.
- Do not rearrange the overall page hierarchy.
- Do not change the Coach Shen profile photo, Qualifications layout, Coaching Philosophy layout, transition header, What We Offer, Equipment, Testimonials, Contact, floating Google Reviews, floating Start Training CTA, or Hero.
- Coach Shen is a woman. Use she/her/hers for relevant Coach Shen references.
- Rename "Training influences" to "Training approach."
- Bulgarian and American methods are comparisons only, not methods Coach Shen uses.
- Chinese-influenced approach is the Atlas method and must include `ATLAS METHOD`.
- Desktop method-card details reveal on hover, focus, and focus-within.
- Mobile method-card details remain visible without hover.
- Reduced motion must remove translated reveal motion.
- Run `npm test`, `npm run build`, and `node --check src/main.js` before completion.

---

### Task 1: Lock Verification Around the New Coach Story

**Files:**
- Modify: `tests/verify-scroll-animations.mjs`

**Interfaces:**
- Consumes: existing `html`, `css`, and `coachHtml` constants.
- Produces: failing assertions that define the new Coach Shen methodology story before HTML/CSS changes.

- [ ] **Step 1: Replace the old Coach methodology expectations**

In `tests/verify-scroll-animations.mjs`, replace these old checks:

```js
["Coach section includes technique and mobility", html.includes("Technique and positions") && html.includes("Build positions you can repeat") && html.includes("front rack") && html.toLowerCase().includes("overhead stability")],
["Coach section includes training methodology", html.includes("Training influences") && html.includes("Bulgarian-influenced training") && html.includes("American approaches") && html.includes("Chinese-influenced training")],
["Methodology uses softened Atlas approach", html.includes("Three lenses. One Atlas approach.") && html.includes("Atlas approach") && html.includes("Often associated with frequent heavy practice and high specificity.") && html.includes("Often associated with planned training blocks and broader exercise variation.") && html.includes("Technical choices can be adjusted around individual proportions and positions.") && html.includes("Technical positions you can repeat.") && !html.includes("Atlas bias")],
["Technique proof copy is educational rather than absolute", html.includes("Mobility can help athletes access the positions required by the lifts.") && html.includes("Technical repetitions give athletes more opportunities to practice a position consistently.") && html.includes("Repeatable positions make it easier to evaluate what changes as speed or load increases.") && !html.includes("Quality reps build long-term strength.") && !html.includes("Training transfers when positions are repeatable.")],
["Coach section keeps Shen group labels", coachHtml.includes("Qualifications") && coachHtml.includes("Coaching Philosophy") && coachHtml.includes("Technique and positions") && coachHtml.includes("Training influences")],
```

with checks that assert:

```js
["Coach section frames technique as Shen's teaching process", coachHtml.includes("Technique and positions") && coachHtml.includes("Teach the position. Then teach the athlete to use it.") && coachHtml.includes("Coach Shen teaches the Olympic lifts by breaking down the positions, timing, and movement patterns") && coachHtml.includes("The goal is to give the athlete a position they understand and can reproduce")],
["Coach technique cards are specific to her decisions", coachHtml.includes("Create access to the position.") && coachHtml.includes("Coach Shen addresses that limitation as part of the training session") && coachHtml.includes("Use drills to solve what she sees.") && coachHtml.includes("Technical variations are selected around the problem in front of her")],
["Coach technique process uses Position Practice Apply", coachHtml.includes("01 Position") && coachHtml.includes("Find the position the athlete needs.") && coachHtml.includes("02 Practice") && coachHtml.includes("Give the athlete opportunities to repeat it.") && coachHtml.includes("03 Apply") && coachHtml.includes("Bring it back into the full lift.")],
["Coach section uses training approach language", coachHtml.includes("Training approach") && coachHtml.includes("Why Atlas uses a Chinese-influenced approach.") && !coachHtml.includes("Training influences") && !coachHtml.includes("Three lenses. One Atlas approach.")],
["Training approach distinguishes comparison systems from Atlas method", coachHtml.includes("Bulgarian approach") && coachHtml.includes("Heavy, specific, and high intensity.") && coachHtml.includes("American approaches") && coachHtml.includes("More varied and periodized.") && coachHtml.includes("Chinese-influenced approach") && coachHtml.includes("Technique, positions, mobility, and supporting strength.") && coachHtml.includes("ATLAS METHOD")],
["Coach Shen application block resolves the method", coachHtml.includes("How Coach Shen applies it") && coachHtml.includes("Chinese-influenced technique, adapted to the athlete.") && coachHtml.includes("Coach Shen uses Chinese-influenced principles as the foundation of her coaching") && coachHtml.includes("Repeatable technical positions.") && coachHtml.includes("Mobility that supports the lifts.") && coachHtml.includes("Accessory work chosen for a purpose.") && coachHtml.includes("Strength developed around the demands of weightlifting.")],
["Coach section keeps Shen group labels", coachHtml.includes("Qualifications") && coachHtml.includes("Coaching Philosophy") && coachHtml.includes("Technique and positions") && coachHtml.includes("Training approach")],
```

- [ ] **Step 2: Add CSS interaction assertions**

Add a check near the other method card checks:

```js
["Method cards reveal details accessibly across desktop and mobile", css.includes(".lifting-method-card:hover .lifting-method-drawer") && css.includes(".lifting-method-card:focus .lifting-method-drawer") && css.includes(".lifting-method-card:focus-within .lifting-method-drawer") && css.includes("grid-template-rows: 0fr") && css.includes("grid-template-rows: 1fr") && css.includes("@media (max-width: 1023px)") && css.includes(".lifting-method-drawer") && css.includes("transform: none")],
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`

Expected: FAIL with the new Coach section copy and interaction checks missing.

---

### Task 2: Rewrite the Lower Coach HTML

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: class names already styled in `src/styles.css`.
- Produces: updated public-facing Coach Shen methodology content.

- [ ] **Step 1: Update Technique and Positions copy**

In the `.technique-gallery-copy` block, replace the headline and paragraph with:

```html
<h3 class="technique-gallery-headline">
  Teach the position. Then teach the athlete to use it<span>.</span>
</h3>
<p class="technique-gallery-body">
  Coach Shen teaches the Olympic lifts by breaking down the
  positions, timing, and movement patterns that make up the full
  lift. Rather than relying on one cue for every athlete, she looks
  at where the lift is breaking down and chooses mobility work,
  technical drills, or strength work around that specific problem.
</p>
<p class="technique-gallery-body technique-gallery-body-secondary">
  The goal is to give the athlete a position they understand and can
  reproduce as the lift gets faster and heavier.
</p>
```

- [ ] **Step 2: Update Mobility and Technique cards**

Replace the Mobility card heading/body with:

```html
<h4>Create access to the position.</h4>
<span>
  When mobility limits a position used in the snatch or clean and
  jerk, Coach Shen addresses that limitation as part of the training
  session. The goal is not flexibility for its own sake. It is giving
  the athlete access to a position they need to lift effectively.
</span>
```

Replace the Technique card heading/body with:

```html
<h4>Use drills to solve what she sees.</h4>
<span>
  Technical variations are selected around the problem in front of
  her. That may mean working on bar path, pull timing, footwork,
  turnover, dip-drive rhythm, or the receiving position rather than
  adding drills without a specific reason.
</span>
```

- [ ] **Step 3: Update the three lower process items**

Change the proof strip `aria-label` to:

```html
aria-label="Coach Shen teaching process"
```

Use these three article bodies:

```html
<p><span>01</span> Position</p>
<strong>Find the position the athlete needs.</strong>
<small>Mobility and setup work are used when the athlete cannot consistently access a position required by the lift.</small>
```

```html
<p><span>02</span> Practice</p>
<strong>Give the athlete opportunities to repeat it.</strong>
<small>Technical drills isolate parts of the movement so Coach Shen can reinforce the position, timing, or pattern being worked on.</small>
```

```html
<p><span>03</span> Apply</p>
<strong>Bring it back into the full lift.</strong>
<small>The change matters when the athlete can carry it into the snatch or clean and jerk as speed and load increase.</small>
```

- [ ] **Step 4: Rewrite Training Approach header**

Replace the method header label, headline, and paragraph with:

```html
<p>Training approach</p>
<h3 id="method-heading">Why Atlas uses a Chinese-influenced approach.</h3>
```

```html
<p>
  Weightlifting systems can place very different emphasis on
  intensity, exercise selection, positions, and technical development.
  Atlas uses a Chinese-influenced approach. The comparisons below show
  how that approach differs from two other commonly discussed systems.
</p>
```

- [ ] **Step 5: Rewrite method cards**

Bulgarian card:

```html
<h4>Bulgarian approach</h4>
<p class="lifting-method-summary">Heavy, specific, and high intensity.</p>
<div class="lifting-method-drawer">
  <div>
    <p>Bulgarian-style training is commonly associated with frequent exposure to heavy competition lifts, limited exercise variation, and high training intensity.</p>
    <ul>
      <li>Frequent heavy classical lifts.</li>
      <li>Relatively narrow exercise selection in its best-known forms.</li>
      <li>High recovery demands from repeated high-intensity exposure.</li>
    </ul>
    <p>Compared with the approach used at Atlas, it places less emphasis on extensive accessory work and technical variation.</p>
  </div>
</div>
```

American card:

```html
<h4>American approaches</h4>
<p class="lifting-method-summary">More varied and periodized.</p>
<div class="lifting-method-drawer">
  <div>
    <p>American weightlifting programs vary considerably, but many use planned training blocks, broader exercise selection, and changing levels of volume and intensity.</p>
    <ul>
      <li>Broader exercise selection.</li>
      <li>Planned changes in training volume and intensity.</li>
      <li>Programming can differ substantially between coaches and systems.</li>
    </ul>
    <p>Compared with Atlas, American weightlifting is less defined by one technical methodology and can vary significantly from coach to coach.</p>
  </div>
</div>
```

Chinese card:

```html
<span class="lifting-method-badge">ATLAS METHOD</span>
<h4>Chinese-influenced approach</h4>
<p class="lifting-method-summary">Technique, positions, mobility, and supporting strength.</p>
<div class="lifting-method-drawer">
  <div>
    <p>Atlas follows a Chinese-influenced approach that gives substantial attention to technical positions, mobility, accessory strength work, and repetition of the movements that support the snatch and clean and jerk.</p>
    <ul>
      <li>Detailed technical work.</li>
      <li>Mobility when positions require it.</li>
      <li>Accessory work selected around weaknesses or technical needs.</li>
      <li>Positional and leg strength developed alongside the competition lifts.</li>
    </ul>
  </div>
</div>
```

- [ ] **Step 6: Rewrite final highlighted block**

Replace the final choice block label, body, and list with:

```html
<p>How Coach Shen applies it</p>
<h4>Chinese-influenced technique, adapted to the athlete.</h4>
```

```html
<p>
  Coach Shen uses Chinese-influenced principles as the foundation of her
  coaching. She emphasizes technical detail, positional strength,
  mobility, and accessory work, then adjusts those tools around the
  athlete's proportions, experience, current limitations, and training
  goals.
</p>
```

```html
<li>Repeatable technical positions.</li>
<li>Mobility that supports the lifts.</li>
<li>Accessory work chosen for a purpose.</li>
<li>Strength developed around the demands of weightlifting.</li>
```

- [ ] **Step 7: Run test and expect CSS failures remain**

Run: `npm test`

Expected: content checks pass or move forward; CSS interaction check still fails until Task 3.

---

### Task 3: Update CSS for Process Copy and Method Reveal

**Files:**
- Modify: `src/styles.css`
- Build output: `dist/styles.css`

**Interfaces:**
- Consumes: existing classes from `index.html`.
- Produces: subtle process-number styling, desktop method-card reveal, visible mobile details, and reduced-motion compatibility.

- [ ] **Step 1: Add secondary body and process-detail styles**

In `src/styles.css`, near the Coach technique styles, add:

```css
.technique-gallery-body-secondary {
  margin-top: 0.9rem;
  color: rgba(244, 242, 237, 0.7);
}

.coach-technique-panel .technique-proof-strip p span {
  color: #f7d64a;
  font-size: 0.62rem;
  font-weight: 950;
  letter-spacing: 0.18em;
}

.coach-technique-panel .technique-proof-strip small {
  display: block;
  max-width: 18rem;
  margin-top: 0.62rem;
  color: rgba(244, 242, 237, 0.62);
  font-size: 0.78rem;
  font-weight: 650;
  line-height: 1.45;
}
```

- [ ] **Step 2: Convert drawer reveal to grid rows**

Replace the current `.lifting-method-drawer` block with:

```css
.lifting-method-drawer {
  display: grid;
  grid-template-rows: 0fr;
  margin-top: 0.85rem;
  opacity: 0;
  transform: translateY(0.45rem);
  transition:
    grid-template-rows 440ms cubic-bezier(0.32,0.72,0,1),
    opacity 360ms cubic-bezier(0.32,0.72,0,1),
    transform 440ms cubic-bezier(0.32,0.72,0,1);
}

.lifting-method-drawer > div {
  overflow: hidden;
}

.lifting-method-card:hover .lifting-method-drawer,
.lifting-method-card:focus .lifting-method-drawer,
.lifting-method-card:focus-within .lifting-method-drawer {
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Style drawer paragraphs and badge**

Add:

```css
.lifting-method-drawer p {
  color: rgba(244, 242, 237, 0.64);
  font-size: 0.84rem;
  line-height: 1.48;
}

.lifting-method-drawer p + ul,
.lifting-method-drawer ul + p {
  margin-top: 0.9rem;
}

.lifting-method-badge {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 0.8rem;
  border: 1px solid rgba(247, 214, 74, 0.42);
  border-radius: 999px;
  padding: 0.38rem 0.62rem;
  color: #f7d64a;
  font-size: 0.56rem;
  font-weight: 950;
  letter-spacing: 0.18em;
  line-height: 1;
}
```

- [ ] **Step 4: Ensure mobile details are visible**

Inside the existing `@media (max-width: 1023px)` block, set:

```css
.lifting-method-drawer {
  grid-template-rows: 1fr;
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 5: Ensure reduced motion removes translated reveal**

Inside `@media (prefers-reduced-motion: reduce)`, add or preserve:

```css
.lifting-method-drawer {
  transform: none;
}
```

- [ ] **Step 6: Build generated CSS**

Run: `npm run build`

Expected: `dist/styles.css` updates.

- [ ] **Step 7: Run verification**

Run:

```bash
npm test
node --check src/main.js
```

Expected: both pass.

---

### Task 4: Pronoun Audit, Review, and Finish

**Files:**
- Inspect: `index.html`, `src/main.js`, `src/styles.css`, `tests/verify-scroll-animations.mjs`

**Interfaces:**
- Consumes: final implementation from Tasks 1-3.
- Produces: verified final state, review findings addressed if needed, and a commit.

- [ ] **Step 1: Search Coach Shen references**

Run:

```bash
rg -n "Coach Shen|Shen|\\bhe\\b|\\bhim\\b|\\bhis\\b|\\bshe\\b|\\bher\\b|\\bhers\\b" index.html src tests
```

Expected: any Coach Shen pronoun references use she/her/hers.

- [ ] **Step 2: Run final verification**

Run:

```bash
npm test
npm run build
node --check src/main.js
git diff --check
```

Expected: tests, build, and JS check pass; `git diff --check` has no whitespace errors except normal Windows line-ending warnings.

- [ ] **Step 3: Review final diff for scope**

Run:

```bash
git diff -- index.html src/styles.css dist/styles.css tests/verify-scroll-animations.mjs docs/superpowers/specs/2026-08-12-coach-shen-methodology-design.md docs/superpowers/plans/2026-08-12-coach-shen-methodology.md
```

Confirm no unrelated site sections were changed.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add index.html src/styles.css dist/styles.css tests/verify-scroll-animations.mjs docs/superpowers/plans/2026-08-12-coach-shen-methodology.md
git commit -m "feat: rewrite coach methodology section"
```

- [ ] **Step 5: Push if requested or already approved by project flow**

Run:

```bash
git push origin main
```
