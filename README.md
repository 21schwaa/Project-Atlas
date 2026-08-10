# Atlas Barbell Club

Static website for Atlas Barbell Club using npm, HTML5, vanilla JavaScript, and Tailwind CSS.

## Scripts

```bash
npm run dev
```

Watches `src/styles.css` and writes compiled CSS to `dist/styles.css`.

```bash
npm run build
```

Builds a minified production CSS file.

```bash
npm run build:digitalocean
```

Builds the production CSS and prepares the DigitalOcean App Platform static output in `public/`.

```bash
npm run verify:digitalocean
```

Checks that `public/` contains the deployable HTML, CSS, JavaScript, and image assets.

Open `index.html` in a browser to view the site.

## DigitalOcean App Platform

Use these App Platform settings:

- Resource type: Static Site
- Source directory: `/`
- Build command: `npm ci && npm run build:digitalocean`
- Output directory: `public`

See `docs/digitalocean-app-platform.md` for the optional app spec template and deployment notes.
