"use client"

import { AdminPageTitle } from "@/components/admin/AdminPageTitle"
import { StatusPill } from "@/components/admin/tint"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmptyState, PageLoader, TablePanel } from "@/components/admin/ui"
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
import { Edit, Trash2, Package } from "lucide-react"
import { useAdminBundles, useDeleteBundle } from "@/lib/api/bundles"
import { useState } from "react"
import { toast } from "sonner"

export default function AdminPaketPage() {
  const { data: bundles = [], isLoading } = useAdminBundles()
  const deleteMutation = useDeleteBundle()
  const [deleteTarget, setDeleteTarget] = useState<{ workId: string; bundleId: string; title: string } | null>(null)

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle title="Paket" description={`${bundles.length} paket dari semua karya · buat paket baru dari halaman detail karya`} />

      <TablePanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Karya</TableHead>
              <TableHead>Nama paket</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead className="text-right">Chapter</TableHead>
              <TableHead className="w-[120px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bundles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={Package}
                    title="Belum ada paket"
                    description="Buat paket dari halaman detail karya."
                  />
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
                  <TableCell className="text-muted-foreground">{b.title}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">Rp {b.price.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right">
                    <StatusPill tone="brown" className="tabular-nums">{b.chapterCount} chapter</StatusPill>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" asChild>
                        <Link href={`/nulis/karya/${b.workId}/paket/${b.id}`}>
                          <Edit className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
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
      </TablePanel>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus paket</AlertDialogTitle>
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
