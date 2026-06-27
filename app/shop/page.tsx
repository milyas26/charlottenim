"use client";

import BottomNav from "@/components/layout/BottomNav";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center max-w-[480px] mx-auto w-full px-4 pb-24">
        <div
          className="size-20 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--accent)" }}
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
          </svg>
        </div>

        <h1
          className="text-xl font-bold font-[family-name:var(--font-display)] text-center tracking-wide"
          style={{ color: "var(--foreground)" }}
        >
          Shop
        </h1>

        <div className="gold-rule max-w-[80px] mx-auto my-4" />

        <p
          className="text-sm text-center leading-relaxed max-w-[260px]"
          style={{ color: "var(--muted)" }}
        >
          Toko akan segera hadir. Nantikan merchandise dan koleksi spesial.
        </p>

        <div className="flex gap-1.5 mt-6">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: "var(--accent)", opacity: 0.4 }}
          />
          <span
            className="size-1.5 rounded-full animate-pulse-dot"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: "var(--accent)", opacity: 0.4 }}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
