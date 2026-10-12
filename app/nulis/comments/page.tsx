"use client"

import { AdminPageTitle } from "@/components/admin/AdminPageTitle"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TablePanel, SearchInput, Toolbar, EmptyState, PageLoader } from "@/components/admin/ui"
import { tint } from "@/components/admin/tint"
import { Pagination } from "@/components/ui/pagination"
import { MessageSquare } from "lucide-react"
import { useAdminComments } from "@/lib/api/comments"

/** Relative time for ISO dates; anything that isn't an ISO date is shown as-is. */
function formatCommentDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return value
  const t = new Date(value).getTime()
  if (Number.isNaN(t)) return value
  const min = Math.floor((Date.now() - t) / 60_000)
  if (min < 1) return "baru saja"
  if (min < 60) return `${min} menit lalu`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} jam lalu`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} hari lalu`
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })
}

export default function AdminCommentsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)

  // SearchInput already debounces, so `search` only changes after typing pauses.
  const { data, isLoading, isFetching } = useAdminComments(page, limit, search)

  const comments = data?.comments ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  // Only the very first load replaces the page; later searches keep the input mounted.
  if (isLoading && !data) return <PageLoader />

  return (
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle title="Komentar" description={`${total} komentar dari pembaca`} />
      <Toolbar>
        <SearchInput
          placeholder="Cari user, karya, atau komentar..."
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
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead className="w-[220px]">Karya / chapter</TableHead>
              <TableHead>Komentar</TableHead>
              <TableHead className="w-[120px]">Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState
                    icon={MessageSquare}
                    tone="indigo"
                    title="Tidak ada komentar ditemukan"
                    description={search ? "Coba kata kunci lain." : "Komentar pembaca akan muncul di sini."}
                  />
                </TableCell>
              </TableRow>
            ) : (
              comments.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        {c.userAvatar && (
                          <AvatarImage src={c.userAvatar} alt="" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                        )}
                        <AvatarFallback className="text-[11px] font-semibold" style={tint("brown")}>
                          {getInitials(c.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold truncate max-w-[140px]">{c.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium truncate max-w-[220px]">{c.workTitle}</p>
                    <p className="text-[13px] text-muted-foreground truncate max-w-[220px]">{c.chapterTitle}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm leading-relaxed text-foreground/90 line-clamp-2 max-w-xl whitespace-normal">{c.content}</p>
                  </TableCell>
                  <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                    {formatCommentDate(c.createdAt)}
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
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
      />
    </div>
  )
}
