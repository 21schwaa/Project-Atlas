# Atlas Conversion Flow Refinement Design

## Objective

Refine the existing Atlas Barbell Club landing page conversion path without a broad redesign. The final page should help visitors understand Atlas, choose how they want to train, inspect the facility, read the matching training option, and contact Atlas with minimal friction.

## Current Context

The site is a static HTML/Tailwind v4 landing page with vanilla JavaScript and simple Node verification tests. The existing dark industrial Atlas identity, amber accent, fixed header, floating Google Reviews placeholder, hero composition, training sections, coach section, member stories, contact section, and DigitalOcean build flow are already close to final.

There are current uncommitted refinements in the working tree for:

- floating Google Reviews placement
- hero CTA spacing
- active header navigation highlighting

Implementation must preserve and integrate those changes rather than overwrite them.

## Final Page Hierarchy

The main content order becomes:

1. Hero, `#home`
2. Compact training selector, `#training-options`
3. What We Have, `#equipment`
4. What We Offer, `#offerings`
5. Team Programming, `#team`
6. Coaching, `#coaching`
7. Open Gym, `#open-gym`
8. Meet Coach Shen, `#coach`
9. Member Stories, `#testimonials`
10. Contact, `#contact`
11. Footer

The large `#welcome` section is removed. Its general copy, origin placeholder, and principles are deleted because the hero already explains what Atlas is, where it is, and the available training paths.

## Training Selector

The useful selector from the removed Welcome section becomes a compact standalone transition immediately after the hero.

Required section:

- id: `training-options`
- label: `Choose how you train`
- heading: `Three ways to train at Atlas.`
- no long explanatory company paragraph

Required links:

- Team Programming, `Follow a shared weekly track.`, target `#team`
- Coaching, `Get a closer eye on the lift.`, target `#coaching`
- Open Gym, `Bring your own plan.`, target `#open-gym`

The selector remains visually restrained and action-oriented. It should not become a massive new section.

## Hero and Navigation Changes

The hero remains visually unchanged except for the tertiary action:

- `Get Started`
- supporting copy: `Choose how you want to train.`
- target: `#training-options`

The main desktop and mobile navigation removes `Welcome`.

Final nav labels:

- The Floor
- Training
- Coach
- Lifters
- Contact

The logo continues to link to `#home`.

The existing active-section nav highlight must be preserved and updated so it does not reference removed `#welcome`.

## Contextual Training CTAs

Each major training option receives a contextual CTA at the end of its own section. These CTAs route to `#contact` and include a `data-training-interest` attribute for future form integration.

Team Programming:

- visible label: `Start Team Programming`
- supporting copy: `Ask about joining the Atlas training track.`
- href: `#contact`
- data: `data-training-interest="team"`

Coaching:

- visible label: `Ask About Coaching`
- supporting copy: `Tell us what you want help with.`
- href: `#contact`
- data: `data-training-interest="coaching"`

Open Gym:

- visible label: `Start Open Gym`
- supporting copy: `Ask about access and getting started.`
- href: `#contact`
- data: `data-training-interest="open-gym"`

The CTAs should feel like natural conclusions to their sections. They must not compete with the hero primary CTA or look like large generic SaaS buttons.

## Persistent Start Training CTA

Add a persistent right-side `Start Training` CTA that links to `#contact`.

Required markup behavior:

- actual anchor element
- href `#contact`
- accessible name includes `Start Training`
- optional small supporting text: `Find your next step`

Required visibility behavior:

- hidden while `#home` is visible
- visible after the hero exits
- remains visible through `#training-options`, `#equipment`, `#offerings`, `#team`, `#coaching`, `#open-gym`, `#coach`, and `#testimonials`
- hides when `#contact` enters view
- may return when scrolling back upward out of contact

JavaScript uses `IntersectionObserver`, not hardcoded scroll thresholds.

Internal state:

- `heroVisible`
- `contactVisible`
- `shouldShow = !heroVisible && !contactVisible`

CSS handles the entrance and exit with opacity and `translateX`. Reduced motion disables the translated animation.

## Floating UI Balance

The Google Reviews component remains a truthful bottom-left trust element:

- `Google Reviews`
- `Reviews coming soon`
- no fake rating, stars, counts, quotes, scores, Google review links, or external widgets

The Start Training tab lives on the opposite side and serves conversion. These elements must not be merged.

Desktop composition:

- Google Reviews bottom-left
- Start Training right edge

Mobile composition:

- Google Reviews remains bottom-left and compact
- Start Training uses a smaller bottom-right or right-edge treatment
- neither floating control should cover meaningful contact content or create an unusable stack at 320px

## Visual Direction

Preserve the Atlas dark industrial visual language:

- dark background
- amber edge/detail
- white typography
- precise machined shapes
- restrained motion

The global CTA should feel attached to the right edge of the viewport, not like a generic floating chat widget, badge, pulsing button, or glassy SaaS pill.

The page should feel more actionable, not more crowded.

## CSS Cleanup

After deleting `#welcome`, remove CSS that is demonstrably unused:

- `.welcome-grid`
- `.welcome-copy`
- `.welcome-editorial`
- `.welcome-origin-note`
- `.welcome-principles`

Keep and reuse `.training-selector` styles unless the implementation clearly benefits from a narrowly scoped rename.

Avoid broad CSS refactors.

## Anchor Requirements

Final important anchors:

- `#home`
- `#training-options`
- `#equipment`
- `#offerings`
- `#team`
- `#coaching`
- `#open-gym`
- `#coach`
- `#testimonials`
- `#contact`

No `#welcome` section or `href="#welcome"` references should remain.

## Accessibility Requirements

Training selector links must have clear names.

Contextual CTAs must not rely on generic repeated text. Each visible label should be specific:

- `Start Team Programming`
- `Ask About Coaching`
- `Start Open Gym`

The persistent CTA must be keyboard focusable and implemented as an anchor.

Active nav highlighting must continue to set `aria-current="true"` on the current section link.

Motion must respect `prefers-reduced-motion`.

## Testing Requirements

Update existing static tests without adding a new framework.

Required coverage:

- hero `Get Started` links to `#training-options`
- no `#welcome` section remains
- no `href="#welcome"` remains
- training selector exists after hero and before equipment
- selector links target `#team`, `#coaching`, and `#open-gym`
- contextual training CTAs exist and link to `#contact`
- contextual CTAs include `data-training-interest="team"`, `data-training-interest="coaching"`, and `data-training-interest="open-gym"`
- persistent Start Training CTA exists and links to `#contact`
- persistent CTA JavaScript observes `#home` and `#contact`
- visibility logic uses `heroVisible`, `contactVisible`, and `IntersectionObserver`
- mobile navigation and active nav behavior still exist
- Google Reviews placeholder remains truthful

## Verification Requirements

Before completion, run:

- `npm test`
- `npm run build`

If DigitalOcean output is affected or final delivery includes deployment readiness, also run:

- `npm run build:digitalocean`
- `npm run verify:digitalocean`

## Out of Scope

Do not redesign unrelated sections:

- What We Have
- Team Programming core content
- Coaching core content
- Open Gym core content
- Meet Coach Shen
- Qualifications
- Technique section
- Training Influences
- Member Stories carousel
- Contact design
- Footer
- Google Reviews design
- Hero major visual composition

Do not add a booking system, complex form logic, Google Places integration, review widget, or new dependency.

## Spec Self-Review

- No unresolved placeholders remain.
- The hierarchy, anchor list, nav labels, and CTA behavior are internally consistent.
- The scope is one focused conversion-flow pass.
- The only required generated output is the existing compiled CSS after source CSS changes.
