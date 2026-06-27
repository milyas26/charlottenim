import { getAllWorks, createWork } from "@/lib/queries"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET(req: Request) {
  try {
    await requireAdmin(req)
    const works = await getAllWorks()
    return Response.json(works)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/works error:", error)
    return Response.json({ error: "Gagal mengambil data karya" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const { title, slug, synopsis, coverUrl, genres, status } = body

    if (!title || !slug || !synopsis) {
      return Response.json({ error: "Title, slug, dan synopsis wajib diisi" }, { status: 400 })
    }

    const work = await createWork({ title, slug, synopsis, coverUrl, genres, status })
    return Response.json(work, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("POST /api/nulis/works error:", error)
    return Response.json({ error: "Gagal membuat karya" }, { status: 500 })
  }
}
