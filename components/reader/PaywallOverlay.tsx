"use client";

import LoginDialog from "@/components/LoginDialog";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  price: number;
}

export default function PaywallOverlay({ price }: Props) {
  const { user } = useAuth();
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

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

      <button
        className="w-full max-w-xs py-3 px-6 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Beli Chapter &middot; {formattedPrice}
      </button>

      {!user && (
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
