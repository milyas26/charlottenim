export const DEFAULT_TIME_ZONE = "Asia/Jakarta"

/** Hour 0–23 in the given time zone, or in the runtime's local zone when omitted. */
function hourIn(date: Date, timeZone?: string) {
  if (!timeZone) return date.getHours()
  // hourCycle "h23" avoids the "24" some runtimes return for midnight with hour12: false.
  const hour = new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone }).format(date)
  return Number(hour) % 24
}

export function getGreeting(date: Date = new Date(), timeZone?: string) {
  const h = hourIn(date, timeZone)
  if (h < 4) return "Selamat malam"
  if (h < 11) return "Selamat pagi"
  if (h < 15) return "Selamat siang"
  if (h < 19) return "Selamat sore"
  return "Selamat malam"
}
