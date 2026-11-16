"use client";
import { useEffect, useRef, useCallback, type RefObject } from "react";
import { createSceneEngine } from "@/animations/scene-engine";
export function useSceneEngine(ref: RefObject<HTMLDivElement | null>) {
  const engine = useRef<ReturnType<typeof createSceneEngine> | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    const setup = () => {
      engine.current?.destroy();
      engine.current = createSceneEngine({ world: container.querySelector<HTMLElement>(".world")!, canvas: container.querySelector<HTMLCanvasElement>(".path-canvas")!, spacer: container.querySelector<HTMLElement>(".scroll-spacer")!, hud: container.querySelector<HTMLElement>(".hud")!, panel: container.querySelector<HTMLElement>(".studio-panel")! });
    };
    setup();
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", setup);
    return () => { engine.current?.destroy(); engine.current = null; media.removeEventListener("change", setup); };
  }, [ref]);
  return useCallback((id: string) => { engine.current?.go(id); }, []);
}
