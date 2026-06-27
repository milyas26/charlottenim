"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { PlusCircle, Search, MoreHorizontal, Edit, Eye, Trash2, Loader2 } from "lucide-react"
import api from "@/lib/axios"
import type { WorkStatus, Work } from "@/data/types"

type WorkWithReads = Work & { totalReads: number }

export default function AdminWorksPage() {
  const { setActions } = useAdminHeaderActions()
  const queryClient = useQueryClient()

  useEffect(() => {
    setActions(
      <Button asChild>
        <Link href="/admin/karya/baru">
          <PlusCircle className="size-4" />
          Tambah Karya
        </Link>
      </Button>
    )
    return () => setActions(null)
  }, [setActions])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<WorkStatus | "ALL">("ALL")
  const [deleteTarget, setDeleteTarget] = useState<WorkWithReads | null>(null)

  const { data: works = [], isLoading } = useQuery({
    queryKey: ["works"],
    queryFn: async () => {
      const { data } = await api.get<WorkWithReads[]>("/api/admin/works")
      return data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/works/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] })
      setDeleteTarget(null)
    },
    onError: (err) => {
      console.error(err)
      setDeleteTarget(null)
    },
  })

  const filtered = works.filter((w) => {
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || w.status === statusFilter
    return matchSearch && matchStatus
  })

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
            placeholder="Cari judul karya..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as WorkStatus | "ALL")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ONGOING">Ongoing</SelectItem>
            <SelectItem value="COMPLETED">Selesai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="text-center">Chapter</TableHead>
              <TableHead className="text-right">Total Dibaca</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Tidak ada karya ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((work) => (
                <TableRow key={work.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {work.coverUrl.startsWith("http") || work.coverUrl.startsWith("data:") ? (
                        <img src={work.coverUrl} alt={work.title} className="w-10 h-14 rounded object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-14 rounded bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center text-[10px] font-medium text-accent shrink-0">
                          {work.title.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link href={`/admin/karya/${work.id}`} className="font-medium hover:text-primary transition-colors block truncate">
                          {work.title}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">/{work.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={work.status === "DRAFT" ? "secondary" : work.status === "ONGOING" ? "default" : "outline"}>
                      {work.status === "DRAFT" ? "Draft" : work.status === "ONGOING" ? "Ongoing" : "Selesai"}
                    </Badge>
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
                  <TableCell className="text-center">{work.totalChapters}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{(work.totalReads ?? 0).toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/karya/${work.id}`}>
                            <Eye className="size-4" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/karya/${work.id}?edit=true`}>
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
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Menampilkan {filtered.length} dari {works.length} karya</p>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Karya</AlertDialogTitle>
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
