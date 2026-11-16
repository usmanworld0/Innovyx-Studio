import type { CSSProperties, ReactNode } from "react";
type SceneProps = { id?: string; label: string; gap?: number; hold?: number; anchor?: string; mobileAnchor?: string; dark?: boolean; ease?: number; children?: ReactNode; className?: string; };
export function Scene({ id, label, gap = 3, hold = .6, anchor = "0,0", mobileAnchor, dark, ease = 1, className = "", children }: SceneProps) {
  return <section id={id} className={`scene ${className}`} data-label={label} data-gap={gap} data-hold={hold} data-anchor={anchor} data-mobile-anchor={mobileAnchor} data-dark={dark ? "true" : undefined} data-ease={ease} aria-label={label}>{children}</section>;
}
type LayerProps = { position?: string; mobile?: string; depth?: number; from?: string; rotation?: number; absolute?: boolean; children: ReactNode; className?: string; };
export function Layer({ position = "0,0", mobile, depth = 0, from = "0,0", rotation = 0, absolute, children, className = "" }: LayerProps) {
  return <div className={`layer ${className}`} data-position={position} data-mobile={mobile} data-depth={depth} data-from={from} data-rotation={rotation} data-absolute={absolute ? "true" : undefined}>{children}</div>;
}
export function SplitText({ text, className = "", as: Tag = "p" }: { text: string; className?: string; as?: "h1" | "h2" | "p" }) {
  let index = 0;
  return <Tag className={`display split ${className}`} aria-label={text}>{text.split(" ").map((word, wi) => <span className="word" key={`${word}-${wi}`} aria-hidden="true">{word.split("").map((letter) => { const i = index++; return <span key={i} className="char" style={{ "--i": i } as CSSProperties}>{letter}</span>; })}{wi < text.split(" ").length - 1 ? <span className="word-space"> </span> : null}</span>)}</Tag>;
}
