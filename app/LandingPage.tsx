"use client";

import { useState, useMemo } from "react";
import { Work } from "@/data/types";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/landing/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import HeroSection from "@/components/landing/HeroSection";
import WorkCard from "@/components/landing/WorkCard";
import SearchBar from "@/components/landing/SearchBar";
import { SearchX } from "lucide-react";
import Greeting from "@/components/Greeting";

interface Props {
  works: Work[];
}

const ALL = "Semua";

export default function LandingPage({ works }: Props) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(ALL);

  const publishedWorks = useMemo(
    () => works.filter((w) => w.status === "ONGOING" || w.status === "COMPLETED"),
    [works]
  );

  const genres = useMemo(() => {
    const set = new Set<string>();
    publishedWorks.forEach((w) => w.genres.forEach((g) => set.add(g)));
    return [ALL, ...Array.from(set)];
  }, [publishedWorks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return publishedWorks.filter(
      (w) =>
        (genre === ALL || w.genres.includes(genre)) &&
        (!q || w.title.toLowerCase().includes(q))
    );
  }, [search, genre, publishedWorks]);

  const heroWork = publishedWorks[0];
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="font-ui min-h-screen bg-[var(--background)] relative animate-page-enter">
      <Navbar />

      <main className="max-w-[480px] mx-auto px-4 pt-3 pb-28 relative z-[1]">
        <div className="mb-5">
          <p className="text-[13px]" style={{ color: "var(--muted)" }}>
            <Greeting name={firstName} />
          </p>
          <h2 className="font-title text-2xl font-semibold leading-tight mt-0.5" style={{ color: "var(--foreground)" }}>
            Mau baca apa hari ini?
          </h2>
        </div>

        {heroWork && <HeroSection work={heroWork} />}

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
              Koleksi Cerita
            </h2>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {filtered.length} judul
            </span>
          </div>

          <SearchBar value={search} onChange={setSearch} />

          {genres.length > 2 && (
            <div className="no-scrollbar -mx-4 px-4 mt-3 flex gap-2 overflow-x-auto">
              {genres.map((g) => {
                const active = g === genre;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(g)}
                    className="shrink-0 h-8 px-3.5 rounded-full text-xs font-medium transition-colors tap-feedback"
                    style={{
                      backgroundColor: active ? "var(--foreground)" : "var(--card)",
                      color: active ? "var(--background)" : "var(--foreground)",
                      border: `1px solid ${active ? "var(--foreground)" : "var(--border)"}`,
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="animate-fade-in-up text-center py-20">
              <SearchX className="mx-auto mb-3 size-10" strokeWidth={1.25} style={{ color: "var(--muted)", opacity: 0.5 }} />
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Cerita tidak ditemukan
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                Coba kata kunci atau genre lain.
              </p>
            </div>
          ) : (
            <div key={`${search}-${genre}`} className="grid grid-cols-2 gap-x-4 gap-y-6 mt-5">
              {filtered.map((work, i) => (
                <div
                  key={work.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                >
                  <WorkCard work={work} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
