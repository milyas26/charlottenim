import { getWorkById, updateWorkById, deleteWorkById } from "@/lib/queries"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const work = await getWorkById(id)
    if (!work) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json(work)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/works/[id] error:", error)
    return Response.json({ error: "Gagal mengambil data karya" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const body = await req.json()
    const updated = await updateWorkById(id, body)
    if (!updated) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json(updated)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("PUT /api/nulis/works/[id] error:", error)
    return Response.json({ error: "Gagal mengupdate karya" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const deleted = await deleteWorkById(id)
    if (!deleted) {
      return Response.json({ error: "Karya tidak ditemukan" }, { status: 404 })
    }
    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("DELETE /api/nulis/works/[id] error:", error)
    return Response.json({ error: "Gagal menghapus karya" }, { status: 500 })
  }
}
