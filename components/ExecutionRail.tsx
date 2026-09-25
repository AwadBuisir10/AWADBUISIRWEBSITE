"use client";

import { useEffect, useState } from "react";
import { ScrambleText } from "@/components/ScrambleText";

/** Story chapters shared by the wide-screen rail and the navbar's "you are here" label. */
export const chapters = [
  { id: "about", number: "01", label: "Origin" },
  { id: "work", number: "02", label: "Build" },
  { id: "experience", number: "03", label: "Proof" },
  { id: "community", number: "05", label: "Reach" },
  { id: "creative", number: "08", label: "Create" },
  { id: "contact", number: "09", label: "Connect" }
];

/** Wide-screen (2xl) chapter rail. On smaller screens, progress lives in the navbar. */
export function ExecutionRail() {
  const [active, setActive] = useState(chapters[0].id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55%", threshold: [0, 0.15, 0.5] }
    );

    chapters.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <aside className="execution-rail" aria-label="Page chapters">
      <span className="execution-rail__track" aria-hidden="true">
        <span className="execution-rail__progress" style={{ transform: `scaleY(${progress})` }} />
      </span>
      <ol className="execution-rail__labels">
        {chapters.map((chapter) => (
          <li key={chapter.id} className={active === chapter.id ? "is-active" : ""}>
            <a href={`#${chapter.id}`} aria-current={active === chapter.id ? "location" : undefined}>
              <span>{chapter.number}</span>
              <ScrambleText text={chapter.label} hover onView={false} duration={400} />
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
