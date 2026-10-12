"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, createContext, useContext, useState, useCallback } from "react"
import { ChevronRight } from "lucide-react"

type OwnedActions = { owner: string; node: React.ReactNode }

const HeaderActionsContext = createContext<{
  owned: OwnedActions | null
  setOwned: React.Dispatch<React.SetStateAction<OwnedActions | null>>
}>({ owned: null, setOwned: () => {} })

export function AdminHeaderActionsProvider({ children }: { children: React.ReactNode }) {
  const [owned, setOwned] = useState<OwnedActions | null>(null)
  return (
    <HeaderActionsContext.Provider value={{ owned, setOwned }}>
      {children}
    </HeaderActionsContext.Provider>
  )
}

/**
 * Header actions are tagged with the pathname of the page that set them, so a
 * page that forgets to clean up can never leak its buttons into another module.
 */
export function useAdminHeaderActions() {
  const pathname = usePathname()
  const { setOwned } = useContext(HeaderActionsContext)

  const setActions = useCallback(
    (node: React.ReactNode | null) => {
      if (node === null) {
        // Only clear actions this page owns; the next page may already have set its own.
        setOwned((cur) => (cur?.owner === pathname ? null : cur))
      } else {
        setOwned({ owner: pathname, node })
      }
    },
    [pathname, setOwned]
  )

  return { setActions }
}

const pathLabels: Record<string, string> = {
  nulis: "Dashboard",
  karya: "Karya",
  baru: "Tambah baru",
  chapter: "Chapter",
  create: "Tambah baru",
  users: "Users",
  orders: "Orders",
  paket: "Paket",
  comments: "Komentar",
}

// Routes that exist as pages and can be linked from the breadcrumb.
const linkable = [
  /^\/nulis$/,
  /^\/nulis\/(karya|users|orders|paket|comments)$/,
  /^\/nulis\/karya\/[^/]+$/,
  /^\/nulis\/users\/[^/]+$/,
]

// Dynamic [id] segments follow one of these collection segments.
const idLabels: Record<string, string> = {
  karya: "Detail karya",
  users: "Detail user",
  chapter: "Edit chapter",
  paket: "Edit paket",
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)
  const crumbs: { label: string; href: string; linkable: boolean }[] = []

  let accumulated = ""
  segments.forEach((seg, i) => {
    accumulated += "/" + seg
    const prev = segments[i - 1]
    const label =
      pathLabels[seg] ??
      (prev && idLabels[prev]) ??
      seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ")
    crumbs.push({ label, href: accumulated, linkable: linkable.some((r) => r.test(accumulated)) })
  })

  return crumbs
}

export function AdminHeader() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLDivElement>(null)
  const breadcrumbs = getBreadcrumbs(pathname)
  const { owned } = useContext(HeaderActionsContext)
  const actions = owned && owned.owner === pathname ? owned.node : null

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const onScroll = () => {
      el.style.borderBottomColor = window.scrollY > 4 ? "var(--border)" : "transparent"
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      ref={headerRef}
      className="sticky top-0 z-30 backdrop-blur-xl transition-colors duration-300"
      style={{
        borderBottom: "1px solid transparent",
        backgroundColor: "color-mix(in srgb, var(--background) 90%, transparent)",
      }}
    >
      <div className="flex items-center gap-4 h-16 px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 flex-1 min-w-0 text-[13px]">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1
            return (
              <span key={crumb.href} className="flex items-center gap-1 min-w-0">
                {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />}
                {isLast ? (
                  <span className="font-semibold text-foreground truncate">{crumb.label}</span>
                ) : crumb.linkable ? (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-muted-foreground truncate">{crumb.label}</span>
                )}
              </span>
            )
          })}
        </nav>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
