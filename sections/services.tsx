"use client";
import { useState } from "react";
import { Scene, Layer, SplitText } from "@/components/scene";
import { services } from "@/lib/content";
const particles = Array.from({ length: 27 }, (_, i) => ({ x: (((i * 37 + 13) % 101) / 100 - .5) * 1.3, y: (((i * 53 + 7) % 101) / 100 - .5), z: -.3 + ((i * 23) % 101) / 100 * 1.9, size: 3 + i % 5 }));
export function Services() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return <Scene id="services" label="What we do" dark hold={1.1} anchor=".46,-.21" mobileAnchor=".46,-.25">
    <Layer position="0,-.33" mobile="0,-.37" depth={.35} from="0,-.1"><SplitText as="h2" text="What we do" className="services-heading" /></Layer>
    {services.map((service, index) => <Layer key={service.title} position={service.position} mobile={service.mobile} depth={Number(service.depth)} absolute><button className="service" aria-expanded={expanded === index} aria-controls={`service-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}><span className="mono">0{index + 1}</span><span className="display service-name">{service.short}</span><span className="service-detail" id={`service-${index}`}>{service.items.map((item) => <span key={item}>{item}</span>)}</span></button></Layer>)}
    {particles.map((p, i) => <Layer key={i} position={`${p.x},${p.y}`} mobile={`${p.x * .8},${p.y}`} depth={p.z} absolute><i className="particle" style={{ width: p.size, height: p.size }} aria-hidden="true" /></Layer>)}
  </Scene>;
}
