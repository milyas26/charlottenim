import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

const JWT_KEY = "auth-jwt"

export function getStoredJwt(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(JWT_KEY)
}

export function setStoredJwt(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(JWT_KEY, token)
  }
}

export function clearStoredJwt() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(JWT_KEY)
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const jwt = getStoredJwt()
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // if (error?.response?.status === 401) {
      //   clearStoredJwt()
      //   window.location.replace("/")
      // }
      return Promise.reject(error)
    }
  )
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit & { cookie?: string },
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  }

  if (options?.cookie) {
    headers.Cookie = options.cookie
    delete (options as Record<string, unknown>).cookie
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export function getApiUrl(): string {
  return API_URL
}

export default api
