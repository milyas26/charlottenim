import axios from "axios"

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
  baseURL: "",
  headers: { "Content-Type": "application/json" },
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
      if (error?.response?.status === 401) {
        clearStoredJwt()
        window.location.replace("/")
      }
      return Promise.reject(error)
    }
  )
}

export default api
