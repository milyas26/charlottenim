"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/layout/BottomNav";
import {
  useAdminStats,
  useAdminOrders,
  usePendingOrderCount,
  approvePayment,
  rejectPayment,
  expirePayment,
  adminKeys,
} from "@/lib/api/admin";
import { Pagination } from "@/components/ui/pagination";
import type { Purchase } from "@/data/admin-types";
import {
  BookOpen,
  Users,
  DollarSign,
  Eye,
  BookMarked,
  Search,
  Loader2,
  Check,
  X,
  ChevronRight,
  Clock,
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 max-w-[480px] mx-auto w-full px-4 pb-24">
        <div className="pt-6 pb-4">
          <h1
            className="text-xl font-bold font-[family-name:var(--font-display)] text-center tracking-wide"
            style={{ color: "var(--foreground)" }}
          >
            Manage
          </h1>
          <div className="gold-rule max-w-[80px] mx-auto my-3" />
        </div>

        <div
          className="flex gap-1 mb-4 p-1 rounded-xl"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <button
            onClick={() => setTab("ringkasan")}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor:
                tab === "ringkasan" ? "var(--accent)" : "transparent",
              color:
                tab === "ringkasan"
                  ? "var(--primary-foreground)"
                  : "var(--muted)",
            }}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setTab("order")}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
            style={{
              backgroundColor:
                tab === "order" ? "var(--accent)" : "transparent",
              color:
                tab === "order"
                  ? "var(--primary-foreground)"
                  : "var(--muted)",
            }}
          >
            Order
            {pendingCount > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                style={{
                  backgroundColor:
                    tab === "order"
                      ? "rgba(255,255,255,0.25)"
                      : "var(--destructive)",
                  color: "white",
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>
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

      <BottomNav />
    </div>
  );
}

function isPurchaseExpired(p: Purchase): boolean {
  return (
    p.status === "PENDING" &&
    p.paymentMethod === "MANUAL_TRANSFER" &&
    !p.paymentProofUrl &&
    Date.now() - new Date(p.createdAt).getTime() > 3_600_000
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
      icon: DollarSign,
      label: "Revenue",
      value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`,
      sub: "Total pendapatan",
    },
    {
      icon: Eye,
      label: "Dibaca",
      value: stats.totalReads.toLocaleString("id-ID"),
      sub: "Kumulatif",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl p-3.5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className="size-3.5" style={{ color: "var(--accent)" }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                {card.label}
              </span>
            </div>
            <div
              className="text-lg font-bold font-[family-name:var(--font-display)] leading-tight"
              style={{ color: "var(--foreground)" }}
            >
              {card.value}
            </div>
            <p
              className="text-[10px] mt-1 leading-snug"
              style={{ color: "var(--muted)" }}
            >
              {card.sub}
            </p>
          </div>
        );
      })}
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
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <Search className="size-3.5 shrink-0" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Cari user, karya, chapter..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--foreground)" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
          className="px-3 py-2 rounded-xl text-sm font-medium outline-none appearance-none"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="ALL">Semua</option>
          <option value="PAID">Berhasil</option>
          <option value="PENDING">Menunggu</option>
          <option value="FAILED">Gagal</option>
        </select>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Tidak ada order ditemukan.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {purchases.map((p, i) => (
            <div
              key={`${p.createdAt}-${p.userId || i}`}
              role="button"
              tabIndex={0}
              onClick={() => onDetailPurchaseChange(p)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDetailPurchaseChange(p); } }}
              className="flex items-center gap-3 py-3 transition-colors hover:bg-[var(--surface)] active:bg-[var(--surface)] -mx-4 px-4 text-left cursor-pointer"
              style={{
                borderBottom:
                  i < purchases.length - 1 ? "1px solid var(--border)" : undefined,
              }}
            >
              <div
                className="size-9 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold font-[family-name:var(--font-display)]"
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
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
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
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
                        className="p-1.5 rounded-lg transition-colors hover:bg-green-100"
                        style={{ color: "#16a34a" }}
                      >
                        <Check className="size-3.5" />
                      </button>
                      <button
                        onClick={() => onConfirmActionChange({ id: p.id, type: "reject" })}
                        disabled={isMutating}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-100"
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
                      className="p-1.5 rounded-lg transition-colors hover:bg-orange-100"
                      style={{ color: "#ea580c" }}
                    >
                      <Clock className="size-3.5" />
                    </button>
                  </div>
                )}

                <ChevronRight className="size-3.5 shrink-0" style={{ color: "var(--muted)", opacity: 0.4 }} />
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
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl px-5 pt-5 pb-8 animate-slide-up"
        style={{
          backgroundColor: "var(--background)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-base font-bold font-[family-name:var(--font-display)]"
            style={{ color: "var(--foreground)" }}
          >
            Detail Order
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            <X className="size-4" style={{ color: "var(--muted)" }} />
          </button>
        </div>

        <div className="text-sm space-y-3">
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
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#16a34a" }}
              >
                Setujui
              </button>
              <button
                onClick={onReject}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#dc2626" }}
              >
                Tolak
              </button>
            </div>
          )}

        {isPurchaseExpired(purchase) && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={onExpire}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        className="relative w-full max-w-sm rounded-2xl p-5"
        style={{ backgroundColor: "var(--background)" }}
      >
        <h3
          className="text-base font-bold font-[family-name:var(--font-display)] mb-2"
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
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
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
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
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
