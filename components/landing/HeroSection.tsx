"use client";

import Link from "next/link";
import { Work } from "@/data/types";
import BookCover, { hasCoverImage } from "@/components/work/BookCover";
import { ArrowRight } from "lucide-react";

interface Props {
  work: Work;
}

export default function HeroSection({ work }: Props) {
  return (
    <section className="animate-fade-in-up mb-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2.5" style={{ color: "var(--muted)" }}>
        Sorotan
      </p>

      <Link
        href={`/karya/${work.slug}`}
        className="group relative block overflow-hidden rounded-2xl tap-feedback"
        style={{ backgroundColor: "var(--secondary)" }}
      >
        {hasCoverImage(work.coverUrl) && (
          <img
            src={work.coverUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover scale-125 blur-2xl opacity-60"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--background) 30%, transparent) 0%, color-mix(in srgb, var(--background) 80%, transparent) 55%)",
          }}
        />

        <div className="relative flex gap-4 p-4">
          <BookCover src={work.coverUrl} title={work.title} slug={work.slug} className="w-[112px] shrink-0" />

          <div className="flex min-w-0 flex-1 flex-col py-1">
            <span
              className="self-start inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
              style={{
                backgroundColor: "color-mix(in srgb, var(--card) 70%, transparent)",
                color: "var(--foreground)",
              }}
            >
              {work.status === "ONGOING" && <span className="size-1.5 rounded-full bg-emerald-500" />}
              {work.status === "ONGOING" ? "Update berkala" : "Sudah tamat"}
            </span>

            <h1
              className="font-title text-xl font-semibold leading-tight line-clamp-2"
              style={{ color: "var(--foreground)" }}
            >
              {work.title}
            </h1>

            <p className="text-[11px] mt-1 truncate" style={{ color: "var(--muted)" }}>
              {[...work.genres.slice(0, 3), `${work.totalChapters} chapter`].join(" · ")}
            </p>

            <p
              className="text-[13px] leading-relaxed mt-2 line-clamp-3"
              style={{ color: "color-mix(in srgb, var(--foreground) 75%, transparent)" }}
            >
              {work.synopsis}
            </p>

            <span
              className="mt-auto pt-3 inline-flex items-center gap-1.5 self-start text-[13px] font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Mulai baca
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
