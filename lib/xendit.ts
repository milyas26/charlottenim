const XENDIT_API_BASE = "https://api.xendit.co/v2"
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY ?? ""
const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN ?? ""
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

function basicAuth(): string {
  return Buffer.from(`${XENDIT_SECRET_KEY}:`).toString("base64")
}

export interface CreateInvoiceParams {
  externalId: string
  amount: number
  payerEmail?: string
  description: string
  successRedirectUrl: string
  failureRedirectUrl: string
  items: { name: string; quantity: number; price: number }[]
}

export interface XenditInvoice {
  id: string
  external_id: string
  user_id: string
  status: string
  merchant_name: string
  merchant_profile_picture_url: string
  amount: number
  payer_email: string
  description: string
  invoice_url: string
  expiry_date: string
  available_banks: unknown[]
  available_retail_outlets: unknown[]
  available_ewallets: unknown[]
  available_qr_codes: unknown[]
  available_direct_debits: unknown[]
  available_paylaters: unknown[]
  should_exclude_credit_card: boolean
  should_send_email: boolean
  created: string
  updated: string
  currency: string
}

export async function createInvoice(params: CreateInvoiceParams): Promise<XenditInvoice> {
  const res = await fetch(`${XENDIT_API_BASE}/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: params.externalId,
      amount: params.amount,
      payer_email: params.payerEmail,
      description: params.description,
      success_redirect_url: params.successRedirectUrl,
      failure_redirect_url: params.failureRedirectUrl,
      currency: "IDR",
      items: params.items,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("Xendit createInvoice error:", err)
    throw new Error(`Xendit error: ${res.status} ${err}`)
  }

  return res.json()
}

export interface WebhookPayload {
  id: string
  external_id: string
  user_id: string
  status: string
  payment_method: string
  payment_channel: string
  payment_destination: string
  amount: number
  paid_amount: number
  paid_at: string
  created: string
  updated: string
}

export function verifyWebhookToken(callbackToken: string): boolean {
  if (!XENDIT_WEBHOOK_TOKEN) {
    console.error("XENDIT_WEBHOOK_TOKEN not set")
    return false
  }
  return callbackToken === XENDIT_WEBHOOK_TOKEN
}

export function buildRedirectUrls(workSlug: string, chapterSlug: string) {
  const base = `${SITE_URL}/baca/${workSlug}/${chapterSlug}`
  return {
    successRedirectUrl: `${base}?payment=success`,
    failureRedirectUrl: `${base}?payment=failed`,
  }
}
