import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiFetch } from "@/lib/axios"
import type { BookListItem, Book, ShippingAddress } from "@/data/types"

export const booksKeys = {
  all: ["books"] as const,
  adminAll: () => [...booksKeys.all, "admin"] as const,
  adminDetail: (id: string) => [...booksKeys.all, "admin", id] as const,
  public: () => [...booksKeys.all, "public"] as const,
  publicBySlug: (slug: string) => [...booksKeys.all, "public-slug", slug] as const,
}

export async function fetchPublicBooks() {
  return apiFetch<BookListItem[]>("/api/books")
}

export async function fetchBookBySlug(slug: string) {
  return apiFetch<Book>(`/api/books/slug/${slug}`)
}

export async function createBookPayment(payload: {
  bookId: string
  shippingAddress: ShippingAddress
}) {
  const { data } = await api.post<{
    purchaseId: string
    amount: number
    bookTitle: string
    bankName: string
    bankAccountNumber: string
    bankAccountHolder: string
  }>("/api/payments/manual/book/create", payload)
  return data
}

export interface BookPurchaseDetail {
  id: string
  amount: number
  bookTitle: string
  bookSlug: string
  status: "PENDING" | "PAID" | "FAILED"
  paymentMethod: string
  paymentProofUrl: string | null
  shippingAddress: Record<string, unknown> | null
  bankName: string
  bankAccountNumber: string
  bankAccountHolder: string
  createdAt: string
  paidAt: string | null
}

export async function fetchBookPurchaseDetail(id: string) {
  return apiFetch<BookPurchaseDetail>(`/api/payments/book/${id}`)
}

export async function uploadBookPaymentProof(purchaseId: string, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post<{ url: string }>(
    `/api/payments/book/${purchaseId}/upload-proof`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  )
  return data
}

export async function fetchAdminBooks() {
  const { data } = await api.get<BookListItem[]>("/api/nulis/books")
  return data
}

export async function fetchAdminBook(id: string) {
  const { data } = await api.get<Book>(`/api/nulis/books/${id}`)
  return data
}

export async function createBook(payload: {
  title: string
  slug: string
  description?: string
  price: number
  coverUrl?: string
  author?: string
  stock?: number
  weight?: number
  pages?: number
  isActive?: boolean
}) {
  const { data } = await api.post<Book>("/api/nulis/books", payload)
  return data
}

export async function updateBook(id: string, payload: {
  title?: string
  slug?: string
  description?: string
  price?: number
  coverUrl?: string
  author?: string
  stock?: number
  weight?: number
  pages?: number
  isActive?: boolean
}) {
  const { data } = await api.put<Book>(`/api/nulis/books/${id}`, payload)
  return data
}

export async function deleteBook(id: string) {
  await api.delete(`/api/nulis/books/${id}`)
}

export async function uploadBookCover(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post<{ url: string }>("/api/nulis/books/upload-cover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.url
}

export async function checkBookSlug(slug: string, excludeId?: string) {
  const params = new URLSearchParams({ slug })
  if (excludeId) params.set("excludeId", excludeId)
  const { data } = await api.get<{ available: boolean }>(
    `/api/nulis/books/check-slug?${params.toString()}`
  )
  return data
}

export function usePublicBooks() {
  return useQuery({
    queryKey: booksKeys.public(),
    queryFn: fetchPublicBooks,
  })
}

export function useBookBySlug(slug: string) {
  return useQuery({
    queryKey: booksKeys.publicBySlug(slug),
    queryFn: () => fetchBookBySlug(slug),
  })
}

export function useCreateBookPayment() {
  return useMutation({
    mutationFn: createBookPayment,
  })
}

export function useBookPurchaseDetail(id: string) {
  return useQuery({
    queryKey: ["book-purchase-detail", id],
    queryFn: () => fetchBookPurchaseDetail(id),
  })
}

export function useUploadBookPaymentProof() {
  return useMutation({
    mutationFn: ({ purchaseId, file }: { purchaseId: string; file: File }) =>
      uploadBookPaymentProof(purchaseId, file),
  })
}

export function useAdminBooks() {
  return useQuery({
    queryKey: booksKeys.adminAll(),
    queryFn: fetchAdminBooks,
  })
}

export function useAdminBook(id: string) {
  return useQuery({
    queryKey: booksKeys.adminDetail(id),
    queryFn: () => fetchAdminBook(id),
    enabled: !!id,
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: booksKeys.adminAll() })
    },
  })
}

export function useUpdateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Parameters<typeof updateBook>[1]) =>
      updateBook(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: booksKeys.adminAll() })
      qc.invalidateQueries({ queryKey: booksKeys.adminDetail(vars.id) })
    },
  })
}

export function useDeleteBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: booksKeys.adminAll() })
    },
  })
}

export function useUploadBookCover() {
  return useMutation({
    mutationFn: uploadBookCover,
  })
}
