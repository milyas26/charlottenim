"use client";

import { Work } from "@/data/types";

interface Props {
  work: Work;
}

const coverGradients: Record<string, string> = {
  "senja-di-ujung-maret":
    "linear-gradient(135deg, #d4a574 0%, #b87b5c 30%, #8b5e3c 60%, #5c3a28 100%)",
  "dua-detik-sebelum-kamu":
    "linear-gradient(135deg, #6b7b8d 0%, #4a5568 30%, #2d3748 60%, #1a202c 100%)",
  "hujan-terakhir-di-bulan-juni":
    "linear-gradient(135deg, #87b3c8 0%, #5a8ea6 30%, #3e708a 60%, #1c4358 100%)",
  "surat-kecil-untuk-bintang":
    "linear-gradient(135deg, #a892d4 0%, #7a58b8 30%, #553898 60%, #2d1e60 100%)",
  "antara-jakarta-dan-kenangan":
    "linear-gradient(135deg, #c4a87e 0%, #a08058 30%, #7a5a30 60%, #4a3418 100%)",
  "pagi-yang-tertukar":
    "linear-gradient(135deg, #e0a090 0%, #c07058 30%, #8a3020 60%, #501810 100%)",
  "stasiun-terakhir":
    "linear-gradient(135deg, #809a84 0%, #557058 30%, #304a34 60%, #142618 100%)",
  "kedai-hujan":
    "linear-gradient(135deg, #9cba94 0%, #6e9460 30%, #487040 60%, #204a1c 100%)",
};

const fallbackGradient =
  "linear-gradient(135deg, #c4b5a5 0%, #a89888 50%, #8c7b6b 100%)";

export default function WorkHeader({ work }: Props) {
  const gradient = coverGradients[work.slug] || fallbackGradient;

  return (
    <div className="mb-5">
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-3 transition-colors"
        style={{ color: "var(--muted)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Semua Karya
      </a>

      <div className="flex flex-col gap-3">
        <div
          className="w-full aspect-[3/2] rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{ background: gradient }}
        >
          <span className="text-sm font-bold text-center text-white/85 drop-shadow-md leading-snug p-4 font-[family-name:var(--font-display)]">
            {work.title}
          </span>
          <div className="absolute top-3 right-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {work.status === "ONGOING" ? "Ongoing" : "Completed"}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {work.genres.map((genre) => (
              <span
                key={genre}
                className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md font-[family-name:var(--font-sans)]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
                  color: "var(--accent)",
                }}
              >
                {genre}
              </span>
            ))}
          </div>

          <h1
            className="text-xl font-bold leading-tight mb-2 font-[family-name:var(--font-display)]"
            style={{ color: "var(--foreground)" }}
          >
            {work.title}
          </h1>

          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--muted)" }}
            >
              {work.totalChapters} chapter
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-md font-[family-name:var(--font-sans)]"
              style={{
                backgroundColor: work.status === "COMPLETED"
                  ? "color-mix(in srgb, #5B8C5A 10%, transparent)"
                  : "color-mix(in srgb, var(--accent) 10%, transparent)",
                color: work.status === "COMPLETED" ? "#5B8C5A" : "var(--accent)",
              }}
            >
              {work.status === "COMPLETED" ? "Tamat" : "Sedang Berlangsung"}
            </span>
          </div>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {work.synopsis}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <a
              href={`/baca/${work.slug}/pertemuan-pertama`}
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Mulai Baca
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <button
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all hover:bg-[var(--surface)]"
              style={{
                color: "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              Bookmark
            </button>
          </div>
        </div>
      </div>

      <div className="ornamental-divider mt-5">
        <span className="ornamental-divider-icon">✦</span>
      </div>
    </div>
  );
}
