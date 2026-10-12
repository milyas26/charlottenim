"use client"

import { AdminPageTitle } from "@/components/admin/AdminPageTitle"
import { useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight, ArrowUp, ArrowDown, ArrowUpDown, Users } from "lucide-react"
import { TablePanel, SearchInput, Toolbar, EmptyState, PageLoader } from "@/components/admin/ui"
import { StatusPill, tint } from "@/components/admin/tint"
import { cn } from "@/lib/utils"
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
  className,
}: {
  field: SortField
  sortField: SortField
  sortDir: SortDir
  onSort: (field: SortField) => void
  children: ReactNode
  className?: string
}) {
  const active = sortField === field
  const Arrow = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown
  return (
    <TableHead
      className={cn(
        "group cursor-pointer select-none transition-colors hover:text-foreground",
        active && "text-foreground",
        className
      )}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        <Arrow
          className={cn(
            "size-3 transition-opacity",
            active ? "opacity-80" : "opacity-0 group-hover:opacity-50"
          )}
        />
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

  const { data: result, isLoading, isFetching } = useAdminUsers(params)
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

  // Only the very first load replaces the page; later searches keep the input mounted.
  if (isLoading && !result) return <PageLoader />

  return (
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle title="Users" description={`${total} pembaca terdaftar`} />
      <Toolbar>
        <SearchInput
          placeholder="Cari nama atau email..."
          value={search}
          loading={isFetching && !isLoading}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
        />
      </Toolbar>

      <TablePanel>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Nama</SortableHead>
              <SortableHead field="role" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Role</SortableHead>
              <SortableHead field="totalPurchases" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Pembelian</SortableHead>
              <SortableHead field="totalSpent" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Total spent</SortableHead>
              <SortableHead field="lastReadWork" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Terakhir baca</SortableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    icon={Users}
                    tone="blue"
                    title="Tidak ada user ditemukan"
                    description={search ? "Coba kata kunci lain." : "Pembaca yang mendaftar akan muncul di sini."}
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: AdminUser) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={user.avatarUrl ?? undefined} alt="" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                        <AvatarFallback className="text-xs font-semibold" style={tint("brown")}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link
                          href={`/nulis/users/${user.id}`}
                          className="block truncate text-[15px] font-semibold transition-colors hover:text-primary"
                        >
                          {user.name}
                        </Link>
                        <p className="text-[13px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={user.role === "ADMIN" ? "brown" : "neutral"}>
                      {user.role === "ADMIN" ? "Admin" : "Reader"}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{user.totalPurchases}</TableCell>
                  <TableCell className="tabular-nums">
                    {user.totalSpent > 0 ? (
                      <span className="font-semibold">Rp {user.totalSpent.toLocaleString("id-ID")}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-muted-foreground">
                    {user.lastReadWork || "-"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/nulis/users/${user.id}`}
                      aria-label={`Lihat ${user.name}`}
                      className="size-8 inline-flex items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <ChevronRight className="size-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TablePanel>

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
