"use client";

import Link from "next/link"
import type { PublicBundleListItem } from "@/data/types"
import BookCover from "@/components/work/BookCover"
import { CheckCircle2, ChevronRight, Layers } from "lucide-react"

interface Props {
  bundle: PublicBundleListItem
  isOwned?: boolean
}

export default function BundleCard({ bundle, isOwned }: Props) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(bundle.price)

  return (
    <Link
      href={`/paket/${bundle.slug}`}
      className="soft-card group flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-[var(--surface)] tap-feedback"
    >
      <BookCover src={bundle.workCoverUrl} title={bundle.workTitle} className="w-[68px] shrink-0 rounded-md" />

      <div className="min-w-0 flex-1 py-0.5">
        <p className="text-[11px] truncate" style={{ color: "var(--muted)" }}>
          {bundle.workTitle}
        </p>
        <h3
          className="font-title text-[15px] font-semibold leading-snug line-clamp-2 mt-0.5"
          style={{ color: "var(--foreground)" }}
        >
          {bundle.title}
        </h3>
        <p className="inline-flex items-center gap-1 text-[11px] mt-1" style={{ color: "var(--muted)" }}>
          <Layers className="size-3" />
          {bundle.chapterCount} chapter
        </p>
        <div className="mt-1.5">
          {isOwned ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B8C5A]">
              <CheckCircle2 className="size-3.5" />
              Sudah dimiliki
            </span>
          ) : (
            <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              {formattedPrice}
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: "var(--muted)" }} />
    </Link>
  )
}
