"use client"

import { use, useState, useCallback, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import type { WorkStatus, Chapter } from "@/data/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  Loader2,
} from "lucide-react"
import { GENRES } from "@/lib/constants"
import api from "@/lib/axios"

type WorkDetail = {
  id: string
  title: string
  slug: string
  synopsis: string
  coverUrl: string
  genres: string[]
  status: WorkStatus
  totalChapters: number
  deletedAt: string | null
}

export default function AdminWorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editSynopsis, setEditSynopsis] = useState("")
  const [editStatus, setEditStatus] = useState<WorkStatus>("DRAFT")
  const [editGenres, setEditGenres] = useState<string[]>([])
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null)
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [deleteChapterTarget, setDeleteChapterTarget] = useState<Chapter | null>(null)
  const [deleteWorkOpen, setDeleteWorkOpen] = useState(false)
  const { setActions } = useAdminHeaderActions()

  const { data: work, isLoading } = useQuery({
    queryKey: ["works", id],
    queryFn: async () => {
      const { data } = await api.get<WorkDetail>(`/api/admin/works/${id}`)
      return data
    },
  })

  const { data: chapters = [] } = useQuery({
    queryKey: ["works", id, "chapters"],
    queryFn: async () => {
      const { data } = await api.get<Chapter[]>(`/api/admin/works/${id}/chapters`)
      return data.sort((a, b) => a.chapterNumber - b.chapterNumber)
    },
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!work) throw new Error("No work")

      const newSlug = editTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

      let coverUrl = work.coverUrl
      if (editCoverFile) {
        const formData = new FormData()
        formData.append("file", editCoverFile)
        const { data: uploadData } = await api.post("/api/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        coverUrl = uploadData.url
      } else if (editCoverPreview) {
        coverUrl = editCoverPreview
      }

      await api.put(`/api/admin/works/${work.id}`, {
        title: editTitle.trim(),
        slug: newSlug,
        synopsis: editSynopsis.trim(),
        status: editStatus,
        genres: editGenres,
        coverUrl,
      })
    },
    onSuccess: () => {
      setIsEditing(false)
      setEditCoverPreview(null)
      setEditCoverFile(null)
      queryClient.invalidateQueries({ queryKey: ["works", id] })
      queryClient.invalidateQueries({ queryKey: ["works", id, "chapters"] })
      queryClient.invalidateQueries({ queryKey: ["works"] })
    },
    onError: (err: Error) => {
      alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || err?.message || "Gagal mengupdate karya")
    },
  })

  const deleteWorkMutation = useMutation({
    mutationFn: async () => {
      if (!work) return
      await api.delete(`/api/admin/works/${work.id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] })
      router.push("/admin/karya")
    },
    onError: (err: Error) => {
      alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || err?.message || "Gagal menghapus karya")
      setDeleteWorkOpen(false)
    },
  })

  const deleteChapterMutation = useMutation({
    mutationFn: async (chapterId: string) => {
      await api.delete(`/api/admin/works/${id}/chapters/${chapterId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works", id, "chapters"] })
      setDeleteChapterTarget(null)
    },
    onError: (err) => {
      console.error(err)
      setDeleteChapterTarget(null)
    },
  })

  const reorderMutation = useMutation({
    mutationFn: async (chapterIds: string[]) => {
      await api.put(`/api/admin/works/${id}/chapters/reorder`, { chapterIds })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works", id, "chapters"] })
      setConfirmOpen(false)
      setDragFromIndex(null)
      setDropIndex(null)
    },
    onError: (err: Error) => {
      alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || err?.message || "Gagal mengurutkan chapter")
    },
  })

  const totalReads = chapters.reduce((sum, ch) => sum + ch.readCount, 0)

  useEffect(() => {
    if (!work) return

    if (isEditing) {
      setActions(
        <>
          <Button variant="outline" size="sm" onClick={() => {
            setIsEditing(false)
            setEditCoverPreview(null)
            setEditCoverFile(null)
            setEditTitle(work.title)
            setEditSynopsis(work.synopsis)
            setEditStatus(work.status)
            setEditGenres(work.genres)
          }}>
            <X className="size-4" />
            Batal
          </Button>
          <Button size="sm" disabled={!editTitle || !editSynopsis || saveMutation.isPending} onClick={() => saveMutation.mutate()}>
            {saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Simpan Perubahan
          </Button>
        </>
      )
    } else {
      setActions(
        <>
          <Button variant="outline" size="sm" onClick={() => {
            if (!work) return
            setEditTitle(work.title)
            setEditSynopsis(work.synopsis)
            setEditStatus(work.status)
            setEditGenres(work.genres)
            setEditCoverPreview(null)
            setEditCoverFile(null)
            setIsEditing(true)
          }}>
            <Edit className="size-4" />
            Edit Karya
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/karya/${work.id}/chapter/create`}>
              <PlusCircle className="size-4" />
              Tambah Chapter
            </Link>
          </Button>
        </>
      )
    }
    return () => setActions(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActions, isEditing, editTitle, editSynopsis, editStatus, editGenres, saveMutation.isPending, work])

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
    setDropIndex(index)
    setDragIndex(null)
    setDragOverIndex(null)
    setConfirmOpen(true)
  }, [dragFromIndex])

  const confirmReorder = useCallback(() => {
    if (dragFromIndex === null || dropIndex === null || !work) return

    const from = dragFromIndex
    const to = dropIndex
    const reordered = [...chapters]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const updated = reordered.map((ch, i) => ({ ...ch, chapterNumber: i + 1 }))
    const chapterIds = updated.map((ch) => ch.id)

    reorderMutation.mutate(chapterIds)
  }, [chapters, dragFromIndex, dropIndex, work, reorderMutation])

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
    setDragFromIndex(null)
    setDropIndex(null)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!work) {
    return (
      <div className="p-4 text-center text-muted-foreground">Karya tidak ditemukan.</div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/karya">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{work.title}</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => setDeleteWorkOpen(true)}>
          <Trash2 className="size-4" />
          Hapus
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
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
                    ) : (work.coverUrl.startsWith("http") || work.coverUrl.startsWith("data:")) ? (
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
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max. 2MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        if (file.size > 2 * 1024 * 1024) {
                          alert("Ukuran file maksimal 2MB.")
                          return
                        }
                        setEditCoverFile(file)
                        const reader = new FileReader()
                        reader.onload = () => setEditCoverPreview(reader.result as string)
                        reader.readAsDataURL(file)
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
                    {GENRES.map((genre) => {
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

              </>
            ) : (
              <>
                {(work.coverUrl.startsWith("http") || work.coverUrl.startsWith("data:")) ? (
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
                    <span className="text-sm font-medium">{chapters.length}</span>
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
              <CardDescription>{chapters.length} chapter · Geser handle untuk mengurutkan.</CardDescription>
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
                {chapters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Belum ada chapter. Tambah chapter pertama.
                    </TableCell>
                  </TableRow>
                ) : (
                  chapters.map((ch, index) => (
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
                          <Link href={`/admin/karya/${work.id}/chapter/${ch.id}`} className="font-medium hover:text-primary transition-colors">
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
                              <Link href={`/admin/karya/${work.id}/chapter/${ch.id}`}>
                                <Edit className="size-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setDeleteChapterTarget(ch)}>
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
            <Button onClick={confirmReorder} disabled={reorderMutation.isPending}>
              {reorderMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Ya, Urutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteChapterTarget} onOpenChange={(open) => !open && setDeleteChapterTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Chapter</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus chapter &ldquo;{deleteChapterTarget?.title}&rdquo;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteChapterTarget && deleteChapterMutation.mutate(deleteChapterTarget.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteWorkOpen} onOpenChange={setDeleteWorkOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Karya</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus &ldquo;{work.title}&rdquo; beserta semua chapternya?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteWorkMutation.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
