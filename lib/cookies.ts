export interface DbUser {
  id: string
  name: string | null
  avatarUrl: string | null
  role: "READER" | "ADMIN"
}

const COOKIE_NAME = "user-data"

export function readDbUser(): DbUser | null {
  if (typeof document === "undefined") return null
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`))
    if (match) return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    // ignore
  }
  return null
}

export function clearDbUser() {
  if (typeof document === "undefined") return
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0`
}

export function setDbUserCookie(user: DbUser): string {
  const value = encodeURIComponent(JSON.stringify(user))
  const isSecure = process.env.NODE_ENV === "production"
  return `${COOKIE_NAME}=${value}; Path=/; SameSite=Lax; Max-Age=604800${isSecure ? "; Secure" : ""}`
}
