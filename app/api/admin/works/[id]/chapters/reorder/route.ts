import { reorderChaptersByWorkId } from "@/lib/queries"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
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
    console.error("PUT /api/admin/works/[id]/chapters/reorder error:", error)
    return Response.json({ error: "Gagal mengurutkan chapter" }, { status: 500 })
  }
}
