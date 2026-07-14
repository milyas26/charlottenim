"use client";

import { use, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import LoginDialog from "@/components/LoginDialog"
import BottomNav from "@/components/layout/BottomNav"
import { fetchPublicBundleBySlug, createManualBundlePayment } from "@/lib/api/bundles"
import { fetchUserPurchases } from "@/lib/api/user"
import { Loader2, Package, ArrowLeft, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PublicBundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [isBuying, setIsBuying] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { data: bundle, isLoading } = useQuery({
    queryKey: ["public-bundle", slug],
    queryFn: () => fetchPublicBundleBySlug(slug),
  })

  const { data: purchases } = useQuery({
    queryKey: ["user-purchases"],
    queryFn: fetchUserPurchases,
    enabled: !!user,
  })

  const isOwned = bundle ? (purchases?.bundles?.some((b) => b.bundleId === bundle.id) ?? false) : false

  const handleBuy = async () => {
    if (!user || !bundle) return
    setShowConfirm(true)
  }

  const doBuy = async () => {
    if (!user || !bundle) return
    setShowConfirm(false)
    setIsBuying(true)
    try {
      const data = await createManualBundlePayment({
        bundleId: bundle.id,
      })
      router.push(`/bayar/${data.purchaseId}`)
    } catch {
      setIsBuying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--muted)" }} />
      </div>
    )
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <div className="flex-1 max-w-[480px] mx-auto w-full px-4 flex items-center justify-center pb-24">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Paket tidak ditemukan.</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(bundle.price)

  const hasCover = bundle.workCoverUrl && (bundle.workCoverUrl.startsWith("http") || bundle.workCoverUrl.startsWith("data:"))

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

        <div className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden mb-5">
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
                className="relative z-10 h-[90%] aspect-[10/15] object-cover shadow-lg rounded-sm"
              />
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
            >
              <Package className="size-12" style={{ color: "var(--accent)", opacity: 0.3 }} />
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
            Paket
          </span>
          <Link
            href={`/karya/${bundle.workSlug}`}
            className="text-xs hover:underline"
            style={{ color: "var(--muted)" }}
          >
            {bundle.workTitle}
          </Link>
        </div>

        <h1
          className="text-xl font-bold leading-tight mb-2 font-[family-name:var(--font-display)]"
          style={{ color: "var(--foreground)" }}
        >
          {bundle.title}
        </h1>

        {bundle.description && (
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            {bundle.description}
          </p>
        )}

        <div className="gold-rule max-w-[80px] my-4" />

        <div className="flex items-center justify-between mb-2">
          <div>
            <p
              className="text-2xl font-bold font-[family-name:var(--font-display)]"
              style={{ color: "var(--accent)" }}
            >
              {formattedPrice}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {bundle.chapterCount} chapter premium
            </p>
          </div>

          {isOwned ? (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: "color-mix(in srgb, #5B8C5A 12%, transparent)", color: "#5B8C5A" }}
            >
              <CheckCircle className="size-4" />
              Sudah Dimiliki
            </div>
          ) : user ? (
            <button
              onClick={handleBuy}
              disabled={isBuying}
              className="py-3 px-8 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback disabled:opacity-60"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {isBuying ? "Memproses..." : "Beli Paket"}
            </button>
          ) : (
            <LoginDialog>
              <button
                className="py-3 px-8 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Login untuk Beli
              </button>
            </LoginDialog>
          )}
        </div>

        {(() => {
          const totalIndividual = bundle.chapters.filter((c) => c.isPremium).reduce((sum, c) => sum + c.price, 0)
          const savings = totalIndividual - bundle.price
          if (savings <= 0) return null
          const percent = Math.round((savings / totalIndividual) * 100)
          const formattedIndividual = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalIndividual)
          return (
            <div
              className="rounded-xl p-3 mb-6 flex items-center gap-2"
              style={{ backgroundColor: "color-mix(in srgb, #5B8C5A 10%, transparent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B8C5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <div className="text-xs" style={{ color: "#5B8C5A" }}>
                <span className="font-semibold">Hemat {percent}%</span> — beli satuan{" "}
                <span className="line-through opacity-70">{formattedIndividual}</span>, cukup{" "}
                <span className="font-semibold">{formattedPrice}</span>
              </div>
            </div>
          )
        })()}

        <h2
          className="text-sm font-bold mb-3 font-[family-name:var(--font-display)]"
          style={{ color: "var(--foreground)" }}
        >
          Chapter dalam Paket
        </h2>

        <div className="space-y-2">
          {bundle.chapters.map((ch) => {
            const content = (
              <>
                <span
                  className="text-xs font-bold w-8 h-6 flex items-center justify-center rounded-md shrink-0"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  {ch.chapterNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {ch.title}
                  </p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                  {ch.isPremium ? `Rp ${ch.price.toLocaleString("id-ID")}` : "Gratis"}
                </span>
                {isOwned && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--muted)", opacity: 0.5, flexShrink: 0 }}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
              </>
            )

            const classes = isOwned
              ? "flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--border)]"
              : "flex items-center gap-3 p-3 rounded-xl"

            return isOwned ? (
              <Link
                key={ch.id}
                href={`/baca/${bundle.workSlug}/${ch.slug}`}
                className={classes}
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {content}
              </Link>
            ) : (
              <div
                key={ch.id}
                className={classes}
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                {content}
              </div>
            )
          })}
        </div>
      </div>
      <BottomNav />

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="w-[90vw] max-w-sm rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembelian</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan membeli paket <strong>{bundle?.title}</strong> seharga{" "}
              <strong>
                {bundle
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(bundle.price)
                  : ""}
              </strong>
              . Lanjutkan ke pembayaran?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={doBuy}
              style={{ backgroundColor: "var(--accent)" }}
            >
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
