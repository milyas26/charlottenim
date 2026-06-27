import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader, AdminHeaderActionsProvider } from "@/components/admin/AdminHeader"

export const metadata: Metadata = {
  title: "Admin Panel — charlottenimmm",
  description: "Admin dashboard for charlottenimmm",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}
