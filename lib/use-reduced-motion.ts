"use client";

import { useReducedMotion as usePreferredReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Hydration-safe reduced-motion flag: false on the server and the first client
 * render (matching server HTML), then the visitor's real preference. Framer's
 * own hook returns null on the server but true on a reduced-motion client's
 * first render, which makes any `reduced ? … : …` branch mismatch.
 */
export function useReducedMotion() {
  const prefersReduced = usePreferredReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(prefersReduced);
}
