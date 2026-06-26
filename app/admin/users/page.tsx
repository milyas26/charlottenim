"use client"

import { useState } from "react"
import Link from "next/link"
import { adminUsers } from "@/data/admin-dummy"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, ChevronRight } from "lucide-react"

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")

  const filtered = adminUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">Kelola semua pengguna terdaftar.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nama</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Pembelian</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Terakhir Baca</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada user ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link href={`/admin/users/${user.id}`} className="font-medium hover:text-primary transition-colors block truncate">
                          {user.name}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role === "ADMIN" ? "Admin" : "Reader"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.totalPurchases}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.totalSpent > 0 ? `Rp ${user.totalSpent.toLocaleString("id-ID")}` : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastReadWork || "-"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="size-8" asChild>
                      <Link href={`/admin/users/${user.id}`}>
                        <ChevronRight className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Menampilkan {filtered.length} dari {adminUsers.length} user</p>
      </div>
    </div>
  )
}
