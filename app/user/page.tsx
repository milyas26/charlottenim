"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import LoginDialog from "@/components/LoginDialog";
import BottomNav from "@/components/layout/BottomNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchUserPurchases, fetchUserPendingPayments } from "@/lib/api/user";
import Link from "next/link";
import { ChevronRight, Clock, HelpCircle, Library, LogOut, Package } from "lucide-react";

export default function UserProfilePage() {
  const { user, loading, logout } = useAuth();

  const { data: purchases, isLoading: chaptersLoading } = useQuery({
    queryKey: ["user-purchases"],
    queryFn: fetchUserPurchases,
    enabled: !!user,
  })

  const purchasedChapters = purchases?.chapters ?? []
  const purchasedBundles = purchases?.bundles ?? []

  const { data: pendingPayments = [] } = useQuery({
    queryKey: ["user-pending-payments"],
    queryFn: fetchUserPendingPayments,
    enabled: !!user,
  })

  if (loading || chaptersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="font-ui min-h-screen flex flex-col items-center justify-center px-6 pb-28 text-center">
        <div
          className="size-16 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
            color: "var(--accent)",
          }}
        >
          <Library className="size-7" />
        </div>
        <h1 className="font-title text-xl font-semibold mt-5" style={{ color: "var(--foreground)" }}>
          Rak bacaanmu ada di sini
        </h1>
        <p className="text-sm mt-2 max-w-[280px] leading-relaxed" style={{ color: "var(--muted)" }}>
          Masuk untuk melihat koleksi chapter, paket, dan status pembayaranmu.
        </p>
        <LoginDialog>
          <button
            className="mt-6 h-11 px-7 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 tap-feedback"
            style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
          >
            Masuk dengan Google
          </button>
        </LoginDialog>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="font-ui min-h-screen px-4 pb-28">
      <div className="max-w-[480px] mx-auto pt-8">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 ring-2 ring-offset-2 ring-offset-[var(--background)] ring-[var(--accent)] shrink-0">
            <AvatarImage src={user.avatarUrl ?? undefined} alt="" referrerPolicy="no-referrer" crossOrigin="anonymous" />
            <AvatarFallback className="text-lg font-semibold">
              {user.name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="font-title text-xl font-semibold leading-tight truncate" style={{ color: "var(--foreground)" }}>
              {user.name || "Pembaca"}
            </h1>
            <p className="text-[13px] mt-0.5 truncate" style={{ color: "var(--muted)" }}>
              {user.email}
            </p>
          </div>
        </div>

        <div className="soft-card grid grid-cols-2 rounded-2xl py-3 mt-6">
          <div className="text-center">
            <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{purchasedChapters.length}</p>
            <p className="text-[11px]" style={{ color: "var(--muted)" }}>Chapter dibeli</p>
          </div>
          <div className="text-center" style={{ borderLeft: "1px solid var(--border)" }}>
            <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{purchasedBundles.length}</p>
            <p className="text-[11px]" style={{ color: "var(--muted)" }}>Paket dimiliki</p>
          </div>
        </div>

        {pendingPayments.length > 0 && (
          <section className="mt-8">
            <SectionTitle>Menunggu Pembayaran</SectionTitle>
            <ul className="soft-card rounded-2xl overflow-hidden">
              {pendingPayments.map((pp, i) => (
                <li key={pp.id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                  <a
                    href={`/bayar/${pp.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--surface)] tap-feedback"
                  >
                    <span
                      className="size-9 rounded-full shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: "color-mix(in srgb, #f59e0b 15%, transparent)", color: "#d97706" }}
                    >
                      <Clock className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--foreground)" }}>
                        {pp.bundleTitle}
                      </p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                        {pp.workTitle} &middot; Rp {pp.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{
                        backgroundColor: pp.paymentProofUrl ? "color-mix(in srgb, #f59e0b 15%, transparent)" : "#f59e0b",
                        color: pp.paymentProofUrl ? "#d97706" : "white",
                      }}
                    >
                      {pp.paymentProofUrl ? "Diverifikasi" : "Bayar"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <SectionTitle>Koleksi Chapter</SectionTitle>
          {purchasedChapters.length > 0 ? (
            <ul className="soft-card rounded-2xl overflow-hidden">
              {purchasedChapters.map((ch, i) => (
                <li key={i} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                  <a
                    href={`/baca/${ch.workSlug}/${ch.chapterSlug}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--surface)] tap-feedback"
                  >
                    <span
                      className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums"
                      style={{ color: "var(--muted)" }}
                    >
                      {ch.chapterNumber}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--foreground)" }}>
                        {ch.chapterTitle}
                      </p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                        {ch.workTitle}
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0" style={{ color: "var(--muted)" }} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRow text="Belum ada chapter premium. Chapter yang kamu beli akan tersimpan di sini." />
          )}
        </section>

        {purchasedBundles.length > 0 && (
          <section className="mt-8">
            <SectionTitle>Paket Dimiliki</SectionTitle>
            <ul className="soft-card rounded-2xl overflow-hidden">
              {purchasedBundles.map((b, i) => (
                <li key={b.bundleId} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                  <a
                    href={`/paket/${b.bundleSlug}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--surface)] tap-feedback"
                  >
                    <span
                      className="size-9 rounded-full shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                        color: "var(--accent)",
                      }}
                    >
                      <Package className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--foreground)" }}>
                        {b.bundleTitle}
                      </p>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                        {b.workTitle} &middot; {b.chapterCount} chapter
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0" style={{ color: "var(--muted)" }} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <SectionTitle>Lainnya</SectionTitle>
          <div className="soft-card rounded-2xl overflow-hidden">
            <Link
              href="/contact"
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--surface)] tap-feedback"
            >
              <HelpCircle className="size-[18px] shrink-0" style={{ color: "var(--muted)" }} />
              <span className="flex-1 text-sm font-medium" style={{ color: "var(--foreground)" }}>Hubungi Kami</span>
              <ChevronRight className="size-4 shrink-0" style={{ color: "var(--muted)" }} />
            </Link>
            <button
              type="button"
              onClick={async () => { await logout(); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--surface)] tap-feedback"
              style={{ borderTop: "1px solid var(--border)", color: "var(--destructive)" }}
            >
              <LogOut className="size-[18px] shrink-0" />
              <span className="flex-1 text-sm font-medium">Keluar</span>
            </button>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-semibold mb-2.5 px-1" style={{ color: "var(--muted)" }}>
      {children}
    </h2>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="soft-card rounded-2xl px-5 py-6 text-center">
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
        {text}
      </p>
      <Link href="/" className="inline-block mt-2 text-[13px] font-semibold" style={{ color: "var(--accent)" }}>
        Jelajahi cerita
      </Link>
    </div>
  );
}
