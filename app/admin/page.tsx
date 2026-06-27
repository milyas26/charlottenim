import { adminStats } from "@/data/admin-dummy"
import { works, chapters } from "@/data/dummy"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Users, DollarSign, Eye, Crown, BookMarked } from "lucide-react"
import Link from "next/link"

const statsCards = [
  { title: "Total Karya", value: adminStats.totalWorks.toString(), icon: BookOpen, description: `${works.filter(w => w.status === "DRAFT").length} draft · ${works.filter(w => w.status === "ONGOING").length} ongoing · ${works.filter(w => w.status === "COMPLETED").length} selesai` },
  { title: "Total Chapter", value: adminStats.totalChapters.toString(), icon: BookMarked, description: `${adminStats.freeChapters} gratis · ${adminStats.premiumChapters} premium` },
  { title: "Total Pembaca", value: adminStats.totalUsers.toString(), icon: Users, description: "User terdaftar" },
  { title: "Total Revenue", value: `Rp ${adminStats.totalRevenue.toLocaleString("id-ID")}`, icon: DollarSign, description: `${adminPurchases.filter(p => p.status === "PAID").length} transaksi sukses` },
  { title: "Total Dibaca", value: adminStats.totalReads.toLocaleString("id-ID"), icon: Eye, description: "Kumulatif semua chapter" },
]

import { adminPurchases } from "@/data/admin-dummy"

export default function AdminDashboardPage() {
  const recentWorks = [...works].sort((a, b) => b.id - a.id).slice(0, 5)

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang kembali, Charlotte.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Karya Terbaru</CardTitle>
              <CardDescription>5 karya terakhir yang ditambahkan</CardDescription>
            </div>
            <Link href="/admin/karya" className="text-sm text-primary hover:underline">
              Lihat semua
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Chapter</TableHead>
                  <TableHead className="text-right">Total Dibaca</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentWorks.map((work) => {
                  const workChapters = chapters.filter((ch) => ch.workId === work.id)
                  const totalReads = workChapters.reduce((sum, ch) => sum + ch.readCount, 0)
                  return (
                    <TableRow key={work.id}>
                      <TableCell className="font-medium">
                        <Link href={`/admin/karya/${work.slug}`} className="hover:text-primary transition-colors">
                          {work.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={work.status === "DRAFT" ? "secondary" : work.status === "ONGOING" ? "default" : "outline"}>
                          {work.status === "DRAFT" ? "Draft" : work.status === "ONGOING" ? "Ongoing" : "Selesai"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{work.totalChapters}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{totalReads.toLocaleString("id-ID")}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Transaksi Terakhir</CardTitle>
            <CardDescription>Pembelian chapter terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminPurchases.slice(0, 5).map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{purchase.userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{purchase.workTitle} — {purchase.chapterTitle}</p>
                  </div>
                  <div className="ml-3 text-right">
                    <p className="text-sm font-medium">Rp {purchase.amount.toLocaleString("id-ID")}</p>
                    <Badge variant={purchase.status === "PAID" ? "default" : purchase.status === "FAILED" ? "destructive" : "secondary"} className="text-[10px]">
                      {purchase.status === "PAID" ? "Sukses" : purchase.status === "FAILED" ? "Gagal" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
