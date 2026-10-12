"use client";

import { useState } from "react";
import Link from "next/link";
import { Chapter } from "@/data/types";
import { ArrowDownUp, CheckCircle2, Lock, MessageCircle } from "lucide-react";

interface Props {
  chapters: Chapter[];
  workSlug: string;
  unlockedChapterIds: string[];
}

export default function ChapterList({ chapters, workSlug, unlockedChapterIds }: Props) {
  const unlockedSet = new Set(unlockedChapterIds);
  const [newestFirst, setNewestFirst] = useState(false);
  const ordered = newestFirst ? [...chapters].reverse() : chapters;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          Daftar Chapter
          <span className="ml-1.5 text-xs font-normal" style={{ color: "var(--muted)" }}>
            {chapters.length}
          </span>
        </h2>
        {chapters.length > 1 && (
          <button
            type="button"
            onClick={() => setNewestFirst((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 h-7 rounded-full transition-colors hover:bg-[var(--surface)] tap-feedback"
            style={{ color: "var(--muted)" }}
          >
            <ArrowDownUp className="size-3.5" />
            {newestFirst ? "Terbaru" : "Terlama"}
          </button>
        )}
      </div>

      <ul className="soft-card rounded-2xl overflow-hidden">
        {ordered.map((chapter, i) => {
          const isUnlocked = unlockedSet.has(chapter.id);
          const locked = chapter.isPremium && !isUnlocked;

          return (
            <li key={chapter.id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
              <Link
                href={`/baca/${workSlug}/${chapter.slug}`}
                className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-[var(--surface)] group tap-feedback"
              >
                <span
                  className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {chapter.chapterNumber}
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-medium leading-snug truncate transition-colors group-hover:text-[var(--accent)]"
                    style={{ color: "var(--foreground)" }}
                  >
                    {chapter.title}
                  </p>
                  <p className="flex items-center gap-2.5 text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="size-3" />
                      {chapter.commentCount.toLocaleString("id-ID")} komentar
                    </span>
                  </p>
                </div>

                {locked ? (
                  <span
                    className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    <Lock className="size-3" />
                    Rp {chapter.price.toLocaleString("id-ID")}
                  </span>
                ) : chapter.isPremium ? (
                  <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-[#5B8C5A]">
                    <CheckCircle2 className="size-3.5" />
                    Dibeli
                  </span>
                ) : (
                  <span className="shrink-0 text-[11px] font-medium" style={{ color: "var(--muted)" }}>
                    Gratis
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
