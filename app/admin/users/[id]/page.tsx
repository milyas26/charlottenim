"use client"

import { use } from "react"
import Link from "next/link"
import { adminUsers, adminPurchases } from "@/data/admin-dummy"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Mail, Calendar, ShoppingBag, BookOpen } from "lucide-react"

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const user = adminUsers.find((u) => u.id === parseInt(id))
  if (!user) notFound()

  const userPurchases = adminPurchases.filter((p) => p.userId === user.id)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Detail User</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="size-20 mx-auto">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-3">{user.name}</CardTitle>
            <CardDescription>
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role === "ADMIN" ? "Admin" : "Reader"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Bergabung: {new Date(user.joinedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <ShoppingBag className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Total Pembelian</span>
              </div>
              <span className="font-medium">{user.totalPurchases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground ml-6">Total Spent</span>
              <span className="font-medium">Rp {user.totalSpent.toLocaleString("id-ID")}</span>
            </div>
            {user.lastReadWork && (
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Terakhir baca: {user.lastReadWork}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Riwayat Pembelian</CardTitle>
            <CardDescription>{userPurchases.length} transaksi</CardDescription>
          </CardHeader>
          <CardContent>
            {userPurchases.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                Belum ada riwayat pembelian.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Karya</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPurchases.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.workTitle}</TableCell>
                      <TableCell className="text-muted-foreground">{p.chapterTitle}</TableCell>
                      <TableCell>Rp {p.amount.toLocaleString("id-ID")}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "PAID" ? "default" : p.status === "FAILED" ? "destructive" : "secondary"}>
                          {p.status === "PAID" ? "Sukses" : p.status === "FAILED" ? "Gagal" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
