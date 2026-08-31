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

## Caching and Security Headers

DigitalOcean App Platform currently serves static-site responses with a 24-hour CDN cache and a 10-second browser cache. The static-site app spec does not expose arbitrary response-header configuration, so this repository does not include an unsupported `_headers` file or claim that `.do/app.yaml` can override those values.

The page supplies a meta-delivered Content Security Policy that permits the site's local assets, the existing GSAP/ScrollTrigger scripts from `cdnjs.cloudflare.com`, and the Google Maps frame. Response-only controls cannot be expressed safely in HTML. Configure these at a reverse proxy/CDN, or serve the build from an App Platform service that can set response headers:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
X-Frame-Options: DENY
```

Likewise, a longer browser `Cache-Control` lifetime requires a response-header-capable edge proxy or service. The current assets use stable filenames, so do not add `immutable` until the build also introduces content-hashed or otherwise versioned asset URLs.

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
npm run test:responsive
npm run build:digitalocean
npm run verify:digitalocean
```

`public/` is generated output and is intentionally ignored by git.
