"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import api from "@/lib/axios"
import { Check, Loader2, Plus, Trash2, GripVertical } from "lucide-react"
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
  onInsertImage: (url: string) => void
}

function SortableImage({
  image,
  index,
  selected,
  onToggle,
  onDelete,
  deleting,
}: {
  image: ImageData
  index: number
  selected: boolean
  onToggle: () => void
  onDelete: (id: string) => void
  deleting: string | null
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg border border-border bg-muted/30 overflow-hidden"
    >
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
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded bg-background/80 hover:bg-accent cursor-grab active:cursor-grabbing"
          title="Geser untuk urutkan"
        >
          <GripVertical className="size-3.5" />
        </button>
      </div>
      <button
        onClick={onToggle}
        className={`
          block w-full aspect-square cursor-pointer relative
          ${selected ? "ring-2 ring-primary ring-inset" : ""}
        `}
        title="Klik untuk pilih"
      >
        <img
          src={image.url}
          alt={`Gambar ${index + 1}`}
          className="w-full h-full object-contain p-2"
          loading="lazy"
        />
        {selected && (
          <div className="absolute inset-0 bg-primary/15 flex items-center justify-center">
            <Check className="size-6 text-primary" strokeWidth={3} />
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
  onInsertImage,
}: ImageBucketModalProps) {
  const [images, setImages] = useState<ImageData[] | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const refresh = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.set("workId", workId)
      if (chapterId) params.set("chapterId", chapterId)
      const { data } = await api.get(`/api/nulis/images?${params.toString()}`)
      setImages(data)
    } catch {
      toast.error("Gagal mengambil daftar gambar")
      setImages([])
    }
  }, [workId, chapterId])

  useEffect(() => {
    if (open) {
      setSelected(new Set())
      refresh()
    }
  }, [open, refresh])

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

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      if (!images) return

      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      const reordered = arrayMove(images, oldIndex, newIndex)
      setImages(reordered)

      try {
        await api.patch("/api/nulis/images/reorder", {
          imageIds: reordered.map((img) => img.id),
        })
      } catch {
        toast.error("Gagal menyimpan urutan")
        setImages(images)
      }
    },
    [images],
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <SortableImage
                      key={img.id}
                      image={img}
                      index={idx}
                      selected={selected.has(img.id)}
                      onToggle={() => handleToggle(img.id)}
                      onDelete={handleDelete}
                      deleting={deleting}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
