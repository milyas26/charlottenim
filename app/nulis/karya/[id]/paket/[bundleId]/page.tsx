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
import { useAdminWorkChapters } from "@/lib/api/works"
import { useAdminBundleDetail, useUpdateBundle, useDeleteBundle, useAdminBundlesByWork, checkBundleSlug } from "@/lib/api/bundles"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Save, Loader2, Trash2, X, PlusCircle, Check, AlertCircle, BookLock, PackageX } from "lucide-react"
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
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4" />
          Hapus paket
        </Button>
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
          Simpan perubahan
        </Button>
      </>
    )
    return () => setActions(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActions, title, slug, slugValid, slugCheck, price, selectedChapters, updateMutation.isPending, id, bundleId, bundle])

  if (isLoading) {
    return <PageLoader />
  }

  if (!bundle) {
    return <EmptyState icon={PackageX} tone="neutral" title="Paket tidak ditemukan" />
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
    <div className="space-y-5 px-6 pb-10">
      <AdminPageTitle title="Edit paket" description={`Karya: ${bundle.workTitle}`} backHref={`/nulis/karya/${id}`} />

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
            <InfoRow label="Dibuat">
              <span className="tabular-nums">{new Date(bundle.createdAt).toLocaleDateString("id-ID")}</span>
            </InfoRow>
          </div>
        </Panel>

        <Panel
          title="Chapter dalam paket"
          description={`${selectedChapters.length} chapter`}
          className="lg:col-span-2"
        >
          {selectedChapterDetails.length === 0 ? (
            <EmptyState
              icon={BookLock}
              title="Belum ada chapter"
              description="Belum ada chapter di paket ini."
            />
          ) : (
            <div className="space-y-1.5">
              {selectedChapterDetails.map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center gap-3 pl-4 pr-2 py-2.5 rounded-[16px] bg-secondary"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Bab {ch.chapterNumber}: {ch.title}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">Rp {ch.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0 ml-auto mr-2">
                    {chapterBundleMap[ch.id]?.map((bundleTitle) => (
                      <StatusPill key={bundleTitle} tone="neutral" className="text-[11px]">
                        {bundleTitle}
                      </StatusPill>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:bg-card hover:text-destructive shrink-0"
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
              className="w-full border border-dashed border-border bg-transparent hover:bg-secondary"
              onClick={openAddDialog}
              disabled={premiumChaptersNotInBundle.length === 0}
            >
              <PlusCircle className="size-4" />
              Tambah chapter
            </Button>
            {premiumChaptersNotInBundle.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                Semua chapter premium sudah masuk paket ini.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <AlertDialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi perubahan</AlertDialogTitle>
            <AlertDialogDescription>
              Simpan perubahan pada paket &ldquo;{title}&rdquo; dengan harga{" "}
              <span className="font-semibold">{formattedPrice}</span> berisi{" "}
              <span className="font-semibold">{selectedChapters.length} chapter</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doSave}>
              Ya, simpan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus chapter dari paket</AlertDialogTitle>
            <AlertDialogDescription>
              Keluarkan &ldquo;{removeTarget?.title}&rdquo; dari paket ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doRemoveChapter} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addChapterOpen} onOpenChange={setAddChapterOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col overflow-hidden p-0 rounded-[24px]">
          <div className="px-6 pt-6 pb-2 shrink-0">
            <DialogHeader>
              <DialogTitle>Tambah chapter ke paket</DialogTitle>
              <DialogDescription>
                {premiumChaptersNotInBundle.length} chapter premium belum masuk paket ini.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="overflow-y-auto px-6 py-2 flex-1">
            {premiumChaptersNotInBundle.length === 0 ? (
              <EmptyState
                icon={BookLock}
                title="Semua sudah masuk"
                description="Semua chapter premium sudah masuk paket ini."
              />
            ) : (
              <div className="space-y-1.5">
                {premiumChaptersNotInBundle.map((ch) => (
                  <label
                    key={ch.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-[16px] cursor-pointer transition-colors",
                      pendingAdd.includes(ch.id) ? "bg-primary/[0.08] ring-1 ring-primary/30" : "hover:bg-secondary"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={pendingAdd.includes(ch.id)}
                      onChange={() => togglePendingAdd(ch.id)}
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
          </div>
          <div className="px-6 pb-6 pt-3 shrink-0 border-t border-border">
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="secondary" onClick={() => setAddChapterOpen(false)}>
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
            <AlertDialogTitle>Hapus paket</AlertDialogTitle>
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
