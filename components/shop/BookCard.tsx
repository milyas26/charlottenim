"use client";

import Link from "next/link"
import type { BookListItem } from "@/data/types"
import { BookOpen } from "lucide-react"

interface Props {
  book: BookListItem
}

export default function BookCard({ book }: Props) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(book.price)

  const hasCover = book.coverUrl && (book.coverUrl.startsWith("http") || book.coverUrl.startsWith("data:"))

  return (
    <Link
      href={`/buku/${book.slug}`}
      className="rounded-2xl overflow-hidden flex flex-col transition-transform hover:scale-[1.02] active:scale-[0.98] tap-feedback"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="aspect-[10/15] relative overflow-hidden">
        {hasCover ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
          >
            <BookOpen className="size-8" style={{ color: "var(--accent)", opacity: 0.4 }} />
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] font-medium truncate" style={{ color: "var(--muted)" }}>
          {book.author || "Charlottenim"}
        </p>

        <h3
          className="text-sm font-bold mt-0.5 line-clamp-2 leading-snug font-[family-name:var(--font-display)]"
          style={{ color: "var(--foreground)" }}
        >
          {book.title}
        </h3>

        <div className="mt-auto pt-2">
          <p
            className="text-sm font-bold leading-none"
            style={{ color: "var(--accent)" }}
          >
            {formattedPrice}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
            Stok: {book.stock}
          </p>
        </div>
      </div>
    </Link>
  )
}
