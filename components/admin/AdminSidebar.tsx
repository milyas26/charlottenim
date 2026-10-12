"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeft,
  ShoppingCart,
  MessageSquare,
  Package,
} from "lucide-react"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Logo from "@/components/Logo"
import { usePendingOrderCount } from "@/lib/api/admin"

const sidebarGroups = [
  {
    label: "Ringkasan",
    items: [{ title: "Dashboard", href: "/nulis", icon: LayoutDashboard }],
  },
  {
    label: "Konten",
    items: [
      { title: "Karya", href: "/nulis/karya", icon: BookOpen },
      { title: "Paket", href: "/nulis/paket", icon: Package },
      { title: "Komentar", href: "/nulis/comments", icon: MessageSquare },
    ],
  },
  {
    label: "Pembaca & transaksi",
    items: [
      { title: "Users", href: "/nulis/users", icon: Users },
      { title: "Orders", href: "/nulis/orders", icon: ShoppingCart, badge: "orders" as const },
    ],
  },
]

/** The chapter editor needs every pixel, so the sidebar shrinks to icons there. */
export function useSidebarCollapsed() {
  const pathname = usePathname()
  return /^\/nulis\/karya\/[^/]+\/chapter\//.test(pathname)
}

export function AdminSidebar() {
  const pathname = usePathname()
  const collapsed = useSidebarCollapsed()
  const { data: pendingCount = 0 } = usePendingOrderCount()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn("flex h-16 items-center", collapsed ? "justify-center" : "px-5")}>
        {collapsed ? (
          <Link href="/nulis" aria-label="Dashboard" className="tap-feedback">
            <Image src="/charlottenim-logo.png" alt="Charlottenimmm" width={32} height={32} className="h-8 w-auto" />
          </Link>
        ) : (
          <Logo compact href="/nulis" />
        )}
      </div>

      <nav className={cn("flex-1 overflow-y-auto pb-4", collapsed ? "px-3 space-y-3" : "px-3 space-y-6")}>
        {sidebarGroups.map((group, gi) => (
          <div key={group.label}>
            {collapsed ? (
              gi > 0 && <div className="mx-2 mb-3 h-px bg-sidebar-border" />
            ) : (
              <p className="px-3 mb-2 text-[12px] font-semibold text-muted-foreground">{group.label}</p>
            )}
            <div className={cn("flex flex-col gap-1", collapsed && "items-center")}>
              {group.items.map((item) => {
                const isActive = item.href === "/nulis"
                  ? pathname === "/nulis"
                  : pathname === item.href || pathname.startsWith(item.href + "/")
                const Icon = item.icon
                const showBadge = "badge" in item && item.badge === "orders" && pendingCount > 0

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={collapsed ? item.title : undefined}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "relative flex items-center rounded-full h-10 text-[14px] font-medium text-muted-foreground transition-all hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                      collapsed ? "w-10 justify-center" : "gap-3 px-3",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-[var(--shadow-card)]"
                    )}
                  >
                    <Icon className={cn("size-[18px] shrink-0", isActive ? "text-primary" : "opacity-70")} />
                    {!collapsed && <span className="flex-1">{item.title}</span>}
                    {showBadge &&
                      (collapsed ? (
                        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-sidebar" />
                      ) : (
                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-destructive text-[10px] font-bold text-white">
                          {pendingCount > 99 ? "99+" : pendingCount}
                        </span>
                      ))}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("p-3 border-t border-sidebar-border", collapsed && "flex justify-center")}>
        <Link
          href="/"
          aria-label={collapsed ? "Kembali ke situs" : undefined}
          title={collapsed ? "Kembali ke situs" : undefined}
          className={cn(
            "flex items-center rounded-full h-10 text-[14px] font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "w-10 justify-center" : "gap-3 px-3"
          )}
        >
          <ArrowLeft className="size-[18px] opacity-70" />
          {!collapsed && "Kembali ke situs"}
        </Link>
      </div>
    </aside>
  )
}

/** Main column that follows the sidebar width. */
export function AdminContent({ children }: { children: React.ReactNode }) {
  const collapsed = useSidebarCollapsed()
  return (
    <div className={cn("min-h-screen transition-[margin] duration-200", collapsed ? "ml-16" : "ml-60")}>
      {children}
    </div>
  )
}
