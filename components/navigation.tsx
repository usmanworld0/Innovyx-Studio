"use client";
import { useEffect, useRef } from "react";
import { navigation, studio } from "@/lib/content";
import { useFocusTrap } from "@/hooks/use-focus-trap";
export function Navigation({ open, setOpen, navigate }: { open: boolean; setOpen: (open: boolean) => void; navigate: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.classList.remove("menu-open"); };
  }, [open, setOpen]);
  return <div ref={ref}>
    <header className="bar">
      <button className="mark" onClick={() => navigate("hero")} aria-label="Innovyx Studio — back to start">Innovyx <span>Studio</span></button>
      <button className="menu-button" aria-controls="main-menu" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}><span className="mono">{open ? "Close" : "Menu"}</span><i aria-hidden="true" /></button>
    </header>
    <nav id="main-menu" className="menu" aria-label="Main navigation" inert={!open}>
      <ol>{navigation.map((item, index) => <li key={item.id}><a href={`#${item.id}`} onClick={(e) => { e.preventDefault(); navigate(item.id); }}><span className="mono">{String(index + 1).padStart(2, "0")}</span><span className="display">{item.label}</span></a></li>)}</ol>
      <div className="menu-bottom mono"><span>{studio.founder} · {studio.role}</span><a href={studio.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a></div>
    </nav>
  </div>;
}
