"use client";

import { Chapter } from "@/data/types";

interface Props {
  chapters: Chapter[];
  workSlug: string;
}

export default function ChapterList({ chapters, workSlug }: Props) {
  return (
    <div>
      <h2
        className="text-base font-bold mb-4 font-[family-name:var(--font-display)]"
        style={{ color: "var(--foreground)" }}
      >
        Daftar Chapter
      </h2>

      <div className="space-y-2">
        {chapters.map((chapter) => (
          <a
            key={chapter.id}
            href={`/baca/${workSlug}/${chapter.slug}`}
            className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all hover:bg-[var(--surface)] group"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-sans)]"
                style={{
                  backgroundColor: chapter.isPremium
                    ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                    : "color-mix(in srgb, #5B8C5A 12%, transparent)",
                  color: chapter.isPremium ? "var(--accent)" : "#5B8C5A",
                }}
              >
                {chapter.chapterNumber}
              </span>
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold leading-snug truncate group-hover:text-[var(--accent)] transition-colors"
                  style={{ color: "var(--foreground)" }}
                >
                  {chapter.title}
                </p>
                <p className="text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                  {chapter.readCount.toLocaleString("id-ID")} pembaca
                </p>
              </div>
            </div>

            {chapter.isPremium ? (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md flex-shrink-0 font-[family-name:var(--font-sans)]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  color: "var(--accent)",
                }}
              >
                Rp {chapter.price.toLocaleString("id-ID")}
              </span>
            ) : (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md flex-shrink-0 font-[family-name:var(--font-sans)]"
                style={{
                  backgroundColor: "color-mix(in srgb, #5B8C5A 12%, transparent)",
                  color: "#5B8C5A",
                }}
              >
                Gratis
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
