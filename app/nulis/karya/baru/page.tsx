"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { useAdminHeaderActions } from "@/components/admin/AdminHeader"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, X, Upload, Loader2 } from "lucide-react"
import { GENRES } from "@/lib/constants"
import { WorkStatus } from "@/data/types"
import api from "@/lib/axios"

export default function AdminNewWorkPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [synopsis, setSynopsis] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [status, setStatus] = useState<WorkStatus>("DRAFT")

  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { setActions } = useAdminHeaderActions()

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

      let coverUrl = ""
      if (coverFile) {
        const formData = new FormData()
        formData.append("file", coverFile)
        const { data: uploadData } = await api.post("/api/nulis/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        coverUrl = uploadData.url
      }

      const { data: work } = await api.post("/api/nulis/works", {
        title: title.trim(),
        slug,
        synopsis: synopsis.trim(),
        coverUrl: coverUrl || undefined,
        genres: selectedGenres,
        status,
      })
      return work
    },
    onSuccess: (work) => {
      router.push(`/nulis/karya/${work.id}`)
    },
    onError: (err: Error) => {
      alert((err as { response?: { data?: { error?: string } } })?.response?.data?.error || err?.message || "Gagal membuat karya")
    },
  })

  const handleSave = useCallback(() => {
    if (!title || !synopsis) return
    saveMutation.mutate()
  }, [title, synopsis, saveMutation])

  useEffect(() => {
    setActions(
      <>
        <Button variant="outline" asChild>
          <Link href="/nulis/karya">Batal</Link>
        </Button>
        <Button disabled={!title || !synopsis || saveMutation.isPending} onClick={handleSave}>
          {saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan Karya
        </Button>
      </>
    )
  }, [setActions, title, synopsis, saveMutation.isPending, handleSave])

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    } else if (selectedGenres.length < 5) {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB.")
      return
    }
    setCoverFile(file)
    const reader = new FileReader()
    reader.onload = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/nulis/karya">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Karya Baru</h1>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Karya</CardTitle>
              <CardDescription>Data utama karya yang akan ditampilkan ke pembaca.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Karya</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul karya..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {title && (
                  <p className="text-xs text-muted-foreground">
                    Slug: <code className="text-accent">/{slug}</code>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="synopsis">Sinopsis</Label>
                <Textarea
                  id="synopsis"
                  placeholder="Tulis sinopsis singkat karya..."
                  rows={6}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{synopsis.length} karakter</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as WorkStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {status === "DRAFT" && "Hanya terlihat oleh admin."}
                  {status === "ONGOING" && "Tampil di halaman utama."}
                  {status === "COMPLETED" && "Tampil dengan label Selesai."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Genre</CardTitle>
              <CardDescription>Pilih maksimal 5 genre yang sesuai.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => {
                  const isSelected = selectedGenres.includes(genre)
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      disabled={!isSelected && selectedGenres.length >= 5}
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
              {selectedGenres.length >= 5 && (
                <p className="text-xs text-muted-foreground mt-2">Maksimal 5 genre.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-[72px]">
            <CardHeader>
              <CardTitle>Cover Karya</CardTitle>
              <CardDescription>Upload cover JPG/PNG, maks 2MB.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <label className="relative flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed rounded-lg cursor-pointer border-input hover:border-primary/50 hover:bg-accent/5 transition-colors overflow-hidden">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                  />
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs font-medium">Klik untuk ganti cover</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center px-4">
                      <Upload className="size-10 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground text-center">
                        <span className="font-medium text-primary">Klik untuk upload</span> atau drag & drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max. 2MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
