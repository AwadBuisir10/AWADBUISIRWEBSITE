"use client";

import { useEffect } from "react";
import { openProject } from "@/lib/project-events";
import { scrollToHash } from "@/lib/scroll-to-hash";

/**
 * Every in-page link (nav, rail, footer, globe pins, marquee, buttons) goes
 * through one handler so they all land in the same place. Deep links like
 * /#work are re-aligned once the page has laid out.
 */
export function HashNavigation() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href^='#']") : null;
      const hash = link?.getAttribute("href");
      if (!link || !hash) return;
      if (link.dataset.openProject) openProject(link.dataset.openProject);
      if (!scrollToHash(hash)) return;
      event.preventDefault();
      if (hash === "#main-content") document.getElementById("main-content")?.focus({ preventScroll: true });
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    if (window.location.hash) {
      const frame = requestAnimationFrame(() => scrollToHash(window.location.hash, { smooth: false }));
      return () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("click", onClick);
      };
    }
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
