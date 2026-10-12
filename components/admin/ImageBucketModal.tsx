"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAdminImages, deleteAdminImage, adminKeys } from "@/lib/api/admin"
import { uploadMultipleFiles } from "@/lib/api/upload"
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
  deleting: boolean
}) {
  return (
    <div className="relative group rounded-[16px] bg-secondary overflow-hidden">
      <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1">
        <span className="bg-card/90 text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full shadow-sm select-none">
          {index + 1}
        </span>
      </div>
      <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(image.id)
          }}
          disabled={deleting}
          className="size-7 inline-flex items-center justify-center rounded-full bg-card/90 shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
          title="Hapus gambar"
        >
          {deleting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </button>
      </div>
      <button
        onClick={onToggle}
        className={`block w-full aspect-square cursor-pointer relative rounded-[16px] transition-all ${
          selected
            ? "ring-2 ring-inset ring-primary"
            : alreadyUsed
              ? "ring-2 ring-inset ring-sky-400"
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
            <div className="absolute top-1.5 left-8 z-10 flex items-center justify-center size-5 rounded-full bg-primary shadow-sm">
              <Check className="size-3 text-primary-foreground" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 bg-primary/10" />
          </>
        )}
        {alreadyUsed && (
          <div className="absolute bottom-1.5 right-1.5 z-10">
            <span className="bg-foreground/70 text-background text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm select-none">
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
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sortImages = (images: ImageData[]) =>
    [...images].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order
      return new Date(a.id).getTime() - new Date(b.id).getTime()
    })

  const { data: images = [], isLoading } = useAdminImages(workId, chapterId, open)

  const uploadMutation = useMutation({
    mutationFn: ({ files }: { files: FileList }) => uploadMultipleFiles(files, workId, chapterId),
    onSuccess: (success: number) => {
      if (success > 0) {
        toast.success(`${success} gambar berhasil diupload`)
        queryClient.invalidateQueries({ queryKey: adminKeys.images(workId, chapterId) })
      }
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
    onError: () => {
      toast.error("Gagal upload gambar")
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdminImage,
    onSuccess: (_data, id) => {
      toast.success("Gambar berhasil dihapus")
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      queryClient.invalidateQueries({ queryKey: adminKeys.images(workId, chapterId) })
    },
    onError: () => {
      toast.error("Gagal menghapus gambar")
    },
  })

  const existingUrlSet = useMemo(
    () => new Set(existingImageUrls ?? []),
    [existingImageUrls],
  )

  const alreadyUsedIdsMemo = useMemo(() => {
    if (!open) return new Set<string>()
    if (existingUrlSet.size > 0 && images.length > 0) {
      const matchedIds = images
        .filter((img) => existingUrlSet.has(img.url))
        .map((img) => img.id)
      return new Set<string>(matchedIds)
    }
    return new Set<string>()
  }, [open, existingUrlSet, images])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen) setSelected(new Set())
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return
      uploadMutation.mutate({ files })
    },
    [uploadMutation],
  )

  const handleAddSelectedToEditor = useCallback(() => {
    const sortedUrls = images
      .filter((img) => selected.has(img.id))
      .map((img) => img.url)
    if (sortedUrls.length > 0) {
      sortedUrls.forEach((url) => onInsertImage(url))
    }
    onOpenChange(false)
  }, [images, selected, onInsertImage, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[720px] h-[580px] max-w-none max-h-none flex flex-col p-0 gap-2 rounded-[24px] overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0 shrink-0 mb-0">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-[17px] font-semibold tracking-[-0.02em]">Bucket gambar</DialogTitle>
            {selected.size > 0 && (
              <button
                onClick={handleAddSelectedToEditor}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors shrink-0"
              >
                <Check className="size-3.5" />
                Tambah ke editor ({selected.size})
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="shrink-0 px-5 py-1 flex gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-secondary text-[13px] font-medium text-foreground hover:brightness-95 transition disabled:opacity-50"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Plus className="size-3.5" />
            )}
            Upload
          </button>
          {images.length > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-secondary text-[13px] font-medium text-foreground hover:brightness-95 transition disabled:opacity-50"
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

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <GalleryImage
                  key={img.id}
                  image={img}
                  index={idx}
                  selected={selected.has(img.id)}
                  alreadyUsed={alreadyUsedIdsMemo.has(img.id)}
                  onToggle={() => handleToggle(img.id)}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  deleting={deleteMutation.isPending && deleteMutation.variables === img.id}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
