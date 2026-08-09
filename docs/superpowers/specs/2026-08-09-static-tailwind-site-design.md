# Static Tailwind Site Design

## Goal

Create a basic website framework for Atlas Barbell Club using npm, HTML5, and Tailwind CSS.

## Approach

Use a vanilla static site so the project stays easy to open, edit, and deploy. Tailwind CSS is compiled from `src/styles.css` into `dist/styles.css` through npm scripts.

## Files

- `index.html`: Semantic HTML5 page structure and starter content.
- `src/styles.css`: Tailwind import plus small global base rules.
- `dist/styles.css`: Generated CSS output.
- `package.json`: Project metadata and Tailwind build scripts.
- `.gitignore`: Local dependency and OS file ignores.
- `README.md`: Basic usage instructions.

## Verification

Run `npm run build` and confirm Tailwind writes `dist/styles.css`.
