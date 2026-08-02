"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Upload } from "lucide-react"
import { useCreateBook, useUpdateBook, useUploadBookCover } from "@/lib/api/books"
import type { Book } from "@/data/types"
import { toast } from "sonner"

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

interface BookFormProps {
  initialBook?: Book
  isEdit?: boolean
  bookId?: string
}

export default function BookForm({ initialBook, isEdit, bookId }: BookFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(initialBook?.title ?? "")
  const [slug, setSlug] = useState(initialBook?.slug ?? "")
  const [description, setDescription] = useState(initialBook?.description ?? "")
  const [price, setPrice] = useState(initialBook?.price ? String(initialBook.price) : "")
  const [author, setAuthor] = useState(initialBook?.author ?? "")
  const [stock, setStock] = useState(initialBook?.stock ? String(initialBook.stock) : "0")
  const [weight, setWeight] = useState(initialBook?.weight ? String(initialBook.weight) : "0")
  const [pages, setPages] = useState(initialBook?.pages ? String(initialBook.pages) : "0")
  const [isActive, setIsActive] = useState(initialBook?.isActive ?? true)
  const [saving, setSaving] = useState(false)

  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialBook?.coverUrl && (initialBook.coverUrl.startsWith("http") || initialBook.coverUrl.startsWith("data:"))
      ? initialBook.coverUrl
      : null
  )
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const createMutation = useCreateBook()
  const updateMutation = useUpdateBook()
  const uploadCoverMutation = useUploadBookCover()

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!isEdit) {
      setSlug(generateSlug(value))
    }
  }

  const handleFileChange = (file: File | null) => {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar")
      return
    }
    setCoverFile(file)
    const reader = new FileReader()
    reader.onload = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error("Judul wajib diisi"); return }
    if (!slug.trim()) { toast.error("Slug wajib diisi"); return }
    if (!price || parseInt(price) < 1000) { toast.error("Harga minimal Rp 1.000"); return }

    setSaving(true)
    try {
      let coverUrl = initialBook?.coverUrl ?? ""
      if (coverFile) {
        coverUrl = await uploadCoverMutation.mutateAsync(coverFile)
      }

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        price: parseInt(price),
        coverUrl,
        author: author.trim(),
        stock: parseInt(stock) || 0,
        weight: parseInt(weight) || 0,
        pages: parseInt(pages) || 0,
        isActive,
      }

      if (isEdit && bookId) {
        await updateMutation.mutateAsync({ id: bookId, ...payload })
        toast.success("Buku berhasil diupdate")
      } else {
        await createMutation.mutateAsync(payload)
        toast.success("Buku berhasil dibuat")
      }
      router.push("/nulis/buku")
    } catch (err) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg || "Gagal menyimpan buku")
    } finally {
      setSaving(false)
    }
  }

  const autoSlug = isEdit ? slug : generateSlug(title)

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/nulis/buku">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Buku" : "Tambah Buku"}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEdit ? "Edit detail buku yang sudah ada" : "Tambahkan buku baru ke katalog"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Buku</CardTitle>
              <CardDescription>Data utama buku yang akan ditampilkan ke pembeli.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Buku *</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul buku..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                {autoSlug && (
                  <p className="text-xs text-muted-foreground">
                    Slug: <code className="text-primary font-medium">/{autoSlug}</code>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="slug-buku"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); if (!isEdit) setTitle(title) }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Tulis deskripsi buku..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{description.length} karakter</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detail Buku</CardTitle>
              <CardDescription>Informasi harga, stok, dan detail fisik buku.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga (IDR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Halaman</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nama penulis"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Berat (gram)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked === true)}
                />
                <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                  Buku Aktif (tampil di halaman Shop)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-[72px]">
            <CardHeader>
              <CardTitle>Cover Buku</CardTitle>
              <CardDescription>Upload cover JPG/PNG, maks 2MB.</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
              <div
                className={`relative flex flex-col items-center justify-center w-full aspect-[10/15] border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50 hover:bg-accent/5"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  handleFileChange(e.dataTransfer.files?.[0] ?? null)
                }}
              >
                {uploadCoverMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center px-4">
                    <Loader2 className="size-10 text-muted-foreground mb-3 animate-spin" />
                    <p className="text-sm text-muted-foreground text-center">Mengupload...</p>
                  </div>
                ) : coverPreview ? (
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" asChild>
          <Link href="/nulis/buku">Batal</Link>
        </Button>
        <Button onClick={handleSubmit} disabled={saving || uploadCoverMutation.isPending}>
          {(saving || uploadCoverMutation.isPending) && <Loader2 className="size-4 mr-2 animate-spin" />}
          {isEdit ? "Simpan Perubahan" : "Tambah Buku"}
        </Button>
      </div>
    </div>
  )
}
