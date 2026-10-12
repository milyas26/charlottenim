"use client"

import { StatusPill, workStatusTone, workStatusLabel } from "@/components/admin/tint"
import { AdminPageTitle } from "@/components/admin/AdminPageTitle"
import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TablePanel, SearchInput, FilterPills, Toolbar, EmptyState, PageLoader } from "@/components/admin/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PlusCircle, MoreHorizontal, Edit, Eye, Trash2, BookOpen } from "lucide-react"
import { useAdminWorks, deleteWork, worksKeys, type WorkWithReads } from "@/lib/api/works"
import type { WorkStatus } from "@/data/types"

export default function AdminWorksPage() {
  const { setActions } = useAdminHeaderActions()
  const queryClient = useQueryClient()

  useEffect(() => {
    setActions(
      <Button asChild>
        <Link href="/nulis/karya/baru">
          <PlusCircle className="size-4" />
          Tambah karya
        </Link>
      </Button>
    )
    return () => setActions(null)
  }, [setActions])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<WorkStatus | "ALL">("ALL")
  const [deleteTarget, setDeleteTarget] = useState<WorkWithReads | null>(null)

  const { data: works = [], isLoading } = useAdminWorks()

  const deleteMutation = useMutation({
    mutationFn: deleteWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: worksKeys.list("admin") })
      setDeleteTarget(null)
    },
    onError: () => setDeleteTarget(null),
  })

  const filtered = works.filter((w) => {
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || w.status === statusFilter
    return matchSearch && matchStatus
  })

  const countBy = (status: WorkStatus) => works.filter((w) => w.status === status).length
  const statusOptions: { value: WorkStatus | "ALL"; label: string; count: number }[] = [
    { value: "ALL", label: "Semua", count: works.length },
    { value: "DRAFT", label: "Draft", count: countBy("DRAFT") },
    { value: "ONGOING", label: "Ongoing", count: countBy("ONGOING") },
    { value: "COMPLETED", label: "Selesai", count: countBy("COMPLETED") },
  ]

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle title="Karya" description={`${works.length} karya · kelola cerita, chapter, dan paket`} />
      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Cari judul karya..." delay={200} />
        <FilterPills value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
      </Toolbar>

      <TablePanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="text-center">Chapter</TableHead>
              <TableHead className="text-right">Total dibaca</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState icon={BookOpen} title="Tidak ada karya ditemukan." />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((work) => (
                <TableRow key={work.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {work.coverUrl.startsWith("http") || work.coverUrl.startsWith("data:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={work.coverUrl} alt={work.title} className="w-10 h-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-14 rounded-lg bg-secondary flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
                          {work.title.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link href={`/nulis/karya/${work.id}`} className="text-[15px] font-semibold hover:text-primary transition-colors block truncate">
                          {work.title}
                        </Link>
                        <p className="text-[13px] text-muted-foreground truncate">/{work.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={workStatusTone[work.status]}>{workStatusLabel[work.status]}</StatusPill>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {work.genres.slice(0, 2).map((g) => (
                        <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
                      ))}
                      {work.genres.length > 2 && (
                        <Badge variant="secondary" className="text-[10px]">+{work.genres.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">{work.totalChapters}</TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">{(work.totalReads ?? 0).toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 rounded-full">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/nulis/karya/${work.id}`}>
                            <Eye className="size-4" />
                            Lihat detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/nulis/karya/${work.id}?edit=true`}>
                            <Edit className="size-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(work)}>
                          <Trash2 className="size-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TablePanel>

      <p className="text-[13px] text-muted-foreground">
        Menampilkan {filtered.length} dari {works.length} karya
      </p>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus karya</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus &ldquo;{deleteTarget?.title}&rdquo;? Karya akan di-soft delete dan bisa dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
