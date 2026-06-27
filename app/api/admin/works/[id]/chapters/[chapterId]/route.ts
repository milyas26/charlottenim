import { updateChapter, deleteChapter, getChapterById } from "@/lib/queries"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  try {
    const { chapterId } = await params
    const chapter = await getChapterById(chapterId)
    if (!chapter) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }
    return Response.json(chapter)
  } catch (error) {
    console.error("GET /api/admin/works/[id]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal mengambil data chapter" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  try {
    const { chapterId } = await params
    const body = await req.json()

    const chapter = await getChapterById(chapterId)
    if (!chapter) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }

    const updated = await updateChapter(chapter.id, body)
    if (!updated) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }
    return Response.json(updated)
  } catch (error) {
    console.error("PUT /api/admin/works/[id]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal mengupdate chapter" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  try {
    const { chapterId } = await params

    const chapter = await getChapterById(chapterId)
    if (!chapter) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }

    const deleted = await deleteChapter(chapter.id)
    if (!deleted) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }
    return Response.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/works/[id]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal menghapus chapter" }, { status: 500 })
  }
}
