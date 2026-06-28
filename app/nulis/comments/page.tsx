"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Pagination } from "@/components/ui/pagination"
import { useDebounce } from "@/hooks/useDebounce"
import { Search, Loader2 } from "lucide-react"
import { useAdminComments } from "@/lib/api/comments"

export default function AdminCommentsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)

  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useAdminComments(page, limit, debouncedSearch)

  const comments = data?.comments ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

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
          placeholder="Cari user, karya, atau komentar..."
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
              <TableHead className="w-[180px]">User</TableHead>
              <TableHead className="w-[180px]">Karya / Chapter</TableHead>
              <TableHead>Komentar</TableHead>
              <TableHead className="w-[100px]">Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Tidak ada komentar ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              comments.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                          {getInitials(c.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{c.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium truncate max-w-[180px]">{c.workTitle}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">{c.chapterTitle}</div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">{c.content}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{c.createdAt}</TableCell>
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
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
      />
    </div>
  )
}
