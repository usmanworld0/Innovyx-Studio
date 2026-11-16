import { Scene, Layer, SplitText } from "@/components/scene";
import { Runner } from "@/components/motion-figures";
const story = [
  { word: "Usman", eyebrow: "The person", title: "Muhammad Usman", description: "Founder and creative lead. A designer and developer bringing a personal point of view to digital experiences.", left: true },
  { word: "Studio", eyebrow: "The studio", title: "Innovyx Studio", description: "An independent creative digital agency. Web design, branding and e-commerce, brought together under one roof.", left: false },
  { word: "Today", eyebrow: "The direction", title: "I build brands.", description: "A clear focus: distinctive websites, considered identities and e-commerce experiences that put the brand first.", left: true },
  { word: "Next", eyebrow: "The next chapter", title: "Your brand, next.", description: "A new website, an online store or a distinctive identity. The next chapter starts with a conversation.", left: false },
];
export function Journey() {
  return <>
    <Scene id="journey" label="Our story" hold={.5} anchor="0,.3" mobileAnchor="-.38,.3">
      <Layer position="0,-.06" mobile="0,-.08" from="0,.1"><div className="journey-title-wrap"><Runner /><SplitText text="The journey" className="journey-heading outline-fill" as="h2" /></div></Layer>
      <Layer position=".12,.15" mobile=".05,.12" depth={-.15} from=".1,0"><p className="display journey-sub">so far</p></Layer>
    </Scene>
    {story.map((item) => <Scene key={item.word} id={`story-${item.word.toLowerCase()}`} label="Our story" gap={1.35} hold={.32} ease={.55} anchor="0,.3" mobileAnchor="-.38,-.03" className="milestone-scene">
      <Layer position="0,.3" mobile="-.38,-.03"><i className="path-node" aria-hidden="true" /></Layer>
      <Layer position={`${item.left ? -.2 : .2},-.05`} mobile=".02,-.13" depth={.25} from={`${item.left ? -.25 : .25},0`}><p className="display story-word">{item.word}</p></Layer>
      <Layer position={`${item.left ? .2 : -.2},.04`} mobile=".05,.15" depth={-.1} from={`${item.left ? .2 : -.2},0`}><div className="story-copy"><span className="mono">{item.eyebrow}</span><h3 className="story-title">{item.title}</h3><p>{item.description}</p></div></Layer>
    </Scene>)}
    <Scene id="approach" label="Our approach" gap={1.8} hold={.85} anchor="0,.44" mobileAnchor="-.44,.42">
      <Layer position=".03,-.02" mobile="0,-.02" from="0,.3"><div className="approach-copy"><span className="mono">Our approach</span>{["Design with intention", "Develop with care", "Build around the brand"].map((line, index) => <SplitText key={line} text={line} className={`approach-line line-${index}`} />)}</div></Layer>
      <Layer position="-.36,-.16" mobile="-.24,-.29" depth={.45} from="-.35,-.05" rotation={18}><svg className="studio-symbol" viewBox="0 0 100 100" aria-label="Innovyx monogram" role="img"><path fill="currentColor" d="M8 15h23l61 70H69L8 15Zm0 27 25 29v14H8V42Zm59-27h25v43L67 29V15Z" /></svg></Layer>
    </Scene>
  </>;
}
