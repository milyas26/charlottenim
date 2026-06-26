"use client"

import { use, useState } from "react"
import Link from "next/link"
import { works } from "@/data/dummy"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Save } from "lucide-react"

export default function AdminNewChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const work = works.find((w) => w.slug === slug)
  if (!work) notFound()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPremium, setIsPremium] = useState(false)
  const [price, setPrice] = useState("5000")

  const chapterSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  const nextChapterNumber = work.totalChapters + 1

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/karya/${work.slug}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Chapter Baru</h1>
          <p className="text-muted-foreground mt-1">
            {work.title} &mdash; Chapter {nextChapterNumber}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Chapter</CardTitle>
            <CardDescription>Judul, nomor, dan pengaturan akses chapter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-16">
                <Label>Nomor</Label>
                <p className="mt-2 h-9 flex items-center text-sm font-medium bg-muted rounded-md px-3">
                  #{nextChapterNumber}
                </p>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="title">Judul Chapter</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul chapter..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {title && (
                  <p className="text-xs text-muted-foreground">
                    Slug: <code className="text-accent">/{chapterSlug}</code>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-8 pt-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isPremium"
                  checked={isPremium}
                  onCheckedChange={(checked) => setIsPremium(checked === true)}
                />
                <Label htmlFor="isPremium" className="cursor-pointer">
                  Chapter Premium
                </Label>
              </div>

              {isPremium && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="price">Harga</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-36 pl-10"
                      min={1000}
                      step={500}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konten Chapter</CardTitle>
            <CardDescription>Tulis konten chapter di sini. Format HTML didukung.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="<p>Mulai menulis konten chapter di sini...</p>"
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {content.length} karakter &middot; Preview akan tersedia setelah disimpan.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 justify-end">
          <Button variant="outline" asChild>
            <Link href={`/admin/karya/${work.slug}`}>Batal</Link>
          </Button>
          <Button disabled={!title || !content}>
            <Save className="size-4" />
            Simpan Chapter
          </Button>
        </div>
      </div>
    </div>
  )
}
