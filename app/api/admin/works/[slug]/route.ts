import { getWorkBySlug, updateWork, deleteWork } from "@/lib/queries"

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const work = await getWorkBySlug(slug)
    if (!work) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json(work)
  } catch (error) {
    console.error("GET /api/admin/works/[slug] error:", error)
    return Response.json({ error: "Gagal mengambil data karya" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const body = await req.json()
    const updated = await updateWork(slug, body)
    if (!updated) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json(updated)
  } catch (error) {
    console.error("PUT /api/admin/works/[slug] error:", error)
    return Response.json({ error: "Gagal mengupdate karya" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const deleted = await deleteWork(slug)
    if (!deleted) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/works/[slug] error:", error)
    return Response.json({ error: "Gagal menghapus karya" }, { status: 500 })
  }
}
