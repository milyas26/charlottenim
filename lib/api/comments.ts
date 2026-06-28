import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import type { Comment } from "@/data/types"
import type { AdminComment } from "@/data/admin-types"

export const commentsKeys = {
  all: ["comments"] as const,
  byChapter: (chapterId: string) => [...commentsKeys.all, chapterId] as const,
  admin: (page: number, limit: number, search: string) => [...commentsKeys.all, "admin", page, limit, search] as const,
}

export async function fetchComments(chapterId: string) {
  const { data } = await api.get<Comment[]>(`/api/comments?chapterId=${chapterId}`)
  return data
}

export async function createComment(chapterId: string, content: string) {
  const { data } = await api.post<Comment>("/api/comments", { chapterId, content })
  return data
}

export async function likeComment(commentId: string) {
  const { data } = await api.post<Comment>(`/api/comments/${commentId}/like`)
  return data
}

export type CommentsResponse = {
  comments: AdminComment[]
  total: number
  page: number
  totalPages: number
}

export async function fetchAdminComments(page: number, limit: number, search: string) {
  const { data } = await api.get<CommentsResponse>("/api/nulis/comments", {
    params: { page, limit, search },
  })
  return data
}

export function useComments(chapterId: string) {
  return useQuery({
    queryKey: commentsKeys.byChapter(chapterId),
    queryFn: () => fetchComments(chapterId),
  })
}

export function useCreateComment(chapterId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => createComment(chapterId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentsKeys.byChapter(chapterId) })
    },
  })
}

export function useLikeComment(chapterId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentsKeys.byChapter(chapterId) })
    },
  })
}

export function useAdminComments(page: number, limit: number, search: string) {
  return useQuery({
    queryKey: commentsKeys.admin(page, limit, search),
    queryFn: () => fetchAdminComments(page, limit, search),
  })
}
