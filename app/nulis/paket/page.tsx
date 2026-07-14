"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Edit, Trash2, Loader2 } from "lucide-react"
import { useAdminBundles, useDeleteBundle } from "@/lib/api/bundles"
import { useState } from "react"
import { toast } from "sonner"

export default function AdminPaketPage() {
  const { data: bundles = [], isLoading } = useAdminBundles()
  const deleteMutation = useDeleteBundle()
  const [deleteTarget, setDeleteTarget] = useState<{ workId: string; bundleId: string; title: string } | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paket</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {bundles.length} paket dari semua karya
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karya</TableHead>
                <TableHead>Nama Paket</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead className="text-right">Chapter</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Belum ada paket. Buat paket dari halaman detail karya.
                  </TableCell>
                </TableRow>
              ) : (
                bundles.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">
                      <Link href={`/nulis/karya/${b.workId}`} className="hover:text-primary transition-colors">
                        {b.workTitle}
                      </Link>
                    </TableCell>
                    <TableCell>{b.title}</TableCell>
                    <TableCell>Rp {b.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{b.chapterCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-8" asChild>
                          <Link href={`/nulis/karya/${b.workId}/paket/${b.id}`}>
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive"
                          onClick={() => setDeleteTarget({ workId: b.workId, bundleId: b.id, title: b.title })}
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
            <AlertDialogTitle>Hapus Paket</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus paket &ldquo;{deleteTarget?.title}&rdquo;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(
                    { workId: deleteTarget.workId, bundleId: deleteTarget.bundleId },
                    {
                      onSuccess: () => toast.success("Paket berhasil dihapus"),
                      onError: () => toast.error("Gagal menghapus paket"),
                    }
                  )
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
