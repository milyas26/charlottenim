"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, createContext, useContext, useState } from "react"
import { ChevronRight } from "lucide-react"

const HeaderActionsContext = createContext<{
  actions: React.ReactNode | null
  setActions: (actions: React.ReactNode | null) => void
}>({ actions: null, setActions: () => {} })

export function AdminHeaderActionsProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<React.ReactNode | null>(null)
  return (
    <HeaderActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </HeaderActionsContext.Provider>
  )
}

export function useAdminHeaderActions() {
  return useContext(HeaderActionsContext)
}

const pathLabels: Record<string, string> = {
  admin: "Dashboard",
  karya: "Karya",
  baru: "Tambah Baru",
  chapter: "Chapter",
  create: "Tambah Baru",
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
  const { actions } = useContext(HeaderActionsContext)

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
      <div className="flex items-center h-14 px-8 text-sm">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
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
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
