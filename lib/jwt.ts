import { SignJWT, jwtVerify } from "jose"

export interface JwtPayload {
  userId: string
  email: string
  role: "READER" | "ADMIN"
  name: string | null
  avatarUrl: string | null
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function signJwt(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as unknown as JwtPayload
}
