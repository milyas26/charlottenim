"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2 } from "lucide-react"
import api from "@/lib/axios"
import type { Purchase } from "@/data/admin-types"

type StatusFilter = "ALL" | "PAID" | "PENDING" | "FAILED"

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await api.get<Purchase[]>("/api/admin/orders")
      return data
    },
  })

  const filtered = purchases.filter((p) => {
    const matchSearch =
      p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.workTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.chapterTitle.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    PAID: "default",
    PENDING: "secondary",
    FAILED: "destructive",
  }

  const statusLabel: Record<string, string> = {
    PAID: "Berhasil",
    PENDING: "Menunggu",
    FAILED: "Gagal",
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari user, karya, atau chapter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="PAID">Berhasil</SelectItem>
            <SelectItem value="PENDING">Menunggu</SelectItem>
            <SelectItem value="FAILED">Gagal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Karya</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada pembelian ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p, i) => (
                <TableRow key={`${p.createdAt}-${p.userId || i}`}>
                  <TableCell className="font-medium">{p.userName}</TableCell>
                  <TableCell className="text-muted-foreground">{p.workTitle}</TableCell>
                  <TableCell className="text-muted-foreground">{p.chapterTitle}</TableCell>
                  <TableCell className="text-right">Rp {p.amount.toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status]}>
                      {statusLabel[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("id-ID")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Menampilkan {filtered.length} dari {purchases.length} pembelian</p>
      </div>
    </div>
  )
}
