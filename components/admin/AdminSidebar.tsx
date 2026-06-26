"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  PlusCircle,
  ChevronLeft,
  FileText,
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
    children: [
      {
        title: "Semua Karya",
        href: "/admin/karya",
        icon: FileText,
      },
      {
        title: "Tambah Karya",
        href: "/admin/karya/baru",
        icon: PlusCircle,
      },
    ],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
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

            if (item.children) {
              return (
                <div key={item.href} className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="size-4 opacity-50" />
                    <span>{item.title}</span>
                  </div>
                  <div className="ml-4 flex flex-col gap-1 border-l border-sidebar-border pl-3">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href
                      const ChildIcon = child.icon
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            childActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          )}
                        >
                          <ChildIcon className="size-3.5 opacity-50" />
                          <span>{child.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            }

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
