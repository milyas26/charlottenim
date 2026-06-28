import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiFetch } from "@/lib/axios"
import type { Chapter, ChapterStatus } from "@/data/types"
import { worksKeys } from "./works"

export const chaptersKeys = {
  all: ["chapters"] as const,
  detail: (workSlug: string, chapterSlug: string) => [...chaptersKeys.all, "by-slug", workSlug, chapterSlug] as const,
  adjacent: (workSlug: string, chapterSlug: string) => [...chaptersKeys.all, "adjacent", workSlug, chapterSlug] as const,
  purchased: (chapterId: string) => [...chaptersKeys.all, "purchased", chapterId] as const,
  adminDetail: (workId: string, chapterId: string) => [...chaptersKeys.all, "admin", workId, chapterId] as const,
}

export async function fetchChapterBySlug(workSlug: string, chapterSlug: string): Promise<Chapter> {
  return apiFetch<Chapter>(`/api/chapters/by-slug/${workSlug}/${chapterSlug}`)
}

export async function fetchAdjacentChapters(workSlug: string, chapterSlug: string) {
  return apiFetch<{ prev: Chapter | null; next: Chapter | null }>(
    `/api/chapters/adjacent/${workSlug}/${chapterSlug}`
  )
}

export async function fetchChapterPurchased(chapterId: string, cookie?: string) {
  return apiFetch<{ purchased: boolean }>(`/api/chapters/${chapterId}/purchased`, { cookie })
}

export async function markChapterRead(chapterId: string) {
  await api.post("/api/chapters/read", { chapterId })
}

export async function fetchAdminChapter(workId: string, chapterId: string) {
  const { data } = await api.get<Chapter>(`/api/nulis/works/${workId}/chapters/${chapterId}`)
  return data
}

export type ChapterListItem = {
  id: string
  workId: string
  workSlug: string
  chapterNumber: number
  slug: string
  title: string
  isPremium: boolean
  price: number
  readCount: number
  status: ChapterStatus
  deletedAt?: string | null
}

export async function fetchAdminChapterList(workId: string) {
  const { data } = await api.get<ChapterListItem[]>(`/api/nulis/works/${workId}/chapters`)
  return data.sort((a, b) => a.chapterNumber - b.chapterNumber)
}

export async function createChapter(workId: string, payload: {
  chapterNumber: number
  chapterSlug: string
  title: string
  content: string
  isPremium: boolean
  price: number
  status: ChapterStatus
}) {
  const { data } = await api.post<Chapter>(`/api/nulis/works/${workId}/chapters`, payload)
  return data
}

export async function updateChapter(workId: string, chapterId: string, payload: {
  slug?: string
  title: string
  content: string
  isPremium: boolean
  price: number
  status: ChapterStatus
}) {
  const { data } = await api.put<Chapter>(`/api/nulis/works/${workId}/chapters/${chapterId}`, payload)
  return data
}

export async function deleteChapter(workId: string, chapterId: string) {
  await api.delete(`/api/nulis/works/${workId}/chapters/${chapterId}`)
}

export async function reorderChapters(workId: string, chapterIds: string[]) {
  await api.put(`/api/nulis/works/${workId}/chapters/reorder`, { chapterIds })
}

export function useAdminChapter(workId: string, chapterId: string) {
  return useQuery({
    queryKey: chaptersKeys.adminDetail(workId, chapterId),
    queryFn: () => fetchAdminChapter(workId, chapterId),
  })
}

export function useAdminChapterList(workId: string) {
  return useQuery({
    queryKey: worksKeys.chapters(workId),
    queryFn: () => fetchAdminChapterList(workId),
  })
}

export function useCreateChapter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ workId, ...payload }: { workId: string } & Parameters<typeof createChapter>[1]) =>
      createChapter(workId, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: worksKeys.chapters(vars.workId) })
      qc.invalidateQueries({ queryKey: worksKeys.all })
    },
  })
}

export function useUpdateChapter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ workId, chapterId, ...payload }: { workId: string; chapterId: string } & Parameters<typeof updateChapter>[2]) =>
      updateChapter(workId, chapterId, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: worksKeys.chapters(vars.workId) })
      qc.invalidateQueries({ queryKey: worksKeys.all })
    },
  })
}

export function useDeleteChapter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ workId, chapterId }: { workId: string; chapterId: string }) =>
      deleteChapter(workId, chapterId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: worksKeys.chapters(vars.workId) })
    },
  })
}

export function useReorderChapters() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ workId, chapterIds }: { workId: string; chapterIds: string[] }) =>
      reorderChapters(workId, chapterIds),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: worksKeys.chapters(vars.workId) })
    },
  })
}

export function useMarkChapterRead() {
  return useMutation({
    mutationFn: markChapterRead,
  })
}

export function useSaveProgress() {
  return useMutation({
    mutationFn: async (params: { workId: string; chapterId: string }) => {
      await api.post("/api/user/progress", params)
    },
  })
}
