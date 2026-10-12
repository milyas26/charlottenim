"use client";

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import BottomNav from "@/components/layout/BottomNav"
import PageHeader from "@/components/layout/PageHeader"
import BundleCard from "@/components/shop/BundleCard"
import { fetchPublicBundles } from "@/lib/api/bundles"
import { fetchUserPurchases } from "@/lib/api/user"
import { Package, BookOpen } from "lucide-react"

function EmptyState({ icon: Icon, title, text }: { icon: typeof Package; title: string; text: string }) {
  return (
    <div className="soft-card rounded-2xl px-6 py-10 text-center">
      <div
        className="size-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
        style={{
          backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
          color: "var(--accent)",
        }}
      >
        <Icon className="size-5" />
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        {title}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
        {text}
      </p>
    </div>
  )
}

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
    <div className="font-ui min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1 max-w-[480px] mx-auto w-full px-4 pb-28">
        <PageHeader title="Toko" subtitle="Paket chapter premium, lebih hemat dibanding beli satuan." />

        <section className="mb-8">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
              Paket Cerita
            </h2>
            {!isLoading && (
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {bundles.length} paket
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="soft-card rounded-2xl p-3 flex gap-4 animate-pulse">
                  <div className="w-[68px] aspect-[2/3] rounded-md bg-[var(--surface)]" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-1/3 rounded bg-[var(--surface)]" />
                    <div className="h-4 w-3/4 rounded bg-[var(--surface)]" />
                    <div className="h-3 w-1/4 rounded bg-[var(--surface)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : bundles.length === 0 ? (
            <EmptyState icon={Package} title="Belum ada paket" text="Paket baru akan muncul di sini." />
          ) : (
            <div className="space-y-3">
              {bundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} isOwned={ownedBundleIds.has(bundle.id)} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            Buku Cetak
          </h2>
          <EmptyState icon={BookOpen} title="Segera hadir" text="Versi cetak sedang disiapkan. Nantikan, ya!" />
        </section>
      </div>
      <BottomNav />
    </div>
  )
}
