import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovyx Studio — Muhammad Usman",
  description: "Independent creative studio crafting distinctive websites, e-commerce experiences and visual identities. Founded and led by Muhammad Usman.",
  openGraph: {
    title: "Innovyx Studio — I build brands.",
    description: "Web design. Branding. E-commerce. An independent creative studio led by Muhammad Usman.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
