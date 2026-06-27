import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request) {
  try {
    await requireAdmin(req)
    const { imageIds } = await req.json()

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return Response.json({ error: "imageIds harus berupa array non-kosong" }, { status: 400 })
    }

    await prisma.$transaction(
      imageIds.map((id: string, idx: number) =>
        prisma.image.update({ where: { id }, data: { order: idx } }),
      ),
    )

    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("PATCH /api/nulis/images/reorder error:", error)
    return Response.json({ error: "Gagal mengurutkan gambar" }, { status: 500 })
  }
}
