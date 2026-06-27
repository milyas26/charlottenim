import { getWorkById, updateWorkById, deleteWorkById } from "@/lib/queries"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const work = await getWorkById(id)
    if (!work) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json(work)
  } catch (error) {
    console.error("GET /api/admin/works/[id] error:", error)
    return Response.json({ error: "Gagal mengambil data karya" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const updated = await updateWorkById(id, body)
    if (!updated) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json(updated)
  } catch (error) {
    console.error("PUT /api/admin/works/[id] error:", error)
    return Response.json({ error: "Gagal mengupdate karya" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await deleteWorkById(id)
    if (!deleted) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/works/[id] error:", error)
    return Response.json({ error: "Gagal menghapus karya" }, { status: 500 })
  }
}
