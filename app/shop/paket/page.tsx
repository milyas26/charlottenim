"use client";

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import BottomNav from "@/components/layout/BottomNav"
import BundleCard from "@/components/shop/BundleCard"
import { fetchPublicBundles } from "@/lib/api/bundles"
import { fetchUserPurchases } from "@/lib/api/user"
import { Loader2, Package, ChevronLeft } from "lucide-react"

export default function ShopPaketPage() {
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
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/shop"
              className="flex items-center gap-0.5 text-sm font-medium transition-colors hover:underline"
              style={{ color: "var(--accent)" }}
            >
              <ChevronLeft className="size-4" />
              Shop
            </Link>
          </div>
          <h1
            className="text-xl font-bold font-[family-name:var(--font-display)] tracking-wide"
            style={{ color: "var(--foreground)" }}
          >
            Semua Paket
          </h1>
          <div className="gold-rule max-w-[80px] my-3" />
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
      </div>
      <BottomNav />
    </div>
  )
}
