"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"

const pathLabels: Record<string, string> = {
  admin: "Dashboard",
  karya: "Karya",
  baru: "Tambah Baru",
  chapter: "Chapter",
  users: "Users",
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)
  const crumbs: { label: string; href: string }[] = []

  let accumulated = ""
  for (const seg of segments) {
    accumulated += "/" + seg
    if (seg === "admin" && segments.length === 1) {
      crumbs.push({ label: "Dashboard", href: accumulated })
    } else {
      crumbs.push({ label: pathLabels[seg] || seg, href: accumulated })
    }
  }

  return crumbs
}

export function AdminHeader() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLDivElement>(null)
  const breadcrumbs = getBreadcrumbs(pathname)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const onScroll = () => {
      const scrolled = window.scrollY > 4
      el.style.borderBottomColor = scrolled
        ? "var(--border)"
        : "transparent"
      el.style.backgroundColor = scrolled
        ? "color-mix(in srgb, var(--background) 92%, transparent)"
        : "var(--background)"
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      ref={headerRef}
      className="sticky top-0 z-30 backdrop-blur-xl transition-all duration-300"
      style={{ borderBottom: "1px solid transparent" }}
    >
      <div className="flex items-center gap-1.5 h-14 px-8 text-sm">
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1
          return (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground/50" />}
              <span
                className={
                  isLast
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {crumb.label}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
