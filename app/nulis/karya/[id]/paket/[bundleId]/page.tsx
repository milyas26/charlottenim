"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import { useAdminWorkChapters } from "@/lib/api/works"
import { useAdminBundleDetail, useUpdateBundle, useDeleteBundle, useAdminBundlesByWork, checkBundleSlug } from "@/lib/api/bundles"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { ArrowLeft, Save, Loader2, Trash2, X, PlusCircle, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function EditBundlePage({
  params,
}: {
  params: Promise<{ id: string; bundleId: string }>
}) {
  const { id, bundleId } = use(params)
  const router = useRouter()
  const { setActions } = useAdminHeaderActions()

  const { data: bundle, isLoading } = useAdminBundleDetail(id, bundleId)
  const { data: chapters = [] } = useAdminWorkChapters(id)
  const { data: existingBundles = [] } = useAdminBundlesByWork(id)
  const updateMutation = useUpdateBundle()
  const deleteMutation = useDeleteBundle()

  const chapterBundleMap: Record<string, string[]> = {}
  for (const b of existingBundles) {
    if (b.id === bundleId) continue
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
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<{ id: string; title: string } | null>(null)
  const [addChapterOpen, setAddChapterOpen] = useState(false)
  const [pendingAdd, setPendingAdd] = useState<string[]>([])

  useEffect(() => {
    if (bundle) {
      setTitle(bundle.title)
      setSlug(bundle.slug)
      setSlugEdited(false)
      setDescription(bundle.description)
      setPrice(String(bundle.price))
      setSelectedChapters(bundle.chapters.map((c) => c.id))
    }
  }, [bundle])

  const debouncedSlug = useDebounce(slug, 400)

  const { data: slugCheck, isFetching: slugChecking } = useQuery({
    queryKey: ["check-bundle-slug", id, debouncedSlug, bundleId],
    queryFn: () => checkBundleSlug(id, debouncedSlug, bundleId),
    enabled: debouncedSlug.length > 0,
  })

  const isSlugAvailable = slugCheck?.available ?? true
  const slugValid = slug.length === 0 || (slug.length > 0 && isSlugAvailable)

  const doSave = () => {
    if (!bundle) return
    setSaveConfirmOpen(false)

    updateMutation.mutate(
      {
        workId: id,
        bundleId,
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        price: parseInt(price, 10),
        chapterIds: selectedChapters,
      },
      {
        onSuccess: () => {
          toast.success("Paket berhasil disimpan")
        },
        onError: (err) => {
          alert(
            (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
              err?.message ||
              "Gagal mengupdate paket"
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
          disabled={!title || !slug || !slugValid || !slugCheck || !price || selectedChapters.length === 0 || updateMutation.isPending}
          onClick={() => setSaveConfirmOpen(true)}
        >
          {updateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan Perubahan
        </Button>
      </>
    )
    return () => setActions(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActions, title, slug, slugValid, slugCheck, price, selectedChapters, updateMutation.isPending, id, bundleId, bundle])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!bundle) {
    return <div className="p-4 text-center text-muted-foreground">Paket tidak ditemukan.</div>
  }

  const selectedChapterDetails = chapters.filter((ch) => selectedChapters.includes(ch.id))

  const totalChapterPrice = selectedChapterDetails
    .reduce((sum, ch) => sum + (ch.isPremium ? ch.price : 0), 0)

  const premiumChaptersNotInBundle = chapters.filter(
    (ch) => ch.isPremium && !selectedChapters.includes(ch.id)
  )

  const doRemoveChapter = () => {
    if (!removeTarget) return
    setSelectedChapters((prev) => prev.filter((c) => c !== removeTarget.id))
    setRemoveTarget(null)
  }

  const openAddDialog = () => {
    setPendingAdd([])
    setAddChapterOpen(true)
  }

  const togglePendingAdd = (chapterId: string) => {
    setPendingAdd((prev) =>
      prev.includes(chapterId) ? prev.filter((c) => c !== chapterId) : [...prev, chapterId]
    )
  }

  const confirmAddChapters = () => {
    setSelectedChapters((prev) => [...prev, ...pendingAdd])
    setAddChapterOpen(false)
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Edit Paket</h1>
          <p className="text-sm text-muted-foreground">Karya: {bundle.workTitle}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4" />
          Hapus Paket
        </Button>
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dibuat</span>
                <span className="font-medium">
                  {new Date(bundle.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Chapter dalam Paket</CardTitle>
              <CardDescription>
                {selectedChapters.length} chapter
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {selectedChapterDetails.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                Belum ada chapter di paket ini.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedChapterDetails.map((ch) => (
                  <div
                    key={ch.id}
                    className="flex items-center gap-3 p-3 rounded-md border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        Bab {ch.chapterNumber}: {ch.title}
                      </p>
                      <p className="text-xs text-muted-foreground">Rp {ch.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 shrink-0 ml-auto mr-2">
                      {chapterBundleMap[ch.id]?.map((bundleTitle) => (
                        <span
                          key={bundleTitle}
                          className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/30"
                        >
                          {bundleTitle}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => setRemoveTarget({ id: ch.id, title: ch.title })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={openAddDialog}
                disabled={premiumChaptersNotInBundle.length === 0}
              >
                <PlusCircle className="size-4" />
                Tambah Chapter
              </Button>
              {premiumChaptersNotInBundle.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Semua chapter premium sudah masuk paket ini.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Perubahan</AlertDialogTitle>
            <AlertDialogDescription>
              Simpan perubahan pada paket &ldquo;{title}&rdquo; dengan harga{" "}
              <span className="font-semibold">{formattedPrice}</span> berisi{" "}
              <span className="font-semibold">{selectedChapters.length} chapter</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doSave}>
              Ya, Simpan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Chapter dari Paket</AlertDialogTitle>
            <AlertDialogDescription>
              Keluarkan &ldquo;{removeTarget?.title}&rdquo; dari paket ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doRemoveChapter} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addChapterOpen} onOpenChange={setAddChapterOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col overflow-hidden p-0">
          <div className="px-6 pt-6 pb-2 shrink-0">
            <DialogHeader>
              <DialogTitle>Tambah Chapter ke Paket</DialogTitle>
              <DialogDescription>
                {premiumChaptersNotInBundle.length} chapter premium belum masuk paket ini.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="overflow-y-auto px-6 py-2 flex-1">
            {premiumChaptersNotInBundle.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground text-sm">
                Semua chapter premium sudah masuk paket ini.
              </p>
            ) : (
              <div className="space-y-2">
                {premiumChaptersNotInBundle.map((ch) => (
                  <label
                    key={ch.id}
                    className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      pendingAdd.includes(ch.id)
                        ? "border-primary bg-primary/5"
                        : "border-input hover:bg-accent/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={pendingAdd.includes(ch.id)}
                      onChange={() => togglePendingAdd(ch.id)}
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
          </div>
          <div className="px-6 pb-6 pt-2 shrink-0 border-t">
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => setAddChapterOpen(false)}>
                Batal
              </Button>
              <Button onClick={confirmAddChapters} disabled={pendingAdd.length === 0}>
                Tambah {pendingAdd.length > 0 && `(${pendingAdd.length})`}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Paket</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus paket &ldquo;{title}&rdquo;? Chapter yang ada di paket ini tidak akan terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate(
                  { workId: id, bundleId },
                  {
                    onSuccess: () => {
                      toast.success("Paket berhasil dihapus")
                      router.push(`/nulis/karya/${id}`)
                    },
                    onError: () => setDeleteOpen(false),
                  }
                )
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
