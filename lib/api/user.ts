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

export const userKeys = {
  all: ["user"] as const,
  purchases: () => [...userKeys.all, "purchases"] as const,
  progress: (workId: string) => [...userKeys.all, "progress", workId] as const,
}

export async function fetchUserPurchases() {
  const { data } = await api.get<PurchasedChapter[]>("/api/user/purchases")
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

export function useUserPurchases(enabled: boolean) {
  return useQuery({
    queryKey: userKeys.purchases(),
    queryFn: fetchUserPurchases,
    enabled,
  })
}
