"use client";

import { useState, useMemo } from "react";
import { Work } from "@/data/types";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WorkCard from "@/components/landing/WorkCard";
import SearchBar from "@/components/landing/SearchBar";

interface Props {
  works: Work[];
}

export default function LandingPage({ works }: Props) {
  const [search, setSearch] = useState("");

  const publishedWorks = works.filter(
    (w) => w.status === "ONGOING" || w.status === "COMPLETED"
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return publishedWorks;
    const q = search.toLowerCase();
    return publishedWorks.filter((w) => w.title.toLowerCase().includes(q));
  }, [search, publishedWorks]);

  const heroWork = publishedWorks[0];

  return (
    <div className="min-h-screen bg-[var(--background)] relative">
      <Navbar />

      <main className="max-w-[480px] mx-auto px-4 pt-2 pb-6 relative z-[1]">
        {heroWork && <HeroSection work={heroWork} />}

        <div className="section-ornament mt-1.5">
          <span className="section-ornament-icon font-[family-name:var(--font-display)]">
            &#10086;
          </span>
        </div>

        <div className="mb-3">
          <h2
            className="text-lg font-bold font-[family-name:var(--font-display)] text-center tracking-wide"
            style={{ color: "var(--foreground)" }}
          >
            Koleksi Karya
          </h2>
          <p
            className="text-xs mt-2 text-center font-medium tracking-wider uppercase"
            style={{ color: "var(--muted)" }}
          >
            {filtered.length} judul tersedia
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <svg
              className="mx-auto mb-4"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              style={{ color: "var(--muted)", opacity: 0.35 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--muted)" }}
            >
              Karya tidak ditemukan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((work, i) => (
              <div
                key={work.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <WorkCard work={work} />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-6 relative z-[1]">
        <div className="gold-rule max-w-[120px] mx-auto mb-3" />
        <p
          className="text-[11px] tracking-[0.35em] uppercase font-medium"
          style={{ color: "var(--muted)", opacity: 0.3 }}
        >
          charlottenimmm
        </p>
      </footer>
    </div>
  );
}
