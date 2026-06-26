"use client"

import { use, useState, useCallback, useRef } from "react"
import type { WorkStatus } from "@/data/types"
import Link from "next/link"
import { works, chapters } from "@/data/dummy"
import { Chapter } from "@/data/types"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  PlusCircle,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  GripVertical,
  Lock,
  LockOpen,
  Save,
  X,
  Upload,
} from "lucide-react"
import { allGenres } from "@/data/admin-dummy"

export default function AdminWorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const work = works.find((w) => w.slug === slug)
  if (!work) notFound()

  const initialChapters = chapters
    .filter((ch) => ch.workId === work.id)
    .sort((a, b) => a.chapterNumber - b.chapterNumber)

  const [orderedChapters, setOrderedChapters] = useState<Chapter[]>(initialChapters)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(work.title)
  const [editSynopsis, setEditSynopsis] = useState(work.synopsis)
  const [editStatus, setEditStatus] = useState<WorkStatus>(work.status)
  const [editGenres, setEditGenres] = useState<string[]>(work.genres)
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null)
  const dragItem = useRef<number | null>(null)

  const totalReads = orderedChapters.reduce((sum, ch) => sum + ch.readCount, 0)

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
    setDropIndex(index)
    setDragIndex(null)
    setDragOverIndex(null)
    setConfirmOpen(true)
  }, [])

  const confirmReorder = useCallback(() => {
    if (dragItem.current === null || dropIndex === null) return

    const from = dragItem.current
    const to = dropIndex

    const reordered = [...orderedChapters]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)

    const updated = reordered.map((ch, i) => ({
      ...ch,
      chapterNumber: i + 1,
    }))

    setOrderedChapters(updated)
    setConfirmOpen(false)
    dragItem.current = null
    setDropIndex(null)

    alert("Urutan chapter berhasil diubah!")
  }, [orderedChapters, dropIndex])

  const toggleGenre = (genre: string) => {
    if (editGenres.includes(genre)) {
      setEditGenres(editGenres.filter((g) => g !== genre))
    } else if (editGenres.length < 5) {
      setEditGenres([...editGenres, genre])
    }
  }

  const editSlug = editTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  const cancelReorder = useCallback(() => {
    setConfirmOpen(false)
    dragItem.current = null
    setDropIndex(null)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/karya">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{work.title}</h1>
          <p className="text-muted-foreground mt-1">/{work.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            if (isEditing) {
              setIsEditing(false)
              setEditCoverPreview(null)
            } else {
              setEditTitle(work.title)
              setEditSynopsis(work.synopsis)
              setEditStatus(work.status)
              setEditGenres(work.genres)
              setEditCoverPreview(null)
              setIsEditing(true)
            }
          }}>
            {isEditing ? <X className="size-4" /> : <Edit className="size-4" />}
            {isEditing ? "Batal" : "Edit Karya"}
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/karya/${work.slug}/chapter/create`}>
              <PlusCircle className="size-4" />
              Tambah Chapter
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Info Karya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed rounded-lg cursor-pointer border-input hover:border-primary/50 hover:bg-accent/5 transition-colors relative overflow-hidden">
                    {editCoverPreview ? (
                      <img
                        src={editCoverPreview}
                        alt={editTitle || work.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : work.coverUrl.startsWith("http") ? (
                      <img
                        src={work.coverUrl}
                        alt={work.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center px-4">
                        <Upload className="size-10 text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground text-center">
                          <span className="font-medium text-primary">Klik untuk upload</span> atau drag & drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max. 100KB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () => setEditCoverPreview(reader.result as string)
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-title">Judul Karya</Label>
                  <Input
                    id="edit-title"
                    placeholder="Masukkan judul karya..."
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  {editTitle && (
                    <p className="text-xs text-muted-foreground">
                      Slug: <code className="text-accent">/{editSlug}</code>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-synopsis">Sinopsis</Label>
                  <Textarea
                    id="edit-synopsis"
                    placeholder="Tulis sinopsis singkat karya..."
                    rows={6}
                    value={editSynopsis}
                    onChange={(e) => setEditSynopsis(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{editSynopsis.length} karakter</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editStatus} onValueChange={(v) => setEditStatus(v as WorkStatus)}>
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ONGOING">Ongoing</SelectItem>
                      <SelectItem value="COMPLETED">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {editStatus === "DRAFT" && "Hanya terlihat oleh admin."}
                    {editStatus === "ONGOING" && "Tampil di halaman utama."}
                    {editStatus === "COMPLETED" && "Tampil dengan label Selesai."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Genre (maks. 5)</Label>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map((genre) => {
                      const isSelected = editGenres.includes(genre)
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          disabled={!isSelected && editGenres.length >= 5}
                          className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
                          }`}
                        >
                          {genre}
                          {isSelected && <X className="ml-1.5 size-3" />}
                        </button>
                      )
                    })}
                  </div>
                  {editGenres.length >= 5 && (
                    <p className="text-xs text-muted-foreground">Maksimal 5 genre.</p>
                  )}
                </div>

                <Button className="w-full" disabled={!editTitle || !editSynopsis} onClick={() => {
                  work.title = editTitle
                  work.synopsis = editSynopsis
                  work.status = editStatus
                  work.genres = editGenres
                  setIsEditing(false)
                  alert("Karya berhasil diedit!")
                }}>
                  <Save className="size-4" />
                  Simpan Perubahan
                </Button>
              </>
            ) : (
              <>
                {work.coverUrl.startsWith("http") ? (
                  <img src={work.coverUrl} alt={work.title} className="w-full aspect-[3/4] rounded-lg object-cover" />
                ) : (
                  <div className="w-full aspect-[3/4] rounded-lg bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-accent/40">{work.title.charAt(0)}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={work.status === "DRAFT" ? "secondary" : work.status === "ONGOING" ? "default" : "outline"}>
                      {work.status === "DRAFT" ? "Draft" : work.status === "ONGOING" ? "Ongoing" : "Selesai"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Chapter</span>
                    <span className="text-sm font-medium">{orderedChapters.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Dibaca</span>
                    <span className="text-sm font-medium">{totalReads.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Genre</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {work.genres.map((g) => (
                      <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Sinopsis</span>
                  <p className="text-sm mt-1 leading-relaxed">{work.synopsis}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Daftar Chapter</CardTitle>
              <CardDescription>{orderedChapters.length} chapter · Geser handle untuk mengurutkan.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Akses</TableHead>
                  <TableHead className="text-right">Dibaca</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderedChapters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Belum ada chapter. Tambah chapter pertama.
                    </TableCell>
                  </TableRow>
                ) : (
                  orderedChapters.map((ch, index) => (
                    <TableRow
                      key={ch.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`transition-all ${
                        dragIndex === index
                          ? "opacity-40 scale-[0.98]"
                          : ""
                      } ${
                        dragOverIndex === index && dragIndex !== index
                          ? "border-t-2 border-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <TableCell>
                        <GripVertical className="size-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      </TableCell>
                      <TableCell className="font-medium">{ch.chapterNumber}</TableCell>
                      <TableCell>
                        <div>
                          <Link href={`/baca/${ch.workSlug}/${ch.slug}`} className="font-medium hover:text-primary transition-colors">
                            {ch.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">/{ch.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {ch.isPremium ? (
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="size-3" />
                            Premium · Rp {ch.price.toLocaleString("id-ID")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <LockOpen className="size-3" />
                            Gratis
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {ch.readCount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="size-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/karya/${work.slug}/chapter/${ch.slug}`}>
                                <Edit className="size-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Trash2 className="size-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pengurutan</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin mengubah urutan chapter? Nomor chapter akan diperbarui secara otomatis sesuai urutan baru.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelReorder} className="mr-2">
              Batal
            </Button>
            <Button onClick={confirmReorder}>
              Ya, Urutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
