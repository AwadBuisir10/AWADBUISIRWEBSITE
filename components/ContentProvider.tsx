"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useContext, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "@/data/content";

const ContentContext = createContext<SiteContent>(defaultContent);

export function ContentProvider({ children, content = defaultContent }: { children: ReactNode; content?: SiteContent }) {
  // "user" drops transform animations for visitors who prefer reduced motion.
  return (
    <ContentContext.Provider value={content}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(ContentContext);
}
