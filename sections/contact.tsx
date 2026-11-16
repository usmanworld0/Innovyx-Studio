"use client";
import { useEffect, useRef, useState } from "react";
import { Scene, Layer, SplitText } from "@/components/scene";
import { studio } from "@/lib/content";
import { Parachute } from "@/components/motion-figures";
export function Contact({ navigate }: { navigate: (id: string) => void }) {
  const [copyState, setCopyState] = useState("Copy Instagram");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(studio.handle); setCopyState("Copied"); }
    catch { setCopyState("Select @innovyx.studio to copy"); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("Copy Instagram"), 2200);
  };
  return <Scene id="contact" label="Contact" gap={3.4} hold={1.2} anchor=".44,-.07" mobileAnchor=".47,-.07">
    <Layer position="0,-.06" mobile="0,-.11"><div className="contact-heading-wrap"><SplitText as="h2" text="Let's make something" className="contact-heading" /><Parachute /></div></Layer>
    <Layer position="0,.13" mobile="0,.13" depth={-.12} from="0,.1"><div className="contact-row"><a className="contact-handle" href={studio.instagram} target="_blank" rel="noopener noreferrer">{studio.handle} <span aria-hidden="true">↗</span></a><button className="pill" onClick={copy} aria-live="polite">{copyState}</button></div></Layer>
    <Layer position="0,.26" mobile="0,.29" depth={-.15} from="0,.1"><p className="contact-person small">Muhammad Usman · Founder / Creative Lead</p></Layer>
    <Layer position="0,.38" mobile="0,.41" depth={-.2} from="0,.1"><footer className="contact-footer mono"><a href={studio.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><button onClick={() => navigate("services")}>Services</button><button onClick={() => navigate("hero")}>Back to start ↑</button><span>© {new Date().getFullYear()} Innovyx Studio</span></footer></Layer>
  </Scene>;
}
export function StudioPanel() {
  return <section className="studio-panel" id="studio-panel" aria-label="The studio"><div className="studio-panel-inner"><div className="studio-panel-copy"><span className="mono panel-reveal">The studio · Muhammad Usman</span><p className="display studio-panel-mark panel-reveal">Innovyx<br />Studio</p><h2 className="panel-reveal">Digital experiences.<br />Built to make brands matter.</h2><p className="panel-reveal">{studio.introduction}</p><a className="studio-cta panel-reveal" href={studio.instagram} target="_blank" rel="noopener noreferrer">Start a conversation <span aria-hidden="true">↗</span></a></div><div className="studio-emblem panel-reveal" aria-hidden="true"><svg viewBox="0 0 100 100"><path fill="currentColor" d="M8 15h23l61 70H69L8 15Zm0 27 25 29v14H8V42Zm59-27h25v43L67 29V15Z" /></svg><span className="mono">Web design · Branding · E-commerce</span></div></div></section>;
}
