import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiFetch } from "@/lib/axios"

export type PurchasedChapter = {
  chapterId: string
  chapterTitle: string
  chapterSlug: string
  chapterNumber: number
  isPremium: boolean
  price: number
  workId: string
  workSlug: string
  workTitle: string
  purchaseStatus: string
}

export type PurchasedBundle = {
  bundleId: string
  bundleTitle: string
  bundleSlug: string
  price: number
  workTitle: string
  workSlug: string
  workCoverUrl: string | null
  chapterCount: number
  purchaseStatus: string
  purchasedAt: string
}

export type UserPurchases = {
  chapters: PurchasedChapter[]
  bundles: PurchasedBundle[]
}

export type PendingBundlePayment = {
  id: string
  bundleId: string
  bundleTitle: string
  bundleSlug: string
  amount: number
  workTitle: string
  chapterCount: number
  paymentProofUrl: string | null
  createdAt: string
}

export const userKeys = {
  all: ["user"] as const,
  purchases: () => [...userKeys.all, "purchases"] as const,
  pendingPayments: () => [...userKeys.all, "pending-payments"] as const,
  progress: (workId: string) => [...userKeys.all, "progress", workId] as const,
}

export async function fetchUserPurchases() {
  const { data } = await api.get<UserPurchases>("/api/user/purchases")
  return data
}

export type UserProgress = {
  chapterSlug: string
  chapterNumber: number
  chapterTitle: string
} | null

export async function fetchUserProgress(workId: string, cookie?: string) {
  return apiFetch<UserProgress>(`/api/user/progress/${workId}`, { cookie })
}

export async function fetchUserPendingPayments() {
  const { data } = await api.get<PendingBundlePayment[]>("/api/user/pending-payments")
  return data
}

export function useUserPurchases(enabled: boolean) {
  return useQuery({
    queryKey: userKeys.purchases(),
    queryFn: fetchUserPurchases,
    enabled,
  })
}

export function useUserPendingPayments(enabled: boolean) {
  return useQuery({
    queryKey: userKeys.pendingPayments(),
    queryFn: fetchUserPendingPayments,
    enabled,
  })
}
