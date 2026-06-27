import { prisma } from "@/lib/prisma"

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

  return Response.json(user)
}
