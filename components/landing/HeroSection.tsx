"use client";

import { Work } from "@/data/types";

interface Props {
  work: Work;
}

const coverGradients: Record<string, string> = {
  "senja-di-ujung-maret":
    "linear-gradient(160deg, #e8c9a0 0%, #d4a574 20%, #c08b5e 40%, #b87b5c 60%, #9a5f40 80%, #6b3a2a 100%)",
  "dua-detik-sebelum-kamu":
    "linear-gradient(160deg, #a3b5c8 0%, #7b8da0 25%, #5a6d82 50%, #4a5568 75%, #2d3748 100%)",
  "hujan-terakhir-di-bulan-juni":
    "linear-gradient(160deg, #bdd6e4 0%, #8ab5cc 25%, #5e8ea6 50%, #3e708a 75%, #1c4358 100%)",
  "surat-kecil-untuk-bintang":
    "linear-gradient(160deg, #d5cdec 0%, #b09ade 25%, #8568c4 50%, #6042a4 75%, #36236e 100%)",
  "antara-jakarta-dan-kenangan":
    "linear-gradient(160deg, #e6d3b8 0%, #ccb08a 25%, #ad8c5e 50%, #8a683a 75%, #5f4022 100%)",
  "pagi-yang-tertukar":
    "linear-gradient(160deg, #f2d0c6 0%, #e0a090 25%, #c07058 50%, #9a3a2e 75%, #601810 100%)",
  "stasiun-terakhir":
    "linear-gradient(160deg, #b0bfb2 0%, #809a84 25%, #557058 50%, #304a34 75%, #142618 100%)",
  "kedai-hujan":
    "linear-gradient(160deg, #c8d8c4 0%, #9cba94 25%, #6e9460 50%, #487040 75%, #204a1c 100%)",
};

const coverFallback =
  "linear-gradient(160deg, #d9cec0 0%, #c4b5a5 40%, #b09e8d 70%, #8c7b6b 100%)";

export default function HeroSection({ work }: Props) {
  const gradient = coverGradients[work.slug] || coverFallback;

  return (
    <section className="relative w-full animate-fade-in-up mb-5">
      <div
        className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl"
        style={{ background: gradient }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 20%, #fff 1.5px, transparent 1.5px), radial-gradient(circle at 60% 70%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 35%, rgba(255,255,255,0.8) 0.5px, transparent 0.5px)",
            backgroundSize: "32px 32px, 24px 24px, 40px 40px",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.05) 65%, transparent 85%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.2) 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end p-4 pb-5">
          <div className="mb-3">
            <div className="gold-rule max-w-[48px] mb-2" />
          </div>

          <h1
            className="text-[2rem] sm:text-[2.25rem] font-bold leading-[1.15] text-white drop-shadow-2xl font-[family-name:var(--font-display)] tracking-tight"
          >
            {work.title}
          </h1>
        </div>

        <div className="absolute top-5 right-5 flex items-center gap-2">
          {work.status === "ONGOING" && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full backdrop-blur-md"
                style={{
                  backgroundColor: "rgba(0,0,0,0.25)",
                  color: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                Ongoing
              </span>
            </span>
          )}
          {work.status === "COMPLETED" && (
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{
                backgroundColor: "rgba(0,0,0,0.25)",
                color: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="px-1 mt-3">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {work.genres.map((genre) => (
            <span
              key={genre}
              className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-lg font-[family-name:var(--font-sans)] transition-all duration-200 hover:bg-[var(--accent)]/20 cursor-default"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
                border: "0.5px solid color-mix(in srgb, var(--accent) 20%, transparent)",
              }}
            >
              {genre}
            </span>
          ))}
          <span
            className="text-[11px] font-medium tracking-wider px-3 py-1 rounded-lg"
            style={{ color: "var(--muted)" }}
          >
            {work.totalChapters} chapter
          </span>
        </div>

        <p
          className="text-sm leading-relaxed text-center italic px-4 mb-3 font-[family-name:var(--font-body)] relative"
          style={{ color: "var(--muted)" }}
        >
          <span
            className="absolute -top-1 -left-0 text-2xl leading-none opacity-20"
            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
          >
            &ldquo;
          </span>
          {work.synopsis}
          <span
            className="absolute -bottom-3 -right-0 text-2xl leading-none opacity-20"
            style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
          >
            &rdquo;
          </span>
        </p>

        <div className="flex items-center justify-center">
          <a
            href={`/karya/${work.slug}`}
            className="group inline-flex items-center gap-2.5 text-sm font-semibold px-8 py-3.5 rounded-xl text-white transition-all duration-300 hover:opacity-90 active:scale-[0.97]"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "0 4px 18px var(--accent-glow)",
            }}
          >
            Mulai Baca
            <svg
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
