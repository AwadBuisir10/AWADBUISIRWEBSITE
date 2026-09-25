"use client";

import { RollingNumber } from "@/components/RollingNumber";
import { useSocialCounts } from "@/lib/social-count-store";

export function LiveFollowerTotal({ className }: { className?: string }) {
  const count = useSocialCounts();
  return <RollingNumber text={count.totalFollowers.toLocaleString("en-US")} className={className} />;
}

/** Resolve legacy audience copy at render time from the shared scraper data.
 * Supports both the published copy and pending editorial revisions. */
export function AudienceText({ children }: { children: string }) {
  const count = useSocialCounts();
  const audience = count.totalFollowers.toLocaleString("en-US");
  return <>{children.replace(/\b\d+(?:\.\d+)?K\+(?= (?:followers|audience|network|community)\b)/g, audience)
    .replace(/12M\+ views/g, "20M+ views").replace(/1\.3M\+ engagement/g, "1M+ interactions")}</>;
}
