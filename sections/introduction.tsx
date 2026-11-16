import Image from "next/image";
import { Scene, Layer, SplitText } from "@/components/scene";
import { studio } from "@/lib/content";
export function Introduction({ navigate }: { navigate: (id: string) => void }) {
  return <>
    <Scene id="hero" label="Home" gap={0} hold={.45} anchor=".455,0" mobileAnchor=".46,-.04">
      <Layer position="0,-.06" mobile="0,-.06" from="0,.05"><SplitText as="h1" text="Innovyx Studio" className="hero-name intro" /></Layer>
      <Layer position="-.31,.34" mobile="-.02,.24" depth={-.12} from="-.1,.1"><div className="hero-caption"><span className="mono">Independent creative studio</span><p className="lede">Digital experiences. Built to make brands matter.</p><p className="hero-description">Web design, e-commerce and visual identity. Led by Muhammad Usman.</p></div></Layer>
      <Layer position=".4,.36" mobile=".3,.38" depth={-.2}><button className="scroll-cue" onClick={() => navigate("about")} aria-label="Scroll to explore the studio"><i aria-hidden="true" /><span className="mono">Scroll<span className="cue-extra"> to explore</span></span></button></Layer>
    </Scene>
    <Scene id="about" label="About" gap={3.2} hold={.85} anchor="-.06,-.36" mobileAnchor=".38,-.36">
      <Layer position="-.18,.02" mobile="0,-.205" depth={.35} from="-.35,.05" rotation={28}><figure className="portrait"><Image src="/images/muhammad-usman.webp" width={700} height={900} alt="Muhammad Usman, founder and creative lead of Innovyx Studio" priority sizes="(max-width:760px) 45vw, 27vw" /><figcaption className="mono">Muhammad Usman<br />Founder / Creative Lead</figcaption></figure></Layer>
      <Layer position=".15,-.06" mobile="0,.22" depth={-.08} from=".3,0" rotation={-22}><div className="about-copy"><span className="mono">About the studio</span><SplitText text="Independent by design" className="about-heading" as="h2" /><p className="lede">{studio.introduction}</p><p className="small">Led by Muhammad Usman, we bring design, development and brand storytelling together. Thoughtful ideas, considered typography and the small details that make a digital experience feel right.</p></div></Layer>
    </Scene>
    <Scene id="focus" label="Our focus" dark hold={.7} anchor="0,.36" mobileAnchor="-.4,.42">
      <Layer position="-.3,-.04" mobile="-.12,-.27" depth={.55} from="-.2,-.1"><div className="focus-item"><span className="mono">Web & digital</span><p className="display">Design</p></div></Layer>
      <Layer position=".04,.12" mobile=".08,0" from="0,.15"><div className="focus-item"><span className="mono">E-commerce</span><p className="display">Develop</p></div></Layer>
      <Layer position=".33,-.14" mobile="-.12,.27" depth={-.22} from=".25,-.1"><div className="focus-item"><span className="mono">Visual identity</span><p className="display">Define</p></div></Layer>
    </Scene>
  </>;
}
