import { requireAuth } from "@/lib/auth-guard"
import { likeComment, toggleLikeByCharlotte } from "@/lib/queries"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req)
    const { id } = await params

    const comment =
      user.role === "ADMIN"
        ? await toggleLikeByCharlotte(id)
        : await likeComment(id)

    if (!comment) {
      return Response.json({ error: "Komentar tidak ditemukan" }, { status: 404 })
    }

    return Response.json(comment)
  } catch (error) {
    if (error instanceof Response) return error
    console.error("POST /api/comments/[id]/like error:", error)
    return Response.json({ error: "Gagal menyukai komentar" }, { status: 500 })
  }
}
