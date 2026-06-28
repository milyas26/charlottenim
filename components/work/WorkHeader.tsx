"use client";

import { Work, ReadingProgressInfo } from "@/data/types";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  work: Work;
  firstChapterSlug: string;
  readingProgress: ReadingProgressInfo | null;
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

export default function WorkHeader({ work, firstChapterSlug, readingProgress }: Props) {
  const { user } = useAuth();
  const hasImage = work.coverUrl.startsWith("http");
  const gradient = coverGradients[work.slug] || fallbackGradient;

  const isLoggedIn = !!user;
  const hasProgress = isLoggedIn && readingProgress !== null;

  const readHref = hasProgress
    ? `/baca/${work.slug}/${readingProgress!.chapterSlug}`
    : `/baca/${work.slug}/${firstChapterSlug}`;

  const buttonLabel = hasProgress ? "Lanjutkan" : "Mulai Baca";
  const buttonSub = hasProgress
    ? `Ch. ${readingProgress!.chapterNumber} — ${readingProgress!.chapterTitle}`
    : null;

  return (
    <div className="mb-5">
      <div className="flex flex-col gap-3">
        <div
          className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden animate-fade-in-up"
          style={{ background: hasImage ? "transparent" : gradient }}
        >
          {hasImage && (
            <>
              <img
                src={work.coverUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-md opacity-95 scale-110"
              />
              <img
                src={work.coverUrl}
                alt={work.title}
                className="relative z-10 h-[100%] aspect-[3/4] object-cover shadow-lg"
              />
            </>
          )}
          {!hasImage && (
            <span className="text-sm font-bold text-center text-white/85 drop-shadow-md leading-snug p-4 font-[family-name:var(--font-display)]">
              {work.title}
            </span>
          )}
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

          <div className="flex flex-col gap-1.5 mt-4">
            <a
              href={readHref}
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 tap-feedback self-start"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {buttonLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            {buttonSub && (
              <span className="text-[11px] font-medium italic" style={{ color: "var(--muted)" }}>
                {buttonSub}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="ornamental-divider mt-5">
        <span className="ornamental-divider-icon">✦</span>
      </div>
    </div>
  );
}
