type AnimatedNumberProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/**
 * Metrics are intentionally rendered at their final value in server HTML.
 * Motion belongs around the evidence, not inside the evidence itself: this
 * keeps numbers correct before hydration, under reduced motion, and on Safari.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className
}: AnimatedNumberProps) {
  const text = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");

  return <span className={className}>{prefix}{text}{suffix}</span>;
}
