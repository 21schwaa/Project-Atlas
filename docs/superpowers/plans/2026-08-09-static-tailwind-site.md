# Static Tailwind Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a basic static website framework for Atlas Barbell Club.

**Architecture:** The site uses plain HTML5 for content and Tailwind CSS for styling. npm scripts run the Tailwind CLI to build a generated stylesheet from a small source CSS file.

**Tech Stack:** HTML5, npm, Tailwind CSS 4 CLI.

## Global Constraints

Use option 1: vanilla static HTML and Tailwind CSS.
Keep the scaffold lightweight and easy to open locally.
Do not add a JavaScript framework.

---

### Task 1: Static Website Scaffold

**Files:**
- Create: `index.html`
- Create: `src/styles.css`
- Create: `.gitignore`
- Create: `README.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: Tailwind CLI from `devDependencies`.
- Produces: `npm run dev`, `npm run build`, `index.html`, and `src/styles.css`.

- [x] **Step 1: Add npm scripts**

```json
"scripts": {
  "dev": "tailwindcss -i ./src/styles.css -o ./dist/styles.css --watch",
  "build": "tailwindcss -i ./src/styles.css -o ./dist/styles.css --minify"
}
```

- [x] **Step 2: Add Tailwind source CSS**

```css
@import "tailwindcss";
```

- [x] **Step 3: Add semantic HTML starter page**

Create a single `index.html` page with a header, hero, training cards, coaching section, visit section, and footer.

- [x] **Step 4: Add documentation**

Create `README.md` with the available npm scripts and local viewing instructions.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Tailwind exits with code 0 and writes `dist/styles.css`.
