import { reorderChaptersByWorkId } from "@/lib/queries"
import { requireAdmin } from "@/lib/auth-guard"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const { chapterIds } = await req.json()

    if (!Array.isArray(chapterIds) || chapterIds.length === 0) {
      return Response.json({ error: "chapterIds harus berupa array non-kosong" }, { status: 400 })
    }

    const result = await reorderChaptersByWorkId(id, chapterIds)
    if (!result) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("PUT /api/admin/works/[id]/chapters/reorder error:", error)
    return Response.json({ error: "Gagal mengurutkan chapter" }, { status: 500 })
  }
}
