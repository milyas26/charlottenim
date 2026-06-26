"use client";

import { Work } from "@/data/types";

interface Props {
  work: Work;
}

const coverGradients: Record<string, string> = {
  "senja-di-ujung-maret":
    "linear-gradient(155deg, #f0d4ae 0%, #e2bc8a 12%, #d4a574 25%, #c08858 40%, #b87b5c 55%, #a46340 68%, #8b4e32 80%, #6b3a2a 92%, #4a2418 100%)",
  "dua-detik-sebelum-kamu":
    "linear-gradient(155deg, #bcc8d6 0%, #9aacbf 12%, #7b8da0 28%, #5e7188 45%, #4a5568 60%, #3a4460 75%, #2d3748 88%, #1a202c 100%)",
};

const fallbackGradient =
  "linear-gradient(155deg, #e0d6c8 0%, #d0c4b4 20%, #c4b5a5 45%, #b09e8d 65%, #948274 85%, #6b5d50 100%)";

export default function WorkCard({ work }: Props) {
  const gradient = coverGradients[work.slug] || fallbackGradient;

  return (
    <a
      href={`/karya/${work.slug}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1.5 active:scale-[0.97]"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 14px 36px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.04), 0 0 0 1px color-mix(in srgb, var(--accent) 22%, transparent)";
        e.currentTarget.style.borderColor =
          "color-mix(in srgb, var(--accent) 28%, transparent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div
        className="aspect-[3/4] w-full relative flex flex-col items-center justify-center overflow-hidden"
        style={{ background: gradient }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 45% 25%, rgba(255,255,255,0.18) 0%, transparent 45%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #fff 1.5px, transparent 1.5px), radial-gradient(circle at 65% 18%, #fff 1px, transparent 1px), radial-gradient(circle at 40% 70%, #fff 0.8px, transparent 0.8px), radial-gradient(circle at 75% 60%, #fff 0.6px, transparent 0.6px)",
            backgroundSize: "24px 24px, 32px 32px, 18px 18px, 26px 26px",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 30%, rgba(0,0,0,0.04) 55%, transparent 75%)",
          }}
        />

        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] opacity-30"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.25))",
          }}
        />

        <div className="relative z-10 flex flex-col items-center px-4 mt-auto pb-9">
          <div
            className="w-8 h-px mb-3 opacity-50"
            style={{ background: "rgba(255,255,255,0.55)" }}
          />
          <span
            className="text-sm sm:text-[15px] font-bold text-center leading-tight drop-shadow-lg font-[family-name:var(--font-display)]"
            style={{
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {work.title}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          {work.status === "ONGOING" && (
            <span
              className="w-[7px] h-[7px] rounded-full bg-emerald-400 animate-pulse-dot"
              style={{ boxShadow: "0 0 6px rgba(74,222,128,0.6)" }}
            />
          )}
          <span
            className="text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full backdrop-blur-md"
            style={{
              backgroundColor: "rgba(0,0,0,0.28)",
              color: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {work.status === "ONGOING" ? "Ongoing" : "Completed"}
          </span>
        </div>
      </div>

      <div className="px-3.5 pt-3.5 pb-4">
        <h3
          className="font-bold text-[13px] leading-snug mb-3 line-clamp-2 font-[family-name:var(--font-display)] group-hover:text-[var(--accent)] transition-colors duration-200"
          style={{ color: "var(--foreground)" }}
        >
          {work.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {work.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md font-[family-name:var(--font-sans)]"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent) 10%, transparent)",
                  color: "var(--accent)",
                }}
              >
                {genre}
              </span>
            ))}
            {work.genres.length > 2 && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                style={{ color: "var(--muted)" }}
              >
                +{work.genres.length - 2}
              </span>
            )}
          </div>

          <div
            className="text-[10px] font-semibold flex items-center gap-1"
            style={{ color: "var(--muted)" }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: 0.55 }}
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            {work.totalChapters}
          </div>
        </div>
      </div>
    </a>
  );
}
