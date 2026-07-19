"use client";

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import BottomNav from "@/components/layout/BottomNav"
import BundleCard from "@/components/shop/BundleCard"
import { fetchPublicBundles } from "@/lib/api/bundles"
import { fetchUserPurchases } from "@/lib/api/user"
import { Loader2, Package, Book, BookOpen } from "lucide-react"

export default function ShopPage() {
  const { user } = useAuth()

  const { data: bundles = [], isLoading } = useQuery({
    queryKey: ["bundles", "public"],
    queryFn: fetchPublicBundles,
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
          <div className="flex items-center gap-2 mb-3">
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
            <div className="grid grid-cols-2 gap-3">
              {bundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} isOwned={ownedBundleIds.has(bundle.id)} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <Book className="size-5" style={{ color: "var(--accent)" }} />
            <h2
              className="text-base font-bold font-[family-name:var(--font-display)]"
              style={{ color: "var(--foreground)" }}
            >
              Buku
            </h2>
          </div>

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
              Segera hadir.
            </p>
          </div>
        </section>
      </div>
      <BottomNav />
    </div>
  )
}
