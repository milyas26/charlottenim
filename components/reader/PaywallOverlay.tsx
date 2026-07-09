"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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

const SNAP_SRC = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

let snapScriptLoaded = false;

function loadSnapScript(): Promise<void> {
  return new Promise((resolve) => {
    if (snapScriptLoaded) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${SNAP_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => {
        snapScriptLoaded = true;
        resolve();
      });
      return;
    }
    const script = document.createElement("script");
    script.src = SNAP_SRC;
    script.setAttribute("data-client-key", CLIENT_KEY);
    script.onload = () => {
      snapScriptLoaded = true;
      resolve();
    };
    document.body.appendChild(script);
  });
}

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

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks: {
        onSuccess?: (result: unknown) => void;
        onPending?: (result: unknown) => void;
        onError?: (result: unknown) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

export default function PaywallOverlay({ price, chapterId, workSlug, chapterSlug }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const buyMutation = useMutation({
    mutationFn: async () => createPayment({
      chapterId,
      workSlug,
      chapterSlug,
      payerEmail: user!.email,
    }),
    onSuccess: async (data) => {
      await loadSnapScript();
      const paymentUrl = new URL(window.location.href);
      paymentUrl.searchParams.set("payment", "success");
      window.snap?.pay(data.snapToken, {
        onSuccess: () => {
          window.location.href = paymentUrl.toString();
        },
        onPending: () => {
          window.location.href = paymentUrl.toString();
        },
        onError: () => {
          window.location.href = paymentUrl.toString();
        },
        onClose: () => {},
      });
    },
  });

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
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="w-20 h-5 mx-auto rounded-full bg-[var(--border)] animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 text-xl"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
      >
        🔒
      </div>

      <h3
        className="text-lg font-bold mb-2 font-[family-name:var(--font-display)]"
        style={{ color: "var(--foreground)" }}
      >
        Chapter Premium
      </h3>

      <p
        className="text-sm mb-3 leading-relaxed max-w-xs mx-auto"
        style={{ color: "var(--muted)" }}
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
          style={{ backgroundColor: "var(--accent)" }}>
          {buyMutation.isPending ? "Memproses..." : `Beli Chapter \u00B7 ${formattedPrice}`}
        </button>
      ) : (
        <LoginDialog>
          <button
            className="w-full max-w-xs py-3 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Login untuk Beli &middot; {formattedPrice}
          </button>
        </LoginDialog>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-[90vw] max-w-sm rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-display)] tracking-tight">
              Konfirmasi Pembelian
            </DialogTitle>
            <DialogDescription className="text-sm" style={{ color: "var(--muted)" }}>
              Anda akan membeli chapter ini seharga{" "}
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>
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
                backgroundColor: "color-mix(in srgb, var(--muted) 15%, transparent)",
                color: "var(--foreground)",
              }}
            >
              Batal
            </button>
            <button
              onClick={handleBuy}
              disabled={buyMutation.isPending}
              className="flex-1 py-2.5 px-4 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 tap-feedback disabled:opacity-60"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Ya, Beli
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
