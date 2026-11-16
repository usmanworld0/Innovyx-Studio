# Innovyx Studio

An immersive Next.js portfolio for Muhammad Usman, following the layout and scroll mechanics of johnbolster.design. TypeScript, React, locally hosted fonts, CSS and a modular Canvas/perspective scene engine.

## Run locally

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if the system execution policy prevents `npm.ps1` from running. Open http://localhost:3000.

## Build and verify

```sh
npm run build
node scripts/check-scene-engine.mjs
```

The static production website is exported to `out/`. No environment variables, backend, external tracking or live API connections are required.

## Edit content

- `lib/content.ts`: identity, services, Instagram link and selected work.
- `sections/`: individual narrative sections.
- `animations/scene-engine.ts`: camera, path, scroll mapping, themes and interlude.
- `app/globals.css`: typography, composition and responsive layouts.
- `assets/work/`: the six original attached website screenshots.
- `public/images/`: portrait and lossless WebP copies of those screenshots.
- `scripts/prepare-assets.mjs`: reproducible image optimization, including pixel-for-pixel verification of each screenshot.

Selected Work uses the actual screenshots supplied by the user: Dipitt, Loom, Sweet Treats, Innovyx Studio, Qalakari and Driptide. Cards and project views preserve each screenshot's original proportions. Contact links point to the verified Instagram account; no email address is invented.

The layout has a normal document-flow mode for reduced motion. Navigation and project overlays support Escape, focus trapping and focus restoration. Native scrolling remains available; the camera is visually damped rather than intercepting wheel/touch events.

See `SOURCE_NOTES.md` for reference evidence and outstanding browser verification.
