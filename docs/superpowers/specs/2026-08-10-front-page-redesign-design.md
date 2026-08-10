# Atlas Front Page Redesign Design

## Goal

Redesign the Atlas Barbell Club front page so it feels more eye-catching, premium, and clearly focused on Olympic weightlifting without becoming visually busy.

## Direction

Use a dark, cinematic training-room aesthetic with amber highlights, restrained image treatment, large editorial typography, and generous whitespace. The page stays a static HTML/Tailwind site and keeps the current `src/main.js` reveal pattern, with GSAP added from a CDN for scroll-based image and text motion.

## Page Structure

- Navigation: floating rounded island with logo, key section links, and a trial CTA.
- Attention: asymmetrical hero with a wide 2-3 line headline, two high-contrast CTAs, Atlas logo hardware panel, and Olympic weightlifting language.
- Interest: gapless dense bento section for platforms, coaching, beginner onboarding, and barbell culture.
- Desire: scroll-led media/story section with image scale/fade and scrubbed text reveal.
- Action: strong final CTA with contact link and concise footer.

## Constraints

- Keep the site static: HTML, Tailwind CSS, and vanilla JavaScript only.
- Do not add a JavaScript framework.
- Use `Geist` as the primary type direction through CSS font stacks.
- Avoid old generic content labels: `Powerlifting`, `Strength Basics`, and raw hero stat blocks.
- Keep the page visually rich but not crowded: 3-5 major bento cards, large section padding, and no nested card clutter.
- Maintain accessibility basics: skip link, semantic sections, readable contrast, descriptive link text, and reduced-motion handling.

## Verification

Run `npm test` to confirm required markup, copy, and animation hooks exist. Run `npm run build` to compile Tailwind output.
