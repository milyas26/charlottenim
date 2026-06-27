import { updateChapter, deleteChapter, getChapterBySlug, getChapterById } from "@/lib/queries"
import type { Chapter } from "@/data/types"

async function findChapter(slug: string, chapterId: string): Promise<Chapter | null> {
  const byId = await getChapterById(chapterId)
  if (byId) return byId
  return getChapterBySlug(slug, chapterId)
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; chapterId: string }> }) {
  try {
    const { slug, chapterId } = await params
    const chapter = await findChapter(slug, chapterId)
    if (!chapter) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }
    return Response.json(chapter)
  } catch (error) {
    console.error("GET /api/admin/works/[slug]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal mengambil data chapter" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string; chapterId: string }> }) {
  try {
    const { slug, chapterId } = await params
    const body = await req.json()

    const chapter = await findChapter(slug, chapterId)
    if (!chapter) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }

    const updated = await updateChapter(chapter.id, body)
    if (!updated) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }
    return Response.json(updated)
  } catch (error) {
    console.error("PUT /api/admin/works/[slug]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal mengupdate chapter" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string; chapterId: string }> }) {
  try {
    const { slug, chapterId } = await params

    const chapter = await findChapter(slug, chapterId)
    if (!chapter) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }

    const deleted = await deleteChapter(chapter.id)
    if (!deleted) {
      return Response.json({ error: "Chapter tidak ditemukan" }, { status: 404 })
    }
    return Response.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/works/[slug]/chapters/[chapterId] error:", error)
    return Response.json({ error: "Gagal menghapus chapter" }, { status: 500 })
  }
}
