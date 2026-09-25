"use client";

import { useEffect, useState } from "react";

const TIME_ZONE = "America/New_York";

/**
 * Live Boston time. Renders a neutral placeholder on the server and the first
 * client pass (no hydration mismatch), then ticks every second.
 */
export function LocalClock({ seconds = false, className }: { seconds?: boolean; className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!now) return <span className={className}>--:--</span>;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" } : {}),
    timeZoneName: "short"
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";

  return (
    <time dateTime={now.toISOString()} className={`tabular-nums ${className ?? ""}`}>
      {part("hour")}<span className={seconds ? undefined : "blink-caret"}>:</span>{part("minute")}
      {seconds ? <>:{part("second")}</> : null} {part("dayPeriod")} <span className="opacity-60">{part("timeZoneName")}</span>
    </time>
  );
}
