import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface PaymentResponse {
  snapToken: string
  snapRedirectUrl: string
  orderId: string
}

export async function createPayment(payload: {
  chapterId: string
  workSlug: string
  chapterSlug: string
  payerEmail: string
}) {
  const { data } = await api.post<PaymentResponse>("/api/payments/create", payload)
  return data
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: createPayment,
  })
}
