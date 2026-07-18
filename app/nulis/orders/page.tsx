"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Search, Loader2, Check, X, Clock } from "lucide-react"
import { useAdminOrders, approvePayment, rejectPayment, expirePayment } from "@/lib/api/admin"
import { adminKeys } from "@/lib/api/admin"
import { Pagination } from "@/components/ui/pagination"
import type { Purchase } from "@/data/admin-types"

type StatusFilter = "ALL" | "PAID" | "PENDING" | "FAILED"

type ConfirmAction = { id: string; type: "approve" | "reject" | "expire" } | null

function isPurchaseExpired(p: Purchase): boolean {
  return (
    p.status === "PENDING" &&
    p.paymentMethod === "MANUAL_TRANSFER" &&
    !p.paymentProofUrl &&
    Date.now() - new Date(p.createdAt).getTime() > 3_600_000
  )
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [detailPurchase, setDetailPurchase] = useState<Purchase | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const params = {
    ...(search && { search }),
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    page,
    limit,
  }

  const { data: result, isLoading } = useAdminOrders(params)
  const purchases = result?.data ?? []
  const total = result?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / (limit || 10)))

  const qc = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: approvePayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] })
      qc.invalidateQueries({ queryKey: adminKeys.pendingCount() })
      setConfirmAction(null)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectPayment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] })
      qc.invalidateQueries({ queryKey: adminKeys.pendingCount() })
      setConfirmAction(null)
    },
  })

  const expireMutation = useMutation({
    mutationFn: (id: string) => expirePayment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] })
      qc.invalidateQueries({ queryKey: adminKeys.pendingCount() })
      setConfirmAction(null)
    },
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

  const handleConfirm = () => {
    if (!confirmAction) return
    if (confirmAction.type === "approve") {
      approveMutation.mutate(confirmAction.id)
    } else if (confirmAction.type === "expire") {
      expireMutation.mutate(confirmAction.id)
    } else {
      rejectMutation.mutate(confirmAction.id)
    }
  }

  const selectedConfirmPurchase = confirmAction
    ? purchases.find((p) => p.id === confirmAction.id)
    : null

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as StatusFilter)
    setPage(1)
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
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
              <TableHead>Tipe</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Tidak ada pembelian ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              purchases.map((p: Purchase, i: number) => (
                <TableRow
                  key={`${p.createdAt}-${p.userId || i}`}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setDetailPurchase(p)}
                >
                  <TableCell className="font-medium">{p.userName}</TableCell>
                  <TableCell className="text-muted-foreground">{p.workTitle}</TableCell>
                  <TableCell>
                    <Badge variant={p.type === "bundle" ? "outline" : "secondary"}>
                      {p.type === "bundle" ? "Paket" : "Chapter"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.paymentMethod === "MANUAL_TRANSFER" ? (
                      <Badge variant="outline" className="text-xs">
                        Manual Transfer
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Duitku
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.targetTitle}</TableCell>
                  <TableCell className="text-right">Rp {p.amount.toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[p.status]}>
                      {statusLabel[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {p.paymentMethod === "MANUAL_TRANSFER" && p.status === "PENDING" && p.paymentProofUrl && (
                        <>
                          <button
                            onClick={() => setConfirmAction({ id: p.id, type: "approve" })}
                            disabled={approveMutation.isPending || rejectMutation.isPending || expireMutation.isPending}
                            className="p-1.5 rounded-md hover:bg-green-100 transition-colors text-green-600"
                            title="Setujui"
                          >
                            <Check className="size-4" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ id: p.id, type: "reject" })}
                            disabled={approveMutation.isPending || rejectMutation.isPending || expireMutation.isPending}
                            className="p-1.5 rounded-md hover:bg-red-100 transition-colors text-red-600"
                            title="Tolak"
                          >
                            <X className="size-4" />
                          </button>
                        </>
                      )}
                      {isPurchaseExpired(p) && (
                        <button
                          onClick={() => setConfirmAction({ id: p.id, type: "expire" })}
                          disabled={approveMutation.isPending || rejectMutation.isPending || expireMutation.isPending}
                          className="p-1.5 rounded-md hover:bg-orange-100 transition-colors text-orange-600"
                          title="Kedaluwarsa"
                        >
                          <Clock className="size-4" />
                        </button>
                      )}
                    </div>
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

      <Dialog open={!!detailPurchase} onOpenChange={(open) => !open && setDetailPurchase(null)}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle>Detail Order</DialogTitle>
            <DialogDescription>
              Informasi lengkap pembelian
            </DialogDescription>
          </DialogHeader>
          {detailPurchase && (
            <>
              <div className="overflow-y-auto flex-1 -mx-6 px-6 text-sm space-y-4">
                <div className="grid grid-cols-[100px_1fr] gap-y-2">
                  <span className="text-muted-foreground">User</span>
                  <span className="font-medium">{detailPurchase.userName}</span>

                  <span className="text-muted-foreground">Karya</span>
                  <span>{detailPurchase.workTitle}</span>

                  <span className="text-muted-foreground">Tipe</span>
                  <span>{detailPurchase.type === "bundle" ? "Paket" : "Chapter"}</span>

                  <span className="text-muted-foreground">Item</span>
                  <span>{detailPurchase.targetTitle}</span>

                  <span className="text-muted-foreground">Metode</span>
                  <span>{detailPurchase.paymentMethod === "MANUAL_TRANSFER" ? "Manual Transfer" : "Duitku"}</span>

                  <span className="text-muted-foreground">Jumlah</span>
                  <span className="font-semibold">Rp {detailPurchase.amount.toLocaleString("id-ID")}</span>

                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={statusVariant[detailPurchase.status]}>
                    {statusLabel[detailPurchase.status]}
                  </Badge>

                  <span className="text-muted-foreground">Tanggal</span>
                  <span>{new Date(detailPurchase.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>

                  {detailPurchase.paidAt && (
                    <>
                      <span className="text-muted-foreground">Dibayar</span>
                      <span>{new Date(detailPurchase.paidAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </>
                  )}

                  {detailPurchase.approvedAt && (
                    <>
                      <span className="text-muted-foreground">Disetujui</span>
                      <span>{new Date(detailPurchase.approvedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </>
                  )}

                  {detailPurchase.failureReason && (
                    <>
                      <span className="text-muted-foreground">Alasan Gagal</span>
                      <span className="text-red-600">{detailPurchase.failureReason}</span>
                    </>
                  )}
                </div>

                {detailPurchase.paymentProofUrl && (
                  <div>
                    <p className="text-muted-foreground mb-2">Bukti Pembayaran</p>
                    <a href={detailPurchase.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                      <img
                        src={detailPurchase.paymentProofUrl}
                        alt="Bukti Pembayaran"
                        className="w-full rounded-lg border"
                      />
                    </a>
                  </div>
                )}
              </div>

              {detailPurchase.paymentMethod === "MANUAL_TRANSFER" && detailPurchase.status === "PENDING" && detailPurchase.paymentProofUrl && (
                <div className="flex gap-2 pt-2 shrink-0">
                  <button
                    onClick={() => {
                      setDetailPurchase(null)
                      setConfirmAction({ id: detailPurchase.id, type: "approve" })
                    }}
                    className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => {
                      setDetailPurchase(null)
                      setConfirmAction({ id: detailPurchase.id, type: "reject" })
                    }}
                    className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Tolak
                  </button>
                </div>
              )}

              {isPurchaseExpired(detailPurchase) && (
                <div className="flex gap-2 pt-2 shrink-0">
                  <button
                    onClick={() => {
                      setDetailPurchase(null)
                      setConfirmAction({ id: detailPurchase.id, type: "expire" })
                    }}
                    className="flex-1 py-2 px-4 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Kedaluwarsa
                  </button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "expire"
                ? "Kedaluwarsa?"
                : confirmAction?.type === "approve"
                  ? "Setujui Pembayaran?"
                  : "Tolak Pembayaran?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "expire" ? (
                <span>
                  Transaksi dari <strong>{selectedConfirmPurchase?.userName}</strong> untuk{" "}
                  <strong>{selectedConfirmPurchase?.targetTitle}</strong> sudah lebih dari 1 jam tanpa pembayaran.
                  Batalkan transaksi ini?
                </span>
              ) : confirmAction?.type === "approve" ? (
                <span>
                  Setujui pembayaran dari <strong>{selectedConfirmPurchase?.userName}</strong> untuk{" "}
                  <strong>{selectedConfirmPurchase?.targetTitle}</strong> sebesar{" "}
                  <strong>Rp {selectedConfirmPurchase?.amount.toLocaleString("id-ID")}</strong>?
                  User akan langsung mendapat akses.
                </span>
              ) : (
                <span>
                  Tolak pembayaran dari <strong>{selectedConfirmPurchase?.userName}</strong> untuk{" "}
                  <strong>{selectedConfirmPurchase?.targetTitle}</strong>?
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={approveMutation.isPending || rejectMutation.isPending || expireMutation.isPending}
              className={
                confirmAction?.type === "expire"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : confirmAction?.type === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmAction?.type === "expire"
                ? "Ya, Batalkan"
                : confirmAction?.type === "approve"
                  ? "Ya, Setujui"
                  : "Ya, Tolak"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
