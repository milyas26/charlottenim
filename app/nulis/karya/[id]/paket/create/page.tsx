"use client"

import { AdminPageTitle } from "@/components/admin/AdminPageTitle"
import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import { EmptyState, InfoRow, PageLoader, Panel } from "@/components/admin/ui"
import { StatusPill, tones } from "@/components/admin/tint"
import { cn } from "@/lib/utils"
import { useAdminWork, useAdminWorkChapters } from "@/lib/api/works"
import { useCreateBundle, useAdminBundlesByWork, checkBundleSlug } from "@/lib/api/bundles"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Save, Loader2, X, Check, AlertCircle, BookLock } from "lucide-react"
import { toast } from "sonner"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function CreateBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { setActions } = useAdminHeaderActions()

  const { data: work, isLoading: workLoading } = useAdminWork(id)
  const { data: chapters = [], isLoading: chaptersLoading } = useAdminWorkChapters(id)
  const { data: existingBundles = [] } = useAdminBundlesByWork(id)
  const createMutation = useCreateBundle()

  const chapterBundleMap: Record<string, string[]> = {}
  for (const b of existingBundles) {
    for (const bc of b.chapters) {
      if (!chapterBundleMap[bc.id]) chapterBundleMap[bc.id] = []
      chapterBundleMap[bc.id].push(b.title)
    }
  }

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)

  const debouncedSlug = useDebounce(slug, 400)

  const { data: slugCheck, isFetching: slugChecking } = useQuery({
    queryKey: ["check-bundle-slug", id, debouncedSlug],
    queryFn: () => checkBundleSlug(id, debouncedSlug),
    enabled: debouncedSlug.length > 0,
  })

  const isSlugAvailable = slugCheck?.available ?? true
  const slugValid = slug.length === 0 || (slug.length > 0 && isSlugAvailable)

  const handleSave = () => {
    setConfirmOpen(false)
    createMutation.mutate(
      {
        workId: id,
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        price: parseInt(price, 10),
        chapterIds: selectedChapters,
      },
      {
        onSuccess: (bundle) => {
          toast.success("Paket berhasil dibuat")
          router.push(`/nulis/karya/${id}/paket/${bundle.id}`)
        },
        onError: (err) => {
          alert(
            (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
              err?.message ||
              "Gagal membuat paket"
          )
        },
      }
    )
  }

  useEffect(() => {
    setActions(
      <>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/nulis/karya/${id}`}>
            <X className="size-4" />
            Batal
          </Link>
        </Button>
        <Button
          size="sm"
          disabled={!title || !slug || !slugValid || !slugCheck || !price || selectedChapters.length === 0 || createMutation.isPending}
          onClick={() => setConfirmOpen(true)}
        >
          {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan paket
        </Button>
      </>
    )
    return () => setActions(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActions, title, slug, slugValid, slugCheck, price, selectedChapters, createMutation.isPending, id])

  const toggleChapter = (chapterId: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterId) ? prev.filter((c) => c !== chapterId) : [...prev, chapterId]
    )
  }

  if (workLoading || chaptersLoading) {
    return <PageLoader />
  }

  if (!work) {
    return <EmptyState icon={BookLock} tone="neutral" title="Karya tidak ditemukan" />
  }

  const totalChapterPrice = chapters
    .filter((ch) => selectedChapters.includes(ch.id))
    .reduce((sum, ch) => sum + (ch.isPremium ? ch.price : 0), 0)

  const premiumChapters = chapters.filter((ch) => ch.isPremium)

  const formattedPrice = price
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(parseInt(price, 10))
    : "-"

  return (
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle title="Buat paket" description={`Karya: ${work.title}`} backHref={`/nulis/karya/${id}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Info paket" className="lg:col-span-1" bodyClassName="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bundle-title">Judul paket</Label>
            <Input
              id="bundle-title"
              placeholder="Masukkan judul paket..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slugEdited) {
                  setSlug(slugify(e.target.value))
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bundle-slug">Slug</Label>
            <div className="relative">
              <Input
                id="bundle-slug"
                placeholder="slug-paket"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value))
                  setSlugEdited(true)
                }}
              />
              {slug.length > 0 && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {slugChecking ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : isSlugAvailable ? (
                    <Check className="size-4" style={{ color: tones.green }} />
                  ) : (
                    <AlertCircle className="size-4" style={{ color: tones.rose }} />
                  )}
                </div>
              )}
            </div>
            {slug.length > 0 && !slugChecking && !isSlugAvailable && (
              <p className="text-xs font-medium" style={{ color: tones.rose }}>Slug sudah digunakan</p>
            )}
            {slug.length > 0 && !slugChecking && isSlugAvailable && (
              <p className="text-xs font-medium" style={{ color: tones.green }}>Slug tersedia</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bundle-desc">Deskripsi (opsional)</Label>
            <Textarea
              id="bundle-desc"
              placeholder="Deskripsi singkat paket..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bundle-price">Harga paket (IDR)</Label>
            <Input
              id="bundle-price"
              type="number"
              min={1000}
              step={500}
              placeholder="Min Rp 1.000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {price && parseInt(price, 10) < 1000 && (
              <p className="text-xs font-medium" style={{ color: tones.rose }}>Harga minimal Rp 1.000</p>
            )}
          </div>

          <div className="rounded-[18px] bg-secondary px-4 py-1 divide-y divide-border">
            <InfoRow label="Chapter dipilih">
              <span className="tabular-nums">{selectedChapters.length}</span>
            </InfoRow>
            <InfoRow label="Total harga chapter">
              <span className="tabular-nums">Rp {totalChapterPrice.toLocaleString("id-ID")}</span>
            </InfoRow>
          </div>
        </Panel>

        <Panel
          title="Pilih chapter"
          description={`${premiumChapters.length} chapter premium tersedia. Centang untuk memasukkan ke paket.`}
          className="lg:col-span-2"
        >
          {premiumChapters.length === 0 ? (
            <EmptyState
              icon={BookLock}
              title="Belum ada chapter premium"
              description="Buat chapter premium terlebih dahulu."
            />
          ) : (
            <div className="space-y-1.5">
              {premiumChapters.map((ch) => (
                <label
                  key={ch.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-[16px] cursor-pointer transition-colors",
                    selectedChapters.includes(ch.id) ? "bg-primary/[0.08] ring-1 ring-primary/30" : "hover:bg-secondary"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedChapters.includes(ch.id)}
                    onChange={() => toggleChapter(ch.id)}
                    className="size-4 shrink-0 accent-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Bab {ch.chapterNumber}: {ch.title}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">Rp {ch.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0 ml-auto">
                    {chapterBundleMap[ch.id]?.map((bundleTitle) => (
                      <StatusPill key={bundleTitle} tone="neutral" className="text-[11px]">
                        {bundleTitle}
                      </StatusPill>
                    ))}
                  </div>
                </label>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi pembuatan paket</AlertDialogTitle>
            <AlertDialogDescription>
              Buat paket &ldquo;{title}&rdquo; dengan harga{" "}
              <span className="font-semibold">{formattedPrice}</span> berisi{" "}
              <span className="font-semibold">{selectedChapters.length} chapter</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              Ya, buat paket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
