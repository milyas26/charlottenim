"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import api from "@/lib/axios"
import { Check, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ImageData {
  id: string
  url: string
  order: number
}

interface ImageBucketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workId: string
  chapterId?: string
  existingImageUrls?: string[]
  onInsertImage: (url: string) => void
}

function GalleryImage({
  image,
  index,
  selected,
  alreadyUsed,
  onToggle,
  onDelete,
  deleting,
}: {
  image: ImageData
  index: number
  selected: boolean
  alreadyUsed: boolean
  onToggle: () => void
  onDelete: (id: string) => void
  deleting: string | null
}) {
  return (
    <div className="relative group rounded-lg border border-border bg-muted/30 overflow-hidden">
      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1">
        <span className="bg-background/80 text-xs font-mono px-1.5 py-0.5 rounded shadow select-none">
          {index + 1}
        </span>
      </div>
      <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(image.id)
          }}
          disabled={deleting === image.id}
          className="p-1 rounded bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          title="Hapus gambar"
        >
          {deleting === image.id ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </button>
      </div>
      <button
        onClick={onToggle}
        className={`block w-full aspect-square cursor-pointer relative transition-all ${
          selected
            ? "ring-2 ring-offset-1 ring-offset-background ring-emerald-500"
            : alreadyUsed
              ? "ring-2 ring-offset-1 ring-offset-background ring-sky-400"
              : "ring-1 ring-transparent"
        }`}
        title="Klik untuk pilih"
      >
        <img
          src={image.url}
          alt={`Gambar ${index + 1}`}
          className={`w-full h-full object-contain p-2 transition-opacity ${selected ? "opacity-50" : ""}`}
          loading="lazy"
        />
        {selected && (
          <>
            <div className="absolute top-1.5 left-8 z-10 flex items-center justify-center size-5 rounded-full bg-emerald-500 shadow">
              <Check className="size-3 text-white" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 bg-emerald-500/10" />
          </>
        )}
        {alreadyUsed && (
          <div className="absolute bottom-1.5 right-1.5 z-10">
            <span className="bg-slate-500/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow select-none">
              Used
            </span>
          </div>
        )}
      </button>
    </div>
  )
}

export default function ImageBucketModal({
  open,
  onOpenChange,
  workId,
  chapterId,
  existingImageUrls,
  onInsertImage,
}: ImageBucketModalProps) {
  const [images, setImages] = useState<ImageData[] | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [alreadyUsedIds, setAlreadyUsedIds] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.set("workId", workId)
      if (chapterId) params.set("chapterId", chapterId)
      const { data } = await api.get(`/api/nulis/images?${params.toString()}`)
      setImages(data)
      return data as ImageData[]
    } catch {
      toast.error("Gagal mengambil daftar gambar")
      setImages([])
      return [] as ImageData[]
    }
  }, [workId, chapterId])

  const existingUrlSet = useMemo(
    () => new Set(existingImageUrls ?? []),
    [existingImageUrls],
  )

  useEffect(() => {
    if (open) {
      refresh().then((data) => {
        setSelected(new Set())
        if (existingUrlSet.size > 0 && data.length > 0) {
          const matchedIds = data
            .filter((img) => existingUrlSet.has(img.url))
            .map((img) => img.id)
          setAlreadyUsedIds(new Set(matchedIds))
        } else {
          setAlreadyUsedIds(new Set())
        }
      })
    }
  }, [open, refresh, existingUrlSet])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      onOpenChange(newOpen)
    },
    [onOpenChange],
  )

  const handleToggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      setUploading(true)
      let success = 0
      try {
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) continue
          if (file.size > 2 * 1024 * 1024) {
            toast.error("Ukuran gambar maksimal 2MB")
            continue
          }
          const formData = new FormData()
          formData.append("file", file)
          formData.append("type", "CONTENT")
          formData.append("workId", workId)
          if (chapterId) formData.append("chapterId", chapterId)
          await api.post("/api/nulis/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          success++
        }
        if (success > 0) {
          toast.success(`${success} gambar berhasil diupload`)
          await refresh()
        }
      } catch {
        toast.error("Gagal upload gambar")
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    },
    [workId, chapterId, refresh],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setDeleting(id)
      try {
        await api.delete(`/api/nulis/images/${id}`)
        toast.success("Gambar berhasil dihapus")
        setSelected((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        await refresh()
      } catch {
        toast.error("Gagal menghapus gambar")
      } finally {
        setDeleting(null)
      }
    },
    [refresh],
  )

  const handleAddSelectedToEditor = useCallback(() => {
    const sortedUrls = images
      ?.filter((img) => selected.has(img.id))
      .map((img) => img.url)
    if (sortedUrls && sortedUrls.length > 0) {
      sortedUrls.forEach((url) => onInsertImage(url))
    }
    onOpenChange(false)
  }, [images, selected, onInsertImage, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[720px] h-[580px] max-w-none max-h-none flex flex-col p-0 gap-2">
        <DialogHeader className="px-4 pt-4 pb-0 shrink-0 mb-0">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle>Bucket Gambar</DialogTitle>
            {selected.size > 0 && (
              <button
                onClick={handleAddSelectedToEditor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
              >
                <Check className="size-3.5" />
                Tambah ke Editor ({selected.size})
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="shrink-0 px-4 py-2 flex gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Plus className="size-3.5" />
            )}
            Upload
          </button>
          {images && images.length > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {images === null ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <GalleryImage
                  key={img.id}
                  image={img}
                  index={idx}
                  selected={selected.has(img.id)}
                  alreadyUsed={alreadyUsedIds.has(img.id)}
                  onToggle={() => handleToggle(img.id)}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
