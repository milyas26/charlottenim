"use client";

import { Chapter } from "@/data/types";

interface Props {
  prev: Chapter | null;
  next: Chapter | null;
}

export default function ChapterNavigation({ prev, next }: Props) {
  return (
    <nav className="flex items-stretch gap-3 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
      {prev ? (
        <a
          href={`/baca/${prev.workSlug}/${prev.slug}`}
          className="flex-1 group flex flex-col items-start py-3 px-4 rounded-xl transition-all hover:bg-[var(--surface)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <span
            className="text-xs font-medium uppercase tracking-wider mb-0.5 transition-colors group-hover:text-[var(--accent)]"
            style={{ color: "var(--muted)" }}
          >
            ← Sebelumnya
          </span>
          <span
            className="text-sm font-medium leading-snug line-clamp-1"
            style={{ color: "var(--foreground)" }}
          >
            {prev.title}
          </span>
        </a>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <a
          href={`/baca/${next.workSlug}/${next.slug}`}
          className="flex-1 group flex flex-col items-end text-right py-3 px-4 rounded-xl transition-all hover:bg-[var(--surface)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <span
            className="text-xs font-medium uppercase tracking-wider mb-0.5 transition-colors group-hover:text-[var(--accent)]"
            style={{ color: "var(--muted)" }}
          >
            Selanjutnya →
          </span>
          <span
            className="text-sm font-medium leading-snug line-clamp-1"
            style={{ color: "var(--foreground)" }}
          >
            {next.title}
          </span>
        </a>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
