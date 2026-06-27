import { prisma } from "@/lib/prisma"
import { setDbUserCookie, type DbUser } from "@/lib/cookies"

export async function POST(req: Request) {
  const { firebaseUid, email, name, avatarUrl } = await req.json()

  if (!firebaseUid || !email) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const user = await prisma.user.upsert({
    where: { firebaseUid },
    update: { name, avatarUrl },
    create: { firebaseUid, email, name, avatarUrl },
  })

  const dbUser: DbUser = {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role as DbUser["role"],
  }

  const response = Response.json(dbUser)
  response.headers.set("Set-Cookie", setDbUserCookie(dbUser))
  return response
}
