"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Scene } from "@/components/scene";
import { ProjectOverlay } from "@/components/project-overlay";
import { Introduction } from "@/sections/introduction";
import { Journey } from "@/sections/journey";
import { Services } from "@/sections/services";
import { Work } from "@/sections/work";
import { Contact, StudioPanel } from "@/sections/contact";
import { useSceneEngine } from "@/hooks/use-scene-engine";
import { projects } from "@/lib/content";

export function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [project, setProject] = useState<number | null>(null);
  const origin = useRef<DOMRect | null>(null);
  const projectButton = useRef<HTMLButtonElement | null>(null);
  const go = useSceneEngine(root);
  const navigate = useCallback((id: string) => { setMenu(false); go(id); history.pushState(null, "", `#${id}`); }, [go]);
  const openProject = (index: number, button: HTMLButtonElement) => {
    origin.current = button.getBoundingClientRect(); projectButton.current = button;
    setProject(index); history.pushState(null, "", `#project/${projects[index].slug}`);
  };
  const closeProject = useCallback(() => { setProject(null); history.replaceState(null, "", "#work"); requestAnimationFrame(() => projectButton.current?.focus({ preventScroll: true })); }, []);
  useEffect(() => {
    const sync = () => {
      const slug = location.hash.match(/^#project\/(.+)$/)?.[1];
      const index = projects.findIndex((p) => p.slug === slug);
      setProject(index >= 0 ? index : null);
    };
    sync(); addEventListener("popstate", sync); addEventListener("hashchange", sync);
    return () => { removeEventListener("popstate", sync); removeEventListener("hashchange", sync); };
  }, []);
  useEffect(() => {
    const locked = menu || project !== null;
    document.documentElement.classList.toggle("overlay-open", locked);
    return () => document.documentElement.classList.remove("overlay-open");
  }, [menu, project]);

  return <div ref={root}>
    <a href="#about" className="skip-link" onClick={(e) => { e.preventDefault(); navigate("about"); }}>Skip introduction</a>
    <Navigation open={menu} setOpen={setMenu} navigate={navigate} />
    <canvas className="path-canvas" aria-hidden="true" />
    <main className="world" id="main-content" inert={menu || project !== null}>
      <Introduction navigate={navigate} /><Journey /><Services /><Work openProject={openProject} />
      <Scene id="studio" label="The studio" hold={3.1} anchor="0,0"><StudioPanel /></Scene>
      <Contact navigate={navigate} />
    </main>
    <div className="scroll-spacer" aria-hidden="true" />
    <aside className="hud mono" aria-hidden="true"><div className="hud-track"><i /></div><div className="hud-ticks" /><i className="hud-dot" /><div className="hud-caption"><span className="hud-number">01</span><b className="hud-label">Home</b></div></aside>
    {project !== null && <ProjectOverlay index={project} origin={origin.current} close={closeProject} next={(index) => { setProject(index); history.pushState(null, "", `#project/${projects[index].slug}`); }} />}
  </div>;
}
