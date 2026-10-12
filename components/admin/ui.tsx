import Link from "next/link"
import { ChevronRight, Loader2, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconBubble, type Tone } from "@/components/admin/tint"

export { SearchInput } from "@/components/admin/SearchInput"

/* Shared building blocks for /nulis pages (see .agents/skills/dashboard-admin-design). */

export function Panel({
  title,
  description,
  href,
  hrefLabel = "Lihat semua",
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  href?: string
  hrefLabel?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  const hasHeader = title || description || href || actions
  return (
    <section className={cn("rounded-[24px] bg-card border border-border shadow-[var(--shadow-card)]", className)}>
      {hasHeader && (
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div className="min-w-0">
            {title && <h2 className="text-[17px] font-semibold tracking-[-0.02em]">{title}</h2>}
            {description && <p className="text-[13px] text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            {href && (
              <Link
                href={href}
                className="inline-flex items-center gap-1 h-8 pl-3.5 pr-2.5 rounded-full bg-secondary text-[13px] font-semibold transition hover:brightness-95"
              >
                {hrefLabel}
                <ChevronRight className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
      <div className={cn("p-5", hasHeader && "pt-4", bodyClassName)}>{children}</div>
    </section>
  )
}

/** Wraps a shadcn <Table> so it sits in a soft rounded panel. */
export function TablePanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[24px] bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden",
        // Inner padding gives the rounded row-hover room to breathe.
        "px-2 pb-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export function FilterPills<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; count?: number }[]
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-secondary p-1">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "h-8 px-3.5 rounded-full text-[13px] font-medium transition-all",
              active ? "bg-card text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {o.label}
            {o.count !== undefined && <span className="ml-1.5 text-muted-foreground tabular-nums">{o.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>{children}</div>
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  tone = "brown",
  action,
}: {
  icon: LucideIcon
  title: string
  description?: string
  tone?: Tone
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <IconBubble tone={tone} className="size-12">
        <Icon className="size-5" />
      </IconBubble>
      <p className="mt-3 text-[15px] font-semibold">{title}</p>
      {description && <p className="mt-1 text-[13px] text-muted-foreground max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-24", className)}>
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-right min-w-0 truncate">{children}</span>
    </div>
  )
}

export function StatTile({
  icon: Icon,
  tone,
  label,
  value,
  hint,
}: {
  icon: LucideIcon
  tone: Tone
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
}) {
  return (
    <div className="rounded-[20px] bg-card border border-border shadow-[var(--shadow-card)] p-4 flex flex-col">
      <div className="flex items-center gap-2.5">
        <IconBubble tone={tone} className="size-9">
          <Icon className="size-[18px]" />
        </IconBubble>
        <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="mt-4 text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{value}</p>
      {hint && <p className="mt-1.5 text-[12px] text-muted-foreground truncate">{hint}</p>}
    </div>
  )
}
