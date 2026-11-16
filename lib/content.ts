// Identity and services are user-supplied and confirmed by the public Instagram bio.
// Selected Work uses the original screenshots supplied by the user.
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
export type Project = { slug: string; name: string; category: string; summary: string; image: string; width: number; height: number; };
// Descriptions cover the visible designs without inventing clients or results.
export const projects: Project[] = [
  { slug: "dipitt", name: "Dipitt", category: "Product website", summary: "An expressive product presentation with floating sauce bottles, warm colour and oversized editorial typography.", image: "/images/work/dipitt.webp", width: 2254, height: 1308 },
  { slug: "loom", name: "Loom", category: "Coffee website", summary: "A rich red and cream coffee experience with bold typography and a playful product composition.", image: "/images/work/loom.webp", width: 2236, height: 1434 },
  { slug: "sweet-treats", name: "Sweet Treats", category: "E-commerce website", summary: "A warm celebration of custom cakes, with a striped rose backdrop and distinctive scalloped framing.", image: "/images/work/sweet-treats.webp", width: 2250, height: 1431 },
  { slug: "innovyx-studio", name: "Innovyx Studio", category: "Studio website", summary: "A studio identity presented through a floating device, oversized type and a restrained monochrome composition.", image: "/images/work/innovyx-studio.webp", width: 2230, height: 1297 },
  { slug: "qalakari", name: "Qalakari", category: "Gallery website", summary: "A photography gallery imagined as prints suspended along a line, using perspective and depth to invite exploration.", image: "/images/work/qalakari.webp", width: 2254, height: 1308 },
  { slug: "driptide", name: "Driptide", category: "Fashion website", summary: "An editorial fashion storefront with a clean white canvas, oversized wordmark and a collection-led composition.", image: "/images/work/driptide.webp", width: 2254, height: 1300 },
];
export const navigation = [
  { id: "about", label: "About" }, { id: "journey", label: "Our story" },
  { id: "services", label: "What we do" }, { id: "work", label: "Work" },
  { id: "studio", label: "The studio" }, { id: "contact", label: "Contact" },
];
