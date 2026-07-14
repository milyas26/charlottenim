import { useMutation, useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { apiFetch } from "@/lib/axios"

export async function createPayment(payload: {
  chapterId: string
  workSlug: string
  chapterSlug: string
  payerEmail: string
}) {
  const { data } = await api.post<{ paymentUrl: string }>("/api/payments/create", payload)
  return data
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: createPayment,
  })
}

export async function uploadPaymentProof(purchaseId: string, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post<{ url: string }>(`/api/payments/manual/${purchaseId}/upload-proof`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data
}

export function useUploadPaymentProof() {
  return useMutation({
    mutationFn: ({ purchaseId, file }: { purchaseId: string; file: File }) =>
      uploadPaymentProof(purchaseId, file),
  })
}

export interface PurchaseDetail {
  id: string
  amount: number
  bundleTitle: string
  workTitle: string
  workSlug: string
  status: "PENDING" | "PAID" | "FAILED"
  paymentMethod: string
  paymentProofUrl: string | null
  bankName: string
  bankAccountNumber: string
  bankAccountHolder: string
  createdAt: string
  paidAt: string | null
}

export async function fetchPurchaseDetail(id: string) {
  return apiFetch<PurchaseDetail>(`/api/payments/manual/${id}`)
}

export function usePurchaseDetail(id: string) {
  return useQuery({
    queryKey: ["purchase-detail", id],
    queryFn: () => fetchPurchaseDetail(id),
  })
}
