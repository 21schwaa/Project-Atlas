# DigitalOcean App Platform

This site is deployed as a DigitalOcean App Platform static site.

## Resource Settings

- Resource type: Static Site
- Source directory: `/`
- Build command: `npm ci && npm run build:digitalocean`
- Output directory: `public`
- Index document: `index.html`
- Catchall document: `index.html`

The deployment build compiles Tailwind CSS, then assembles the deployable static files in `public/`.

## Optional App Spec

Use `.do/app.yaml.example` as a starting point if you want to deploy with `doctl` or a checked-in App Platform spec.

Before renaming it to `.do/app.yaml`, replace:

```yaml
repo: your-github-user-or-org/atlas-barbell-club
```

with the actual GitHub repo slug that DigitalOcean can access.

## Local Verification

Run:

```bash
npm test
npm run build:digitalocean
npm run verify:digitalocean
```

`public/` is generated output and is intentionally ignored by git.
