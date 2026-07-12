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
  metadataBase: new URL("https://awadbuisirwebsite.vercel.app"),
  title: "Awad Buisir — Software, AI & Media Systems",
  description:
    "CS at Northeastern. Software, AI automation, creative strategy, and community building — connected by execution.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Awad Buisir — Software, AI & Media Systems",
    description:
      "Software, AI workflows, and media systems that create visible impact.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Awad Buisir portfolio" }]
  },
  twitter: { card: "summary_large_image", title: "Awad Buisir — Software, AI & Media Systems", description: "Software, AI workflows, and media systems that create visible impact.", images: ["/opengraph-image"] }
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
              url: "https://awadbuisirwebsite.vercel.app",
              jobTitle: "Software Engineer",
              alumniOf: { "@type": "CollegeOrUniversity", name: "Northeastern University" },
              sameAs: [
                "https://www.linkedin.com/in/awad-buisir-0221a41ab/",
                "https://github.com/ABuisir10",
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
