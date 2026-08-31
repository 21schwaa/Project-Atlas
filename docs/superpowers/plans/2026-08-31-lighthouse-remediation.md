# Lighthouse Remediation Implementation Plan

> **For Codex:** Execute this plan with the test-driven-development, systematic-debugging, and verification-before-completion workflows.

**Goal:** Resolve the reported first-party Lighthouse accessibility, image-sizing, SVG-payload, caching, and security-header findings without redesigning the site or altering its animations.

**Architecture:** Keep the site as a static HTML/CSS/JavaScript build. Add targeted regression checks around ARIA and asset markup, optimize the specified SVG sources with a reproducible conservative SVGO configuration, and document platform-level response-header limits rather than introducing an application server.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js test scripts, headless Chromium/Edge responsive fixture, axe-core, SVGO, DigitalOcean App Platform static-site build.

---

### Task 1: Add failing accessibility and asset regressions

**Files:**
- Modify: `tests/responsive-fixture.html`
- Modify: `tests/verify-responsive.mjs`
- Create: `tests/verify-lighthouse-remediation.mjs`
- Modify: `package.json`

1. Add targeted axe checks for ARIA validity to the rendered responsive fixture.
2. Add source assertions that the equipment side strip has no prohibited ARIA and every image has positive intrinsic dimensions.
3. Add SVG assertions for valid vector markup, retained view boxes, absence of embedded raster images, and size budgets.
4. Run the new checks and confirm they fail against the current markup/assets.

### Task 2: Fix ARIA and explicit image dimensions

**Files:**
- Modify: `index.html`

1. Remove the prohibited accessible-name attribute from the decorative equipment strip.
2. Add natural-ratio `width` and `height` attributes to image elements while leaving responsive CSS sizing unchanged.
3. Run the targeted source and rendered accessibility tests.

### Task 3: Optimize the nine reported SVGs safely

**Files:**
- Modify: `teamicon.svg`, `platformlogo.svg`, `stopwatchicon.svg`, `clean.svg`, `opengym.svg`, `snatch.svg`, `squat.svg`, `planicon.svg`, `jerk.svg`
- Create: `svgo.config.mjs`
- Modify: `package.json`, `package-lock.json`

1. Add a conservative, reproducible SVGO configuration that preserves view boxes and vector rendering.
2. Optimize only the nine specified SVG files.
3. Confirm the optimized files remain SVG vectors, preserve their dimensions/view boxes, pass size budgets, and render without an appearance regression.

### Task 4: Address deploy-policy findings within static-hosting limits

**Files:**
- Modify: `index.html` only if a compatible meta-delivered CSP is safe
- Modify: `.do/app.yaml.example` only if DigitalOcean supports the needed settings
- Modify: `docs/digitalocean-app-platform.md`
- Modify: `scripts/verify-digitalocean-build.mjs`

1. Confirm DigitalOcean App Platform static-site cache and custom-response-header capabilities from current official documentation.
2. Add only repository-level controls that DigitalOcean supports cleanly; do not add unsupported `_headers` conventions or immutable caching on stable filenames.
3. Document any cache/security headers that require an edge proxy or a service component.
4. Extend production-output verification for any repository-delivered policy.

### Task 5: Full verification and review

**Files:**
- Verify all changed source and generated production files.

1. Run `npm test`.
2. Run `npm run test:responsive`.
3. Run `npm run build:digitalocean`.
4. Run `npm run verify:digitalocean`.
5. Review `public/` for ARIA, dimensions, optimized assets, indexing directives, and obvious policy mistakes.
6. Report changed files, issue mapping, platform-only items, and intentional non-changes.
