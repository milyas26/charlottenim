import api from "@/lib/axios"
import type { DbUser } from "@/lib/cookies"

export async function syncUser(payload: {
  firebaseUid: string
  email: string | null
  name: string | null
  avatarUrl: string | null
}) {
  const { data } = await api.post<DbUser>("/api/auth/sync", payload)
  return data
}

export async function loginWithFirebase(firebaseUid: string) {
  const { data } = await api.post<{ jwt: string; user: DbUser }>("/api/auth/login", { firebaseUid })
  return data
}

export async function logoutUser() {
  await api.post("/api/auth/logout")
}
