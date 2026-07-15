"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ChevronRight, Loader2, ArrowUpDown } from "lucide-react"
import { useAdminUsers } from "@/lib/api/admin"
import { Pagination } from "@/components/ui/pagination"
import type { AdminUser } from "@/data/admin-types"

type SortField = "name" | "role" | "totalPurchases" | "totalSpent" | "lastReadWork"
type SortDir = "asc" | "desc"

function SortableHead({
  field,
  sortField,
  sortDir,
  onSort,
  children,
}: {
  field: SortField
  sortField: SortField
  sortDir: SortDir
  onSort: (field: SortField) => void
  children: ReactNode
}) {
  return (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortField === field ? (
          <span className="text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>
        ) : (
          <ArrowUpDown className="size-3 text-muted-foreground" />
        )}
      </span>
    </TableHead>
  )
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortField, setSortField] = useState<SortField>("totalSpent")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const params = {
    ...(search && { search }),
    sortField,
    sortDir,
    page,
    limit,
  }

  const { data: result, isLoading } = useAdminUsers(params)
  const users = result?.data ?? []
  const total = result?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / (limit || 10)))

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
    setPage(1)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Nama</SortableHead>
              <SortableHead field="role" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Role</SortableHead>
              <SortableHead field="totalPurchases" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Pembelian</SortableHead>
              <SortableHead field="totalSpent" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Total Spent</SortableHead>
              <SortableHead field="lastReadWork" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Terakhir Baca</SortableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada user ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: AdminUser) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl ?? undefined} alt="" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link href={`/nulis/users/${user.id}`} className="font-medium hover:text-primary transition-colors block truncate">
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
                      <Link href={`/nulis/users/${user.id}`}>
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

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
      />
    </div>
  )
}
