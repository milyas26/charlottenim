"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import LoginDialog from "@/components/LoginDialog";
import BottomNav from "@/components/layout/BottomNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchUserPurchases, type PurchasedChapter } from "@/lib/api/user";

export default function UserProfilePage() {
  const { user, loading, logout } = useAuth();

  const { data: purchasedChapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ["user-purchases"],
    queryFn: fetchUserPurchases,
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 pb-28">
        <div className="size-16 rounded-full bg-[var(--surface)] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--muted)" }}>
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Masuk untuk melihat profil
        </p>
        <LoginDialog>
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 tap-feedback"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--primary-foreground)",
            }}
          >
            Masuk dengan Google
          </button>
        </LoginDialog>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-28">
      <div className="max-w-[480px] mx-auto pt-8 px-0">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="size-12 ring-2 ring-[var(--accent)] shrink-0">
            <AvatarImage src={user.avatarUrl ?? undefined} alt="" referrerPolicy="no-referrer" crossOrigin="anonymous" />
            <AvatarFallback className="text-base font-bold font-[family-name:var(--font-display)]">
              {user.name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold font-[family-name:var(--font-display)] leading-tight truncate">
                {user.name || "Pengguna"}
              </h1>
            <p className="text-xs mt-px" style={{ color: "var(--muted)" }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={async () => { await logout(); }}
            className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 hover:bg-[var(--surface)] tap-feedback shrink-0"
            style={{
              color: "var(--destructive)",
              border: "1px solid var(--border)",
            }}
          >
            Keluar
          </button>
        </div>

        <section>
          {purchasedChapters.length === 0 ? (
            <div className="rounded-lg p-4 text-center" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Belum ada koleksi chapter premium.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {purchasedChapters.map((ch, i) => (
                <a
                  key={i}
                  href={`/baca/${ch.workSlug}/${ch.chapterSlug}`}
                  className="flex items-center gap-2.5 py-2.5 transition-colors hover:bg-[var(--surface)] active:bg-[var(--surface)] -mx-5 px-5"
                  style={{
                    borderBottom: i < purchasedChapters.length - 1 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <div
                    className="size-8 rounded-md shrink-0 flex items-center justify-center text-[11px] font-bold font-[family-name:var(--font-display)]"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    {ch.chapterNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight truncate font-medium">
                      {ch.chapterTitle}
                    </p>
                    <p className="text-[11px] mt-px" style={{ color: "var(--muted)" }}>
                      {ch.workTitle}
                    </p>
                  </div>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--muted)", opacity: 0.4, flexShrink: 0 }}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </section>

          {/* <div className="mt-6">
            <a
              href="/contact"
              className="flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-90 tap-feedback"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--accent)",
                border: "1px solid var(--border)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Contact Support
            </a>
          </div> */}
      </div>

      <BottomNav />
    </div>
  );
}
