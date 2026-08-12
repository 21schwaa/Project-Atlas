# Coach Transition Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained transition header between the Coach profile grid and Coach support grid.

**Architecture:** Update the existing static HTML and CSS only, then rebuild the tracked generated CSS. Extend the current static verification test before implementation.

**Tech Stack:** Static HTML, Tailwind v4 CSS source, generated `dist/styles.css`, Node static verification.

## Global Constraints

- Do not redesign the Coach section.
- Insert the bridge after `.coach-profile-grid` and before `.coach-support-grid`.
- Use eyebrow `MEET COACH SHEN`.
- Use line `How the approach shows up in training.`
- Do not add another paragraph.
- Use existing `data-reveal`.
- Do not introduce another `<h2>`.
- Verify with `npm test` and `npm run build`.

---

### Task 1: Test Contract

**Files:**
- Modify: `tests/verify-scroll-animations.mjs`

**Interfaces:**
- Consumes: `index.html`, `src/styles.css`
- Produces: A failing static check for the new coach transition bridge.

- [ ] Add a `coachBridgeIndex` derived from `coachHtml.indexOf("coach-transition-header")`.
- [ ] Add a check requiring bridge copy, placement after `coach-profile-grid`, placement before `coach-support-grid`, `data-reveal`, no `<h2>` inside the bridge, and CSS selector `.coach-transition-header`.
- [ ] Run `npm test` and confirm the coach bridge check fails.

### Task 2: Markup And CSS

**Files:**
- Modify: `index.html`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: Task 1 test.
- Produces: The new transition bridge.

- [ ] Insert `<div class="coach-transition-header" data-reveal data-reveal-delay="220">` after the profile grid and before support grid.
- [ ] Add `<p>MEET COACH SHEN<span aria-hidden="true"></span></p>`.
- [ ] Add `<p class="coach-transition-line">How the approach shows up in training.</p>`.
- [ ] Style the bridge as restrained, left-aligned, responsive, and consistent with the Coach section.
- [ ] Run `npm test` and confirm it passes.

### Task 3: Build And Verify

**Files:**
- Modify: `dist/styles.css`

**Interfaces:**
- Consumes: `src/styles.css`
- Produces: synchronized generated CSS.

- [ ] Run `npm run build`.
- [ ] Run `npm test`.
- [ ] Run `node --check src/main.js`.
- [ ] Commit and push the scoped change.

## Plan Self-Review

This plan covers the complete requested scope and does not include unrelated Coach section changes.
