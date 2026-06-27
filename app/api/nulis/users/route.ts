import { getAllUsers } from "@/lib/queries"
import { requireAdmin } from "@/lib/auth-guard"

export async function GET(req: Request) {
  try {
    await requireAdmin(req)
    const users = await getAllUsers()
    return Response.json(users)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/nulis/users error:", error)
    return Response.json({ error: "Gagal mengambil data user" }, { status: 500 })
  }
}
