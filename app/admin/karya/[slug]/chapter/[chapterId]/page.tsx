"use client"

import { use, useState, useCallback, useRef, useEffect } from "react"
import { works, chapters as allChapters, getChaptersByWorkSlug } from "@/data/dummy"
import type { Chapter } from "@/data/types"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import ChapterEditor from "@/components/admin/ChapterEditor"
import { ArrowLeft, Save, GripVertical, PlusCircle, Lock, LockOpen, ChevronRight, X } from "lucide-react"
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

  const [title, setTitle] = useState(existingChapter?.title ?? "")
  const [content, setContent] = useState(existingChapter?.content ?? "")
  const [isPremium, setIsPremium] = useState(existingChapter?.isPremium ?? false)
  const [price, setPrice] = useState(String(existingChapter?.price ?? 5000))

  const isEditing = !!existingChapter

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
      return
    }
    const reordered = [...orderedChapters]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(index, 0, moved)
    const updated = reordered.map((ch, i) => ({ ...ch, chapterNumber: i + 1 }))
    setOrderedChapters(updated)
    setDragIndex(null)
    setDragOverIndex(null)
    dragItem.current = null
  }, [orderedChapters])

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
        <div className="shrink-0 p-6 pb-0 space-y-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <Input
                id="title"
                placeholder="Judul chapter..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-7 text-sm border-0 border-b border-input rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-bold"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPremium"
                checked={isPremium}
                onCheckedChange={(checked) => setIsPremium(checked === true)}
              />
              <Label htmlFor="isPremium" className="cursor-pointer text-xs">
                Premium
              </Label>
            </div>
            {isPremium && (
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Rp</span>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-24 pl-6 h-7 text-sm"
                  min={1000}
                  step={500}
                />
              </div>
            )}
          </div>
          {title && (
            <p className="text-xs text-muted-foreground">
              Slug: <code className="text-accent">/{chapterSlug}</code>
            </p>
          )}
        </div>

        <div className="flex-1 min-h-0 p-6 pt-4">
          <ChapterEditor
            content={content}
            onChange={setContent}
            placeholder="Mulai menulis..."
          />
        </div>
      </div>
    </div>
  )
}
