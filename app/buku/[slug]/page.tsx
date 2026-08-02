"use client";

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import LoginDialog from "@/components/LoginDialog"
import BottomNav from "@/components/layout/BottomNav"
import { fetchBookBySlug } from "@/lib/api/books"
import { Loader2, BookOpen, ArrowLeft } from "lucide-react"

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { user } = useAuth()

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", slug],
    queryFn: () => fetchBookBySlug(slug),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--muted)" }} />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <div className="flex-1 max-w-[480px] mx-auto w-full px-4 flex items-center justify-center pb-24">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Buku tidak ditemukan.</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(book.price)

  const hasCover = book.coverUrl && (book.coverUrl.startsWith("http") || book.coverUrl.startsWith("data:"))

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 max-w-[480px] mx-auto w-full px-4 pb-24">
        <div className="flex items-center gap-3 pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors"
            style={{ color: "var(--muted)" }}
          >
            <ArrowLeft className="size-5" />
          </button>
          <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
            Kembali
          </p>
        </div>

        <div className="w-full aspect-[10/15] rounded-2xl flex items-center justify-center relative overflow-hidden mb-5">
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
              <BookOpen className="size-12" style={{ color: "var(--accent)", opacity: 0.3 }} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md font-[family-name:var(--font-sans)]"
            style={{
              backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
              color: "var(--accent)",
            }}
          >
            Buku
          </span>
          {book.author && (
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              oleh {book.author}
            </span>
          )}
        </div>

        <h1
          className="text-xl font-bold leading-tight mb-2 font-[family-name:var(--font-display)]"
          style={{ color: "var(--foreground)" }}
        >
          {book.title}
        </h1>

        {book.description && (
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            {book.description}
          </p>
        )}

        <div className="gold-rule max-w-[80px] my-4" />

        <div className="flex items-center justify-between mb-3">
          <div>
            <p
              className="text-2xl font-bold font-[family-name:var(--font-display)]"
              style={{ color: "var(--accent)" }}
            >
              {formattedPrice}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {book.stock > 0 ? `Stok: ${book.stock}` : "Stok habis"}
              {book.pages > 0 && ` • ${book.pages} hlm`}
            </p>
          </div>
        </div>

        <div className="mb-6">
          {book.stock > 0 ? (
            user ? (
              <button
                onClick={() => router.push(`/checkout/buku/${book.id}`)}
                className="w-full py-3 px-8 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Beli Sekarang
              </button>
            ) : (
              <LoginDialog>
                <button
                  className="w-full py-3 px-8 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Login untuk Beli
                </button>
              </LoginDialog>
            )
          ) : (
            <button
              disabled
              className="w-full py-3 px-8 rounded-xl text-white font-semibold text-sm opacity-50 cursor-not-allowed"
              style={{ backgroundColor: "var(--muted)" }}
            >
              Stok Habis
            </button>
          )}
        </div>

        {book.weight > 0 && (
          <div
            className="rounded-xl p-3 mb-3 flex items-start gap-2"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 5%, transparent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" style={{ color: "var(--muted)" }}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              <span className="font-semibold">Info Pengiriman:</span> Berat buku {book.weight}g. Ongkos kirim belum termasuk dalam harga. Hubungi admin via WhatsApp untuk info ongkir setelah pesanan dibuat.
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
