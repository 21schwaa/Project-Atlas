# Coach Shen Methodology Design

## Goal

Rewrite the lower half of the Meet Coach Shen section so it reads as Coach Shen's coaching method, not a generic explanation of Olympic weightlifting systems.

## Scope

This pass is limited to:
- Technique and Positions copy.
- Mobility and Technique card copy.
- The three lower technique process items.
- Training Approach copy.
- Method card reveal behavior.
- Coach Shen pronoun correctness in public-facing content.

This pass does not redesign the hero, equipment, offerings, testimonials, contact, floating CTAs, Coach Shen profile photo, qualifications layout, Coaching Philosophy layout, or transition header.

## Design Read

This is a targeted evolution of an existing premium local gym landing page. The Atlas visual language remains dark, industrial, amber-accented, image-led, and restrained. The lower Coach section should become more coach-led and technical without adding visual noise or a new design direction.

## Technique and Positions

The existing section shell remains. The headline changes to:

> Teach the position. Then teach the athlete to use it.

The intro copy explains that Coach Shen observes where the lift breaks down, then chooses mobility work, technical drills, or strength work around that specific problem.

The two upper cards become:
- Mobility: "Create access to the position."
- Technique: "Use drills to solve what she sees."

The lower proof strip becomes a teaching progression:
- 01 Position: find the position the athlete needs.
- 02 Practice: give the athlete opportunities to repeat it.
- 03 Apply: bring it back into the full lift.

The progression should be visually clear but quiet: small amber numbers, compact headings, existing icon language, no oversized statistic cards.

## Training Approach

The section label changes from "Training influences" to:

> Training approach

The headline changes to:

> Why Atlas uses a Chinese-influenced approach.

The intro establishes that Bulgarian and American systems are comparisons only, while Atlas uses a Chinese-influenced approach.

The method cards remain Bulgarian, American, and Chinese:
- Bulgarian approach: heavy, specific, and high intensity.
- American approaches: more varied and periodized.
- Chinese-influenced approach: technique, positions, mobility, and supporting strength.

The Chinese card gets a restrained `ATLAS METHOD` marker and subtle amber emphasis. It should not look like a pricing plan or an aggressive superiority claim.

## Method Card Interaction

On desktop:
- Cards show flag, title, and short summary by default.
- Bullet details reveal on hover, focus, and focus-within.
- Reveal uses opacity, transform, and grid-template-rows or max-height.
- The card should not bounce or move significantly.

On mobile and touch-sized layouts:
- Bullet details remain visible without hover or tap.
- No new tap-to-expand behavior is added.

Reduced motion:
- Details remain available.
- Translated reveal motion is removed.

## Final Highlight

The final highlighted block changes from a generic Atlas approach summary to:

> How Coach Shen applies it

Headline:

> Chinese-influenced technique, adapted to the athlete.

The body explains that Coach Shen uses Chinese-influenced principles as the foundation, then adapts technical detail, positional strength, mobility, and accessory work around the athlete's proportions, experience, current limitations, and training goals.

The final principle list becomes:
- Repeatable technical positions.
- Mobility that supports the lifts.
- Accessory work chosen for a purpose.
- Strength developed around the demands of weightlifting.

## Test Requirements

Automated checks should cover:
- "Training approach" replaces "Training influences" in the Coach section.
- Chinese card contains `ATLAS METHOD`.
- Technique process contains Position, Practice, and Apply.
- Bulgarian, American, and Chinese comparison cards remain present.
- Coach Shen public-facing references use she/her language where pronouns are present.
- Method card details are hidden by default on desktop and revealed on hover/focus.
- Method card details remain visible in mobile CSS.

## Acceptance Criteria

The lower Coach section should answer:
- What Coach Shen teaches.
- Why she teaches it that way.
- How she decides what to work on.
- Which methodology Atlas uses.
- How that methodology differs from Bulgarian and American comparisons.

The implementation should pass `npm test`, `npm run build`, and `node --check src/main.js`.
