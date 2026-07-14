"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { usePurchaseDetail, useUploadPaymentProof } from "@/lib/api/payments";
import { Loader2, ArrowLeft, Upload, CheckCircle, XCircle, Clock, AlertCircle, Copy } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import LoginDialog from "@/components/LoginDialog";
import { useAuth } from "@/contexts/AuthContext";

export default function BayarPage({
  params,
}: {
  params: Promise<{ purchaseId: string }>;
}) {
  const { purchaseId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: purchase, isLoading, refetch } = usePurchaseDetail(purchaseId);
  const uploadMutation = useUploadPaymentProof();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    uploadMutation.mutate(
      { purchaseId, file },
      { onSuccess: () => refetch() }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--muted)" }} />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <div className="flex-1 max-w-[480px] mx-auto w-full px-4 flex items-center justify-center pb-24">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Pembelian tidak ditemukan.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(purchase.amount);

  const statusBadge = () => {
    if (purchase.status === "PAID") {
      return (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
          style={{ backgroundColor: "color-mix(in srgb, #5B8C5A 12%, transparent)", color: "#5B8C5A" }}
        >
          <CheckCircle className="size-4" />
          Pembayaran Diterima
        </div>
      );
    }
    if (purchase.status === "FAILED") {
      return (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
          style={{ backgroundColor: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" }}
        >
          <XCircle className="size-4" />
          Ditolak
        </div>
      );
    }
    if (purchase.paymentProofUrl) {
      return (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
          style={{ backgroundColor: "color-mix(in srgb, #f59e0b 12%, transparent)", color: "#f59e0b" }}
        >
          <Clock className="size-4" />
          Menunggu Konfirmasi Admin
        </div>
      );
    }
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
        style={{ backgroundColor: "color-mix(in srgb, #f59e0b 12%, transparent)", color: "#f59e0b" }}
      >
        <AlertCircle className="size-4" />
        Menunggu Pembayaran
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 max-w-[480px] mx-auto w-full px-4 pb-24">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors"
            style={{ color: "var(--muted)" }}
          >
            <ArrowLeft className="size-5" />
          </button>
          <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Kembali
          </p>
        </div>

        <div className="text-center my-6">
          {statusBadge()}
        </div>

        <h1
          className="text-lg font-bold text-center mb-6 font-[family-name:var(--font-display)]"
          style={{ color: "var(--foreground)" }}
        >
          {purchase.bundleTitle}
        </h1>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Total Pembayaran
            </p>
            <p
              className="text-2xl font-bold font-[family-name:var(--font-display)]"
              style={{ color: "var(--accent)" }}
            >
              {formattedPrice}
            </p>
          </div>

          <div className="gold-rule max-w-[80px] my-4" />

          <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
            Transfer tepat sejumlah di atas ke rekening:
          </p>

          <div
            className="rounded-xl p-4 mb-4"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 5%, transparent)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "var(--accent)", color: "white" }}
              >
                {purchase.bankName.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {purchase.bankName}
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  a.n {purchase.bankAccountHolder}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p
                className="text-lg font-mono font-bold tracking-wider"
                style={{ color: "var(--foreground)" }}
              >
                {purchase.bankAccountNumber}
              </p>
              <button
                onClick={() => copyToClipboard(purchase.bankAccountNumber)}
                className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
                style={{ color: "var(--muted)" }}
              >
                <Copy className="size-4" />
              </button>
            </div>
            {copied && (
              <p className="text-xs mt-1" style={{ color: "#5B8C5A" }}>
                Nomor rekening disalin!
              </p>
            )}
          </div>
        </div>

        {purchase.status === "PENDING" && (
          <div className="mb-6">
            {!purchase.paymentProofUrl ? (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>
                  Upload Bukti Pembayaran
                </p>
                <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
                  Setelah transfer, upload screenshot/foto bukti transfer di sini. Admin akan memverifikasi pembayaran Anda.
                </p>

                {uploadMutation.isError && (
                  <p className="text-xs mb-3 text-red-500">
                    {(uploadMutation.error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Gagal upload. Coba lagi."}
                  </p>
                )}

                {user ? (
                  <label
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback cursor-pointer disabled:opacity-60"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    <Upload className="size-4" />
                    {uploadMutation.isPending ? "Mengupload..." : "Upload Bukti"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploadMutation.isPending}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <LoginDialog>
                    <button
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      <Upload className="size-4" />
                      Login untuk Upload
                    </button>
                  </LoginDialog>
                )}
              </div>
            ) : (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "color-mix(in srgb, #f59e0b 8%, transparent)", border: "1px solid color-mix(in srgb, #f59e0b 20%, transparent)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="size-5" style={{ color: "#f59e0b" }} />
                  <p className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
                    Menunggu Verifikasi Admin
                  </p>
                </div>
                <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                  Bukti pembayaran sudah terkirim. Admin akan memverifikasi pembayaran Anda. Mohon tunggu.
                </p>
                {purchase.paymentProofUrl && (
                  <>
                    <img
                      src={purchase.paymentProofUrl}
                      alt="Bukti Pembayaran"
                      className="w-full rounded-xl border border-[var(--border)] mb-3"
                    />
                    {uploadMutation.isError && (
                      <p className="text-xs mb-3 text-red-500">
                        {(uploadMutation.error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Gagal upload. Coba lagi."}
                      </p>
                    )}
                    <label
                      className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90 tap-feedback cursor-pointer disabled:opacity-60"
                      style={{ backgroundColor: "color-mix(in srgb, #f59e0b 30%, transparent)", color: "#f59e0b" }}
                    >
                      <Upload className="size-3" />
                      {uploadMutation.isPending ? "Mengupload..." : "Upload Ulang Bukti"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploadMutation.isPending}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {purchase.status === "PAID" && (
          <div
            className="rounded-2xl p-6 text-center mb-6"
            style={{ backgroundColor: "color-mix(in srgb, #5B8C5A 8%, transparent)", border: "1px solid color-mix(in srgb, #5B8C5A 20%, transparent)" }}
          >
            <CheckCircle className="size-10 mx-auto mb-3" style={{ color: "#5B8C5A" }} />
            <p className="text-sm font-semibold mb-2" style={{ color: "#5B8C5A" }}>
              Pembayaran Diterima
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Selamat! Anda sudah bisa membaca semua chapter di paket ini.
            </p>
            <button
              onClick={() => router.push(`/karya/${purchase.workSlug}`)}
              className="py-2.5 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Mulai Membaca
            </button>
          </div>
        )}

        {purchase.status === "FAILED" && (
          <div
            className="rounded-2xl p-6 text-center mb-6"
            style={{ backgroundColor: "color-mix(in srgb, #ef4444 8%, transparent)", border: "1px solid color-mix(in srgb, #ef4444 20%, transparent)" }}
          >
            <XCircle className="size-10 mx-auto mb-3" style={{ color: "#ef4444" }} />
            <p className="text-sm font-semibold mb-2" style={{ color: "#ef4444" }}>
              Pembayaran Ditolak
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Silakan coba lagi atau hubungi admin untuk informasi lebih lanjut.
            </p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
