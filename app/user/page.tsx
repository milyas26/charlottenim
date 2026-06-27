"use client";

import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/LoginDialog";
import BottomNav from "@/components/layout/BottomNav";
import { chapters, works } from "@/data/dummy";

export default function UserProfilePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
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
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
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

  const purchasedChapters = chapters.filter((c) => c.isPremium);

  return (
    <div className="min-h-screen px-5 pb-28">
      <div className="max-w-[480px] mx-auto pt-8 px-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-full overflow-hidden ring-2 ring-[var(--accent)] shrink-0">
            <img
              src={user.photoURL ?? undefined}
              alt=""
              className="size-full object-cover bg-[var(--surface)]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold font-[family-name:var(--font-display)] leading-tight truncate">
              {user.displayName || "Pengguna"}
            </h1>
            <p className="text-xs mt-px" style={{ color: "var(--muted)" }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={async () => { await logout(); }}
            className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 hover:bg-[var(--surface)] active:scale-[0.97] shrink-0"
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
              {purchasedChapters.map((ch, i) => {
                const work = works.find((w) => w.id === ch.workId);
                return (
                  <a
                    key={ch.id}
                    href={`/baca/${ch.workSlug}/${ch.slug}`}
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
                        {ch.title}
                      </p>
                      <p className="text-[11px] mt-px" style={{ color: "var(--muted)" }}>
                        {work?.title || ch.workSlug}
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
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
