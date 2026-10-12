"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAdminImages, deleteAdminImage, adminKeys } from "@/lib/api/admin"
import { uploadFile, getUploadErrorMessage } from "@/lib/api/upload"
import { AlertCircle, Check, Loader2, Plus, RotateCw, Trash2, X } from "lucide-react"
import { toast } from "sonner"

interface ImageData {
  id: string
  url: string
  order: number
}

interface PendingUpload {
  tempId: string
  file: File
  previewUrl: string
  progress: number
  status: "queued" | "uploading" | "error" | "done"
  url?: string
}

const MAX_FILE_SIZE = 2 * 1024 * 1024

// Animasi linear progress indeterminate ala Material UI
const LINEAR_INDETERMINATE_CSS = `
@keyframes bucket-linear-indeterminate-1 {
  0% { left: -35%; right: 100%; }
  60%, 100% { left: 100%; right: -90%; }
}
@keyframes bucket-linear-indeterminate-2 {
  0% { left: -200%; right: 100%; }
  60%, 100% { left: 107%; right: -8%; }
}
`

// Upload yang sudah selesai tetap di slotnya sampai semua upload sebelumnya juga
// selesai/dibatalkan, baru dilepas ke daftar gambar utama — posisinya tidak lompat
function flushDone(list: PendingUpload[]) {
  const firstUnfinished = list.findIndex((u) => u.status !== "done")
  const flushCount = firstUnfinished === -1 ? list.length : firstUnfinished
  if (flushCount === 0) return list
  list.slice(0, flushCount).forEach((u) => URL.revokeObjectURL(u.previewUrl))
  return list.slice(flushCount)
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

function PendingImage({
  upload,
  index,
  onRetry,
  onDismiss,
}: {
  upload: PendingUpload
  index: number
  onRetry: () => void
  onDismiss: () => void
}) {
  const failed = upload.status === "error"
  const done = upload.status === "done"
  return (
    <div
      className={`relative rounded-[16px] bg-secondary overflow-hidden aspect-square ${
        failed ? "ring-2 ring-inset ring-destructive" : ""
      }`}
    >
      <div className="absolute top-1.5 left-1.5 z-10">
        <span className="bg-card/90 text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full shadow-sm select-none">
          {index + 1}
        </span>
      </div>
      {failed && (
        <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5">
          <button
            onClick={onRetry}
            className="size-7 inline-flex items-center justify-center rounded-full bg-card/90 shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Upload ulang"
          >
            <RotateCw className="size-3.5" />
          </button>
          <button
            onClick={onDismiss}
            className="size-7 inline-flex items-center justify-center rounded-full bg-card/90 shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
            title="Batalkan"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
      <img
        src={upload.previewUrl}
        alt={upload.file.name}
        className={`w-full h-full object-contain p-2 ${done ? "" : "opacity-50"}`}
      />
      {!done && (
      <div className="absolute inset-x-3 bottom-3 z-10">
        {failed ? (
          <div className="flex items-center justify-center gap-1 bg-destructive text-destructive-foreground text-[11px] font-semibold px-2 py-1 rounded-full shadow-sm select-none">
            <AlertCircle className="size-3" />
            Gagal upload
          </div>
        ) : (
          <div className="bg-card/90 rounded-full p-1 shadow-sm">
            <div
              role="progressbar"
              aria-label="Mengupload"
              aria-valuenow={upload.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="relative h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden"
            >
              <style href="bucket-linear-indeterminate" precedence="default">
                {LINEAR_INDETERMINATE_CSS}
              </style>
              <div
                className="absolute inset-y-0 rounded-full bg-foreground/35"
                style={{
                  animation:
                    "bucket-linear-indeterminate-1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite",
                }}
              />
              <div
                className="absolute inset-y-0 rounded-full bg-foreground/35"
                style={{
                  animation:
                    "bucket-linear-indeterminate-2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite",
                }}
              />
            </div>
          </div>
        )}
      </div>
      )}
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

  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([])
  const pendingRef = useRef(pendingUploads)
  pendingRef.current = pendingUploads

  useEffect(
    () => () => pendingRef.current.forEach((u) => URL.revokeObjectURL(u.previewUrl)),
    [],
  )

  const updatePending = useCallback((tempId: string, patch: Partial<PendingUpload>) => {
    setPendingUploads((prev) =>
      flushDone(prev.map((u) => (u.tempId === tempId ? { ...u, ...patch } : u))),
    )
  }, [])

  const removePending = useCallback((tempId: string) => {
    setPendingUploads((prev) => {
      const target = prev.find((u) => u.tempId === tempId)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return flushDone(prev.filter((u) => u.tempId !== tempId))
    })
  }, [])

  // Upload dijalankan berurutan (satu per satu) supaya urutan gambar di server
  // sama dengan urutan file yang dipilih
  const queueRef = useRef<{ tempId: string; file: File }[]>([])
  const runningRef = useRef(false)

  const runQueue = useCallback(async () => {
    if (runningRef.current) return
    runningRef.current = true
    try {
      let next: { tempId: string; file: File } | undefined
      while ((next = queueRef.current.shift())) {
        const { tempId, file } = next
        updatePending(tempId, { status: "uploading", progress: 0 })
        try {
          const url = await uploadFile(file, "CONTENT", workId, chapterId, (progress) =>
            updatePending(tempId, { progress }),
          )
          // Tunggu daftar gambar ter-refetch dulu supaya tidak ada kedipan saat preview diganti
          await queryClient.invalidateQueries({ queryKey: adminKeys.images(workId, chapterId) })
          updatePending(tempId, { status: "done", progress: 100, url })
        } catch (error) {
          updatePending(tempId, { status: "error" })
          toast.error(`Gagal upload ${file.name}`, { description: getUploadErrorMessage(error) })
        }
      }
    } finally {
      runningRef.current = false
    }
  }, [workId, chapterId, queryClient, updatePending])

  const enqueueUpload = useCallback(
    (tempId: string, file: File) => {
      updatePending(tempId, { status: "queued", progress: 0 })
      queueRef.current.push({ tempId, file })
      runQueue()
    },
    [updatePending, runQueue],
  )

  // Gambar yang masih "ditahan" di slot pending disembunyikan dari daftar utama agar tidak dobel
  const visibleImages = useMemo(() => {
    const heldUrls = new Set(pendingUploads.flatMap((u) => (u.url ? [u.url] : [])))
    return heldUrls.size > 0 ? images.filter((img) => !heldUrls.has(img.url)) : images
  }, [images, pendingUploads])

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
      const files = Array.from(e.target.files ?? [])
      e.target.value = ""
      if (files.length === 0) return

      const valid: PendingUpload[] = []
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} bukan file gambar`)
          continue
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} melebihi 2MB`)
          continue
        }
        valid.push({
          tempId: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          progress: 0,
          status: "queued",
        })
      }
      if (valid.length === 0) return

      setPendingUploads((prev) => [...prev, ...valid])
      valid.forEach((u) => {
        queueRef.current.push({ tempId: u.tempId, file: u.file })
      })
      runQueue()
    },
    [runQueue],
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
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-secondary text-[13px] font-medium text-foreground hover:brightness-95 transition disabled:opacity-50"
          >
            <Plus className="size-3.5" />
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
              {visibleImages.map((img, idx) => (
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
              {pendingUploads.map((upload, idx) => (
                <PendingImage
                  key={upload.tempId}
                  upload={upload}
                  index={visibleImages.length + idx}
                  onRetry={() => enqueueUpload(upload.tempId, upload.file)}
                  onDismiss={() => removePending(upload.tempId)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
