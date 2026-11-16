// Identity and services are user-supplied and confirmed by the public Instagram bio.
// Replace the illustrated reference placeholders with original project images here.
export const studio = {
  name: "Innovyx Studio", founder: "Muhammad Usman", role: "Founder / Creative Lead",
  instagram: "https://www.instagram.com/innovyx.studio/", handle: "@innovyx.studio",
  tagline: "I build brands.",
  introduction: "Innovyx Studio is an independent creative studio crafting distinctive digital experiences, e-commerce platforms and visual identities for ambitious brands.",
};
export const services = [
  { title: "Web Design & Development", short: "Web & digital", items: ["Website design", "Responsive development", "Digital experiences"], position: "-.27,-.1", mobile: "-.07,-.2", depth: ".5" },
  { title: "E-commerce Development", short: "E-commerce", items: ["Storefront design", "E-commerce development", "Shopping experiences"], position: ".26,.2", mobile: "-.04,.03", depth: ".18" },
  { title: "Branding & Visual Identity", short: "Brand identity", items: ["Visual identity", "Typography & colour", "Brand design"], position: ".23,-.22", mobile: "-.06,.27", depth: ".85" },
];
export type Project = { slug: string; name: string; category: string; summary: string; image: string; preview: boolean; };
// Names and visual directions come from supplied screenshots. These are clearly
// labelled references, not verified client commissions or published case studies.
export const projects: Project[] = [
  { slug: "dipitt", name: "Dipitt", category: "Product website reference", summary: "An expressive product presentation with floating sauce bottles, warm colour and oversized editorial typography.", image: "/images/dipitt-preview.svg", preview: true },
  { slug: "loom", name: "Loom", category: "Coffee website reference", summary: "A rich red and cream coffee experience with bold typography and a playful product composition.", image: "/images/loom-preview.svg", preview: true },
  { slug: "sweet-treats", name: "Sweet Treats", category: "E-commerce website reference", summary: "A warm celebration of custom cakes, with a striped rose backdrop and distinctive scalloped framing.", image: "/images/sweet-treats-preview.svg", preview: true },
  { slug: "innovyx-studio", name: "Innovyx Studio", category: "Studio website reference", summary: "A studio identity presented through a floating device, oversized type and a restrained monochrome composition.", image: "/images/innovyx-preview.svg", preview: true },
  { slug: "qalakari", name: "Qalakari", category: "Gallery website reference", summary: "A photography gallery imagined as prints suspended along a line, using perspective and depth to invite exploration.", image: "/images/qalakari-preview.svg", preview: true },
  { slug: "driptide", name: "Driptide", category: "Fashion website reference", summary: "An editorial fashion storefront with a clean white canvas, oversized wordmark and a collection-led composition.", image: "/images/driptide-preview.svg", preview: true },
];
export const navigation = [
  { id: "about", label: "About" }, { id: "journey", label: "Our story" },
  { id: "services", label: "What we do" }, { id: "work", label: "Work" },
  { id: "studio", label: "The studio" }, { id: "contact", label: "Contact" },
];
