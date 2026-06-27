import { verifyJwt, type JwtPayload } from "./jwt"
import { cookies } from "next/headers"

async function getDbUserFromCookie(): Promise<JwtPayload | null> {
  try {
    const jar = await cookies()
    const raw = jar.get("user-data")?.value
    if (!raw) return null
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (parsed.id && parsed.email && parsed.role) {
      return {
        userId: parsed.id,
        email: parsed.email,
        role: parsed.role,
        name: parsed.name ?? null,
        avatarUrl: parsed.avatarUrl ?? null,
      }
    }
    return null
  } catch {
    return null
  }
}

export async function requireAuth(req: Request): Promise<JwtPayload> {
  const authHeader = req.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split("Bearer ")[1]
    try {
      return await verifyJwt(token)
    } catch {
      // fall through to cookie check
    }
  }

  const fromCookie = await getDbUserFromCookie()
  if (fromCookie) return fromCookie

  throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
}

export async function requireAdmin(req: Request): Promise<{ userId: string }> {
  const payload = await requireAuth(req)
  if (payload.role !== "ADMIN") {
    throw new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  }
  return { userId: payload.userId }
}
