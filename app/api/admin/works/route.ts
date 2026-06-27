import { getAllWorks, createWork } from "@/lib/queries"

export async function GET() {
  try {
    const works = await getAllWorks()
    return Response.json(works)
  } catch (error) {
    console.error("GET /api/admin/works error:", error)
    return Response.json({ error: "Gagal mengambil data karya" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, slug, synopsis, coverUrl, genres, status } = body

    if (!title || !slug || !synopsis) {
      return Response.json({ error: "Title, slug, dan synopsis wajib diisi" }, { status: 400 })
    }

    const work = await createWork({ title, slug, synopsis, coverUrl, genres, status })
    return Response.json(work, { status: 201 })
  } catch (error) {
    console.error("POST /api/admin/works error:", error)
    return Response.json({ error: "Gagal membuat karya" }, { status: 500 })
  }
}
