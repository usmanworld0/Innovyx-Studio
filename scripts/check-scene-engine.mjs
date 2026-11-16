// Deterministic camera tests with a minimal DOM adapter. These exercise the real
// engine at every scene and viewport; they do not replace browser visual QA.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import ts from 'typescript';

const html = fs.readFileSync('out/index.html','utf8');
const attributes = (markup) => Object.fromEntries([...markup.matchAll(/([\w-]+)="([^"]*)"/g)].map((m)=>[m[1],m[2]]));
const camel = (name) => name.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());
const definitions = [...html.matchAll(/<section([^>]*)>([\s\S]*?)<\/section>/g)].map((match)=>({attributes:attributes(match[1]),layers:[...match[2].matchAll(/<div([^>]*class="layer [^"]*"[^>]*)>/g)].map((layer)=>attributes(layer[1]))})).filter((s)=>s.attributes.class?.split(' ').includes('scene'));
assert.equal(definitions.length,19,'All narrative and work scenes are exported');
const style = () => ({setProperty(key,value){this[key]=value;},removeProperty(key){delete this[key];}});
const classes = () => {const values=new Set();return{add:(v)=>values.add(v),remove:(v)=>values.delete(v),contains:(v)=>values.has(v),toggle:(v,on)=>{if(on===undefined)on=!values.has(v);if(on)values.add(v);else values.delete(v);}};};
const element = (attrs={}) => ({id:attrs.id||'',dataset:Object.fromEntries(Object.entries(attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[camel(k.slice(5)),v])),style:style(),classList:classes(),inert:false,textContent:'',querySelector:()=>null,querySelectorAll:()=>[],removeAttribute(name){if(name==='style')this.style=style();}});

for(const [width,height] of [[375,812],[390,667],[768,1024],[1440,900],[1920,1080]]){
  const sections=definitions.map((d)=>{const s=element(d.attributes);s.layers=d.layers.map(element);s.querySelectorAll=()=>s.layers;return s;});
  const world=element();world.querySelectorAll=(selector)=>selector==='.scene'?sections:[];
  const canvas=element();canvas.offsetHeight=height;
  const context=new Proxy({},{get:(target,key)=>key in target?target[key]:()=>{}});canvas.getContext=()=>context;
  const spacer=element(),panel=element();panel.querySelectorAll=()=>[];
  const ticks=element();ticks.children=[];ticks.replaceChildren=(...children)=>ticks.children=children;ticks.querySelectorAll=()=>ticks.children;
  const number=element(),label=element(),hud=element();hud.querySelector=(selector)=>selector==='.hud-number'?number:selector==='.hud-label'?label:ticks;
  const root=element();let callback=null,clock=0;
  const sandbox={exports:{},console,Math,Number,Array,Object,String,NaN,document:{documentElement:root,createElement:()=>element(),fonts:{ready:Promise.resolve()},getElementById:()=>null},innerWidth:width,innerHeight:height,devicePixelRatio:1,location:{hash:''},history:{scrollRestoration:'auto'},matchMedia:()=>({matches:false}),performance:{now:()=>clock},requestAnimationFrame:(fn)=>{callback=fn;return 1;},cancelAnimationFrame:()=>{callback=null;},setTimeout,clearTimeout,addEventListener(){},removeEventListener(){}};
  sandbox.window={scrollY:0,scrollTo:(options,y)=>{sandbox.window.scrollY=typeof options==='number'?y:options.top;}};
  vm.createContext(sandbox);
  const modules=new Map();
  const load=(filename)=>{const file=path.resolve(filename);if(modules.has(file))return modules.get(file);const exports={};modules.set(file,exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;const evaluate=vm.runInContext(`(function(exports,require){${code}\n})`,sandbox);evaluate(exports,(specifier)=>load(path.resolve(path.dirname(file),`${specifier}.ts`)));return exports;};
  const engine=load('animations/scene-engine.ts').createSceneEngine({world,canvas,spacer,hud,panel});
  const advance=()=>{for(let frame=0;frame<240;frame++){clock+=16.67;callback?.(clock);}};
  advance();
  assert.ok(root.classList.contains('is-3d'));
  assert.equal(label.textContent,'Home');
  for(const section of sections){
    if(!section.id)continue;
    engine.go(section.id);advance();
    assert.ok(Number.isFinite(sandbox.window.scrollY),`${section.id}: finite scroll`);
    assert.ok(sandbox.window.scrollY<=parseFloat(spacer.style.height),`${section.id}: reachable scroll`);
    if(section.layers.length){assert.ok(section.layers.some((l)=>l.style.visibility==='visible'),`${width}: ${section.id} has a visible layer`);assert.ok(section.layers.some((l)=>!l.inert),`${width}: ${section.id} permits interaction`);}
    for(const s of sections)for(const layer of s.layers){assert.doesNotMatch(layer.style.transform||'',/NaN|Infinity/);assert.ok(layer.style.opacity===undefined||Number.isFinite(Number(layer.style.opacity)));}
    if(section.id==='studio')assert.equal(panel.inert,false,`${width}: studio CTA accessible`);
  }
  engine.go('hero');advance();assert.equal(label.textContent,'Home');
  engine.destroy();assert.ok(!root.classList.contains('is-3d'));assert.equal(sandbox.history.scrollRestoration,'auto');
  // The real letter choreography must settle cleanly and never emit invalid CSS.
  const letters=Array.from({length:20},(_,i)=>({...element(),offsetLeft:i*35,offsetTop:0,offsetWidth:30,offsetHeight:100}));
  const chute=element(),runner=element(),limbs=new Map();
  runner.querySelector=(selector)=>{if(!limbs.has(selector))limbs.set(selector,{setAttribute:(key,value)=>assert.doesNotMatch(String(value),/NaN|Infinity/)});return limbs.get(selector);};
  const heading=element(),wrapper={...element(),offsetWidth:700,getBoundingClientRect:()=>({left:width/2-350,top:height/2,width:700}),querySelector:(selector)=>selector==='.display'?heading:selector==='.contact-parachute'?chute:runner,querySelectorAll:()=>letters};
  letters.forEach((letter)=>letter.offsetParent=wrapper);
  sandbox.getComputedStyle=()=>({fontSize:'100px'});
  const choreography=load('animations/letter-choreography.ts');
  for(let p=0;p<=100;p++){
    choreography.animateParachute(wrapper,p/100,width,height);
    choreography.animateRunner(wrapper,p/100,Math.max(0,(p/100-.8)*5));
    for(const letter of letters)assert.doesNotMatch(letter.style.transform||'',/NaN|Infinity/);
    assert.doesNotMatch(chute.style.transform||'',/NaN|Infinity/);
  }
  assert.ok(letters.every((letter)=>letter.style.transform==='none'),'Contact letters settle at their natural positions');
  let fallbackTarget='';sandbox.matchMedia=()=>({matches:true});sandbox.document.getElementById=(id)=>({scrollIntoView:()=>{fallbackTarget=id;}});
  const fallback=load('animations/scene-engine.ts').createSceneEngine({world,canvas,spacer,hud,panel});fallback.go('studio');assert.equal(fallbackTarget,'studio-panel');assert.ok(!root.classList.contains('is-3d'));fallback.destroy();
  console.log(`PASS ${width}×${height}: every scene reachable; finite transforms; scene interactions and studio CTA enabled; return and teardown work.`);
}
// Asset graph: every local image/font/style/script in the exported page exists.
const referenced = [...html.matchAll(/(?:src|href)="(\/(?:images|fonts|_next)\/[^"?]+)(?:\?[^\"]*)?"/g)].map((m)=>m[1]);
for(const asset of referenced)assert.ok(fs.existsSync(`out${asset}`),`Missing exported asset: ${asset}`);
for(const slug of ['dipitt','loom','sweet-treats','innovyx-studio','qalakari','driptide']){
  assert.ok(fs.existsSync(`assets/work/${slug}.png`),`Missing original screenshot: ${slug}`);
  assert.ok(referenced.includes(`/images/work/${slug}.webp`),`Selected Work must use the actual ${slug} screenshot`);
}
assert.doesNotMatch(html,/illustrated placeholder|original imagery pending|reference preview|preview placeholder|\-preview\.svg/i);
assert.doesNotMatch(html,/John Bolster|jsb@|Designing since|250\+|23 awards/i);
console.log(`PASS exported asset graph (${new Set(referenced).size} assets), six actual work screenshots and brand-content audit.`);
