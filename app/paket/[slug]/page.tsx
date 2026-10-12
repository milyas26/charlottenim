"use client";

import { use, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import LoginDialog from "@/components/LoginDialog"
import BottomNav from "@/components/layout/BottomNav"
import { fetchPublicBundleBySlug, createBundlePayment } from "@/lib/api/bundles"
import { fetchUserPurchases } from "@/lib/api/user"
import { Loader2, Package, CheckCircle, ChevronRight } from "lucide-react"
import TopBar from "@/components/layout/TopBar"
import BookCover from "@/components/work/BookCover"
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
      const data = await createBundlePayment({
        bundleId: bundle.id,
        workSlug: bundle.workSlug,
        payerEmail: user.email,
      })
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      }
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
      <div className="font-ui min-h-screen bg-[var(--background)] flex flex-col">
        <TopBar backHref="/shop" />
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

  const totalIndividual = bundle.chapters.filter((c) => c.isPremium).reduce((sum, c) => sum + c.price, 0)
  const savings = totalIndividual - bundle.price
  const savingsPercent = savings > 0 ? Math.round((savings / totalIndividual) * 100) : 0
  const formattedIndividual = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalIndividual)

  return (
    <div className="font-ui min-h-screen bg-[var(--background)] flex flex-col">
      <TopBar title={bundle.title} />

      <div className="flex-1 max-w-[480px] mx-auto w-full px-4 pb-28">
        <div className="flex gap-4 pt-2">
          <BookCover src={bundle.workCoverUrl} title={bundle.workTitle} slug={bundle.workSlug} className="w-[110px] shrink-0" />
          <div className="min-w-0 flex-1 py-1">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Package className="size-3" />
              Paket
            </span>
            <h1 className="font-title text-xl font-semibold leading-tight mt-2" style={{ color: "var(--foreground)" }}>
              {bundle.title}
            </h1>
            <Link
              href={`/karya/${bundle.workSlug}`}
              className="inline-block text-[13px] mt-1 hover:underline"
              style={{ color: "var(--muted)" }}
            >
              {bundle.workTitle}
            </Link>
            <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
              {bundle.chapterCount} chapter premium
            </p>
          </div>
        </div>

        {bundle.description && (
          <p
            className="font-[family-name:var(--font-lora)] text-[15px] leading-[1.75] mt-5 whitespace-pre-line"
            style={{ color: "color-mix(in srgb, var(--foreground) 82%, transparent)" }}
          >
            {bundle.description}
          </p>
        )}

        <div className="soft-card rounded-2xl p-4 mt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px]" style={{ color: "var(--muted)" }}>Harga paket</p>
              <p className="text-2xl font-bold mt-0.5" style={{ color: "var(--foreground)" }}>
                {formattedPrice}
              </p>
              {savingsPercent > 0 && (
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  <span className="line-through">{formattedIndividual}</span>
                </p>
              )}
            </div>
            {savingsPercent > 0 && (
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, #5B8C5A 14%, transparent)", color: "#5B8C5A" }}
              >
                Hemat {savingsPercent}%
              </span>
            )}
          </div>

          <div className="mt-4">
            {isOwned ? (
              <div
                className="flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "color-mix(in srgb, #5B8C5A 12%, transparent)", color: "#5B8C5A" }}
              >
                <CheckCircle className="size-4" />
                Sudah dimiliki, selamat membaca!
              </div>
            ) : user ? (
              <button
                onClick={handleBuy}
                disabled={isBuying}
                className="w-full h-12 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback disabled:opacity-60"
                style={{ backgroundColor: "var(--accent)", color: "var(--primary-foreground)" }}
              >
                {isBuying ? "Memproses..." : "Beli Paket"}
              </button>
            ) : (
              <LoginDialog>
                <button
                  className="w-full h-12 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 tap-feedback"
                  style={{ backgroundColor: "var(--accent)", color: "var(--primary-foreground)" }}
                >
                  Masuk untuk Beli
                </button>
              </LoginDialog>
            )}
          </div>
        </div>

        <h2 className="text-base font-semibold mt-8 mb-3" style={{ color: "var(--foreground)" }}>
          Isi Paket
          <span className="ml-1.5 text-xs font-normal" style={{ color: "var(--muted)" }}>
            {bundle.chapters.length}
          </span>
        </h2>

        <ul className="soft-card rounded-2xl overflow-hidden">
          {bundle.chapters.map((ch, i) => {
            const content = (
              <>
                <span
                  className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums"
                  style={{ color: "var(--muted)" }}
                >
                  {ch.chapterNumber}
                </span>
                <p className="flex-1 min-w-0 text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                  {ch.title}
                </p>
                {isOwned ? (
                  <ChevronRight className="size-4 shrink-0" style={{ color: "var(--muted)" }} />
                ) : (
                  <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                    {ch.isPremium ? `Rp ${ch.price.toLocaleString("id-ID")}` : "Gratis"}
                  </span>
                )}
              </>
            )

            const classes = "flex items-center gap-3.5 px-4 py-3.5"

            return (
              <li key={ch.id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}>
                {isOwned ? (
                  <Link
                    href={`/baca/${bundle.workSlug}/${ch.slug}`}
                    className={`${classes} transition-colors hover:bg-[var(--surface)] tap-feedback`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className={classes}>{content}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <BottomNav />

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="font-ui w-[90vw] max-w-sm rounded-2xl">
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
