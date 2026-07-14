"use client";

import Link from "next/link"
import type { PublicBundleListItem } from "@/data/types"
import { Package } from "lucide-react"

interface Props {
  bundle: PublicBundleListItem
}

export default function BundleCard({ bundle }: Props) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(bundle.price)

  const hasCover = bundle.workCoverUrl && (bundle.workCoverUrl.startsWith("http") || bundle.workCoverUrl.startsWith("data:"))

  return (
    <Link
      href={`/paket/${bundle.slug}`}
      className="rounded-2xl overflow-hidden flex flex-col transition-transform hover:scale-[1.02] active:scale-[0.98] tap-feedback"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="aspect-[3/2] relative overflow-hidden">
        {hasCover ? (
          <>
            <img
              src={bundle.workCoverUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-95 scale-110"
            />
            <img
              src={bundle.workCoverUrl}
              alt={bundle.workTitle}
              className="relative z-10 h-[90%] mx-auto aspect-[10/15] object-cover shadow-md"
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
          >
            <Package className="size-8" style={{ color: "var(--accent)", opacity: 0.4 }} />
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] font-medium truncate" style={{ color: "var(--muted)" }}>
          {bundle.workTitle}
        </p>

        <h3
          className="text-sm font-bold mt-0.5 line-clamp-2 leading-snug font-[family-name:var(--font-display)]"
          style={{ color: "var(--foreground)" }}
        >
          {bundle.title}
        </h3>

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p
              className="text-sm font-bold leading-none"
              style={{ color: "var(--accent)" }}
            >
              {formattedPrice}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
              {bundle.chapterCount} chapter
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
