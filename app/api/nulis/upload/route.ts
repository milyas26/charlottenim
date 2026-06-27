import { requireAdmin } from "@/lib/auth-guard"
import { uploadToS3, generateKey, getExtFromContentType } from "@/lib/s3"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    await requireAdmin(req)
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as string | null
    const workId = formData.get("workId") as string | null
    const chapterId = formData.get("chapterId") as string | null

    if (!file) {
      return Response.json({ error: "File wajib diupload" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "File harus berupa gambar" }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return Response.json({ error: "Ukuran file maksimal 2MB" }, { status: 400 })
    }

    if (!type || !["COVER", "CONTENT"].includes(type)) {
      return Response.json({ error: "Tipe gambar harus COVER atau CONTENT" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = getExtFromContentType(file.type)
    const key = generateKey(ext)
    const url = await uploadToS3(buffer, file.type, key)

    const image = await prisma.image.create({
      data: {
        type: type as "COVER" | "CONTENT",
        url,
        key,
        workId: workId || null,
        chapterId: chapterId || null,
      },
    })

    return Response.json({ url, id: image.id })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("POST /api/nulis/upload error:", error)
    return Response.json({ error: "Gagal upload file" }, { status: 500 })
  }
}
