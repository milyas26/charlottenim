import { requireAuth } from "@/lib/auth-guard"
import { getComments, createComment } from "@/lib/queries"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const chapterId = searchParams.get("chapterId")
    if (!chapterId) {
      return Response.json({ error: "chapterId diperlukan" }, { status: 400 })
    }
    const comments = await getComments(chapterId)
    return Response.json(comments)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("GET /api/comments error:", error)
    return Response.json({ error: "Gagal mengambil komentar" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req)
    const { chapterId, content } = await req.json()

    if (!chapterId || !content?.trim()) {
      return Response.json({ error: "chapterId dan content diperlukan" }, { status: 400 })
    }

    if (content.trim().length > 1000) {
      return Response.json({ error: "Komentar maksimal 1000 karakter" }, { status: 400 })
    }

    const comment = await createComment(user.userId, chapterId, content.trim())
    return Response.json(comment, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("POST /api/comments error:", error)
    return Response.json({ error: "Gagal membuat komentar" }, { status: 500 })
  }
}
