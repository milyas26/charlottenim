import { requireAdmin } from "@/lib/auth-guard"
import { getAllCommentsAdmin } from "@/lib/queries"

export async function GET(req: Request) {
  try {
    await requireAdmin(req)
    const comments = await getAllCommentsAdmin()
    return Response.json(comments)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/comments error:", error)
    return Response.json({ error: "Gagal mengambil data komentar" }, { status: 500 })
  }
}
