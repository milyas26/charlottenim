import type { Metadata } from "next"
import AdminGuard from "@/components/admin/AdminGuard"
import { NulisTheme } from "@/components/admin/NulisTheme"
import { AdminSidebar, AdminContent } from "@/components/admin/AdminSidebar"
import { AdminHeader, AdminHeaderActionsProvider } from "@/components/admin/AdminHeader"

export const metadata: Metadata = {
  title: "Nulis Panel — Charlottenimmm",
  description: "Nulis dashboard for Charlottenimmm",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <NulisTheme />
      <div className="nulis-theme font-ui min-h-screen bg-background text-foreground">
        <AdminSidebar />
        <AdminContent>
          <AdminHeaderActionsProvider>
            <AdminHeader />
            <main>
              <div className="min-h-[calc(100vh-64px)]">{children}</div>
            </main>
          </AdminHeaderActionsProvider>
        </AdminContent>
      </div>
    </AdminGuard>
  )
}
