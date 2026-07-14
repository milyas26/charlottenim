"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import LoginDialog from "@/components/LoginDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { createPayment } from "@/lib/api/payments";
import { fetchChapterBundles } from "@/lib/api/bundles";
import type { ChapterBundleInfo } from "@/data/types";

interface Props {
  price: number;
  chapterId: string;
  workSlug: string;
  chapterSlug: string;
}

function getErrorMessage(err: unknown): string {
  const axiosErr = err as { response?: { data?: { error?: string } } };
  return axiosErr?.response?.data?.error ?? "Gagal memproses pembayaran. Coba lagi.";
}

export default function PaywallOverlay({ price, chapterId, workSlug, chapterSlug }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: bundles = [] } = useQuery({
    queryKey: ["chapter-bundles", chapterId],
    queryFn: () => fetchChapterBundles(chapterId),
  });

  const buyMutation = useMutation({
    mutationFn: async () => createPayment({
      chapterId,
      workSlug,
      chapterSlug,
      payerEmail: user!.email,
    }),
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      }
    },
  })

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

  const handleBuy = () => {
    if (!user) return;
    setConfirmOpen(false);
    buyMutation.mutate();
  };

  if (authLoading) {
    return (
      <div
        className="rounded-2xl p-4 text-center"
        style={{ backgroundColor: "var(--rm-surface)", border: "1px solid var(--rm-border)" }}
      >
        <div className="w-20 h-5 mx-auto rounded-full bg-[var(--rm-border)] animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{
        backgroundColor: "var(--rm-surface)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 text-xl"
        style={{ backgroundColor: "color-mix(in srgb, var(--rm-accent) 10%, transparent)" }}
      >
        🔒
      </div>

      <h3
        className="text-lg font-bold mb-2 font-[family-name:var(--font-display)]"
        style={{ color: "var(--rm-fg)" }}
      >
        Chapter Premium
      </h3>

      <p
        className="text-sm mb-3 leading-relaxed max-w-xs mx-auto"
        style={{ color: "var(--rm-muted)" }}
      >
        Beli chapter ini untuk melanjutkan membaca. Satu kali beli, akses selamanya.
      </p>

      {buyMutation.isError && (
        <p className="text-xs mb-3 max-w-xs mx-auto text-red-500">
          {getErrorMessage(buyMutation.error)}
        </p>
      )}

      {user ? (
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={buyMutation.isPending}
          className="w-full max-w-xs py-3 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback disabled:opacity-60"
          style={{ backgroundColor: "var(--rm-accent)" }}>
          {buyMutation.isPending ? "Memproses..." : `Beli Chapter \u00B7 ${formattedPrice}`}
        </button>
      ) : (
        <LoginDialog>
          <button
            className="w-full max-w-xs py-3 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback"
            style={{ backgroundColor: "var(--rm-accent)" }}
          >
            Login untuk Beli &middot; {formattedPrice}
          </button>
        </LoginDialog>
      )}

      {bundles.length > 0 && (
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--rm-border)" }}>
          <p className="text-xs mb-3" style={{ color: "var(--rm-muted)" }}>
            Atau beli paket lebih hemat:
          </p>
          <div className="space-y-2">
            {bundles.map((b) => {
              const bundlePrice = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(b.price)

              return (
                <Link
                  key={b.id}
                  href={`/paket/${b.slug}`}
                  className="w-full max-w-xs py-2.5 px-4 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 tap-feedback flex items-center justify-between mx-auto"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--rm-accent) 10%, transparent)",
                    color: "var(--rm-accent)",
                  }}
                >
                  <span className="truncate mr-2">{b.title}</span>
                  <span className="font-semibold shrink-0">{bundlePrice}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-[90vw] max-w-sm rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-display)] tracking-tight">
              Konfirmasi Pembelian
            </DialogTitle>
            <DialogDescription className="text-sm" style={{ color: "var(--rm-muted)" }}>
              Anda akan membeli chapter ini seharga{" "}
              <span className="font-semibold" style={{ color: "var(--rm-fg)" }}>
                {formattedPrice}
              </span>
              . Satu kali beli, akses selamanya. Lanjutkan?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 tap-feedback"
              style={{
                backgroundColor: "color-mix(in srgb, var(--rm-muted) 15%, transparent)",
                color: "var(--rm-fg)",
              }}
            >
              Batal
            </button>
            <button
              onClick={handleBuy}
              disabled={buyMutation.isPending}
              className="flex-1 py-2.5 px-4 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 tap-feedback disabled:opacity-60"
              style={{ backgroundColor: "var(--rm-accent)" }}
            >
              Ya, Beli
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
