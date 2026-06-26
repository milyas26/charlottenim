"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { chapters, works } from "@/data/dummy";

export default function UserProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  const purchasedChapters = chapters.filter((c) => c.isPremium);

  return (
    <div className="min-h-screen px-5 py-8">
      <div className="max-w-[480px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-full overflow-hidden ring-2 ring-[var(--accent)] shrink-0">
            <img
              src={user.photoURL ?? undefined}
              alt=""
              className="size-full object-cover bg-[var(--surface)]"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold font-[family-name:var(--font-display)] leading-tight truncate">
              {user.displayName || "Pengguna"}
            </h1>
            <p className="text-xs mt-px" style={{ color: "var(--muted)" }}>
              {user.email}
            </p>
          </div>
        </div>

        <section>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-0.5 h-3 rounded-full bg-[var(--accent)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
              Koleksi Saya
            </h2>
            <span className="text-[11px] ml-auto" style={{ color: "var(--muted)" }}>
              {purchasedChapters.length} chapter
            </span>
          </div>

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
    </div>
  );
}
