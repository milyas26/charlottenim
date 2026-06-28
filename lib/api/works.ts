import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiFetch } from "@/lib/axios"
import type { Work, WorkStatus, Chapter } from "@/data/types"

export type WorkWithReads = Work & { totalReads: number }

export const worksKeys = {
  all: ["works"] as const,
  lists: () => [...worksKeys.all, "list"] as const,
  list: (scope: "public" | "admin") => [...worksKeys.lists(), scope] as const,
  details: () => [...worksKeys.all, "detail"] as const,
  detail: (id: string) => [...worksKeys.details(), id] as const,
  chapters: (workId: string) => [...worksKeys.all, workId, "chapters"] as const,
}

export async function fetchWorks(): Promise<WorkWithReads[]> {
  return apiFetch<WorkWithReads[]>("/api/works")
}

export async function fetchWorkBySlug(slug: string): Promise<Work> {
  return apiFetch<Work>(`/api/works/${slug}`)
}

export async function fetchWorkChapters(slug: string): Promise<Chapter[]> {
  return apiFetch<Chapter[]>(`/api/works/${slug}/chapters`)
}

export async function fetchAdminWorks() {
  const { data } = await api.get<WorkWithReads[]>("/api/nulis/works")
  return data
}

export type WorkDetail = {
  id: string
  title: string
  slug: string
  synopsis: string
  coverUrl: string
  genres: string[]
  status: WorkStatus
  totalChapters: number
  deletedAt: string | null
}

export async function fetchAdminWork(id: string) {
  const { data } = await api.get<WorkDetail>(`/api/nulis/works/${id}`)
  return data
}

export async function fetchAdminWorkChapters(workId: string) {
  const { data } = await api.get<Chapter[]>(`/api/nulis/works/${workId}/chapters`)
  return data.sort((a, b) => a.chapterNumber - b.chapterNumber)
}

export async function createWork(payload: {
  title: string
  slug: string
  synopsis: string
  coverUrl?: string
  genres: string[]
  status: WorkStatus
}) {
  const { data } = await api.post<Work>("/api/nulis/works", payload)
  return data
}

export async function updateWork(id: string, payload: {
  title: string
  slug: string
  synopsis: string
  status: WorkStatus
  genres: string[]
  coverUrl: string
}) {
  await api.put(`/api/nulis/works/${id}`, payload)
}

export async function deleteWork(id: string) {
  await api.delete(`/api/nulis/works/${id}`)
}

export function useAdminWorks() {
  return useQuery({
    queryKey: worksKeys.list("admin"),
    queryFn: fetchAdminWorks,
  })
}

export function useAdminWork(id: string) {
  return useQuery({
    queryKey: worksKeys.detail(id),
    queryFn: () => fetchAdminWork(id),
  })
}

export function useAdminWorkChapters(workId: string) {
  return useQuery({
    queryKey: worksKeys.chapters(workId),
    queryFn: () => fetchAdminWorkChapters(workId),
  })
}

export function useCreateWork() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createWork,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: worksKeys.list("admin") })
    },
  })
}

export function useUpdateWork() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Parameters<typeof updateWork>[1]) =>
      updateWork(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: worksKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: worksKeys.list("admin") })
    },
  })
}

export function useDeleteWork() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteWork,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: worksKeys.list("admin") })
    },
  })
}
