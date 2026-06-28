import { incrementChapterRead } from "@/lib/queries"

export async function POST(req: Request) {
  try {
    const { chapterId } = await req.json()

    if (!chapterId) {
      return Response.json({ error: "chapterId is required" }, { status: 400 })
    }

    await incrementChapterRead(chapterId)
    return Response.json({ ok: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("POST /api/chapters/read error:", error)
    return Response.json({ error: "Gagal mencatat pembacaan" }, { status: 500 })
  }
}
