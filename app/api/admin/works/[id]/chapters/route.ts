import { getChaptersByWorkIdLight, createChapterByWorkId } from "@/lib/queries"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const chapters = await getChaptersByWorkIdLight(id)
    return Response.json(chapters)
  } catch (error) {
    console.error("GET /api/admin/works/[id]/chapters error:", error)
    return Response.json({ error: "Gagal mengambil data chapter" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
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
    console.error("POST /api/admin/works/[id]/chapters error:", error)
    return Response.json({ error: "Gagal membuat chapter" }, { status: 500 })
  }
}
