import { requireAuth } from "@/lib/auth-guard"
import { upsertReadingProgress } from "@/lib/queries"

export async function POST(req: Request) {
  try {
    const { userId } = await requireAuth(req)
    const { workId, chapterId } = await req.json()

    if (!workId || !chapterId) {
      return Response.json({ error: "workId and chapterId are required" }, { status: 400 })
    }

    await upsertReadingProgress(userId, workId, chapterId)
    return Response.json({ ok: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("POST /api/user/progress error:", error)
    return Response.json({ error: "Gagal menyimpan progres" }, { status: 500 })
  }
}
