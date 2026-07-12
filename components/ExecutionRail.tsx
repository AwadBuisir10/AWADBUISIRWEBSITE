"use client";

import { useEffect, useState } from "react";

const chapters = [
  { id: "about", number: "01", label: "Origin" },
  { id: "work", number: "02", label: "Build" },
  { id: "community", number: "03", label: "Reach" },
  { id: "experience", number: "06", label: "Proof" },
  { id: "creative", number: "07", label: "Create" },
  { id: "contact", number: "09", label: "Connect" }
];

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

  const current = chapters.find((chapter) => chapter.id === active) ?? chapters[0];

  return (
    <>
      <div className="route-mobile" aria-hidden="true">
        <span className="route-mobile__fill" style={{ transform: `scaleX(${progress})` }} />
        <span className="route-mobile__label">{current.number} / {current.label}</span>
      </div>
      <aside className="execution-rail" aria-label="Page chapters">
        <span className="execution-rail__track" aria-hidden="true">
          <span className="execution-rail__progress" style={{ transform: `scaleY(${progress})` }} />
        </span>
        <ol className="execution-rail__labels">
          {chapters.map((chapter) => (
            <li key={chapter.id} className={active === chapter.id ? "is-active" : ""}>
              <a href={`#${chapter.id}`} aria-current={active === chapter.id ? "location" : undefined}>
                <span>{chapter.number}</span>
                {chapter.label}
              </a>
            </li>
          ))}
        </ol>
      </aside>
    </>
  );
}
