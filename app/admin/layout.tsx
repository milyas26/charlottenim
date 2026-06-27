import type { Metadata } from "next"
import AdminGuard from "@/components/admin/AdminGuard"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader, AdminHeaderActionsProvider } from "@/components/admin/AdminHeader"

export const metadata: Metadata = {
  title: "Admin Panel — charlottenimmm",
  description: "Admin dashboard for charlottenimmm",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="ml-60 min-h-screen">
          <AdminHeaderActionsProvider>
            <AdminHeader />
            <main>
              <div className="min-h-[calc(100vh-64px)]">{children}</div>
            </main>
          </AdminHeaderActionsProvider>
        </div>
      </div>
    </AdminGuard>
  )
}
