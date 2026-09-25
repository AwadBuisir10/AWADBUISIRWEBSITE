const PROJECT_OPEN = "project:open";

/** Ask the Work section to show and expand a project (palette, nav preview). */
export const openProject = (slug: string) => window.dispatchEvent(new CustomEvent<string>(PROJECT_OPEN, { detail: slug }));

export function onProjectOpen(handler: (slug: string) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(PROJECT_OPEN, listener);
  return () => window.removeEventListener(PROJECT_OPEN, listener);
}
