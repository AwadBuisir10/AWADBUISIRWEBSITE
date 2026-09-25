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
  title: "Awad Buisir — Software Engineer · Applied AI",
  description:
    "CS at Northeastern (3.84 GPA). Software engineer building applied-AI systems — voice agents, computer vision, and LLM pipelines that do real work.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Awad Buisir — Software Engineer · Applied AI",
    description:
      "Applied-AI software systems: voice agents, computer vision, and LLM pipelines — designed, shipped, and operated end to end.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Awad Buisir portfolio" }]
  },
  twitter: { card: "summary_large_image", title: "Awad Buisir — Software Engineer · Applied AI", description: "Applied-AI software systems: voice agents, computer vision, and LLM pipelines — designed, shipped, and operated end to end.", images: ["/opengraph-image"] }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Awad Buisir",
              url: "https://awadbuisir.com",
              jobTitle: "Software Engineer",
              alumniOf: { "@type": "CollegeOrUniversity", name: "Northeastern University" },
              sameAs: [
                "https://www.linkedin.com/in/awad-buisir/",
                "https://github.com/AwadBuisir10",
                "https://www.instagram.com/awadbuisir/"
              ]
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
