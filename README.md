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

- `lib/content.ts`: identity, services, Instagram link and work references.
- `sections/`: individual narrative sections.
- `animations/scene-engine.ts`: camera, path, scroll mapping, themes and interlude.
- `app/globals.css`: typography, composition and responsive layouts.
- `public/images/`: portrait and six explicitly labelled illustrated placeholders.
- `scripts/prepare-assets.mjs`: reproducible portrait optimization and preview generation.

The project examples use names from the supplied screenshots and are labelled references. Replace placeholders with original assets and confirmed case-study details before presenting them as completed studio work. Contact links point to the verified Instagram account; no email address is invented.

The layout has a normal document-flow mode for reduced motion. Navigation and project overlays support Escape, focus trapping and focus restoration. Native scrolling remains available; the camera is visually damped rather than intercepting wheel/touch events.

See `SOURCE_NOTES.md` for reference evidence and outstanding browser verification.
