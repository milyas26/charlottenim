import { requireAdmin } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    await requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const workId = searchParams.get("workId")
    const chapterId = searchParams.get("chapterId")

    if (!workId && !chapterId) {
      return Response.json({ error: "workId atau chapterId wajib" }, { status: 400 })
    }

    const where: Record<string, string> = {}
    if (workId) where.workId = workId
    if (chapterId) where.chapterId = chapterId

    const images = await prisma.image.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, url: true, key: true, type: true, order: true, createdAt: true },
    })

    return Response.json(images)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/images error:", error)
    return Response.json({ error: "Gagal mengambil data gambar" }, { status: 500 })
  }
}
