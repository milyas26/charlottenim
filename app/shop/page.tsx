"use client";

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import BottomNav from "@/components/layout/BottomNav"
import BundleCard from "@/components/shop/BundleCard"
import BookCard from "@/components/shop/BookCard"
import { fetchPublicBundles } from "@/lib/api/bundles"
import { fetchPublicBooks } from "@/lib/api/books"
import { fetchUserPurchases } from "@/lib/api/user"
import Link from "next/link"
import { Loader2, Package, Book, BookOpen, ChevronRight } from "lucide-react"

export default function ShopPage() {
  const { user } = useAuth()

  const { data: bundles = [], isLoading } = useQuery({
    queryKey: ["bundles", "public"],
    queryFn: fetchPublicBundles,
  })

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ["books", "public"],
    queryFn: fetchPublicBooks,
  })

  const { data: purchases } = useQuery({
    queryKey: ["user-purchases"],
    queryFn: fetchUserPurchases,
    enabled: !!user,
  })

  const ownedBundleIds = new Set(purchases?.bundles?.map((b) => b.bundleId) ?? [])

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 max-w-[480px] mx-auto w-full px-4 pb-24">
        <div className="pt-6 pb-4">
          <h1
            className="text-xl font-bold font-[family-name:var(--font-display)] text-center tracking-wide"
            style={{ color: "var(--foreground)" }}
          >
            Shop
          </h1>
          <div className="gold-rule max-w-[80px] mx-auto my-3" />
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="size-5" style={{ color: "var(--accent)" }} />
              <h2
                className="text-base font-bold font-[family-name:var(--font-display)]"
                style={{ color: "var(--foreground)" }}
              >
                Paket
              </h2>
              {!isLoading && (
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  ({bundles.length})
                </span>
              )}
            </div>
            {bundles.length > 0 && (
              <Link
                href="/shop/paket"
                className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Lihat Semua
                <ChevronRight className="size-3.5" />
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin" style={{ color: "var(--muted)" }} />
            </div>
          ) : bundles.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="size-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
              >
                <Package className="size-6" style={{ color: "var(--accent)" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Belum ada paket tersedia.
              </p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mr-4 pr-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {bundles.slice(0, 5).map((bundle) => (
                <div key={bundle.id} className="min-w-[180px] max-w-[180px] shrink-0">
                  <BundleCard bundle={bundle} isOwned={ownedBundleIds.has(bundle.id)} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Book className="size-5" style={{ color: "var(--accent)" }} />
              <h2
                className="text-base font-bold font-[family-name:var(--font-display)]"
                style={{ color: "var(--foreground)" }}
              >
                Buku
              </h2>
              {!booksLoading && (
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  ({books.length})
                </span>
              )}
            </div>
            {books.length > 0 && (
              <Link
                href="/shop/buku"
                className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Lihat Semua
                <ChevronRight className="size-3.5" />
              </Link>
            )}
          </div>

          {booksLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin" style={{ color: "var(--muted)" }} />
            </div>
          ) : books.length === 0 ? (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="size-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
              >
                <BookOpen className="size-6" style={{ color: "var(--accent)" }} />
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Belum ada buku tersedia.
              </p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 -mr-4 pr-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {books.slice(0, 5).map((book) => (
                <div key={book.id} className="min-w-[180px] max-w-[180px] shrink-0">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <BottomNav />
    </div>
  )
}
