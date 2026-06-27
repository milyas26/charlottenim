import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"
import { deleteFromS3 } from "@/lib/s3"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params

    const image = await prisma.image.findUnique({ where: { id } })
    if (!image) {
      return Response.json({ error: "Gambar tidak ditemukan" }, { status: 404 })
    }

    await deleteFromS3(image.key)
    await prisma.image.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("DELETE /api/nulis/images/[id] error:", error)
    return Response.json({ error: "Gagal menghapus gambar" }, { status: 500 })
  }
}
