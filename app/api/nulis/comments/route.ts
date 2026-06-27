import { requireAdmin } from "@/lib/auth-guard"

export async function GET(req: Request) {
  try {
    await requireAdmin(req)
    return Response.json([])
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/comments error:", error)
    return Response.json({ error: "Gagal mengambil data komentar" }, { status: 500 })
  }
}
