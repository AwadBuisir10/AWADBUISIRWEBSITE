import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://awadbuisir.com"),
  title: "Awad Buisir — Software, AI & Media Systems",
  description:
    "CS at Northeastern. Software, AI automation, creative strategy, and community building — connected by execution.",
  openGraph: {
    title: "Awad Buisir — Software, AI & Media Systems",
    description:
      "Software, AI workflows, and media systems that create visible impact.",
    images: ["/assets/hero-visual.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
