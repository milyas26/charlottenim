"use client"

import { use, useState, useCallback, useEffect } from "react"
import type { Chapter, ChapterStatus } from "@/data/types"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
import { Save, GripVertical, PlusCircle, Lock, LockOpen, ChevronRight, ChevronLeft, X, List, SlidersHorizontal, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Loader2 } from "lucide-react"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import Link from "next/link"

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

type ChapterListItem = {
  id: string
  workId: string
  workSlug: string
  chapterNumber: number
  slug: string
  title: string
  isPremium: boolean
  price: number
  readCount: number
  status: ChapterStatus
  deletedAt?: string | null
}

export default function AdminChapterEditorPage({
  params,
}: {
  params: Promise<{ slug: string; chapterId: string }>
}) {
  const { slug, chapterId } = use(params)
  const router = useRouter()
  const isNew = chapterId === "create"

  const [work, setWork] = useState<WorkDetail | null>(null)
  const [chapters, setChapters] = useState<ChapterListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [chapterNotFound, setChapterNotFound] = useState(false)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [price, setPrice] = useState("5000")
  const [status, setStatus] = useState<ChapterStatus>("PUBLISHED")
  const [existingChapter, setExistingChapter] = useState<ChapterListItem | null>(null)

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

  const fetchWorkAndChapters = useCallback(async () => {
    try {
      const [workRes, chaptersRes] = await Promise.all([
        fetch(`/api/admin/works/${slug}`),
        fetch(`/api/admin/works/${slug}/chapters`),
      ])
      if (!workRes.ok) throw new Error("Karya tidak ditemukan")
      setWork(await workRes.json())
      if (chaptersRes.ok) {
        const data = await chaptersRes.json()
        setChapters(data.sort((a: ChapterListItem, b: ChapterListItem) => a.chapterNumber - b.chapterNumber))
      }
    } catch {
      router.push("/admin/karya")
    }
  }, [slug, router])

  const fetchChapter = useCallback(async () => {
    if (isNew) return
    try {
      const res = await fetch(`/api/admin/works/${slug}/chapters/${chapterId}`)
      if (!res.ok) {
        setChapterNotFound(true)
        return
      }
      const chapter: Chapter = await res.json()
      setExistingChapter(chapter)
      setTitle(chapter.title)
      setContent(chapter.content)
      setIsPremium(chapter.isPremium)
      setPrice(String(chapter.price))
      setStatus(chapter.status)
    } catch {
      setChapterNotFound(true)
    }
  }, [slug, chapterId, isNew])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchWorkAndChapters(), fetchChapter()]).finally(() => setLoading(false))
  }, [fetchWorkAndChapters, fetchChapter])

  useEffect(() => {
    if (!work) return

    setActions(
      <>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/karya/${work.slug}`}>
            <X className="size-4" />
            Batal
          </Link>
        </Button>
        <Button size="sm" disabled={!title || !content || saving} onClick={handleSave}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan
        </Button>
      </>
    )
    return () => setActions(null)
  }, [setActions, work, title, content, saving])

  const chapterSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  const chapterNumber = existingChapter?.chapterNumber ?? (work?.totalChapters ?? 0) + 1

  const handleSave = useCallback(async () => {
    if (!work || !title || !content) return
    setSaving(true)

    try {
      if (isNew) {
        const res = await fetch(`/api/admin/works/${slug}/chapters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapterNumber: chapters.length + 1,
            chapterSlug: chapterSlug || `chapter-${chapters.length + 1}`,
            title: title.trim(),
            content,
            isPremium,
            price: parseInt(price) || 0,
            status,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Gagal membuat chapter")
        }
        const created = await res.json()
        router.replace(`/admin/karya/${slug}/chapter/${created.slug}`)
      } else {
        const res = await fetch(`/api/admin/works/${slug}/chapters/${chapterId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: chapterSlug || undefined,
            title: title.trim(),
            content,
            isPremium,
            price: parseInt(price) || 0,
            status,
          }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Gagal mengupdate chapter")
        }
        const updated = await res.json()
        setExistingChapter(updated)
        if (chapterSlug && chapterSlug !== chapterId) {
          router.replace(`/admin/karya/${slug}/chapter/${updated.slug}`)
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan")
    } finally {
      setSaving(false)
    }
  }, [work, slug, chapterId, isNew, title, content, isPremium, price, status, chapterSlug, chapters.length, router])

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

  const handleConfirmReorder = useCallback(async () => {
    if (!pendingReorder || !work) return
    const chapterIds = pendingReorder.result.map((ch) => ch.id)

    try {
      const res = await fetch(`/api/admin/works/${slug}/chapters/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterIds }),
      })
      if (!res.ok) throw new Error("Gagal mengurutkan")
      setChapters(pendingReorder.result)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengurutkan chapter")
    } finally {
      setPendingReorder(null)
      setReorderDialogOpen(false)
      setDragIndex(null)
      setDragOverIndex(null)
      setDragFromIndex(null)
    }
  }, [pendingReorder, work, slug])

  const handleCancelReorder = useCallback(() => {
    setPendingReorder(null)
    setReorderDialogOpen(false)
    setDragIndex(null)
    setDragOverIndex(null)
    setDragFromIndex(null)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (chapterNotFound && !isNew) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] gap-4 text-muted-foreground">
        <p>Chapter tidak ditemukan.</p>
        <Button variant="outline" asChild>
          <Link href={`/admin/karya/${slug}`}>Kembali</Link>
        </Button>
      </div>
    )
  }

  if (!work) {
    return null
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-0">
      {!leftPanelOpen && (
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="shrink-0 w-8 border-r bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-colors"
          title="Buka panel chapter"
        >
          <PanelLeftOpen className="size-4 text-muted-foreground" />
        </button>
      )}

      {leftPanelOpen && (
        <aside className="w-72 shrink-0 border-r bg-muted/30 flex flex-col relative">
          <button
            onClick={() => setLeftPanelOpen(false)}
            className="absolute -right-6 top-2 z-10 size-5 rounded-r-md border border-l-0 bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-colors"
            title="Tutup panel chapter"
          >
            <PanelLeftClose className="size-3 text-muted-foreground" />
          </button>

          <div className="flex items-center justify-between px-3 h-10 border-b shrink-0">
            <span className="text-xs font-medium text-muted-foreground">
              {chapters.length} Chapter
            </span>
            <Button variant="ghost" size="icon" className="size-6" asChild>
              <Link href={`/admin/karya/${work.slug}/chapter/create`}>
                <PlusCircle className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {chapters.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">
                Belum ada chapter
              </p>
            )}
            {chapters.map((ch, index) => {
              const isActive = ch.slug === chapterId || (isNew && false)
              return (
                <div
                  key={ch.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-all cursor-pointer select-none ${
                    dragIndex === index
                      ? "opacity-30"
                      : dragOverIndex === index && dragIndex !== index
                      ? "border-t border-primary"
                      : ""
                  } ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent/50"
                  }`}
                  onClick={() => router.push(`/admin/karya/${work.slug}/chapter/${ch.slug}`)}
                >
                  <span className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                    <GripVertical className="size-3" />
                  </span>
                  <span className="shrink-0 tabular-nums w-4 text-center">{ch.chapterNumber}</span>
                  <span className="truncate flex-1">{ch.title || "(tanpa judul)"}</span>
                  {ch.isPremium ? (
                    <Lock className="size-3 shrink-0 text-amber-500" />
                  ) : (
                    <LockOpen className="size-3 shrink-0 text-muted-foreground/50" />
                  )}
                  <ChevronRight className="size-3 shrink-0 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )
            })}
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="shrink-0 p-6 pb-0">
          <Input
            id="title"
            placeholder="Judul chapter..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-7 text-sm border-0 border-b border-input rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-bold"
          />
        </div>

        <div className="flex-1 min-h-0 p-6 pt-4">
          <ChapterEditor
            content={content}
            onChange={setContent}
            placeholder="Mulai menulis..."
          />
        </div>
      </div>

      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="shrink-0 w-8 border-l bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-colors"
          title="Buka panel pengaturan"
        >
          <PanelRightOpen className="size-4 text-muted-foreground" />
        </button>
      )}

      {rightPanelOpen && (
        <aside className="w-72 shrink-0 border-l border-border/50 flex flex-col p-4 gap-4 overflow-y-auto relative">
          <button
            onClick={() => setRightPanelOpen(false)}
            className="absolute -left-6 top-2 z-10 size-5 rounded-l-md border border-r-0 bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-colors"
            title="Tutup panel pengaturan"
          >
            <PanelRightClose className="size-3 text-muted-foreground" />
          </button>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ChapterStatus)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Draft</Badge>
                </SelectItem>
                <SelectItem value="PUBLISHED">
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">Published</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Akses</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPremiumPanel"
                checked={isPremium}
                onCheckedChange={(checked) => setIsPremium(checked === true)}
              />
              <Label htmlFor="isPremiumPanel" className="cursor-pointer text-xs">
                Premium
              </Label>
            </div>
            {isPremium && (
              <div>
                <Label htmlFor="pricePanel" className="text-[11px] text-muted-foreground">
                  Harga (Rp)
                </Label>
                <Input
                  id="pricePanel"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-7 text-sm mt-1"
                  min={1000}
                  step={500}
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Info</Label>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chapter</span>
                <span className="tabular-nums">#{chapterNumber}</span>
              </div>
              {title && (
                <div>
                  <span className="text-muted-foreground">Slug</span>
                  <code className="block text-[11px] mt-0.5 text-accent break-all">/{chapterSlug}</code>
                </div>
              )}
              {existingChapter && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dibaca</span>
                  <span className="tabular-nums">{existingChapter.readCount}x</span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Preview</Label>
            <div className="flex justify-center">
              <div className="w-full rounded-xl border-2 border-foreground/20 bg-background overflow-hidden shadow-lg">
                <div className="bg-foreground/10 px-3 py-1.5 flex items-center justify-between border-b border-foreground/5">
                  <span className="text-[9px] font-medium text-foreground/60 truncate max-w-[120px]">
                    {work.title}
                  </span>
                </div>
                <div className="h-[420px] overflow-y-auto">
                  {title ? (
                    <div className="p-3">
                      <h3 className="text-[11px] font-semibold leading-tight mb-2">{title}</h3>
                      <div
                        className="text-[10px] leading-relaxed text-muted-foreground prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: content || "<p class='text-muted-foreground/50 italic'>Mulai menulis...</p>" }}
                      />
                    </div>
                  ) : (
                    <div className="p-3 text-[10px] text-muted-foreground/50 italic text-center py-16">
                      Tulis judul & konten...
                    </div>
                  )}
                </div>
                <div className="bg-foreground/[0.03] border-t border-foreground/5 px-1.5 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground/40">
                    <ChevronLeft className="size-3.5" />
                    <span className="text-[8px] font-medium">Prev</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <List className="size-3 text-muted-foreground/40" />
                  </div>
                  <SlidersHorizontal className="size-3 text-muted-foreground/40" />
                  <div className="flex items-center gap-1 text-muted-foreground/40">
                    <span className="text-[8px] font-medium">Next</span>
                    <ChevronRight className="size-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      <Dialog open={reorderDialogOpen} onOpenChange={setReorderDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sortir Chapter?</DialogTitle>
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
                  <span key={ch.id} className="px-1.5 py-0.5 rounded bg-muted text-[11px]">
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
            <Button variant="outline" size="sm" onClick={handleCancelReorder}>
              Batal
            </Button>
            <Button size="sm" onClick={handleConfirmReorder}>
              Ya, Sortir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
