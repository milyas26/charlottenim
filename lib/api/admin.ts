import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiFetch } from "@/lib/axios"
import type { AdminStats, AdminUser, Purchase } from "@/data/admin-types"

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  orders: (params?: Record<string, string>) => [...adminKeys.all, "orders", params] as const,
  pendingCount: () => [...adminKeys.all, "orders", "pending-count"] as const,
  users: (params?: Record<string, string>) => [...adminKeys.all, "users", params] as const,
  userDetail: (id: string) => [...adminKeys.all, "user", id] as const,
  images: (workId: string, chapterId?: string) => [...adminKeys.all, "images", workId, chapterId] as const,
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface OrderParams {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface UserParams {
  search?: string
  sortField?: string
  sortDir?: string
  page?: number
  limit?: number
}

export async function fetchAdminStats(cookie?: string) {
  return apiFetch<AdminStats>("/api/nulis/stats", { cookie })
}

export async function fetchAdminStatsClient() {
  const { data } = await api.get<AdminStats>("/api/nulis/stats")
  return data
}

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: fetchAdminStatsClient,
  })
}

export async function fetchAdminOrdersServer(cookie?: string) {
  return apiFetch<Purchase[]>("/api/nulis/orders", { cookie })
}

export async function fetchAdminUsers(params?: UserParams): Promise<PaginatedResponse<AdminUser>> {
  const qs = buildQuery(params as Record<string, string | number | undefined>)
  const { data } = await api.get<PaginatedResponse<AdminUser>>(`/api/nulis/users${qs}`)
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

function toQueryParams(params?: Record<string, string | number | undefined>): Record<string, string> | undefined {
  if (!params) return undefined
  const result: Record<string, string> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") result[k] = String(v)
  }
  return Object.keys(result).length > 0 ? result : undefined
}

function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return ""
  const sp = new URLSearchParams()
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "") sp.set(key, String(val))
  }
  const qs = sp.toString()
  return qs ? `?${qs}` : ""
}

export async function fetchAdminOrders(params?: OrderParams): Promise<PaginatedResponse<Purchase>> {
  const qs = buildQuery(params as Record<string, string | number | undefined>)
  const { data } = await api.get<PaginatedResponse<Purchase>>(`/api/nulis/orders${qs}`)
  return data
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

export async function approvePayment(purchaseId: string) {
  await api.patch(`/api/nulis/orders/${purchaseId}/approve`)
}

export async function rejectPayment(purchaseId: string, reason?: string) {
  await api.patch(`/api/nulis/orders/${purchaseId}/reject`, { reason })
}

export async function fetchPendingOrderCount() {
  const { data } = await api.get<{ count: number }>("/api/nulis/orders/pending-count")
  return data.count
}

export function usePendingOrderCount() {
  return useQuery({
    queryKey: adminKeys.pendingCount(),
    queryFn: fetchPendingOrderCount,
    refetchInterval: 30_000,
  })
}

export function useAdminOrders(params?: OrderParams) {
  const keyParams = toQueryParams(params as Record<string, string | number | undefined>)
  return useQuery({
    queryKey: adminKeys.orders(keyParams),
    queryFn: () => fetchAdminOrders(params),
    staleTime: 0,
  })
}

export function useAdminUsers(params?: UserParams) {
  const keyParams = toQueryParams(params as Record<string, string | number | undefined>)
  return useQuery({
    queryKey: adminKeys.users(keyParams),
    queryFn: () => fetchAdminUsers(params),
    staleTime: 0,
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
