import { getChaptersByWorkIdLight, createChapterByWorkId } from "@/lib/queries"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const chapters = await getChaptersByWorkIdLight(id)
    return Response.json(chapters)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/works/[id]/chapters error:", error)
    return Response.json({ error: "Gagal mengambil data chapter" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const body = await req.json()
    const { chapterNumber, chapterSlug: chSlug, title, content, isPremium, price, status } = body

    if (chapterNumber === undefined || !chSlug || !title || !content) {
      return Response.json({ error: "Chapter number, slug, title, dan content wajib diisi" }, { status: 400 })
    }

    const chapter = await createChapterByWorkId(id, {
      chapterNumber,
      slug: chSlug,
      title,
      content,
      isPremium,
      price,
      status,
    })

    if (!chapter) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }

    return Response.json(chapter, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("POST /api/nulis/works/[id]/chapters error:", error)
    return Response.json({ error: "Gagal membuat chapter" }, { status: 500 })
  }
}
