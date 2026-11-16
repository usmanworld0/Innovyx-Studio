# Sources and verification

Reference inspected on 16 November 2026: https://www.johnbolster.design/

The public HTML, stylesheet and animation bundle were fetched and examined. The implementation follows the reference's nineteen-stop editorial progression, perspective camera, sampled Hermite path, depth-based positioning, quintic easing, camera damping, 900ms circular menu reveal, staggered 1.3s text entrance, dark scenes, alternating project positions and expanding project overlays. The original reference currently uses native Canvas and requestAnimationFrame, so this implementation follows that approach rather than adding GSAP.

The body palette, navigation proportions and scene coordinates are matched to the inspected source. Barlow Condensed is a locally hosted, openly licensed approximation of the reference's proprietary Bebas Neue Pro; Geist and Geist Mono are locally hosted for supporting type. All three font families are from Google Fonts.

Verified public brand source: https://www.instagram.com/innovyx.studio/

Its public metadata identifies “Usman | Web Designer & Developer” and the bio “I build brands. Web Design • Branding • E-commerce”. Founder name, role, studio name, agency description and portrait were supplied by the user. No project metrics, awards, clients, testimonials, founding dates, email address, phone number or historical milestones are invented.

The six named work entries correspond to the user's supplied screenshots. Original screenshot files were not available in the accessible project files; consequently the illustrations are labelled preview placeholders. They are not presented as verified commissions. Replace each image and description in `lib/content.ts` with confirmed case-study materials. No random stock imagery is used.

The Next.js production export and TypeScript check pass. `scripts/check-scene-engine.mjs` exercises the actual camera at five viewport sizes, verifies finite projection transforms, scene reachability, interactive state, studio CTA access, return navigation, teardown, exported asset links and placeholder labels. It uses a minimal DOM adapter and does not validate browser layout or visual similarity.

The browser connector reported “The browser access host is unavailable” after extension installation, reconnection and runtime reset. Browser screenshots, side-by-side comparison, actual touch/keyboard behavior and rendered animation timing remain unverified. Do not describe this as a completed pixel-accurate recreation until those checks are performed.
