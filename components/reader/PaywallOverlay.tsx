"use client";

import { useState } from "react";
import LoginDialog from "@/components/LoginDialog";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";

interface Props {
  price: number;
  chapterId: string;
  workSlug: string;
  chapterSlug: string;
}

export default function PaywallOverlay({ price, chapterId, workSlug, chapterSlug }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

  const handleBuy = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/api/payments/create", {
        chapterId,
        workSlug,
        chapterSlug,
        payerEmail: user.email,
      });

      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(
        axiosErr?.response?.data?.error ?? "Gagal memproses pembayaran. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

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

      {error && (
        <p className="text-xs mb-3 max-w-xs mx-auto text-red-500">{error}</p>
      )}

      {user ? (
        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full max-w-xs py-3 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {loading ? "Memproses..." : `Beli Chapter \u00B7 ${formattedPrice}`}
        </button>
      ) : (
        <LoginDialog>
          <button
            className="w-full max-w-xs py-3 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Login untuk Beli &middot; {formattedPrice}
          </button>
        </LoginDialog>
      )}

      {user && (
        <LoginDialog>
          <button
            className="block mt-3 text-xs font-medium mx-auto hover:underline transition-colors"
            style={{ color: "var(--accent)" }}
          >
            Sudah beli? Login di sini
          </button>
        </LoginDialog>
      )}
    </div>
  );
}
