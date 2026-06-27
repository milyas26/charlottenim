import { verifyJwt, type JwtPayload } from "./jwt"

export async function requireAuth(req: Request): Promise<JwtPayload> {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const token = authHeader.split("Bearer ")[1]
  try {
    return await verifyJwt(token)
  } catch {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }
}

export async function requireAdmin(req: Request): Promise<{ userId: string }> {
  const payload = await requireAuth(req)
  if (payload.role !== "ADMIN") {
    throw new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 })
  }
  return { userId: payload.userId }
}
