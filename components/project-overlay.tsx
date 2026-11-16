"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects, studio } from "@/lib/content";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const ease = "cubic-bezier(.7,0,.2,1)";
export function ProjectOverlay({ index, origin, close, next }: { index: number; origin: DOMRect | null; close: () => void; next: (index: number) => void }) {
  const ref = useRef<HTMLDivElement>(null), wipe = useRef<HTMLDivElement>(null);
  const busy = useRef(false), alive = useRef(true);
  const [nextTitle, setNextTitle] = useState("");
  useFocusTrap(ref, true);
  const project = projects[index], nextIndex = (index + 1) % projects.length;
  useEffect(() => {
    alive.current = true;
    const element = ref.current!;
    const initial = origin ? `inset(${Math.max(0, origin.top)}px ${Math.max(0, innerWidth - origin.right)}px ${Math.max(0, innerHeight - origin.bottom)}px ${Math.max(0, origin.left)}px)` : "inset(50% 50% 50% 50%)";
    const animation = !matchMedia("(prefers-reduced-motion: reduce)").matches ? element.animate([{ clipPath: initial }, { clipPath: "inset(0)" }], { duration: 900, easing: ease, fill: "both" }) : null;
    return () => { alive.current = false; animation?.cancel(); };
  }, [origin]);

  const onClose = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try { await ref.current?.animate([{ clipPath: "inset(0)" }, { clipPath: "inset(50% 50% 50% 50%)" }], { duration: 700, easing: ease, fill: "forwards" }).finished; } catch { /* Interrupted animation. */ }
    }
    if (alive.current) close();
  }, [close]);

  const onNext = useCallback(async () => {
    if (busy.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { next(nextIndex); ref.current?.scrollTo(0, 0); return; }
    busy.current = true; setNextTitle(projects[nextIndex].name);
    const element = wipe.current!; element.style.visibility = "visible";
    try {
      await element.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0)" }], { duration: 650, easing: ease, fill: "forwards" }).finished;
      if (!alive.current) return;
      await element.querySelector(".wipe-title")!.animate([{ opacity: 0, transform: "translateY(80px)" }, { opacity: 1, transform: "none" }], { duration: 750, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" }).finished;
      if (!alive.current) return;
      next(nextIndex); ref.current?.scrollTo(0, 0);
      await element.animate([{ clipPath: "inset(0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: 750, easing: ease, fill: "forwards" }).finished;
    } catch { /* Closing/unmounting may cancel a transition. */ }
    if (alive.current) { element.style.visibility = "hidden"; busy.current = false; }
  }, [nextIndex, next]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    addEventListener("keydown", handleKey); return () => removeEventListener("keydown", handleKey);
  }, [onClose]);

  return <>
    <div className="project-overlay" role="dialog" aria-modal="true" aria-labelledby="project-title" ref={ref}>
      <button className="project-close" aria-label="Close project" onClick={onClose}>×</button>
      <div className="project-layout" key={project.slug}>
        <div className="project-overview"><span className="mono">{String(index + 1).padStart(2, "0")} / 06 · Supplied visual reference</span><h2 id="project-title" className="display">{project.name}</h2><div><span className="mono">Overview</span><p>{project.summary}</p></div><dl><dt>Category</dt><dd>{project.category}</dd><dt>Preview</dt><dd>Illustrated placeholder</dd></dl><p className="project-placeholder-note">Original project imagery and case-study details are pending.</p><a href={studio.instagram} className="project-inquire" target="_blank" rel="noopener noreferrer">Discuss a project like this <span aria-hidden="true">↗</span></a><button className="project-next" onClick={onNext}><span className="mono">Next project</span><span className="display">{projects[nextIndex].name} <span aria-hidden="true">→</span></span></button></div>
        <div className="project-gallery"><figure><Image src={project.image} alt={`${project.name} illustrated reference preview — original imagery pending`} width={1200} height={900} unoptimized priority /></figure><div className="project-gallery-detail"><span className="mono">Visual direction</span><p className="display">{project.name}</p><span className="small">{project.category}</span><span className="reference-label mono">Preview placeholder</span></div></div>
      </div>
    </div>
    <div className="project-wipe" ref={wipe} aria-hidden="true"><svg viewBox="0 0 1000 600" preserveAspectRatio="none"><path d="M-20 470 C220 470 260 140 500 160 S780 520 1020 300" /></svg><div><span className="mono">Next reference</span><p className="display wipe-title">{nextTitle}</p></div></div>
  </>;
}
