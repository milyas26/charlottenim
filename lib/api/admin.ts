import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiFetch } from "@/lib/axios"
import type { AdminStats, AdminUser, Purchase } from "@/data/admin-types"

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  orders: () => [...adminKeys.all, "orders"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  userDetail: (id: string) => [...adminKeys.all, "user", id] as const,
  images: (workId: string, chapterId?: string) => [...adminKeys.all, "images", workId, chapterId] as const,
}

export async function fetchAdminStats(cookie?: string) {
  return apiFetch<AdminStats>("/api/nulis/stats", { cookie })
}

export async function fetchAdminOrders() {
  const { data } = await api.get<Purchase[]>("/api/nulis/orders")
  return data
}

export async function fetchAdminOrdersServer(cookie?: string) {
  return apiFetch<Purchase[]>("/api/nulis/orders", { cookie })
}

export async function fetchAdminUsers() {
  const { data } = await api.get<AdminUser[]>("/api/nulis/users")
  return data
}

export type UserDetail = AdminUser & { purchases: Purchase[] }

export async function fetchAdminUserDetail(id: string) {
  const { data } = await api.get<UserDetail>(`/api/nulis/users/${id}`)
  return data
}

export interface ImageData {
  id: string
  url: string
  order: number
}

export async function fetchAdminImages(workId: string, chapterId?: string) {
  const params = new URLSearchParams()
  params.set("workId", workId)
  if (chapterId) params.set("chapterId", chapterId)
  const { data } = await api.get<ImageData[]>(`/api/nulis/images?${params.toString()}`)
  return data.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return new Date(a.id).getTime() - new Date(b.id).getTime()
  })
}

export async function deleteAdminImage(id: string) {
  await api.delete(`/api/nulis/images/${id}`)
}

export function useAdminOrders() {
  return useQuery({
    queryKey: adminKeys.orders(),
    queryFn: fetchAdminOrders,
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: fetchAdminUsers,
  })
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: adminKeys.userDetail(id),
    queryFn: () => fetchAdminUserDetail(id),
  })
}

export function useAdminImages(workId: string, chapterId?: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.images(workId, chapterId),
    queryFn: () => fetchAdminImages(workId, chapterId),
    enabled,
  })
}
