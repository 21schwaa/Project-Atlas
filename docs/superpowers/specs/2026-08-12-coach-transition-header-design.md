# Coach Transition Header Design

## Objective

Add a small editorial bridge inside the existing Meet Coach Shen section so the reader can move from Coach Shen's profile, qualifications, and philosophy into the technique and training-influence content with clearer rhythm.

## Placement

Insert the bridge immediately after `.coach-profile-grid` closes and immediately before `.coach-support-grid`.

## Copy

Eyebrow:

```text
MEET COACH SHEN
```

Transition line:

```text
How the approach shows up in training.
```

No body paragraph is added.

## Visual Treatment

The bridge is not a new major section. It uses a quiet uppercase eyebrow, a short amber horizontal rule, and restrained editorial type around `clamp(1.6rem, 2.5vw, 2.5rem)`.

It uses the existing Atlas dark industrial styling, the existing reveal system, and responsive rules that prevent horizontal overflow on narrow screens.

## Scope

Do not redesign or rewrite the Coach section. Do not alter qualifications, philosophy, technique, mobility, or training-influence content.

## Verification

Add static coverage for the bridge copy, placement, reveal hook, and CSS selector. Run `npm test` and `npm run build`.
