"use client";

import { useState } from "react";
import Link from "next/link";
import { Work, ReadingProgressInfo } from "@/data/types";
import { useAuth } from "@/contexts/AuthContext";
import { formatCompactNumber } from "@/lib/formatNumber";
import BookCover, { hasCoverImage } from "@/components/work/BookCover";
import { BookOpen } from "lucide-react";

interface Props {
  work: Work;
  firstChapterSlug: string;
  readingProgress: ReadingProgressInfo | null;
}

export default function WorkHeader({ work, firstChapterSlug, readingProgress }: Props) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const hasProgress = !!user && readingProgress !== null;

  const readHref = hasProgress
    ? `/baca/${work.slug}/${readingProgress!.chapterSlug}`
    : `/baca/${work.slug}/${firstChapterSlug}`;

  const stats = [
    { value: String(work.totalChapters), label: "Chapter" },
    ...(work.totalReads !== undefined
      ? [{ value: formatCompactNumber(work.totalReads ?? 0), label: "Dibaca" }]
      : []),
    { value: work.status === "COMPLETED" ? "Tamat" : "Ongoing", label: "Status" },
  ];

  return (
    <section className="mb-8">
      {/* Cover over a blurred backdrop */}
      <div className="relative -mx-4 -mt-14 pt-16 pb-6 overflow-hidden">
        {hasCoverImage(work.coverUrl) && (
          <img
            src={work.coverUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover scale-125 blur-3xl opacity-50"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 0%, var(--background) 92%)" }}
        />
        <BookCover
          src={work.coverUrl}
          title={work.title}
          slug={work.slug}
          className="relative mx-auto w-[150px] animate-fade-in-up"
        />
      </div>

      <div className="text-center">
        <h1 className="font-title text-2xl font-semibold leading-tight px-2" style={{ color: "var(--foreground)" }}>
          {work.title}
        </h1>
        <p className="text-[13px] mt-1.5" style={{ color: "var(--muted)" }}>
          oleh Charlottenimmm
        </p>
      </div>

      <div
        className="soft-card mt-5 grid rounded-2xl py-3"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="text-center"
            style={{ borderLeft: i > 0 ? "1px solid var(--border)" : undefined }}
          >
            <p className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>
              {s.value}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Link
          href={readHref}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-opacity hover:opacity-90 tap-feedback"
          style={{ backgroundColor: "var(--accent)", color: "var(--primary-foreground)" }}
        >
          <BookOpen className="size-[18px]" />
          {hasProgress ? `Lanjutkan Chapter ${readingProgress!.chapterNumber}` : "Mulai Baca"}
        </Link>
        {hasProgress && (
          <p className="text-xs text-center mt-2 truncate" style={{ color: "var(--muted)" }}>
            Terakhir dibaca: {readingProgress!.chapterTitle}
          </p>
        )}
      </div>

      {work.genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-6">
          {work.genres.map((genre) => (
            <span
              key={genre}
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: "var(--surface)", color: "var(--foreground)" }}
            >
              {genre}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-sm font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>
          Sinopsis
        </h2>
        <p
          className={`font-[family-name:var(--font-lora)] text-[15px] leading-[1.75] whitespace-pre-line ${expanded ? "" : "line-clamp-4"}`}
          style={{ color: "color-mix(in srgb, var(--foreground) 82%, transparent)" }}
        >
          {work.synopsis}
        </p>
        {work.synopsis.length > 220 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[13px] font-semibold mt-1.5"
            style={{ color: "var(--accent)" }}
          >
            {expanded ? "Tutup" : "Baca selengkapnya"}
          </button>
        )}
      </div>
    </section>
  );
}
