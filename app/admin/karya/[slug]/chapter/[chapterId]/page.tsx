"use client"

import { use, useState } from "react"
import Link from "next/link"
import { works, chapters } from "@/data/dummy"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import ChapterEditor from "@/components/admin/ChapterEditor"
import { ArrowLeft, Save } from "lucide-react"

export default function AdminChapterEditorPage({
  params,
}: {
  params: Promise<{ slug: string; chapterId: string }>
}) {
  const { slug, chapterId } = use(params)
  const work = works.find((w) => w.slug === slug)
  if (!work) notFound()

  const isNew = chapterId === "create"
  const existingChapter = isNew
    ? null
    : chapters.find((ch) => ch.workId === work.id && ch.slug === chapterId)

  const [title, setTitle] = useState(existingChapter?.title ?? "")
  const [content, setContent] = useState(existingChapter?.content ?? "")
  const [isPremium, setIsPremium] = useState(existingChapter?.isPremium ?? false)
  const [price, setPrice] = useState(String(existingChapter?.price ?? 5000))

  const isEditing = !!existingChapter

  const chapterSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  const chapterNumber = existingChapter?.chapterNumber ?? work.totalChapters + 1

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/karya/${work.slug}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">
            {isEditing ? "Edit Chapter" : "Tambah Chapter Baru"}
          </h1>
          <p className="text-xs text-muted-foreground truncate">
            {work.title} &mdash; Chapter {chapterNumber}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/karya/${work.slug}`}>Batal</Link>
          </Button>
          <Button size="sm" disabled={!title || !content}>
            <Save className="size-4" />
            Simpan
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="shrink-0 w-12">
          <p className="text-xs text-muted-foreground mb-0.5">No.</p>
          <p className="h-7 flex items-center text-sm font-medium bg-muted rounded px-2">
            {chapterNumber}
          </p>
        </div>
        <div className="flex-1 min-w-[160px]">
          <Input
            id="title"
            placeholder="Judul chapter..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-7 text-sm"
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
        <p className="text-xs text-muted-foreground -mt-2">
          Slug: <code className="text-accent">/{chapterSlug}</code>
        </p>
      )}

      <ChapterEditor
        content={content}
        onChange={setContent}
        placeholder="Mulai menulis..."
      />
    </div>
  )
}
