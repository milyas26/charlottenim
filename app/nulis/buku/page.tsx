"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Edit, Trash2, Loader2, Plus } from "lucide-react"
import { useAdminBooks, useDeleteBook } from "@/lib/api/books"
import { useState } from "react"
import { toast } from "sonner"

export default function AdminBukuPage() {
  const { data: books = [], isLoading } = useAdminBooks()
  const deleteMutation = useDeleteBook()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const activeBooks = books.filter((b) => b.isActive)
  const inactiveBooks = books.filter((b) => !b.isActive)

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buku</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {activeBooks.length} buku aktif, {inactiveBooks.length} tidak aktif
          </p>
        </div>
        <Button asChild>
          <Link href="/nulis/buku/create">
            <Plus className="size-4 mr-2" />
            Tambah Buku
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Cover</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Belum ada buku. Klik &ldquo;Tambah Buku&rdquo; untuk menambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                books.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      {b.coverUrl ? (
                        <img src={b.coverUrl} alt={b.title} className="w-12 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-16 rounded bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">-</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell className="text-muted-foreground">{b.author || "-"}</TableCell>
                    <TableCell>Rp {b.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge variant={b.stock > 0 ? "default" : "destructive"}>{b.stock}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={b.isActive ? "default" : "secondary"}>
                        {b.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-8" asChild>
                          <Link href={`/nulis/buku/${b.id}`}>
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive"
                          onClick={() => setDeleteTarget({ id: b.id, title: b.title })}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Buku</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus buku &ldquo;{deleteTarget?.title}&rdquo;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id, {
                    onSuccess: () => toast.success("Buku berhasil dihapus"),
                    onError: () => toast.error("Gagal menghapus buku"),
                  })
                  setDeleteTarget(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
