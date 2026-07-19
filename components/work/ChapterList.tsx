"use client";

import { Chapter } from "@/data/types";
import { formatCompactNumber } from "@/lib/formatNumber";
import { CheckCircle } from "lucide-react";

interface Props {
  chapters: Chapter[];
  workSlug: string;
  unlockedChapterIds: string[];
}

export default function ChapterList({ chapters, workSlug, unlockedChapterIds }: Props) {
  const unlockedSet = new Set(unlockedChapterIds)

  return (
    <div>
      <h2
        className="text-base font-bold mb-3 font-[family-name:var(--font-display)]"
        style={{ color: "var(--foreground)" }}
      >
        Daftar Chapter
      </h2>

      <div className="space-y-2">
        {chapters.map((chapter) => {
          const isUnlocked = unlockedSet.has(chapter.id)

          return (
          <div key={chapter.id}>
          <a
            href={`/baca/${workSlug}/${chapter.slug}`}
            className="flex items-center justify-between px-3.5 py-3 rounded-xl transition-all hover:bg-[var(--surface)] group tap-feedback"
            style={{ border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-[family-name:var(--font-sans)]"
                style={{
                  backgroundColor: chapter.isPremium && !isUnlocked
                    ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                    : "color-mix(in srgb, #5B8C5A 12%, transparent)",
                  color: chapter.isPremium && !isUnlocked ? "var(--accent)" : "#5B8C5A",
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
                  {formatCompactNumber(chapter.readCount)} pembaca · {chapter.commentCount.toLocaleString("id-ID")} komentar
                </p>
              </div>
            </div>

            {chapter.isPremium ? (
              isUnlocked ? (
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md flex-shrink-0 font-[family-name:var(--font-sans)] flex items-center gap-1"
                  style={{
                    backgroundColor: "color-mix(in srgb, #5B8C5A 12%, transparent)",
                    color: "#5B8C5A",
                  }}
                >
                  <CheckCircle className="size-3" />
                  Dibeli
                </span>
              ) : (
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md flex-shrink-0 font-[family-name:var(--font-sans)]"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  Rp {chapter.price.toLocaleString("id-ID")}
                </span>
              )
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
          </div>
        )})}
      </div>
    </div>
  );
}
