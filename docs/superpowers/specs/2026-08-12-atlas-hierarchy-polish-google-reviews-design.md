# Atlas Hierarchy Polish and Google Reviews Floating Element Design

## Scope

This pass refines the approved Atlas Barbell Club landing-page hierarchy without rearranging major sections. The goal is to make the existing site more accurate, calmer, and more production-ready while preserving the current dark Atlas visual identity.

The page order remains:

1. Hero
2. Welcome to Atlas
3. What We Have
4. What We Offer
5. Meet Coach Shen
6. Member testimonials
7. Contact
8. Footer

## Design Read

This is a targeted evolution of a local Olympic weightlifting gym landing page for prospective lifters in Glendale and the Phoenix area. The visual language should stay dark, precise, amber-accented, and facility-led. The tone should feel technically credible without sounding like aggressive gym marketing.

## Hero

The hero will keep the existing primary and secondary paths:

- `Start Training` links to `#contact`
- `See the Floor` links to `#equipment`

A third, lighter action will be added:

- `Get Started` links to `#welcome`
- Supporting copy: `Learn what Atlas is about.`

This third action will not be styled as a third large CTA pill. It should feel editorial and secondary to the two main actions.

The current Google Reviews card will be removed from the hero. The business is not yet live, so the hero should not send visitors to an empty Google search result.

## Floating Google Reviews Placeholder

A persistent Google Reviews placeholder will be added outside the hero. It will be static HTML and CSS, with no third-party review SDK or Google Places script.

Desktop behavior:

- Fixed near the bottom-left of the viewport
- Compact enough not to compete with primary CTAs
- Dark surface, amber detail, precise border
- Small Google mark
- Truthful placeholder copy only

Mobile behavior:

- Remains available but compact
- Uses safe-area-aware offsets
- Avoids covering contact CTAs, email, hours, map controls, footer content, or mobile navigation

Current copy:

- `Google Reviews`
- `Reviews coming soon`

The component will include this source comment:

```html
<!-- TODO: Replace Google Reviews placeholder with verified production rating, review count, and business URL -->
```

The placeholder must not include fabricated ratings, stars, review counts, quotes, or public Google scores.

## Testimonials

The testimonial carousel remains. It represents direct comments from Atlas lifters, not Google Reviews.

Navigation and visible labels will change:

- Desktop nav: `Lifters`
- Mobile nav: `Lifters`
- Kicker: `Member stories`
- Headline: `What lifters say about training at Atlas.`
- Carousel aria label: `Atlas Barbell Club member testimonial carousel`
- Controls label: `Testimonial controls`
- Previous/next labels: `Previous testimonial` and `Next testimonial`
- Dot labels: `Show testimonial {n}`

`src/main.js` will include this comment near the placeholder testimonial data:

```js
// TODO: Replace placeholder testimonial content with verified quotes
// collected directly from Atlas Barbell Club lifters before production.
```

The carousel data model remains compatible with future quote, name, training type, context, and optional photo content.

## Location Language

The site will distinguish the physical address from the broader service area.

Changes:

- Meta description and Open Graph description mention Glendale and the Phoenix area.
- Hero eyebrow becomes `Olympic weightlifting in the Phoenix area`.
- Hero body describes Atlas as a Glendale weightlifting gym serving athletes across the Phoenix area.
- Welcome copy describes Atlas as a Glendale training space serving weightlifters across the Phoenix area.
- Origin scaffolding changes from Phoenix-specific to Glendale/Phoenix-area language.
- Footer changes to `Olympic Weightlifting in Glendale, Arizona`.

The contact map and address remain:

- `17437 N 71st Dr Ste 103`
- `Glendale, AZ 85308`

## Welcome Origin Placeholder

The Welcome structure remains unchanged. No founder story, founding year, biography, or origin details will be invented.

The origin statement will receive this comment:

```html
<!-- TODO: Replace with verified Atlas founder/origin story -->
```

## Equipment Copy

The equipment section structure stays intact.

Updates:

- Remove `rehab-style prep`.
- Replace the Accessories copy with: `Bands, dumbbells, and kettlebells support warm-ups, accessory strength work, mobility work, and supplemental training.`
- Avoid guessing that `American` means `American Barbell`.
- Use neutral plate copy: `Plates are available in both pounds and kilograms for Olympic lifting and strength work.`

## Methodology Tone

The Training Influences section stays inside Meet Coach Shen.

Changes:

- `Three lenses. One Atlas bias.` becomes `Three lenses. One Atlas approach.`
- `Atlas bias` becomes `Atlas approach`.
- The national system language will be softened into tendency-based descriptions.
- The current disclaimer that labels are shorthand, not rules, stays.

Bulgarian-influenced summary:

- `Often associated with frequent heavy practice and high specificity.`

Bulgarian bullets:

- `Heavy classical lifts may appear frequently.`
- `Exercise selection is often relatively narrow in the best-known versions of the system.`
- `Frequent high-intensity exposure can place substantial demands on recovery.`

American summary:

- `Often associated with planned training blocks and broader exercise variation.`

American bullets:

- `Loading changes across longer cycles.`
- `Volume and intensity are commonly adjusted across a training cycle.`
- `Strength work supports the lifts.`

Chinese summary:

- `Technique, mobility, and position work.`

Chinese bullets:

- `Accessory work targets lift problems.`
- `Mobility supports stronger positions.`
- `Technical choices can be adjusted around individual proportions and positions.`

Atlas approach explanation:

`Atlas is primarily influenced by the technical detail, positional work, mobility, and accessory training commonly associated with Chinese weightlifting systems. Those ideas are adapted around the athlete's experience, proportions, goals, and training needs rather than copied as a single fixed model.`

Method list:

- `Technical positions you can repeat.`
- `Mobility where the lift requires it.`
- `Drills chosen for a specific purpose.`
- `Strength work that supports the lifts.`

## Technique and Positions Copy

The section layout remains. Its proof strip will become more educational and less absolute.

Positions:

- `Mobility can help athletes access the positions required by the lifts.`

Repetition:

- `Technical repetitions give athletes more opportunities to practice a position consistently.`

Transfer:

- `Repeatable positions make it easier to evaluate what changes as speed or load increases.`

## Mobile Navigation

The native `<details>` mobile navigation remains.

When a valid in-page navigation link is selected, the script will close the mobile navigation with the equivalent of:

```js
mobileNav.open = false;
```

This must preserve:

- Smooth scrolling
- Hash updates
- Back and forward navigation
- Fixed-header offset behavior
- Reduced-motion behavior

## Accessibility

The floating Google Reviews placeholder will be accessible and truthful:

- If non-interactive, it will use informative semantics without pretending to be a link.
- It will not announce a fake rating, fake stars, or fake count.
- Contrast must be sufficient on dark surfaces.
- It will not cover key controls on mobile.

The testimonial carousel will keep semantic buttons and accurate labels.

The mobile menu remains keyboard usable because it keeps native `<details>` and `<summary>` behavior.

## Testing and Verification

The existing test script will be extended rather than introducing a new framework.

Coverage should verify:

- Hero has `Start Training`, `See the Floor`, and `Get Started`.
- Hero no longer contains Google Reviews.
- Floating Google Reviews placeholder exists.
- Floating Google Reviews contains no fake rating, stars, review count, Google score, or Google search link.
- Testimonials use member-story/testimonial language rather than review language.
- Location language uses Glendale and Phoenix area accurately.
- Founder story is marked as pending without invented details.
- Equipment copy avoids rehab-style claims and unverified brand naming.
- Methodology uses `Atlas approach`.
- Training systems use softened tendency-based language.
- Technique proof copy is educational and less absolute.
- Mobile nav close behavior is present in `src/main.js`.
- Contact address and directions remain intact.
- All required anchors remain present.

Fresh verification before completion:

- `npm test`
- `npm run build`
- `npm run build:digitalocean`
- `npm run verify:digitalocean`

## Non-Goals

This pass will not:

- Redesign the page from scratch
- Reorder approved major sections
- Replace the testimonial carousel
- Add fake reviews or ratings
- Add Google Places, review widgets, or third-party scripts
- Invent founder story content
- Invent equipment brand details
- Split Contact back into separate sections
- Introduce large new visual systems or excessive motion
