import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiFetch } from "@/lib/axios"
import type { BundleInfo, BundleListItem, ChapterBundleInfo, PublicBundle, PublicBundleListItem } from "@/data/types"

export const bundlesKeys = {
  all: ["bundles"] as const,
  adminAll: () => [...bundlesKeys.all, "admin"] as const,
  byWork: (workId: string) => [...bundlesKeys.all, "work", workId] as const,
  detail: (workId: string, bundleId: string) => [...bundlesKeys.all, "detail", workId, bundleId] as const,
  public: () => [...bundlesKeys.all, "public"] as const,
  publicBySlug: (slug: string) => [...bundlesKeys.all, "public-slug", slug] as const,
  byChapter: (chapterId: string) => [...bundlesKeys.all, "by-chapter", chapterId] as const,
}

export async function fetchAdminBundles() {
  const { data } = await api.get<BundleListItem[]>("/api/nulis/bundles")
  return data
}

export async function fetchAdminBundlesByWork(workId: string) {
  const { data } = await api.get<BundleInfo[]>(`/api/nulis/works/${workId}/bundles`)
  return data
}

export async function fetchAdminBundleDetail(workId: string, bundleId: string) {
  const { data } = await api.get<BundleInfo>(`/api/nulis/works/${workId}/bundles/${bundleId}`)
  return data
}

export async function createBundle(workId: string, payload: {
  title: string
  slug: string
  description?: string
  price: number
  chapterIds: string[]
}) {
  const { data } = await api.post<BundleInfo>(`/api/nulis/works/${workId}/bundles`, payload)
  return data
}

export async function updateBundle(workId: string, bundleId: string, payload: {
  title?: string
  slug?: string
  description?: string
  price?: number
  chapterIds?: string[]
}) {
  const { data } = await api.put<BundleInfo>(`/api/nulis/works/${workId}/bundles/${bundleId}`, payload)
  return data
}

export async function deleteBundle(workId: string, bundleId: string) {
  await api.delete(`/api/nulis/works/${workId}/bundles/${bundleId}`)
}

export async function checkBundleSlug(workId: string, slug: string, excludeId?: string) {
  const params = new URLSearchParams({ slug })
  if (excludeId) params.set("excludeId", excludeId)
  const { data } = await api.get<{ available: boolean }>(
    `/api/nulis/works/${workId}/bundles/check-slug?${params.toString()}`
  )
  return data
}

export async function fetchPublicBundles() {
  return apiFetch<PublicBundleListItem[]>("/api/bundles")
}

export async function fetchPublicBundleBySlug(slug: string) {
  return apiFetch<PublicBundle>(`/api/bundles/slug/${slug}`)
}

export async function fetchChapterBundles(chapterId: string) {
  return apiFetch<ChapterBundleInfo[]>(`/api/chapters/${chapterId}/bundles`)
}

export async function createBundlePayment(payload: {
  bundleId: string
  workSlug: string
  payerEmail: string
}) {
  const { data } = await api.post<{ paymentUrl: string }>("/api/payments/bundle/create", payload)
  return data
}

export function useAdminBundles() {
  return useQuery({
    queryKey: bundlesKeys.adminAll(),
    queryFn: fetchAdminBundles,
  })
}

export function useAdminBundlesByWork(workId: string) {
  return useQuery({
    queryKey: bundlesKeys.byWork(workId),
    queryFn: () => fetchAdminBundlesByWork(workId),
  })
}

export function useAdminBundleDetail(workId: string, bundleId: string) {
  return useQuery({
    queryKey: bundlesKeys.detail(workId, bundleId),
    queryFn: () => fetchAdminBundleDetail(workId, bundleId),
  })
}

export function useCreateBundle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ workId, ...payload }: { workId: string } & Parameters<typeof createBundle>[1]) =>
      createBundle(workId, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: bundlesKeys.byWork(vars.workId) })
      qc.invalidateQueries({ queryKey: bundlesKeys.adminAll() })
    },
  })
}

export function useUpdateBundle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ workId, bundleId, ...payload }: { workId: string; bundleId: string } & Parameters<typeof updateBundle>[2]) =>
      updateBundle(workId, bundleId, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: bundlesKeys.byWork(vars.workId) })
      qc.invalidateQueries({ queryKey: bundlesKeys.detail(vars.workId, vars.bundleId) })
      qc.invalidateQueries({ queryKey: bundlesKeys.adminAll() })
    },
  })
}

export function useDeleteBundle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ workId, bundleId }: { workId: string; bundleId: string }) =>
      deleteBundle(workId, bundleId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: bundlesKeys.byWork(vars.workId) })
      qc.invalidateQueries({ queryKey: bundlesKeys.adminAll() })
    },
  })
}

export function usePublicBundles() {
  return useQuery({
    queryKey: bundlesKeys.public(),
    queryFn: fetchPublicBundles,
  })
}

export function usePublicBundleBySlug(slug: string) {
  return useQuery({
    queryKey: bundlesKeys.publicBySlug(slug),
    queryFn: () => fetchPublicBundleBySlug(slug),
  })
}

export function useChapterBundles(chapterId: string) {
  return useQuery({
    queryKey: bundlesKeys.byChapter(chapterId),
    queryFn: () => fetchChapterBundles(chapterId),
  })
}

export function useCreateBundlePayment() {
  return useMutation({
    mutationFn: createBundlePayment,
  })
}
