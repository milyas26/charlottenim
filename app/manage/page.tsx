"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/layout/BottomNav";
import PageHeader from "@/components/layout/PageHeader";
import {
  useAdminStats,
  useAdminOrders,
  usePendingOrderCount,
  approvePayment,
  rejectPayment,
  expirePayment,
  bulkExpirePendingOrders,
  isPurchaseExpired,
  adminKeys,
} from "@/lib/api/admin";
import { Pagination } from "@/components/ui/pagination";
import { RevenueCard } from "@/components/admin/RevenueCard";
import type { Purchase } from "@/data/admin-types";
import {
  BookOpen,
  Users,
  Eye,
  BookMarked,
  Search,
  Loader2,
  Check,
  X,
  ChevronRight,
  Clock,
  Package,
} from "lucide-react";

type StatusFilter = "ALL" | "PAID" | "PENDING" | "FAILED";
type ConfirmAction = { id: string; type: "approve" | "reject" | "expire" } | null;

const statusLabel: Record<string, string> = {
  PAID: "Berhasil",
  PENDING: "Menunggu",
  FAILED: "Gagal",
};

export default function ManagePage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace("/");
    }
  }, [authLoading, isAdmin, router]);

  const [tab, setTab] = useState<"ringkasan" | "order">("ringkasan");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [detailPurchase, setDetailPurchase] = useState<Purchase | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [showBulkExpireConfirm, setShowBulkExpireConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const orderParams = {
    ...(search && { search }),
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    page,
    limit,
  };

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: result, isLoading: ordersLoading } = useAdminOrders(orderParams);
  const purchases = result?.data ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (limit || 10)));
  const { data: pendingCount = 0 } = usePendingOrderCount();
  const qc = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: approvePayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: adminKeys.pendingCount() });
      setConfirmAction(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectPayment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: adminKeys.pendingCount() });
      setConfirmAction(null);
    },
  });

  const expireMutation = useMutation({
    mutationFn: (id: string) => expirePayment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: adminKeys.pendingCount() });
      setConfirmAction(null);
    },
  });

  const bulkExpireMutation = useMutation({
    mutationFn: bulkExpirePendingOrders,
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: adminKeys.pendingCount() });
      setShowBulkExpireConfirm(false);
      if (result.matched === 0) {
        toast.info("Tidak ada order pending yang sudah kedaluwarsa.");
      } else if (result.failed > 0) {
        toast.warning(
          `${result.succeeded} order dibatalkan, ${result.failed} gagal diproses.`
        );
      } else {
        toast.success(`${result.succeeded} order kedaluwarsa berhasil dibatalkan.`);
      }
    },
    onError: () => {
      toast.error("Gagal memproses order kedaluwarsa.");
    },
  });

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") {
      approveMutation.mutate(confirmAction.id);
    } else if (confirmAction.type === "expire") {
      expireMutation.mutate(confirmAction.id);
    } else {
      rejectMutation.mutate(confirmAction.id);
    }
  };

  const selectedConfirmPurchase = confirmAction
    ? purchases.find((p) => p.id === confirmAction.id)
    : null;

  if (authLoading) {
    return (
      <div className="font-ui min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="font-ui min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 max-w-[480px] mx-auto w-full px-4 pb-28">
        <PageHeader title="Kelola" subtitle="Pantau performa cerita dan verifikasi pembayaran." />

        <div
          className="flex gap-1 mb-5 p-1 rounded-full"
          style={{ backgroundColor: "var(--surface)" }}
        >
          {(["ringkasan", "order"] as const).map((key) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex-1 h-9 px-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-1.5 tap-feedback"
                style={{
                  backgroundColor: active ? "var(--card)" : "transparent",
                  color: active ? "var(--foreground)" : "var(--muted)",
                  boxShadow: active ? "0 1px 3px rgba(44,36,26,0.12)" : undefined,
                }}
              >
                {key === "ringkasan" ? "Ringkasan" : "Order"}
                {key === "order" && pendingCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none"
                    style={{ backgroundColor: "var(--destructive)", color: "white" }}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {tab === "ringkasan" ? (
          <RingkasanTab stats={stats} isLoading={statsLoading} />
        ) : (
          <OrderTab
            purchases={purchases}
            isLoading={ordersLoading}
            total={total}
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            statusFilter={statusFilter}
            onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
            onDetailPurchaseChange={setDetailPurchase}
            onConfirmActionChange={setConfirmAction}
            isMutating={approveMutation.isPending || rejectMutation.isPending || expireMutation.isPending}
            onBulkExpireClick={() => setShowBulkExpireConfirm(true)}
            isBulkExpiring={bulkExpireMutation.isPending}
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
          />
        )}
      </div>

      {detailPurchase && (
        <OrderDetailDialog
          purchase={detailPurchase}
          onClose={() => setDetailPurchase(null)}
          onApprove={() => {
            setDetailPurchase(null);
            setConfirmAction({ id: detailPurchase.id, type: "approve" });
          }}
          onReject={() => {
            setDetailPurchase(null);
            setConfirmAction({ id: detailPurchase.id, type: "reject" });
          }}
          onExpire={() => {
            setDetailPurchase(null);
            setConfirmAction({ id: detailPurchase.id, type: "expire" });
          }}
        />
      )}

      {confirmAction && selectedConfirmPurchase && (
        <ConfirmDialog
          action={confirmAction}
          purchase={selectedConfirmPurchase}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          isMutating={approveMutation.isPending || rejectMutation.isPending || expireMutation.isPending}
        />
      )}

      {showBulkExpireConfirm && (
        <BulkExpireConfirmDialog
          onConfirm={() => bulkExpireMutation.mutate()}
          onCancel={() => setShowBulkExpireConfirm(false)}
          isPending={bulkExpireMutation.isPending}
        />
      )}

      <BottomNav />
    </div>
  );
}

function RingkasanTab({
  stats,
  isLoading,
}: {
  stats?: {
    totalWorks: number;
    totalChapters: number;
    totalUsers: number;
    totalRevenue: number;
    totalReads: number;
    premiumChapters: number;
    freeChapters: number;
    draftCount: number;
    ongoingCount: number;
    completedCount: number;
    revenueByMonth: {
      year: number;
      month: number;
      revenue: number;
    }[];
  };
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin" style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Gagal memuat data.
        </p>
      </div>
    );
  }

  const cards = [
    {
      icon: BookOpen,
      label: "Karya",
      value: stats.totalWorks,
      sub: `${stats.draftCount} draft · ${stats.ongoingCount} ongoing · ${stats.completedCount} selesai`,
    },
    {
      icon: BookMarked,
      label: "Chapter",
      value: stats.totalChapters,
      sub: `${stats.freeChapters} gratis · ${stats.premiumChapters} premium`,
    },
    {
      icon: Users,
      label: "Pembaca",
      value: stats.totalUsers,
      sub: "User terdaftar",
    },
    {
      icon: Eye,
      label: "Dibaca",
      value: stats.totalReads.toLocaleString("id-ID"),
      sub: "Kumulatif",
    },
  ];

  return (
    <div className="space-y-3">
      <RevenueCard
        totalRevenue={stats.totalRevenue}
        revenueByMonth={stats.revenueByMonth ?? []}
        variant="manage"
      />
      <h2 className="text-[13px] font-semibold pt-3 pb-0.5 px-1" style={{ color: "var(--muted)" }}>
        Statistik
      </h2>
      <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="soft-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="size-7 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  color: "var(--accent)",
                }}
              >
                <Icon className="size-3.5" />
              </span>
              <span className="text-[13px] font-medium" style={{ color: "var(--muted)" }}>
                {card.label}
              </span>
            </div>
            <div
              className="text-xl font-bold leading-tight tabular-nums"
              style={{ color: "var(--foreground)" }}
            >
              {card.value}
            </div>
            <p
              className="text-[11px] mt-1 leading-snug"
              style={{ color: "var(--muted)" }}
            >
              {card.sub}
            </p>
          </div>
        );
      })}
    </div>
    </div>
  );
}

function OrderTab({
  purchases,
  isLoading,
  total,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onDetailPurchaseChange,
  onConfirmActionChange,
  isMutating,
  onBulkExpireClick,
  isBulkExpiring,
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: {
  purchases: Purchase[];
  isLoading: boolean;
  total: number;
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  onDetailPurchaseChange: (p: Purchase | null) => void;
  onConfirmActionChange: (v: ConfirmAction) => void;
  isMutating: boolean;
  onBulkExpireClick: () => void;
  isBulkExpiring: boolean;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}) {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin" style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 pointer-events-none" style={{ color: "var(--muted)" }} />
        <input
          type="search"
          placeholder="Cari user, karya, chapter…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-shadow placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--ring)]"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        />
      </div>

      <div className="no-scrollbar -mx-4 px-4 flex gap-2 overflow-x-auto">
        {(["ALL", "PENDING", "PAID", "FAILED"] as const).map((key) => {
          const active = statusFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onStatusFilterChange(key)}
              className="shrink-0 h-8 px-3.5 rounded-full text-xs font-medium transition-colors tap-feedback"
              style={{
                backgroundColor: active ? "var(--foreground)" : "var(--card)",
                color: active ? "var(--background)" : "var(--foreground)",
                border: `1px solid ${active ? "var(--foreground)" : "var(--border)"}`,
              }}
            >
              {key === "ALL" ? "Semua" : statusLabel[key]}
            </button>
          );
        })}
      </div>

      <button
        onClick={onBulkExpireClick}
        disabled={isBulkExpiring}
        className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-semibold transition-opacity hover:opacity-85 disabled:opacity-60 tap-feedback"
        style={{
          backgroundColor: "color-mix(in srgb, #ea580c 12%, transparent)",
          color: "#ea580c",
        }}
      >
        {isBulkExpiring ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Clock className="size-3.5" />
        )}
        Proses Order Pending Kedaluwarsa (&gt;1 jam)
      </button>

      {purchases.length === 0 ? (
        <div className="soft-card rounded-2xl text-center py-12">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Tidak ada order ditemukan.
          </p>
        </div>
      ) : (
        <div className="soft-card rounded-2xl overflow-hidden flex flex-col">
          {purchases.map((p, i) => (
            <div
              key={`${p.createdAt}-${p.userId || i}`}
              role="button"
              tabIndex={0}
              onClick={() => onDetailPurchaseChange(p)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDetailPurchaseChange(p); } }}
              className="flex items-center gap-3 py-3.5 px-4 transition-colors hover:bg-[var(--surface)] active:bg-[var(--surface)] text-left cursor-pointer"
              style={{
                borderTop: i > 0 ? "1px solid var(--border)" : undefined,
              }}
            >
              <div
                className="size-9 rounded-full shrink-0 flex items-center justify-center"
                style={{
                  backgroundColor:
                    p.status === "PAID"
                      ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                      : p.status === "FAILED"
                        ? "color-mix(in srgb, var(--destructive) 12%, transparent)"
                        : "color-mix(in srgb, #f59e0b 12%, transparent)",
                  color:
                    p.status === "PAID"
                      ? "var(--accent)"
                      : p.status === "FAILED"
                        ? "var(--destructive)"
                        : "#f59e0b",
                }}
              >
                {p.type === "bundle" ? (
                  <Package className="size-4" />
                ) : (
                  <BookOpen className="size-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--foreground)" }}>
                  {p.userName}
                </p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                  {p.workTitle} · {p.targetTitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Rp {p.amount.toLocaleString("id-ID")}
                  </p>
                  <span
                    className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        p.status === "PAID"
                          ? "color-mix(in srgb, var(--accent) 20%, transparent)"
                          : p.status === "FAILED"
                            ? "color-mix(in srgb, var(--destructive) 20%, transparent)"
                            : "color-mix(in srgb, #f59e0b 20%, transparent)",
                      color:
                        p.status === "PAID"
                          ? "var(--accent)"
                          : p.status === "FAILED"
                            ? "var(--destructive)"
                            : "#f59e0b",
                    }}
                  >
                    {statusLabel[p.status]}
                  </span>
                </div>

                {p.paymentMethod === "MANUAL_TRANSFER" &&
                  p.status === "PENDING" &&
                  p.paymentProofUrl && (
                    <div className="flex items-center gap-0.5 ml-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onConfirmActionChange({ id: p.id, type: "approve" })}
                        disabled={isMutating}
                        className="size-8 rounded-full flex items-center justify-center transition-colors hover:bg-green-100 disabled:opacity-40"
                        style={{ color: "#16a34a" }}
                      >
                        <Check className="size-3.5" />
                      </button>
                      <button
                        onClick={() => onConfirmActionChange({ id: p.id, type: "reject" })}
                        disabled={isMutating}
                        className="size-8 rounded-full flex items-center justify-center transition-colors hover:bg-red-100 disabled:opacity-40"
                        style={{ color: "#dc2626" }}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )}

                {isPurchaseExpired(p) && (
                  <div className="flex items-center gap-0.5 ml-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onConfirmActionChange({ id: p.id, type: "expire" })}
                      disabled={isMutating}
                      className="size-8 rounded-full flex items-center justify-center transition-colors hover:bg-orange-100 disabled:opacity-40"
                      style={{ color: "#ea580c" }}
                    >
                      <Clock className="size-3.5" />
                    </button>
                  </div>
                )}

                <ChevronRight className="size-4 shrink-0" style={{ color: "var(--muted)", opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}

function OrderDetailDialog({
  purchase,
  onClose,
  onApprove,
  onReject,
  onExpire,
}: {
  purchase: Purchase;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onExpire: () => void;
}) {
  return (
    <div
      className="font-ui fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl px-5 pt-3 pb-8 animate-slide-up"
        style={{
          backgroundColor: "var(--background)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full sm:hidden" style={{ backgroundColor: "var(--border)" }} />
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-title text-lg font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Detail Order
          </h3>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="size-9 rounded-full flex items-center justify-center hover:bg-[var(--surface)] transition-colors"
          >
            <X className="size-4" style={{ color: "var(--muted)" }} />
          </button>
        </div>

        <div className="text-sm space-y-3 soft-card rounded-2xl p-4 [&>div.flex]:gap-4 [&>div.flex>span:last-child]:text-right">
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>User</span>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>
              {purchase.userName}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Karya</span>
            <span style={{ color: "var(--foreground)" }}>{purchase.workTitle}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Tipe</span>
            <span style={{ color: "var(--foreground)" }}>
              {purchase.type === "bundle" ? "Paket" : "Chapter"}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Item</span>
            <span style={{ color: "var(--foreground)" }}>{purchase.targetTitle}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Metode</span>
            <span style={{ color: "var(--foreground)" }}>
              {purchase.paymentMethod === "MANUAL_TRANSFER"
                ? "Manual Transfer"
                : "Duitku"}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Jumlah</span>
            <span
              className="font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              Rp {purchase.amount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span style={{ color: "var(--muted)" }}>Status</span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor:
                  purchase.status === "PAID"
                    ? "color-mix(in srgb, var(--accent) 20%, transparent)"
                    : purchase.status === "FAILED"
                      ? "color-mix(in srgb, var(--destructive) 20%, transparent)"
                      : "color-mix(in srgb, #f59e0b 20%, transparent)",
                color:
                  purchase.status === "PAID"
                    ? "var(--accent)"
                    : purchase.status === "FAILED"
                      ? "var(--destructive)"
                      : "#f59e0b",
              }}
            >
              {statusLabel[purchase.status]}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Tanggal</span>
            <span style={{ color: "var(--foreground)" }}>
              {new Date(purchase.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {purchase.paidAt && (
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Dibayar</span>
              <span style={{ color: "var(--foreground)" }}>
                {new Date(purchase.paidAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {purchase.approvedAt && (
            <div className="flex justify-between">
              <span style={{ color: "var(--muted)" }}>Disetujui</span>
              <span style={{ color: "var(--foreground)" }}>
                {new Date(purchase.approvedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {purchase.failureReason && (
            <div
              className="rounded-lg p-3 text-sm"
              style={{
                backgroundColor: "color-mix(in srgb, var(--destructive) 10%, transparent)",
                color: "var(--destructive)",
              }}
            >
              {purchase.failureReason}
            </div>
          )}

          {purchase.paymentProofUrl && (
            <div>
              <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
                Bukti Pembayaran
              </p>
              <a
                href={purchase.paymentProofUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={purchase.paymentProofUrl}
                  alt="Bukti Pembayaran"
                  className="w-full rounded-xl border"
                  style={{ borderColor: "var(--border)" }}
                />
              </a>
            </div>
          )}
        </div>

        {purchase.paymentMethod === "MANUAL_TRANSFER" &&
          purchase.status === "PENDING" &&
          purchase.paymentProofUrl && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={onApprove}
                className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#16a34a" }}
              >
                Setujui
              </button>
              <button
                onClick={onReject}
                className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#dc2626" }}
              >
                Tolak
              </button>
            </div>
          )}

        {purchase.paymentMethod === "MANUAL_TRANSFER" &&
          purchase.status === "PENDING" &&
          !purchase.paymentProofUrl &&
          !isPurchaseExpired(purchase) && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={onApprove}
                className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#16a34a" }}
              >
                Approve tanpa bukti pembayaran
              </button>
            </div>
          )}

        {isPurchaseExpired(purchase) && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={onExpire}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#ea580c" }}
            >
              Kedaluwarsa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({
  action,
  purchase,
  onConfirm,
  onCancel,
  isMutating,
}: {
  action: ConfirmAction & {};
  purchase: Purchase;
  onConfirm: () => void;
  onCancel: () => void;
  isMutating: boolean;
}) {
  const isApprove = action.type === "approve";
  const isExpire = action.type === "expire";

  return (
    <div className="font-ui fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        className="relative w-full max-w-sm rounded-3xl p-6"
        style={{ backgroundColor: "var(--background)" }}
      >
        <h3
          className="font-title text-lg font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          {isExpire ? "Kedaluwarsa?" : isApprove ? "Setujui Pembayaran?" : "Tolak Pembayaran?"}
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          {isExpire ? (
            <>
              Transaksi dari <strong>{purchase.userName}</strong> untuk{" "}
              <strong>{purchase.targetTitle}</strong> sudah lebih dari 1 jam tanpa pembayaran.
              Batalkan transaksi ini?
            </>
          ) : isApprove ? (
            <>
              Setujui pembayaran dari <strong>{purchase.userName}</strong> untuk{" "}
              <strong>{purchase.targetTitle}</strong> sebesar{" "}
              <strong>Rp {purchase.amount.toLocaleString("id-ID")}</strong>?
              User akan langsung mendapat akses.
            </>
          ) : (
            <>
              Tolak pembayaran dari <strong>{purchase.userName}</strong> untuk{" "}
              <strong>{purchase.targetTitle}</strong>?
            </>
          )}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isMutating}
            className="flex-1 h-11 rounded-xl text-sm font-semibold transition-colors"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isMutating}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: isExpire ? "#ea580c" : isApprove ? "#16a34a" : "#dc2626",
            }}
          >
            {isMutating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {isExpire ? "Ya, Batalkan" : isApprove ? "Ya, Setujui" : "Ya, Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BulkExpireConfirmDialog({
  onConfirm,
  onCancel,
  isPending,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="font-ui fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        className="relative w-full max-w-sm rounded-3xl p-6"
        style={{ backgroundColor: "var(--background)" }}
      >
        <h3
          className="font-title text-lg font-semibold mb-2"
          style={{ color: "var(--foreground)" }}
        >
          Proses Order Kedaluwarsa?
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Sistem akan mencari semua order dengan status <strong>Menunggu</strong> (transfer
          manual maupun Duitku, kecuali yang sudah upload bukti bayar dan menunggu review) yang
          sudah lebih dari 1 jam sejak dibuat, lalu menandainya sebagai <strong>Gagal</strong>{" "}
          karena kedaluwarsa. Lanjutkan?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl text-sm font-semibold transition-colors"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
            style={{ backgroundColor: "#ea580c" }}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Ya, Proses
          </button>
        </div>
      </div>
    </div>
  );
}
