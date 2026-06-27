"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ChevronLeft,
  ShoppingCart,
  MessageSquare,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Karya",
    href: "/admin/karya",
    icon: BookOpen,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold text-sm">
          <BookOpen className="size-5 text-sidebar-primary" />
          <span>charlottenimmm</span>
        </Link>
        <span className="ml-auto rounded bg-sidebar-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-sidebar-primary">
          ADMIN
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <Icon className="size-4 opacity-50" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="p-3">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
          <Link href="/">
            <ChevronLeft className="size-4" />
            Kembali ke Situs
          </Link>
        </Button>
      </div>
    </aside>
  )
}
