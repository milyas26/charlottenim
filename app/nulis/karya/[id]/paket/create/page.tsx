"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import { useAdminWork, useAdminWorkChapters } from "@/lib/api/works"
import { useCreateBundle, useAdminBundlesByWork, checkBundleSlug } from "@/lib/api/bundles"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ArrowLeft, Save, Loader2, X, Check, AlertCircle } from "lucide-react"
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
          Simpan Paket
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
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!work) {
    return <div className="p-4 text-center text-muted-foreground">Karya tidak ditemukan.</div>
  }

  const totalChapterPrice = chapters
    .filter((ch) => selectedChapters.includes(ch.id))
    .reduce((sum, ch) => sum + (ch.isPremium ? ch.price : 0), 0)

  const premiumChapters = chapters.filter((ch) => ch.isPremium)

  const formattedPrice = price
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(parseInt(price, 10))
    : "-"

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/nulis/karya/${id}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Buat Paket</h1>
          <p className="text-sm text-muted-foreground">Karya: {work.title}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Info Paket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bundle-title">Judul Paket</Label>
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
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {slugChecking ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : isSlugAvailable ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <AlertCircle className="size-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {slug.length > 0 && !slugChecking && !isSlugAvailable && (
                <p className="text-xs text-destructive">Slug sudah digunakan</p>
              )}
              {slug.length > 0 && !slugChecking && isSlugAvailable && (
                <p className="text-xs text-green-600">Slug tersedia</p>
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
              <Label htmlFor="bundle-price">Harga Paket (IDR)</Label>
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
                <p className="text-xs text-destructive">Harga minimal Rp 1.000</p>
              )}
            </div>

            <div className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chapter dipilih</span>
                <span className="font-medium">{selectedChapters.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total harga chapter</span>
                <span className="font-medium">Rp {totalChapterPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pilih Chapter</CardTitle>
            <CardDescription>
              {premiumChapters.length} chapter premium tersedia. Centang untuk memasukkan ke paket.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {premiumChapters.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                Tidak ada chapter premium. Buat chapter premium terlebih dahulu.
              </p>
            ) : (
              <div className="space-y-2">
                {premiumChapters.map((ch) => (
                  <label
                    key={ch.id}
                    className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedChapters.includes(ch.id)
                        ? "border-primary bg-primary/5"
                        : "border-input hover:bg-accent/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedChapters.includes(ch.id)}
                      onChange={() => toggleChapter(ch.id)}
                      className="size-4 rounded border-input accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        Bab {ch.chapterNumber}: {ch.title}
                      </p>
                      <p className="text-xs text-muted-foreground">Rp {ch.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 shrink-0 ml-auto">
                      {chapterBundleMap[ch.id]?.map((bundleTitle) => (
                        <span
                          key={bundleTitle}
                          className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/30"
                        >
                          {bundleTitle}
                        </span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembuatan Paket</AlertDialogTitle>
            <AlertDialogDescription>
              Buat paket &ldquo;{title}&rdquo; dengan harga{" "}
              <span className="font-semibold">{formattedPrice}</span> berisi{" "}
              <span className="font-semibold">{selectedChapters.length} chapter</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              Ya, Buat Paket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
