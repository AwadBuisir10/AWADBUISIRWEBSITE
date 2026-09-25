"use client";

import { useEffect } from "react";

/**
 * One document-level listener that feeds --spot-x/--spot-y to whichever
 * `.spotlight` surface is under the mouse, so hover glows track the pointer
 * without a listener per card. Renders nothing.
 */
export function SpotlightLayer() {
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const surface = event.target.closest<HTMLElement>(".spotlight");
      if (!surface) return;
      const box = surface.getBoundingClientRect();
      surface.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
      surface.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);

  return null;
}
