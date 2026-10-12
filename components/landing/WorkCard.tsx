"use client";

import Link from "next/link";
import { Work } from "@/data/types";
import { formatCompactNumber } from "@/lib/formatNumber";
import BookCover from "@/components/work/BookCover";
import { BookOpen, Eye } from "lucide-react";

interface Props {
  work: Work;
}

export default function WorkCard({ work }: Props) {
  return (
    <Link href={`/karya/${work.slug}`} className="group block tap-feedback">
      <div className="relative">
        <BookCover
          src={work.coverUrl}
          title={work.title}
          slug={work.slug}
          className="w-full transition-transform duration-300 group-hover:-translate-y-1"
        />
        <span
          className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md"
          style={{ backgroundColor: "rgba(0,0,0,0.42)", color: "#fff" }}
        >
          {work.status === "ONGOING" && <span className="size-1.5 rounded-full bg-emerald-400" />}
          {work.status === "ONGOING" ? "Ongoing" : "Tamat"}
        </span>
      </div>

      <div className="pt-2.5 px-0.5">
        <h3
          className="font-title text-[15px] font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-[var(--accent)]"
          style={{ color: "var(--foreground)" }}
        >
          {work.title}
        </h3>
        {work.genres.length > 0 && (
          <p className="text-[11px] mt-1 truncate" style={{ color: "var(--muted)" }}>
            {work.genres.slice(0, 2).join(" · ")}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium" style={{ color: "var(--muted)" }}>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3" />
            {work.totalChapters} chapter
          </span>
          {work.totalReads !== undefined && (
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3" />
              {formatCompactNumber(work.totalReads ?? 0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
