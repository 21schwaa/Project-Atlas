# Atlas Barbell Club Targeted Premium Cleanup Design

Date: 2026-08-11

## Design Read

This is a redesign-preserve pass for a local Olympic weightlifting gym. The audience is lifters in Phoenix who need to understand whether Atlas fits their training style: team programming, coaching, open gym, technique work, and a serious floor.

The visual language should stay premium industrial sport: dark off-black surfaces, gold accent, real gym photography, machined details, heavy sans typography, and restrained motion. The goal is not a full visual restart. The goal is to remove generic patterns, reduce busyness, and make each major anchor feel like a composed section hero.

Design dials:

- Design variance: 7
- Motion intensity: 5
- Visual density: 4

## Current Problems To Fix

1. Anchor sections such as `#welcome`, `#equipment`, and `#offerings` can render as blank when loaded directly in a browser capture. The reveal system and anchor scroll behavior need to be safer.
2. The page uses too many small uppercase labels and pills. This creates a repeated AI-template rhythm.
3. Too many sections rely on similar card grids. The page needs more variation between editorial intro, image-led floor story, training-path selector, coach dossier, review gateway, and final contact.
4. The home hero is strong, but the first viewport has too many competing proof and action elements.
5. Equipment copy contains intentionally uncertain inventory language. It should avoid looking unfinished while still not fabricating exact quantities.
6. Testimonials currently use placeholder quote cards. The section should not imply fake reviews.
7. Several surface styles use similar rounded-card treatments. They should be reserved for hierarchy, not every block.
8. The footer uses decorative middle-dot separators. Replace with simpler spacing or text rhythm.

## Non-Goals

- Do not change the core information architecture.
- Do not rename primary anchors: `#home`, `#welcome`, `#equipment`, `#offerings`, `#team`, `#coaching`, `#open-gym`, `#coach`, `#testimonials`, `#contact`.
- Do not invent founder story, equipment counts, coach biography details, member quotes, or review content.
- Do not replace the Atlas logo or current brand accent.
- Do not introduce a new framework or dependency.

## Global Design Direction

Keep the existing brand world:

- Dark off-black page theme.
- Gold Atlas accent.
- Fixed PHX rail on desktop.
- Strong photographic sections.
- CSS.gg social and arrow icons where currently used.
- Existing custom SVG icons for Atlas-specific concepts.

Refine the system:

- Reduce section badges. Keep labels only where they help orientation. Most section headings can stand without a pill.
- Use one card radius system: large outer frames around major media, smaller inner cards only where needed.
- Keep buttons as pill CTAs with nested arrow circles.
- Make section anchors reliable with `scroll-margin-top` and reveal behavior that does not hide direct anchor targets.
- Keep motion to reveal, image scale, hover feedback, and the single marquee. Do not add new scroll-hijacks.
- Keep all animation gated by reduced-motion preferences.

## Section Designs

### Home

Preserve the current diagonal image hero and industrial contour language. Simplify the action area:

- Keep headline: "Olympic weightlifting without the guesswork."
- Keep primary CTA: "Start training" to `#contact`.
- Keep secondary CTA: "See the floor" to `#equipment`.
- Remove the third hero CTA from the first viewport.
- Reduce the visual weight of the Google Reviews pill. It can remain as a small proof element, but it should not compete with the CTAs.
- Keep the platform card, but make it slightly calmer and ensure its body text is readable at all viewport sizes.

### Welcome

Make this the calm orientation chapter after the cinematic hero.

- Use one strong headline and short body copy.
- Remove most mini-labels inside the section.
- Replace the four-card bento feel with an editorial intro plus a compact "ways to train" selector.
- Keep the founder/origin copy conservative and clearly not fabricated.
- The selector should link to Team Programming, Coaching, and Open Gym without feeling like another heavy card grid.

### Equipment

Make this the strongest section hero after the homepage hero.

- Use a large photo-led composition of the floor.
- Keep supporting images as a smaller strip or asymmetric deck.
- Present equipment as concise categories, not a long spec table.
- Use neutral copy for unknown inventory: "used for", "available for", and "details confirmed before visiting" only when needed.
- Keep the physical therapy note small and clear: separate practice, independent, attached to the facility.

### Offerings

Turn Team Programming, Coaching, and Open Gym into three training paths.

- Use a stacked path layout rather than repeated card clusters.
- Each path should have one dominant idea, one concise body, and one supporting visual or icon.
- Keep Team Programming first, Coaching second, Open Gym third.
- Keep Open Gym visually related to the hero, but reduce its scale so it does not overpower the entire offerings section.
- Use service cards only for real sub-choices, not decorative filler.

### Coach

Keep this as the human credibility chapter.

- Keep "Meet Coach Shen".
- Improve the qualifications card readability.
- Keep Technique and Mobility as a supporting module under the coach, but reduce the glass-card intensity.
- Keep Training Influences under the coach, but make the method cards quieter and easier to scan.
- Preserve the careful language around Bulgarian, American, and Chinese-influenced systems. Atlas should remain "primarily Chinese-influenced", not framed as the only correct method.

### Testimonials

Do not fake member quotes.

- Convert the section into a Google Reviews gateway until real testimonials are supplied.
- Use a strong headline, small review prompt, Google review card, and one quiet note that real member quotes can be added later.
- Remove visible placeholder testimonial cards from the live design.
- Keep internal source notes only if useful, but avoid visible placeholder content.

### Contact

Make this the final action section.

- Keep one clear CTA: "Ask about training".
- Keep hours, email, and map.
- Make the map and contact layout feel less like two generic cards. Use one calm final split.
- Keep the Google Maps embed and directions link.

## Technical Requirements

- Add `scroll-margin-top` for all major anchored sections.
- Ensure direct anchor loads are visible even before IntersectionObserver marks reveal items visible.
- Keep no-JS content visible by default.
- Keep the DigitalOcean build path working.
- Preserve `public/` build output behavior.
- Update tests to cover anchor safety, reduced placeholder content, and the new section design expectations.

## Verification Plan

Run:

- `npm test`
- `npm run build:digitalocean`
- `npm run verify:digitalocean`

Also capture local screenshots from:

- `/`
- `/#welcome`
- `/#equipment`
- `/#offerings`
- `/#coach`
- `/#testimonials`
- `/#contact`

The screenshots should show meaningful content in the first viewport for each anchor.

## Approval Scope

This spec approves a targeted premium cleanup, not a full redesign. Implementation should focus on visual simplification, anchor reliability, section differentiation, and removing generic placeholder patterns while preserving the existing Atlas identity.
