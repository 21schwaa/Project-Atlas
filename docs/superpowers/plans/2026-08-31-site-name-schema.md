# Site Name Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Google one unambiguous `WebSite` entity naming the site “Atlas Barbell Club” while preserving the existing gym schema and all visible design/content.

**Architecture:** Extend the existing homepage JSON-LD with a separate `WebSite` object and strengthen the source and generated-output verification scripts. Keep the existing `SportsActivityLocation` object intact and make no CSS, animation, layout, or visible-copy edits.

**Tech Stack:** Static HTML, Schema.org JSON-LD, Node.js verification scripts, DigitalOcean static-site build.

**Spec:** Inline user requirements dated 2026-08-31.

## Global Constraints

- Preferred name must be exactly `Atlas Barbell Club`.
- Alternate name must be exactly `Atlas Barbell`.
- Production homepage URL must be exactly `https://atlasbarbellclub.com/`.
- Exactly one `WebSite` JSON-LD object may exist.
- Preserve the existing `SportsActivityLocation` structured data.
- Do not change styling, layout, animations, or visible page content.

---

### Task 1: Add site-name regression checks

**Files:**
- Modify: `tests/verify-lighthouse-remediation.mjs`
- Modify: `tests/verify-digitalocean-build.mjs`

**Interfaces:**
- Consumes: JSON-LD `<script type="application/ld+json">` blocks in `index.html` and `public/index.html`.
- Produces: Failing checks unless exactly one valid `WebSite` entity and the existing gym entity are present.

- [ ] Add JSON parsing that flattens individual objects and `@graph` entries.
- [ ] Assert exactly one `WebSite` entity with the required name, alternate name, and URL.
- [ ] Assert the `SportsActivityLocation` entity remains present.
- [ ] Assert title, canonical, `og:site_name`, and `og:url` use the requested brand/domain.
- [ ] Run `npm test` and `npm run verify:digitalocean`; confirm failure is caused by the missing `WebSite` object.

### Task 2: Add the WebSite entity

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Existing homepage JSON-LD and verified metadata.
- Produces: One `WebSite` JSON-LD object plus the preserved `SportsActivityLocation` object.

- [ ] Add one JSON-LD block containing `@context`, `@type`, `name`, `alternateName`, and `url` with the exact required values.
- [ ] Leave the existing gym schema and visible branding unchanged.
- [ ] Run `npm test`; confirm the source checks pass.

### Task 3: Build and verify production output

**Files:**
- Generate: `public/index.html`

**Interfaces:**
- Consumes: Updated `index.html` and existing DigitalOcean preparation script.
- Produces: Deployable output with consistent site-name metadata and no duplicate site entity.

- [ ] Run `npm test`.
- [ ] Run `npm run test:responsive`.
- [ ] Run `npm run build:digitalocean`.
- [ ] Run `npm run verify:digitalocean`.
- [ ] Inspect `public/index.html` and report the exact final metadata/schema values and any unrelated pre-existing test failure.
