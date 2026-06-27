import { getAllPurchases } from "@/lib/queries"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET(req: Request) {
  try {
    await requireAdmin(req)
    const purchases = await getAllPurchases()
    return Response.json(purchases)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/admin/orders error:", error)
    return Response.json({ error: "Gagal mengambil data order" }, { status: 500 })
  }
}
