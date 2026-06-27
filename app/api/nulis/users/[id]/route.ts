import { getUserWithPurchases } from "@/lib/queries"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const user = await getUserWithPurchases(id)
    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 })
    }
    return Response.json(user)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/users/[id] error:", error)
    return Response.json({ error: "Gagal mengambil data user" }, { status: 500 })
  }
}
