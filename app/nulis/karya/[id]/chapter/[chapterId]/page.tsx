"use client"

import { use, useState, useCallback, useEffect, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ChapterStatus } from "@/data/types"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ChapterEditor from "@/components/admin/ChapterEditor"
import { toast } from "sonner"
import { Save, GripVertical, Plus, FileX, Lock, LockOpen, ChevronRight, ChevronLeft, X, List, SlidersHorizontal, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Loader2 } from "lucide-react"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import { EmptyState, InfoRow, PageLoader, Panel } from "@/components/admin/ui"
import { StatusPill, tones } from "@/components/admin/tint"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  useAdminChapter,
  useAdminChapterList,
  createChapter,
  updateChapter,
  reorderChapters,
  chaptersKeys,
  type ChapterListItem,
} from "@/lib/api/chapters"
import { useAdminWork, worksKeys } from "@/lib/api/works"

type WorkDetail = {
  id: string
  title: string
  slug: string
  synopsis: string
  coverUrl: string
  genres: string[]
  status: string
  totalChapters: number
  deletedAt: string | null
}

type DraftFields = {
  title?: string
  content?: string
  isPremium?: boolean
  price?: string
  status?: ChapterStatus
}

export default function AdminChapterEditorPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>
}) {
  const { id, chapterId } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const isNew = chapterId === "create"

  const [draft, setDraft] = useState<DraftFields>({})

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null)
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false)
  const [pendingReorder, setPendingReorder] = useState<{
    from: number
    to: number
    result: ChapterListItem[]
  } | null>(null)

  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

  const { setActions } = useAdminHeaderActions()

  const { data: work } = useAdminWork(id)

  const { data: chapters = [] } = useAdminChapterList(id)

  const { data: chapterData, isLoading: chapterLoading, isError: chapterError } = useAdminChapter(id, isNew ? "" : chapterId)

  const prevChapterIdRef = useRef(chapterId)
  useEffect(() => {
    if (prevChapterIdRef.current !== chapterId) {
      prevChapterIdRef.current = chapterId
      setDraft({})
    }
  }, [chapterId])

  const existingChapter = !isNew && chapterData ? (chapterData as unknown as ChapterListItem) : null
  const title = draft.title ?? chapterData?.title ?? ""
  const content = draft.content ?? chapterData?.content ?? ""
  const isPremium = draft.isPremium ?? chapterData?.isPremium ?? false
  const price = draft.price ?? String(chapterData?.price ?? "5000")
  const status = draft.status ?? chapterData?.status ?? "PUBLISHED"

  const chapterSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  const chapterNumber = existingChapter?.chapterNumber ?? (work?.totalChapters ?? 0) + 1

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!work || !title || !content) throw new Error("Missing data")

      if (isNew) {
        const created = await createChapter(id, {
          chapterNumber: chapters.length + 1,
          chapterSlug: chapterSlug || `chapter-${chapters.length + 1}`,
          title: title.trim(),
          content,
          isPremium,
          price: parseInt(price) || 0,
          status,
        })
        return { created, isNew: true as const }
      } else {
        const updated = await updateChapter(id, chapterId, {
          slug: chapterSlug || undefined,
          title: title.trim(),
          content,
          isPremium,
          price: parseInt(price) || 0,
          status,
        })
        return { updated, isNew: false as const }
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: worksKeys.chapters(id) })
      queryClient.invalidateQueries({ queryKey: worksKeys.all })
      queryClient.invalidateQueries({ queryKey: chaptersKeys.adminDetail(id, chapterId) })
      toast.success(result.isNew ? "Chapter berhasil dibuat" : "Chapter berhasil disimpan")
      if (result.isNew) {
        router.replace(`/nulis/karya/${id}/chapter/${result.created.id}`)
      } else {
        router.replace(`/nulis/karya/${id}/chapter/${result.updated.id}`)
      }
    },
    onError: (err: Error) => {
      alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || err?.message || "Gagal menyimpan")
    },
  })

  const reorderMutation = useMutation({
    mutationFn: async (chapterIds: string[]) => {
      await reorderChapters(id, chapterIds)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works", id, "chapters"] })
      setPendingReorder(null)
      setReorderDialogOpen(false)
      setDragIndex(null)
      setDragOverIndex(null)
      setDragFromIndex(null)
    },
    onError: (err: Error) => {
      alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || err?.message || "Gagal mengurutkan chapter")
    },
  })

  useEffect(() => {
    if (!work) return

    setActions(
      <>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/nulis/karya/${work.id}`}>
            <X className="size-4" />
            Batal
          </Link>
        </Button>
        <Button size="sm" disabled={!title || !content || saveMutation.isPending} onClick={() => saveMutation.mutate()}>
          {saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan
        </Button>
      </>
    )
    return () => setActions(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActions, work, title, content, saveMutation.isPending])

  const handleDragStart = useCallback((index: number) => {
    setDragFromIndex(index)
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragFromIndex !== index) {
      setDragOverIndex(index)
    }
  }, [dragFromIndex])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragFromIndex === null || dragFromIndex === index) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    const reordered = [...chapters]
    const [moved] = reordered.splice(dragFromIndex, 1)
    reordered.splice(index, 0, moved)
    const updated = reordered.map((ch, i) => ({ ...ch, chapterNumber: i + 1 }))
    setPendingReorder({ from: dragFromIndex, to: index, result: updated })
    setReorderDialogOpen(true)
    setDragIndex(null)
    setDragOverIndex(null)
  }, [chapters, dragFromIndex])

  const handleConfirmReorder = useCallback(() => {
    if (!pendingReorder || !work) return
    const chapterIds = pendingReorder.result.map((ch) => ch.id)
    reorderMutation.mutate(chapterIds)
  }, [pendingReorder, work, reorderMutation])

  const handleCancelReorder = useCallback(() => {
    setPendingReorder(null)
    setReorderDialogOpen(false)
    setDragIndex(null)
    setDragOverIndex(null)
    setDragFromIndex(null)
  }, [])

  const isLoading = !work || (chapterLoading && !isNew)

  if (isLoading) {
    return <PageLoader className="h-[calc(100vh-4rem)] py-0" />
  }

  if (chapterError && !isNew) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <EmptyState
          icon={FileX}
          tone="rose"
          title="Chapter tidak ditemukan"
          description="Chapter ini mungkin sudah dihapus atau tautannya salah."
          action={
            <Button variant="secondary" asChild>
              <Link href={`/nulis/karya/${id}`}>Kembali</Link>
            </Button>
          }
        />
      </div>
    )
  }

  if (!work) {
    return null
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {!leftPanelOpen && (
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="shrink-0 w-10 bg-sidebar border-r border-border hover:bg-secondary flex items-start justify-center pt-4 transition-colors"
          title="Buka panel chapter"
        >
          <PanelLeftOpen className="size-4 text-muted-foreground" />
        </button>
      )}

      {leftPanelOpen && (
        <aside className="w-72 shrink-0 bg-sidebar border-r border-border flex flex-col">
          <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 shrink-0">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold tracking-[-0.02em]">Chapter</p>
              <p className="text-[12px] text-muted-foreground tabular-nums">{chapters.length} chapter</p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href={`/nulis/karya/${work.id}/chapter/create`}
                aria-label="Tambah chapter"
                title="Tambah chapter"
                className="size-8 rounded-full bg-card shadow-sm text-primary flex items-center justify-center transition hover:brightness-95"
              >
                <Plus className="size-4" />
              </Link>
              <button
                onClick={() => setLeftPanelOpen(false)}
                className="size-8 rounded-full text-muted-foreground flex items-center justify-center transition hover:bg-secondary hover:text-foreground"
                title="Tutup panel chapter"
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2.5 pb-3 space-y-0.5">
            {chapters.length === 0 && (
              <p className="text-[13px] text-muted-foreground text-center py-8">
                Belum ada chapter
              </p>
            )}
            {chapters.map((ch, index) => {
              const isActive = ch.id === chapterId
              return (
                <div
                  key={ch.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-[14px] px-2.5 py-2 text-[13px] transition-all cursor-pointer select-none",
                    dragIndex === index && "opacity-30",
                    dragOverIndex === index &&
                      dragIndex !== index &&
                      "before:absolute before:inset-x-2 before:-top-px before:h-0.5 before:rounded-full before:bg-primary",
                    isActive
                      ? "bg-card shadow-[var(--shadow-card)] text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  onClick={() => router.push(`/nulis/karya/${work.id}/chapter/${ch.id}`)}
                >
                  <span className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                    <GripVertical className="size-3.5" />
                  </span>
                  <span
                    className={cn(
                      "shrink-0 tabular-nums w-5 text-center text-[12px] font-semibold",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {ch.chapterNumber}
                  </span>
                  <span className="truncate flex-1">{ch.title || "(tanpa judul)"}</span>
                  {ch.isPremium ? (
                    <Lock className="size-3.5 shrink-0" style={{ color: tones.amber }} />
                  ) : (
                    <LockOpen className="size-3.5 shrink-0 text-muted-foreground/40" />
                  )}
                  <ChevronRight className="size-3.5 shrink-0 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )
            })}
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        <div className="shrink-0 px-8 pt-6 pb-2">
          <input
            id="title"
            placeholder="Judul chapter..."
            value={title}
            onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-transparent border-0 outline-none p-0 text-2xl font-semibold tracking-[-0.02em] text-foreground placeholder:text-muted-foreground/50"
          />
          <p className="mt-1 text-[12px] text-muted-foreground tabular-nums">Chapter #{chapterNumber}</p>
        </div>

        <div className="flex-1 min-h-0 px-6 pb-6 pt-3">
          <ChapterEditor
            content={content}
            onChange={(c) => setDraft(prev => ({ ...prev, content: c }))}
            placeholder="Mulai menulis..."
            workId={work.id}
            chapterId={isNew ? undefined : chapterId}
          />
        </div>
      </div>

      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="shrink-0 w-10 bg-sidebar border-l border-border hover:bg-secondary flex items-start justify-center pt-4 transition-colors"
          title="Buka panel pengaturan"
        >
          <PanelRightOpen className="size-4 text-muted-foreground" />
        </button>
      )}

      {rightPanelOpen && (
        <aside className="w-80 shrink-0 bg-sidebar border-l border-border flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
            <p className="text-[15px] font-semibold tracking-[-0.02em]">Pengaturan</p>
            <button
              onClick={() => setRightPanelOpen(false)}
              className="size-8 rounded-full text-muted-foreground flex items-center justify-center transition hover:bg-secondary hover:text-foreground"
              title="Tutup panel pengaturan"
            >
              <PanelRightClose className="size-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3 px-3 pb-4">
            <Panel title="Publikasi" className="rounded-[20px]" bodyClassName="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground">Status</Label>
                <Select value={status} onValueChange={(v) => setDraft(prev => ({ ...prev, status: v as ChapterStatus }))}>
                  <SelectTrigger className="h-9 w-full rounded-full text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      <StatusPill tone="neutral">Draft</StatusPill>
                    </SelectItem>
                    <SelectItem value="PUBLISHED">
                      <StatusPill tone="green">Published</StatusPill>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <Label className="text-[13px] text-muted-foreground">Akses</Label>
                <label
                  htmlFor="isPremiumPanel"
                  className="flex items-center gap-2.5 rounded-[14px] bg-secondary px-3 py-2.5 cursor-pointer"
                >
                  <Checkbox
                    id="isPremiumPanel"
                    checked={isPremium}
                    onCheckedChange={(checked) => setDraft(prev => ({ ...prev, isPremium: checked === true }))}
                  />
                  <span className="text-[13px] font-medium flex-1">Premium</span>
                  {isPremium && <Lock className="size-3.5" style={{ color: tones.amber }} />}
                </label>
                {isPremium && (
                  <div className="space-y-1.5">
                    <Label htmlFor="pricePanel" className="text-[12px] text-muted-foreground">
                      Harga (Rp)
                    </Label>
                    <Input
                      id="pricePanel"
                      type="number"
                      value={price}
                      onChange={(e) => setDraft(prev => ({ ...prev, price: e.target.value }))}
                      className="h-9 rounded-full text-sm tabular-nums"
                      min={1000}
                      step={500}
                    />
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="Info" className="rounded-[20px]" bodyClassName="pt-1">
              <div className="divide-y divide-border">
                <InfoRow label="Chapter">
                  <span className="tabular-nums">#{chapterNumber}</span>
                </InfoRow>
                {existingChapter && (
                  <InfoRow label="Dibaca">
                    <span className="tabular-nums">{existingChapter.readCount.toLocaleString("id-ID")}x</span>
                  </InfoRow>
                )}
              </div>
              {title && (
                <div className="mt-2 rounded-[14px] bg-secondary px-3 py-2">
                  <p className="text-[12px] text-muted-foreground">Slug</p>
                  <code className="block text-[12px] mt-0.5 text-primary break-all">/{chapterSlug}</code>
                </div>
              )}
            </Panel>

            <Panel title="Preview" className="rounded-[20px]">
              <div className="w-full rounded-[18px] border border-border bg-background overflow-hidden">
                <div className="bg-secondary px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground truncate max-w-[160px]">
                    {work.title}
                  </span>
                </div>
                <div className="h-[420px] overflow-y-auto">
                  {title ? (
                    <div className="p-3">
                      <h3 className="text-[12px] font-semibold leading-tight mb-2">{title}</h3>
                      <div
                        className="text-[10px] leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: content || "<p class='text-muted-foreground/50 italic'>Mulai menulis...</p>" }}
                      />
                    </div>
                  ) : (
                    <div className="p-3 text-[11px] text-muted-foreground/60 italic text-center py-16">
                      Tulis judul & konten...
                    </div>
                  )}
                </div>
                <div className="bg-secondary px-2 py-1.5 flex items-center justify-between text-muted-foreground/60">
                  <div className="flex items-center gap-1">
                    <ChevronLeft className="size-3.5" />
                    <span className="text-[9px] font-medium">Prev</span>
                  </div>
                  <List className="size-3" />
                  <SlidersHorizontal className="size-3" />
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-medium">Next</span>
                    <ChevronRight className="size-3.5" />
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </aside>
      )}

      <Dialog open={reorderDialogOpen} onOpenChange={setReorderDialogOpen}>
        <DialogContent className="max-w-sm rounded-[24px]">
          <DialogHeader>
            <DialogTitle>Sortir chapter?</DialogTitle>
            <DialogDescription>
              Urutan chapter akan diubah. Lanjutkan?
            </DialogDescription>
          </DialogHeader>
          {pendingReorder && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                Pindah <strong className="text-foreground">#{pendingReorder.from + 1}</strong> ke posisi{" "}
                <strong className="text-foreground">#{pendingReorder.to + 1}</strong>
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {pendingReorder.result.slice(0, 6).map((ch) => (
                  <span key={ch.id} className="px-2 py-0.5 rounded-full bg-secondary text-[11px] text-foreground">
                    {ch.chapterNumber}. {ch.title.slice(0, 12)}{ch.title.length > 12 ? "…" : ""}
                  </span>
                ))}
                {pendingReorder.result.length > 6 && (
                  <span className="text-[11px] text-muted-foreground">
                    +{pendingReorder.result.length - 6} lainnya
                  </span>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={handleCancelReorder}>
              Batal
            </Button>
            <Button size="sm" onClick={handleConfirmReorder} disabled={reorderMutation.isPending}>
              {reorderMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Ya, sortir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
