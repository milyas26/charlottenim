import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"

export const metadata: Metadata = {
  title: "Admin Panel — charlottenimmm",
  description: "Admin dashboard for charlottenimmm",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="ml-60 min-h-screen">
        <AdminHeader />
        <main>
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
