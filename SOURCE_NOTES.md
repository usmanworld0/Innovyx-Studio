# Sources and verification

Reference inspected on 16 November 2026: https://www.johnbolster.design/

The public HTML, stylesheet and animation bundle were fetched and examined. The implementation follows the reference's nineteen-stop editorial progression, perspective camera, sampled Hermite path, depth-based positioning, quintic easing, camera damping, 900ms circular menu reveal, staggered 1.3s text entrance, dark scenes, alternating project positions and expanding project overlays. The original reference currently uses native Canvas and requestAnimationFrame, so this implementation follows that approach rather than adding GSAP.

The body palette, navigation proportions and scene coordinates are matched to the inspected source. Barlow Condensed is a locally hosted, openly licensed approximation of the reference's proprietary Bebas Neue Pro; Geist and Geist Mono are locally hosted for supporting type. All three font families are from Google Fonts.

Verified public brand source: https://www.instagram.com/innovyx.studio/

Its public metadata identifies “Usman | Web Designer & Developer” and the bio “I build brands. Web Design • Branding • E-commerce”. Founder name, role, studio name, agency description and portrait were supplied by the user. No project metrics, awards, clients, testimonials, founding dates, email address, phone number or historical milestones are invented.

Selected Work uses the user's actual attached screenshots, located in Pictures/Screenshots and matched visually and by their original dimensions. The originals are preserved in `assets/work/`; the website serves lossless WebP copies in `public/images/work/`. `scripts/prepare-assets.mjs` verifies decoded pixel equality after conversion. The six captures are Screenshot 2026-11-16 142937.png (Dipitt), 143127.png (Loom), 143358.png (Sweet Treats), 143554.png (Innovyx Studio), 144026.png (Qalakari) and 144102.png (Driptide). No generated substitutes or stock images are used for Selected Work.

The Next.js production export and TypeScript check pass. `scripts/check-scene-engine.mjs` exercises the actual camera at five viewport sizes, verifies finite projection transforms, scene reachability, interactive state, studio CTA access, return navigation, teardown, exported asset links and use of all six actual work screenshots. It uses a minimal DOM adapter and does not validate browser layout or visual similarity.

The browser connector reported “The browser access host is unavailable” after extension installation, reconnection and runtime reset. Browser screenshots, side-by-side comparison, actual touch/keyboard behavior and rendered animation timing remain unverified. Do not describe this as a completed pixel-accurate recreation until those checks are performed.
