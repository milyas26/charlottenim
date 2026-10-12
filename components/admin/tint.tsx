import { cn } from "@/lib/utils"

/** Category palette from the dashboard design doc; backgrounds are the same hue at 13% alpha. */
export const tones = {
  green: "#1E9E4A",
  amber: "#F59E0B",
  rose: "#E11D48",
  orange: "#F0892E",
  teal: "#14B8A6",
  blue: "#3B82F6",
  indigo: "#6D6AF0",
  brown: "#B07A4F",
  neutral: "#6B6B70",
} as const

export type Tone = keyof typeof tones

export function tint(tone: Tone) {
  const c = tones[tone]
  return { color: c, backgroundColor: `color-mix(in srgb, ${c} 13%, transparent)` }
}

export function StatusPill({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap", className)}
      style={tint(tone)}
    >
      {children}
    </span>
  )
}

export function IconBubble({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-full", className)} style={tint(tone)}>
      {children}
    </span>
  )
}

export const workStatusTone = { DRAFT: "neutral", ONGOING: "blue", COMPLETED: "green" } as const satisfies Record<string, Tone>
export const workStatusLabel = { DRAFT: "Draft", ONGOING: "Ongoing", COMPLETED: "Selesai" } as const
export const orderStatusTone: Record<string, Tone> = { PAID: "green", PENDING: "amber", FAILED: "rose" }
export const orderStatusLabel: Record<string, string> = { PAID: "Sukses", PENDING: "Pending", FAILED: "Gagal" }
