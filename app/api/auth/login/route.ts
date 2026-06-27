import { signJwt } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

async function verifyFirebaseToken(idToken: string): Promise<{ uid: string; email: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  )
  const data = await res.json()
  if (!res.ok || !data.users?.[0]) return null
  const user = data.users[0]
  return { uid: user.localId, email: user.email }
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json()
    if (!idToken) {
      return Response.json({ error: "idToken wajib diisi" }, { status: 400 })
    }

    const verified = await verifyFirebaseToken(idToken)
    if (!verified) {
      return Response.json({ error: "Token tidak valid" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({ where: { email: verified.email } })
    if (!dbUser) {
      return Response.json({ error: "User belum terdaftar. Lakukan sync terlebih dahulu." }, { status: 404 })
    }

    const jwt = await signJwt({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as "READER" | "ADMIN",
      name: dbUser.name,
      avatarUrl: dbUser.avatarUrl,
    })

    return Response.json({ jwt, user: { id: dbUser.id, email: dbUser.email, name: dbUser.name, avatarUrl: dbUser.avatarUrl, role: dbUser.role } })
  } catch (error) {
    console.error("POST /api/auth/login error:", error)
    return Response.json({ error: "Gagal login" }, { status: 500 })
  }
}
