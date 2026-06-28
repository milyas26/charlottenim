import { requireAdmin } from "@/lib/auth-guard"
import { getAllCommentsAdmin } from "@/lib/queries"

const VALID_LIMITS = [10, 25, 50, 100, 200]

export async function GET(req: Request) {
  try {
    await requireAdmin(req)

    const url = new URL(req.url)
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10))
    const limitRaw = parseInt(url.searchParams.get("limit") || "50", 10)
    const limit = VALID_LIMITS.includes(limitRaw) ? limitRaw : 50
    const search = url.searchParams.get("search") || ""

    const result = await getAllCommentsAdmin(page, limit, search)
    return Response.json(result)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/comments error:", error)
    return Response.json({ error: "Gagal mengambil data komentar" }, { status: 500 })
  }
}
