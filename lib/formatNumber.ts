export function formatCompactNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n < 0) return "-" + formatCompactNumber(-n);

  if (n >= 1_000_000_000) return formatValue(n / 1_000_000_000, "b");
  if (n >= 1_000_000) return formatValue(n / 1_000_000, "m");
  if (n >= 1_000) return formatValue(n / 1_000, "k");
  return Math.round(n).toString();
}

function formatValue(value: number, suffix: string): string {
  if (value >= 100) return Math.round(value) + suffix;
  const rounded = Math.round(value * 10) / 10;
  return rounded.toString().replace(".", ",") + suffix;
}
