import { requireAuth } from "@/lib/auth-guard"
import { getUserPurchasedChapters } from "@/lib/queries"

export async function GET(req: Request) {
  try {
    const { userId } = await requireAuth(req)
    const chapters = await getUserPurchasedChapters(userId)
    return Response.json(chapters)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/user/purchases error:", error)
    return Response.json({ error: "Gagal mengambil data pembelian" }, { status: 500 })
  }
}
