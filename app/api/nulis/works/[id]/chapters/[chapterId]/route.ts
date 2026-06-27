import { updateChapter, deleteChapter, getChapterById } from "@/lib/queries"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET(req: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  try {
    await requireAdmin(req)
    const { chapterId } = await params
    const chapter = await getChapterById(chapterId)
    if (!chapter) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }
    return Response.json(chapter)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/works/[id]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal mengambil data chapter" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  try {
    await requireAdmin(req)
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
    if (error instanceof Response) return error
    console.error("PUT /api/nulis/works/[id]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal mengupdate chapter" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; chapterId: string }> }) {
  try {
    await requireAdmin(req)
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
    if (error instanceof Response) return error
    console.error("DELETE /api/nulis/works/[id]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal menghapus chapter" }, { status: 500 })
  }
}
