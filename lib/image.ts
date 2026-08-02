export const MAX_IMAGE_INPUT_SIZE = 10 * 1024 * 1024
export const MAX_IMAGE_COMPRESS_SIZE = 1 * 1024 * 1024

const COMPRESS_STEPS = [
  { dimension: 1600, quality: 0.8 },
  { dimension: 1280, quality: 0.75 },
  { dimension: 1024, quality: 0.7 },
  { dimension: 800, quality: 0.6 },
]

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Gagal membaca gambar"))
    }
    img.src = url
  })
}

function toCompressedFile(blob: Blob, original: File): File {
  const base = original.name.replace(/\.[^.]+$/, "") || "bukti-pembayaran"
  return new File([blob], `${base}-compressed.jpg`, {
    type: "image/jpeg",
    lastModified: original.lastModified,
  })
}

export async function compressImage(
  file: File,
  maxBytes: number = MAX_IMAGE_COMPRESS_SIZE
): Promise<File> {
  if (file.size <= maxBytes) return file

  const img = await loadImage(file)
  const originalWidth = img.naturalWidth
  const originalHeight = img.naturalHeight

  let best: Blob | null = null
  let bestSize = Infinity

  for (const step of COMPRESS_STEPS) {
    const ratio = Math.min(step.dimension / originalWidth, step.dimension / originalHeight, 1)
    const width = Math.max(1, Math.round(originalWidth * ratio))
    const height = Math.max(1, Math.round(originalHeight * ratio))

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) continue

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", step.quality)
    )
    if (!blob) continue

    if (blob.size <= maxBytes) return toCompressedFile(blob, file)
    if (blob.size < bestSize) {
      bestSize = blob.size
      best = blob
    }
  }

  if (best) return toCompressedFile(best, file)
  return file
}
