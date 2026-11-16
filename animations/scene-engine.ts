import { animateRunner, animateParachute } from "./letter-choreography";
import { clamp, smootherstep } from "./math";

/**
 * Scroll-driven perspective camera. The reference uses native requestAnimationFrame,
 * a damped camera and Hermite interpolation rather than an animation framework.
 * Keeping the same technique preserves its movement, dwell times and reversibility.
 */
const pair = (value?: string): [number, number] => { const values = (value || "0,0").split(",").map(Number); return [values[0] || 0, values[1] || 0]; };
type Point = { x: number; y: number; z: number };
type Stop = { element: HTMLElement; id: string; label: string; z: number; gap: number; hold: number; ease: number; ax: number; ay: number; scroll: number; duration: number; dark: boolean; };
type Layer = { element: HTMLElement; stop: Stop; x: number; y: number; depth: number; z: number; fx: number; fy: number; rotation: number; absolute: boolean; fade: number; visible: boolean; interactive: boolean; };
type Keyframe = { scroll: number; z: number; ease: number };
type EngineElements = { world: HTMLElement; canvas: HTMLCanvasElement; spacer: HTMLElement; hud: HTMLElement; panel: HTMLElement };

export function createSceneEngine({ world, canvas, spacer, hud, panel }: EngineElements) {
  const context = canvas.getContext("2d");
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  if (!context || media.matches) return { go: (id: string) => document.getElementById(id === "studio" ? "studio-panel" : id)?.scrollIntoView(), destroy: () => {} };
  const root = document.documentElement;
  let width = 0, height = 0, focal = 1000, mobile = false;
  let stops: Stop[] = [], layers: Layer[] = [], keyframes: Keyframe[] = [], path: Point[] = [];
  let scrollLength = 0, lastZ = 0, smoothScroll = window.scrollY, animation = 0, resizeTimer: ReturnType<typeof setTimeout>;
  let destroyed = false, previousTime = performance.now(), previousZ = NaN, previousScroll = NaN, previousReveal = NaN;
  let previousTheme = -1, previousLabel = "", force = true;
  const started = performance.now();
  const panelElements = Array.from(panel.querySelectorAll<HTMLElement>(".panel-reveal"));
  const hudNumber = hud.querySelector<HTMLElement>(".hud-number")!;
  const hudLabel = hud.querySelector<HTMLElement>(".hud-label")!;
  const hudTicks = hud.querySelector<HTMLElement>(".hud-ticks")!;
  const colour = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

  function measure() {
    if (destroyed) return;
    const ratio = scrollLength ? clamp(window.scrollY / scrollLength) : 0;
    width = innerWidth;
    // Use the large viewport height so mobile address-bar changes do not reflow the scene.
    height = Math.max(innerHeight, canvas.offsetHeight || 0);
    mobile = width < 760;
    focal = mobile ? 900 : clamp(width * .8, 900, 1400);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context!.setTransform(dpr, 0, 0, dpr, 0, 0);
    world.querySelectorAll<HTMLElement>(".layer .display").forEach((element) => {
      element.style.fontSize = "";
      if (getComputedStyle(element).whiteSpace === "nowrap" && element.offsetWidth > width * .9) {
        element.style.fontSize = `${parseFloat(getComputedStyle(element).fontSize) * width * .9 / element.offsetWidth}px`;
      }
    });
    stops = []; layers = [];
    let z = 0;
    Array.from(world.querySelectorAll<HTMLElement>(".scene")).forEach((element, index) => {
      const gap = Number(element.dataset.gap ?? 3);
      if (index) z += gap * focal;
      const anchor = pair(mobile && element.dataset.mobileAnchor ? element.dataset.mobileAnchor : element.dataset.anchor);
      const stop: Stop = { element, id: element.id, label: element.dataset.label || "", z, gap, hold: Number(element.dataset.hold ?? .6), ease: Number(element.dataset.ease ?? 1), ax: anchor[0], ay: anchor[1], scroll: 0, duration: 0, dark: element.dataset.dark === "true" };
      stops.push(stop);
      element.querySelectorAll<HTMLElement>(".layer").forEach((layer) => {
        const [x, y] = pair(mobile && layer.dataset.mobile ? layer.dataset.mobile : layer.dataset.position);
        const [fx, fy] = pair(layer.dataset.from), depth = Number(layer.dataset.depth ?? 0);
        layers.push({ element: layer, stop, x, y, depth, z: z + depth * focal, fx: mobile ? fx * .5 : fx, fy, rotation: mobile ? 0 : Number(layer.dataset.rotation || 0), absolute: layer.dataset.absolute === "true", fade: clamp(gap * .82, 1, 1.7) * focal, visible: false, interactive: false });
        layer.style.visibility = "hidden"; layer.inert = true;
        layer.classList.toggle("far", depth > .2);
      });
    });
    keyframes = [];
    let scroll = 0;
    stops.forEach((stop, index) => {
      if (index) scroll += stop.gap * (mobile ? .52 : .46) * height;
      const studio = stop.id === "studio";
      const drift = studio || !index ? 0 : .11;
      stop.scroll = scroll;
      stop.duration = stop.hold * height * (studio ? 1 : .55);
      keyframes.push({ scroll, z: stop.z - focal - drift * focal, ease: index ? stop.ease * .45 : 0 });
      scroll += stop.duration;
      keyframes.push({ scroll, z: stop.z - focal + (studio ? 0 : index ? .11 : .18) * focal, ease: 0 });
    });
    scrollLength = scroll;
    spacer.style.height = `${scroll + height}px`;
    buildPath();
    hudTicks.replaceChildren(...stops.filter((s, i) => !i || s.gap >= 2.2).map((s) => { const tick = document.createElement("i"); tick.className = "hud-tick"; tick.style.top = `${s.scroll / scrollLength * 100}%`; tick.dataset.scroll = String(s.scroll); return tick; }));
    smoothScroll = ratio * scrollLength;
    if (ratio && !root.classList.contains("overlay-open") && !root.classList.contains("menu-open")) window.scrollTo(0, smoothScroll);
    force = true;
  }

  function buildPath() {
    const points: Point[] = [{ z: stops[0].z, x: stops[0].ax * width, y: stops[0].ay * height }];
    let direction = 1;
    stops.slice(1).forEach((stop, index) => {
      const before = stops[index];
      if (stop.gap >= 2.2) { direction *= -1; points.push({ z: before.z + (stop.z - before.z) * .5, x: direction * (mobile ? .85 : 1.05) * width, y: (direction > 0 ? -.42 : .46) * height }); }
      points.push({ z: stop.z, x: stop.ax * width, y: stop.ay * height });
    });
    const tangents = points.map((p, index) => {
      const a = points[Math.max(0, index - 1)], b = points[Math.min(points.length - 1, index + 1)];
      return !index || index === points.length - 1 ? { x: 0, y: 0 } : { x: (b.x - a.x) / Math.max(1, b.z - a.z), y: (b.y - a.y) / Math.max(1, b.z - a.z) };
    });
    path = [];
    points.slice(0, -1).forEach((a, index) => {
      const b = points[index + 1], distance = Math.max(1, b.z - a.z), samples = Math.max(24, Math.round(distance / focal * 40));
      for (let i = 0; i < samples; i++) {
        const t = i / samples, t2 = t * t, t3 = t2 * t;
        const h0 = 2 * t3 - 3 * t2 + 1, h1 = t3 - 2 * t2 + t, h2 = -2 * t3 + 3 * t2, h3 = t3 - t2;
        path.push({ z: a.z + distance * t, x: h0 * a.x + h1 * distance * tangents[index].x + h2 * b.x + h3 * distance * tangents[index + 1].x, y: h0 * a.y + h1 * distance * tangents[index].y + h2 * b.y + h3 * distance * tangents[index + 1].y });
      }
    });
    path.push(points[points.length - 1]);
    lastZ = points[points.length - 1].z;
  }

  function cameraAt(scroll: number) {
    if (scroll <= keyframes[0].scroll) return keyframes[0].z;
    for (let i = 1; i < keyframes.length; i++) {
      const before = keyframes[i - 1], after = keyframes[i];
      if (scroll <= after.scroll) { let t = (scroll - before.scroll) / Math.max(1, after.scroll - before.scroll); t = t * (1 - after.ease) + smootherstep(t) * after.ease; return before.z + (after.z - before.z) * t; }
    }
    return keyframes[keyframes.length - 1].z;
  }

  function drawPath(camera: number, reveal: number, dark: number) {
    const ctx = context!;
    ctx.clearRect(0, 0, width, height);
    const near = .1 * focal, end = Math.min(camera + reveal, lastZ);
    let previous: { x: number; y: number } | null = null, last: { x: number; y: number; scale: number } | null = null;
    ctx.strokeStyle = ctx.fillStyle = colour([34, 52, 224], [124, 138, 255], dark);
    ctx.lineJoin = "round";
    for (let i = 0; i < path.length; i++) {
      let point = path[i];
      if (point.z < camera + near) { previous = null; continue; }
      if (point.z > end) {
        if (!previous || !i) break;
        const before = path[i - 1], t = (end - before.z) / Math.max(1, point.z - before.z);
        point = { z: end, x: before.x + (point.x - before.x) * t, y: before.y + (point.y - before.y) * t };
      }
      const distance = point.z - camera, scale = focal / distance;
      const projected = { x: width / 2 + point.x * scale, y: height / 2 + point.y * scale };
      if (previous) {
        ctx.lineWidth = clamp(2.4 * scale, .5, 7);
        ctx.globalAlpha = (1 - .82 * smootherstep((distance - 1.2 * focal) / Math.max(1, reveal - 1.2 * focal))) * smootherstep((distance - near) / (.3 * focal));
        ctx.beginPath(); ctx.moveTo(previous.x, previous.y); ctx.lineTo(projected.x, projected.y); ctx.stroke();
      }
      previous = projected; last = { ...projected, scale };
      if (point.z >= end) break;
    }
    ctx.globalAlpha = 1;
    if (last) { const radius = clamp((end >= lastZ - 1 ? 11 : 5) * last.scale, 2.5, 22); ctx.beginPath(); ctx.arc(last.x, last.y, radius, 0, Math.PI * 2); ctx.fill(); }
  }

  function updateLayers(camera: number) {
    for (const layer of layers) {
      const distance = layer.z - camera, restDistance = focal * (1 + layer.depth), offset = distance - restDistance;
      if (distance < .16 * focal || offset > 2.7 * focal) { hide(layer); continue; }
      const scale = (layer.absolute ? focal : restDistance) / distance;
      const displacement = offset > 0 ? smootherstep(offset / (1.9 * focal)) : 0;
      const opacity = offset > 0 ? 1 - smootherstep((offset - .45 * layer.fade) / (.55 * layer.fade)) : 1 - smootherstep((-offset - .22 * focal) / (.42 * focal));
      if (opacity < .01) { hide(layer); continue; }
      const element = layer.element;
      if (!layer.visible) { element.style.visibility = "visible"; layer.visible = true; }
      element.style.opacity = opacity.toFixed(3);
      element.style.transform = `translate3d(${(width / 2 + (layer.x + layer.fx * displacement) * width * scale).toFixed(1)}px,${(height / 2 + (layer.y + layer.fy * displacement) * height * scale).toFixed(1)}px,0) translate(-50%,-50%) perspective(1100px) rotateY(${(layer.rotation * displacement).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      element.style.setProperty("--k", displacement.toFixed(3));
      const fill = clamp((.55 * focal - offset) / (.65 * focal));
      element.style.setProperty("--fill", fill.toFixed(3));
      const departure = Math.max(0, (-offset - .03 * focal) / (.38 * focal));
      const spread = departure < 1 ? 3 * departure ** 2 - 2 * departure ** 3 + .35 * (departure ** 3 - departure ** 2) : 1 + .35 * (departure - 1);
      element.style.setProperty("--spread", spread.toFixed(3));
      const runner = element.querySelector<HTMLElement>(".journey-title-wrap");
      if (runner) animateRunner(runner, fill, clamp((-offset - .1 * focal) / (.42 * focal)));
      const contact = element.querySelector<HTMLElement>(".contact-heading-wrap");
      if (contact) animateParachute(contact, clamp((smoothScroll - (layer.stop.scroll - .4 * height)) / (.4 * height + layer.stop.duration * .95)), width, height);
      const interactive = opacity > .6 && scale < 1.6;
      if (interactive !== layer.interactive) { layer.interactive = interactive; element.inert = !interactive; element.style.pointerEvents = interactive ? "auto" : "none"; }
      element.querySelector(".path-node")?.classList.toggle("on", offset < .05 * focal);
    }
  }
  function hide(layer: Layer) { if (layer.visible) { layer.element.style.visibility = "hidden"; layer.element.inert = true; layer.element.style.pointerEvents = "none"; layer.visible = false; layer.interactive = false; } }

  function updateTheme(camera: number) {
    let dark = 0;
    for (const stop of stops) if (stop.dark) { const offset = stop.z - camera - focal; dark = Math.max(dark, Math.min(1 - smootherstep((offset - .45 * focal) / (.85 * focal)), 1 - smootherstep((-offset - .6 * focal) / (.65 * focal)))); }
    if (Math.abs(dark - previousTheme) > .003) {
      previousTheme = dark;
      const colours: Record<string, [number[], number[]]> = { bg: [[236, 234, 226], [11, 12, 11]], ink: [[18, 20, 19], [241, 241, 238]], muted: [[94, 99, 96], [154, 160, 156]], hair: [[211, 208, 198], [44, 47, 45]], line: [[34, 52, 224], [124, 138, 255]] };
      for (const [name, values] of Object.entries(colours)) root.style.setProperty(`--${name}`, colour(values[0], values[1], dark));
    }
    return dark;
  }

  function updatePanel(scroll: number) {
    const stop = stops.find((s) => s.id === "studio");
    if (!stop) return;
    const enter = smootherstep((scroll - (stop.scroll - .75 * height)) / (1.05 * height));
    const progress = (scroll - (stop.scroll + .05 * height)) / (.95 * height);
    const exit = smootherstep((scroll - (stop.scroll + stop.duration - 1.05 * height)) / height);
    if (enter <= 0 || exit >= 1) { panel.style.visibility = "hidden"; panel.inert = true; panel.style.pointerEvents = "none"; return; }
    panel.style.visibility = "visible";
    panel.style.clipPath = `circle(${(Math.hypot(width, height) * .62 * enter + 1).toFixed(1)}px at 50% 50%)`;
    panel.style.transform = `perspective(1200px) translate3d(0,${-exit * height * .04}px,0) rotateX(${exit * 14}deg) scale(${(1 - .84 * exit).toFixed(4)})`;
    panel.style.borderRadius = `${exit * 36}px`;
    panel.style.opacity = String(1 - smootherstep((exit - .7) / .3));
    const interactive = enter > .98 && exit < .2;
    panel.inert = !interactive; panel.style.pointerEvents = interactive ? "auto" : "none";
    panelElements.forEach((el, index) => el.style.setProperty("--reveal", (1 - smootherstep(progress * 1.6 - index * .13)).toFixed(3)));
  }

  function updateHud(scroll: number) {
    let selected = stops[0], number = 0, count = 0;
    stops.forEach((stop, index) => { if (!index || stop.gap >= 2.2) { if (scroll >= stop.scroll - .6 * height) { selected = stop; number = count; } count++; } });
    const label = `${number}|${selected.label}`;
    if (previousLabel !== label) { previousLabel = label; hudNumber.textContent = String(number + 1).padStart(2, "0"); hudLabel.textContent = selected.label; }
    hud.style.setProperty("--progress", clamp(scroll / scrollLength).toFixed(5));
    hudTicks.querySelectorAll<HTMLElement>(".hud-tick").forEach((tick) => tick.classList.toggle("on", Number(tick.dataset.scroll) <= scroll + 2));
  }

  function frame(now: number) {
    if (destroyed) return;
    const dt = Math.min(.05, (now - previousTime) / 1000); previousTime = now;
    const delta = window.scrollY - smoothScroll;
    smoothScroll += delta * (1 - Math.exp(-dt * (Math.abs(delta) > 3 * height ? 9 : 5.5)));
    if (Math.abs(delta) < .3) smoothScroll = window.scrollY;
    const reveal = (mobile ? 3 : 3.3) * focal * smootherstep((now - started - 250) / 1700);
    const camera = cameraAt(smoothScroll);
    if (force || camera !== previousZ || smoothScroll !== previousScroll || reveal !== previousReveal) {
      previousZ = camera; previousScroll = smoothScroll; previousReveal = reveal; force = false;
      drawPath(camera, reveal, updateTheme(camera)); updateLayers(camera); updatePanel(smoothScroll); updateHud(smoothScroll);
    }
    animation = requestAnimationFrame(frame);
  }
  const onResize = () => { if (matchMedia("(pointer: coarse)").matches && innerWidth === width) return; clearTimeout(resizeTimer); resizeTimer = setTimeout(measure, 150); };
  const go = (id: string) => { const stop = stops.find((s) => s.id === id); if (stop) window.scrollTo({ top: stop.scroll + (id === "studio" ? stop.duration * .45 : 2), behavior: "instant" }); };
  const onHash = () => { const id = location.hash.slice(1); if (id && !id.startsWith("project/")) go(id); };
  root.classList.add("is-3d");
  const oldRestoration = history.scrollRestoration;
  history.scrollRestoration = "manual";
  measure();
  if (location.hash && !location.hash.startsWith("#project/")) onHash();
  else { window.scrollTo(0, 0); smoothScroll = 0; }
  animation = requestAnimationFrame(frame);
  addEventListener("resize", onResize); addEventListener("hashchange", onHash);
  document.fonts.ready.then(() => { if (!destroyed) measure(); });
  return { go, destroy: () => {
    destroyed = true; cancelAnimationFrame(animation); clearTimeout(resizeTimer);
    removeEventListener("resize", onResize); removeEventListener("hashchange", onHash);
    root.classList.remove("is-3d"); history.scrollRestoration = oldRestoration;
    ["bg", "ink", "muted", "hair", "line"].forEach((key) => root.style.removeProperty(`--${key}`));
    layers.forEach((layer) => { layer.element.removeAttribute("style"); layer.element.inert = false; layer.element.querySelectorAll<HTMLElement>(".char").forEach((el) => { el.style.removeProperty("transform"); el.style.removeProperty("--char-fill"); }); layer.element.querySelectorAll<HTMLElement>(".journey-runner,.contact-parachute").forEach((el) => el.removeAttribute("style")); });
    panel.removeAttribute("style"); panel.inert = false;
    spacer.style.height = "";
  } };
}
