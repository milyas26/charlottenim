"use client"

import { use, useState, useCallback, useRef, useEffect } from "react"
import { works, chapters as allChapters, getChaptersByWorkSlug } from "@/data/dummy"
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
import { Save, GripVertical, PlusCircle, Lock, LockOpen, ChevronRight, X } from "lucide-react"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import Link from "next/link"

export default function AdminChapterEditorPage({
  params,
}: {
  params: Promise<{ slug: string; chapterId: string }>
}) {
  const { slug, chapterId } = use(params)
  const router = useRouter()
  const work = works.find((w) => w.slug === slug)
  if (!work) notFound()

  const isNew = chapterId === "create"
  const existingChapter = isNew
    ? null
    : allChapters.find((ch) => ch.workId === work.id && ch.slug === chapterId)

  const workChapters = getChaptersByWorkSlug(work.slug)
    .sort((a, b) => a.chapterNumber - b.chapterNumber)

  const [orderedChapters, setOrderedChapters] = useState<Chapter[]>(workChapters)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragItem = useRef<number | null>(null)
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false)
  const [pendingReorder, setPendingReorder] = useState<{
    from: number
    to: number
    result: Chapter[]
  } | null>(null)

  const [title, setTitle] = useState(existingChapter?.title ?? (isNew ? "Untitled" : ""))
  const [content, setContent] = useState(existingChapter?.content ?? "")
  const [isPremium, setIsPremium] = useState(existingChapter?.isPremium ?? false)
  const [price, setPrice] = useState(String(existingChapter?.price ?? 5000))
  const [status, setStatus] = useState<ChapterStatus>(existingChapter?.status ?? "PUBLISHED")

  const isEditing = !!existingChapter

  useEffect(() => {
    if (isNew) {
      setOrderedChapters((prev) => {
        if (prev.some((ch) => ch.slug === "create")) return prev
        const dummyChapter: Chapter = {
          id: -1,
          workId: work.id,
          workSlug: work.slug,
          chapterNumber: prev.length + 1,
          slug: "create",
          title: "Untitled",
          content: "",
          isPremium: false,
          price: 0,
          readCount: 0,
          status: "DRAFT",
          deletedAt: null,
        }
        return [...prev, dummyChapter]
      })
    }
  }, [isNew, work.id, work.slug])

  const { setActions } = useAdminHeaderActions()

  useEffect(() => {
    setActions(
      <>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/karya/${work.slug}`}>
            <X className="size-4" />
            Batal
          </Link>
        </Button>
        <Button size="sm" disabled={!title || !content}>
          <Save className="size-4" />
          Simpan
        </Button>
      </>
    )
    return () => setActions(null)
  }, [setActions, work.slug, title, content])

  const chapterSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  const chapterNumber = existingChapter?.chapterNumber ?? work.totalChapters + 1

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragItem.current !== index) {
      setDragOverIndex(index)
    }
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDragOverIndex(null)
    dragItem.current = null
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    const from = dragItem.current
    if (from === null || from === index) {
      setDragIndex(null)
      setDragOverIndex(null)
      dragItem.current = null
      return
    }
    const reordered = [...orderedChapters]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(index, 0, moved)
    const updated = reordered.map((ch, i) => ({ ...ch, chapterNumber: i + 1 }))
    setPendingReorder({ from, to: index, result: updated })
    setReorderDialogOpen(true)
    dragItem.current = null
  }, [orderedChapters])

  const handleConfirmReorder = useCallback(() => {
    if (!pendingReorder) return
    setOrderedChapters(pendingReorder.result)
    setPendingReorder(null)
    setReorderDialogOpen(false)
    setDragIndex(null)
    setDragOverIndex(null)
  }, [pendingReorder])

  const handleCancelReorder = useCallback(() => {
    setPendingReorder(null)
    setReorderDialogOpen(false)
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-0">
      <aside className="w-64 shrink-0 border-r bg-muted/30 flex flex-col">
        <div className="flex items-center justify-between px-3 h-10 border-b shrink-0">
          <span className="text-xs font-medium text-muted-foreground">
            {orderedChapters.length} Chapter
          </span>
          <Button variant="ghost" size="icon" className="size-6" asChild>
            <Link href={`/admin/karya/${work.slug}/chapter/create`}>
              <PlusCircle className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          {orderedChapters.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              Belum ada chapter
            </p>
          )}
          {orderedChapters.map((ch, index) => {
            const isActive = ch.slug === chapterId
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

      <aside className="w-52 shrink-0 border-l border-border/50 flex flex-col p-4 gap-4 overflow-y-auto">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ChapterStatus)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">
                <span className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Draft</Badge>
                </span>
              </SelectItem>
              <SelectItem value="PUBLISHED">
                <span className="flex items-center gap-2">
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">Published</Badge>
                </span>
              </SelectItem>
              <SelectItem value="DELETED">
                <span className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Deleted</Badge>
                </span>
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
      </aside>

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
