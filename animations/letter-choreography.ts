import { clamp, smootherstep } from "./math";

type Letter = { element: HTMLElement; x: number; y: number; width: number };
type Layout = { signature: string; letters: Letter[] };
const layouts = new WeakMap<HTMLElement, Layout>();

function letterLayout(wrapper: HTMLElement): Layout {
  const signature = `${wrapper.offsetWidth}|${getComputedStyle(wrapper.querySelector(".display")!).fontSize}`;
  const cached = layouts.get(wrapper);
  if (cached?.signature === signature) return cached;
  const letters = Array.from(wrapper.querySelectorAll<HTMLElement>(".char")).map((element) => {
    let x = 0, y = 0, node: HTMLElement | null = element;
    while (node && node !== wrapper) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
    return { element, x, y, width: element.offsetWidth };
  });
  const layout = { signature, letters }; layouts.set(wrapper, layout); return layout;
}

export function animateRunner(wrapper: HTMLElement, arrival: number, departure: number) {
  const runner = wrapper.querySelector<HTMLElement>(".journey-runner");
  if (!runner) return;
  const horizontal = arrival * 96 + departure * 26;
  runner.style.left = `${horizontal.toFixed(2)}%`;
  runner.style.transform = `translate(-50%,${(-1.5 * departure + 2.9 * departure ** 2).toFixed(3)}em) rotate(${(departure * 24).toFixed(1)}deg)`;
  runner.classList.toggle("jumping", departure > .01);
  const layout = letterLayout(wrapper), width = wrapper.offsetWidth;
  layout.letters.forEach((letter) => letter.element.style.setProperty("--char-fill", `${(clamp((Math.min(horizontal, 100) - letter.x / width * 100) / (letter.width / width * 100)) * 100).toFixed(1)}%`));
  if (departure > .01) return;
  const phase = arrival * 7 * Math.PI * 2, bounce = Math.abs(Math.sin(phase)) * 1.1;
  const hipX = 17, hipY = 25.5 - bounce, shoulderX = 19.6, shoulderY = 14.2 - bounce;
  const vector = (degrees: number, length: number) => [Math.sin(degrees * Math.PI / 180) * length, Math.cos(degrees * Math.PI / 180) * length];
  const leg = (cycle: number) => { const angle = 40 * Math.sin(cycle), bend = 12 + 78 * Math.max(0, Math.cos(cycle)) * Math.max(0, Math.cos(cycle) * .6 + .5); const a = vector(angle, 8.6), b = vector(angle - bend, 8.8); return `M${hipX} ${hipY}l${a[0]} ${a[1]}l${b[0]} ${b[1]}`; };
  const arm = (cycle: number) => { const angle = -52 * Math.sin(cycle) + 4, a = vector(angle, 6.4), b = vector(angle + 78, 5.6); return `M${shoulderX} ${shoulderY}l${a[0]} ${a[1]}l${b[0]} ${b[1]}`; };
  const set = (name: string, d: string) => runner.querySelector(`[data-limb="${name}"]`)?.setAttribute("d", d);
  set("front-leg", leg(phase)); set("back-leg", leg(phase + Math.PI)); set("front-arm", arm(phase + Math.PI)); set("back-arm", arm(phase)); set("torso", `M${hipX} ${hipY}L${shoulderX + .4} ${shoulderY - 1.2}`);
  const head = runner.querySelector('[data-limb="head"]'); head?.setAttribute("cx", "21.4"); head?.setAttribute("cy", String(6.4 - bounce));
}

export function animateParachute(wrapper: HTMLElement, progress: number, viewportWidth: number, viewportHeight: number) {
  const chute = wrapper.querySelector<HTMLElement>(".contact-parachute");
  if (!chute) return;
  const layout = letterLayout(wrapper), heading = wrapper.querySelector<HTMLElement>(".display")!;
  // A fully completed scene always restores natural text, including unusually
  // wide font fallbacks during loading or a viewport change mid-animation.
  if (progress >= .999) { layout.letters.forEach((letter) => { letter.element.style.transform = "none"; }); chute.style.visibility = "hidden"; return; }
  const fontSize = parseFloat(getComputedStyle(heading).fontSize), chuteWidth = Math.max(.8 * fontSize, 52), chuteScale = chuteWidth / 60;
  chute.style.width = `${chuteWidth}px`;
  const rect = wrapper.getBoundingClientRect(), scale = rect.width / Math.max(1, wrapper.offsetWidth);
  const left = -rect.left / scale - chuteWidth, right = (viewportWidth - rect.left) / scale + chuteWidth;
  const start = .04, end = .9;
  const positionAt = (t: number) => left + (right - left) * clamp((t - start) / (end - start));
  const releaseAt = (x: number) => start + (end - start) * (x - left) / (right - left);
  const releases = layout.letters.map((letter) => releaseAt(letter.x + letter.width / 2 - .04 * fontSize));
  const remaining = releases.filter((time) => progress < time).length;
  const letterSpacing = .15 * fontSize, firstY = (layout.letters[0]?.y || 0) + fontSize * .15;
  let parachuteY = firstY - .18 * fontSize - (remaining * letterSpacing + .12 * fontSize) - (1 - smootherstep(clamp((progress - start) / .25))) * viewportHeight * .6 / scale;
  if (progress >= end - .12) parachuteY -= smootherstep((progress - (end - .12)) / .12) * fontSize * .8;
  const currentX = positionAt(progress), sway = Math.sin(progress * 22);
  let stacked = 0;
  layout.letters.forEach((letter, index) => {
    const homeX = letter.x + letter.width / 2, homeY = letter.y + letter.element.offsetHeight / 2;
    let x: number, y: number, size: number, rotation: number;
    if (progress < releases[index]) {
      const row = remaining - 1 - stacked++;
      x = currentX + (index % 2 ? 1 : -1) * .035 * fontSize + sway * .02 * fontSize * row / layout.letters.length;
      y = parachuteY + .06 * fontSize + row * letterSpacing + letterSpacing * .5;
      size = .3; rotation = (index % 3 - 1) * 6 + sway * 2;
    } else {
      const fall = clamp((progress - releases[index]) / .07);
      const initialX = positionAt(releases[index]) + (index % 2 ? 1 : -1) * .035 * fontSize;
      const initialY = parachuteY + .06 * fontSize + letterSpacing * (remaining + .5);
      x = initialX + (homeX - initialX) * smootherstep(fall);
      y = initialY + (homeY - initialY) * fall ** 2;
      size = .3 + .7 * smootherstep(Math.min(1, fall * 1.6)); rotation = (index % 3 - 1) * 6 * (1 - fall);
      if (fall >= 1) y -= Math.sin(Math.PI * clamp((progress - releases[index] - .07) / .03)) * .05 * fontSize;
    }
    letter.element.style.transform = Math.abs(x - homeX) < .05 && Math.abs(y - homeY) < .05 && size > .999 && Math.abs(rotation) < .05 ? "none" : `translate(${(x - homeX).toFixed(1)}px,${(y - homeY).toFixed(1)}px) rotate(${rotation.toFixed(1)}deg) scale(${size.toFixed(3)})`;
  });
  chute.style.visibility = progress > start && progress < end ? "visible" : "hidden";
  chute.style.transform = `translate(${(currentX - 30 * chuteScale).toFixed(1)}px,${(parachuteY - 74 * chuteScale).toFixed(1)}px) rotate(${(sway * 5).toFixed(2)}deg)`;
}
