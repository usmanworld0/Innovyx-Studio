import Image from "next/image";
import { Scene, Layer, SplitText } from "@/components/scene";
import { projects } from "@/lib/content";
const layout = [
  { x: -.22, y: -.02, width: "clamp(260px,30vw,560px)", anchor: ".05,.3" },
  { x: .21, y: .05, width: "clamp(260px,30vw,560px)", anchor: "-.02,-.3" },
  { x: -.18, y: 0, width: "clamp(280px,34vw,640px)", anchor: ".26,.34" },
  { x: .19, y: -.04, width: "clamp(280px,34vw,640px)", anchor: "0,.32" },
  { x: -.24, y: .03, width: "clamp(230px,25vw,460px)", anchor: ".04,-.3" },
  { x: .23, y: 0, width: "clamp(230px,25vw,460px)", anchor: "-.12,.36" },
];
export function Work({ openProject }: { openProject: (index: number, button: HTMLButtonElement) => void }) {
  return <>
    <Scene id="work" label="Work" hold={.55} anchor=".4,.26" mobileAnchor=".4,.3">
      <Layer position="-.12,-.13" mobile="-.05,-.064" depth={.3} from="-.15,0"><SplitText text="Selected" className="work-heading" as="h2" /></Layer>
      <Layer position=".14,.11" mobile=".04,.064" from=".15,0"><SplitText text="Work" className="work-heading" /></Layer>
      <Layer position="-.3,.4" mobile="0,.3" depth={-.15}><span className="mono work-note">Six projects · Web design & digital experiences</span></Layer>
    </Scene>
    {projects.map((project, index) => { const p = layout[index]; return <Scene key={project.slug} id={`work-${project.slug}`} label="Work" gap={index ? 1.55 : 2.2} hold={.38} ease={.5} anchor={p.anchor} mobileAnchor={`${p.x < 0 ? .43 : -.43},.36`}>
      <Layer position={`${p.x},${p.y}`} mobile="0,-.02" from={`${p.x < 0 ? -.25 : .25},0`} rotation={p.x < 0 ? 18 : -18}>
        <button className={`project-card ${p.x < 0 ? "left" : "right"}`} style={{ width: p.width }} onClick={(e) => openProject(index, e.currentTarget)} aria-label={`View ${project.name} project`}>
          <span className="project-figure" style={{ aspectRatio: `${project.width} / ${project.height}` }}><Image src={project.image} alt={`${project.name} website screenshot`} width={project.width} height={project.height} unoptimized sizes="(max-width:760px) 80vw, 36vw" /></span>
          <span className="project-meta mono"><span>{String(index + 1).padStart(2, "0")} / 06</span><span>Web design</span></span>
          <span className="display project-name">{project.name}</span><span className="small">{project.category}</span><span className="mono project-open">View project <i aria-hidden="true" /></span>
        </button>
      </Layer>
    </Scene>; })}
  </>;
}
