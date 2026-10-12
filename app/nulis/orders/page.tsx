"use client"

import { StatusPill, orderStatusTone, tint, tones } from "@/components/admin/tint"
import { TablePanel, SearchInput, FilterPills, Toolbar, EmptyState, PageLoader, InfoRow } from "@/components/admin/ui"
import { AdminPageTitle } from "@/components/admin/AdminPageTitle"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { Check, X, Clock, ShoppingCart, type LucideIcon } from "lucide-react"
import { useAdminOrders, approvePayment, rejectPayment, expirePayment } from "@/lib/api/admin"
import { adminKeys } from "@/lib/api/admin"
import { Pagination } from "@/components/ui/pagination"
import type { Purchase } from "@/data/admin-types"

type StatusFilter = "ALL" | "PAID" | "PENDING" | "FAILED"

type ConfirmAction = { id: string; type: "approve" | "reject" | "expire" } | null

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "PAID", label: "Berhasil" },
  { value: "PENDING", label: "Menunggu" },
  { value: "FAILED", label: "Gagal" },
]

const actionTone = { approve: "green", reject: "rose", expire: "orange" } as const

function RowAction({
  icon: Icon,
  tone,
  title,
  disabled,
  onClick,
}: {
  icon: LucideIcon
  tone: "green" | "rose" | "orange"
  title: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className="size-8 inline-flex items-center justify-center rounded-full transition hover:brightness-95 disabled:opacity-50 disabled:pointer-events-none"
      style={tint(tone)}
    >
      <Icon className="size-4" />
    </button>
  )
}

function SolidPill({
  tone,
  onClick,
  children,
}: {
  tone: "green" | "rose" | "orange"
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 h-10 px-5 rounded-full text-white text-sm font-semibold transition hover:brightness-95"
      style={{ backgroundColor: tones[tone] }}
    >
      {children}
    </button>
  )
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

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

  const { data: result, isLoading, isFetching } = useAdminOrders(params)
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

  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value)
    setPage(1)
  }

  // Only the very first load replaces the page; later searches keep the input mounted.
  if (isLoading && !result) return <PageLoader />

  const anyPending = approveMutation.isPending || rejectMutation.isPending || expireMutation.isPending

  return (
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle title="Orders" description={`${total} transaksi · verifikasi pembayaran manual di sini`} />
      <Toolbar>
        <SearchInput
          placeholder="Cari user, karya, atau chapter..."
          value={search}
          loading={isFetching && !isLoading}
          onChange={handleSearchChange}
        />
        <FilterPills value={statusFilter} onChange={handleStatusChange} options={STATUS_OPTIONS} />
      </Toolbar>

      <TablePanel>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Karya / item</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyState
                    icon={ShoppingCart}
                    tone="green"
                    title="Tidak ada pembelian ditemukan"
                    description={search || statusFilter !== "ALL" ? "Coba ubah pencarian atau filter status." : undefined}
                  />
                </TableCell>
              </TableRow>
            ) : (
              purchases.map((p: Purchase, i: number) => (
                <TableRow
                  key={`${p.createdAt}-${p.userId || i}`}
                  className="cursor-pointer"
                  onClick={() => setDetailPurchase(p)}
                >
                  <TableCell className="text-[15px] font-semibold">{p.userName}</TableCell>
                  <TableCell className="max-w-[260px]">
                    <p className="text-sm font-medium truncate">{p.workTitle}</p>
                    <p className="text-[13px] text-muted-foreground truncate">{p.targetTitle}</p>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={p.type === "bundle" ? "indigo" : "neutral"}>
                      {p.type === "bundle" ? "Paket" : "Chapter"}
                    </StatusPill>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={p.paymentMethod === "MANUAL_TRANSFER" ? "neutral" : "blue"}>
                      {p.paymentMethod === "MANUAL_TRANSFER" ? "Manual transfer" : "Duitku"}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">
                    Rp {p.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={orderStatusTone[p.status] ?? "neutral"}>
                      {statusLabel[p.status]}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      {p.paymentMethod === "MANUAL_TRANSFER" && p.status === "PENDING" && p.paymentProofUrl && (
                        <>
                          <RowAction
                            icon={Check}
                            tone={actionTone.approve}
                            title="Setujui"
                            disabled={anyPending}
                            onClick={() => setConfirmAction({ id: p.id, type: "approve" })}
                          />
                          <RowAction
                            icon={X}
                            tone={actionTone.reject}
                            title="Tolak"
                            disabled={anyPending}
                            onClick={() => setConfirmAction({ id: p.id, type: "reject" })}
                          />
                        </>
                      )}
                      {isPurchaseExpired(p) && (
                        <RowAction
                          icon={Clock}
                          tone={actionTone.expire}
                          title="Kedaluwarsa"
                          disabled={anyPending}
                          onClick={() => setConfirmAction({ id: p.id, type: "expire" })}
                        />
                      )}
                    </div>
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

      <Dialog open={!!detailPurchase} onOpenChange={(open) => !open && setDetailPurchase(null)}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col rounded-[24px]">
          <DialogHeader className="shrink-0">
            <DialogTitle>Detail order</DialogTitle>
            <DialogDescription>
              Informasi lengkap pembelian
            </DialogDescription>
          </DialogHeader>
          {detailPurchase && (
            <>
              <div className="overflow-y-auto flex-1 -mx-6 px-6 space-y-4">
                <div className="divide-y divide-border">
                  <InfoRow label="User">{detailPurchase.userName}</InfoRow>
                  <InfoRow label="Karya">{detailPurchase.workTitle}</InfoRow>
                  <InfoRow label="Tipe">{detailPurchase.type === "bundle" ? "Paket" : "Chapter"}</InfoRow>
                  <InfoRow label="Item">{detailPurchase.targetTitle}</InfoRow>
                  <InfoRow label="Metode">
                    {detailPurchase.paymentMethod === "MANUAL_TRANSFER" ? "Manual transfer" : "Duitku"}
                  </InfoRow>
                  <InfoRow label="Jumlah">
                    <span className="font-semibold tabular-nums">Rp {detailPurchase.amount.toLocaleString("id-ID")}</span>
                  </InfoRow>
                  <InfoRow label="Status">
                    <StatusPill tone={orderStatusTone[detailPurchase.status] ?? "neutral"}>
                      {statusLabel[detailPurchase.status]}
                    </StatusPill>
                  </InfoRow>
                  <InfoRow label="Tanggal">{formatDateTime(detailPurchase.createdAt)}</InfoRow>
                  {detailPurchase.paidAt && <InfoRow label="Dibayar">{formatDateTime(detailPurchase.paidAt)}</InfoRow>}
                  {detailPurchase.approvedAt && (
                    <InfoRow label="Disetujui">{formatDateTime(detailPurchase.approvedAt)}</InfoRow>
                  )}
                  {detailPurchase.failureReason && (
                    <InfoRow label="Alasan gagal">
                      <span className="whitespace-normal" style={{ color: "var(--destructive)" }}>
                        {detailPurchase.failureReason}
                      </span>
                    </InfoRow>
                  )}
                </div>

                {detailPurchase.paymentProofUrl && (
                  <div>
                    <p className="text-[13px] font-medium text-muted-foreground mb-2">Bukti pembayaran</p>
                    <a href={detailPurchase.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={detailPurchase.paymentProofUrl}
                        alt="Bukti Pembayaran"
                        className="w-full rounded-[18px] border border-border"
                      />
                    </a>
                  </div>
                )}
              </div>

              {detailPurchase.paymentMethod === "MANUAL_TRANSFER" && detailPurchase.status === "PENDING" && detailPurchase.paymentProofUrl && (
                <div className="flex gap-2 pt-2 shrink-0">
                  <SolidPill
                    tone="green"
                    onClick={() => {
                      setDetailPurchase(null)
                      setConfirmAction({ id: detailPurchase.id, type: "approve" })
                    }}
                  >
                    Setujui
                  </SolidPill>
                  <SolidPill
                    tone="rose"
                    onClick={() => {
                      setDetailPurchase(null)
                      setConfirmAction({ id: detailPurchase.id, type: "reject" })
                    }}
                  >
                    Tolak
                  </SolidPill>
                </div>
              )}

              {detailPurchase.paymentMethod === "MANUAL_TRANSFER" && detailPurchase.status === "PENDING" && !detailPurchase.paymentProofUrl && !isPurchaseExpired(detailPurchase) && (
                <div className="flex gap-2 pt-2 shrink-0">
                  <SolidPill
                    tone="green"
                    onClick={() => {
                      setDetailPurchase(null)
                      setConfirmAction({ id: detailPurchase.id, type: "approve" })
                    }}
                  >
                    Approve tanpa bukti pembayaran
                  </SolidPill>
                </div>
              )}

              {isPurchaseExpired(detailPurchase) && (
                <div className="flex gap-2 pt-2 shrink-0">
                  <SolidPill
                    tone="orange"
                    onClick={() => {
                      setDetailPurchase(null)
                      setConfirmAction({ id: detailPurchase.id, type: "expire" })
                    }}
                  >
                    Kedaluwarsa
                  </SolidPill>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent className="max-w-sm rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "expire"
                ? "Kedaluwarsa?"
                : confirmAction?.type === "approve"
                  ? "Setujui pembayaran?"
                  : "Tolak pembayaran?"}
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
            <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={anyPending}
              className="rounded-full text-white hover:brightness-95"
              style={{ backgroundColor: tones[actionTone[confirmAction?.type ?? "approve"]] }}
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
