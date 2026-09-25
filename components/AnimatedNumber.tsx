import { RollingNumber } from "@/components/RollingNumber";

type AnimatedNumberProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/**
 * Metrics are rendered at their final value in server HTML. The odometer roll
 * only slides digit columns into place, so numbers stay correct before
 * hydration, under reduced motion, and if an animation never runs.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className
}: AnimatedNumberProps) {
  const text = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");

  return <RollingNumber text={`${prefix}${text}${suffix}`} className={className} />;
}
