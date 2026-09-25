/** Space the floating navbar needs (12px inset + 64px bar) plus breathing room. */
export const NAV_CLEARANCE = 100;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Where a hash target should land: sections line up their header rule
 * (`[data-section-start]`) just under the navbar instead of their top padding;
 * anything else (projects, the skills ledger) lines up its own top edge.
 */
function targetTop(element: HTMLElement) {
  const anchor = (element.tagName === "SECTION" && element.querySelector<HTMLElement>("[data-section-start]")) || element;
  const top = anchor.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(max, Math.round(top)));
}

let cancelPending: (() => void) | null = null;

/** Smooth-scrolls to `#id`, then corrects once if late layout moved the target. */
export function scrollToHash(hash: string, { smooth = true }: { smooth?: boolean } = {}) {
  cancelPending?.();
  const behavior: ScrollBehavior = smooth && !prefersReducedMotion() ? "smooth" : "instant";

  if (hash === "#" || hash === "#top") {
    window.scrollTo({ top: 0, behavior });
    return true;
  }
  const element = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!element) return false;

  window.scrollTo({ top: targetTop(element), behavior });
  if (behavior !== "smooth") return true;

  // Images, embeds, or a sibling opening can shift the page mid-scroll; settle
  // on the real position when the scroll ends, unless the visitor takes over.
  let done = false;
  const settle = () => {
    if (done) return;
    cleanup();
    const top = targetTop(element);
    if (Math.abs(top - window.scrollY) > 2) window.scrollTo({ top, behavior: "instant" });
  };
  const cleanup = () => {
    done = true;
    window.clearTimeout(timer);
    window.removeEventListener("scrollend", settle);
    for (const type of ["wheel", "touchstart", "keydown"] as const) window.removeEventListener(type, abandon);
    cancelPending = null;
  };
  const abandon = () => cleanup();
  const timer = window.setTimeout(settle, 1600);
  window.addEventListener("scrollend", settle, { once: true });
  for (const type of ["wheel", "touchstart", "keydown"] as const) window.addEventListener(type, abandon, { passive: true, once: true });
  cancelPending = cleanup;
  return true;
}
