import { headers } from "next/headers"
import { verifyWebhookToken, type WebhookPayload } from "@/lib/xendit"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const callbackToken =
      headersList.get("x-callback-token") ??
      headersList.get("x-callback-verification-token") ??
      ""

    console.log("[xendit-webhook] Callback received, token present:", !!callbackToken)

    if (!verifyWebhookToken(callbackToken)) {
      console.error("[xendit-webhook] Invalid callback token")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await req.json()) as WebhookPayload

    console.log("[xendit-webhook] Payload:", JSON.stringify(body))

    if (!body.external_id || !body.status) {
      return Response.json({ error: "Invalid payload" }, { status: 400 })
    }

    if (body.status === "PAID") {
      const purchase = await prisma.purchase.findFirst({
        where: { xenditInvoiceId: body.id },
      })

      if (!purchase) {
        console.error("[xendit-webhook] Purchase not found for invoice:", body.id)
        return Response.json({ error: "Purchase not found" }, { status: 404 })
      }

      if (purchase.status !== "PENDING") {
        console.warn(
          `[xendit-webhook] Skipping PAID update: purchase ${purchase.id} already has status ${purchase.status}`
        )
        return Response.json({ received: true, skipped: true })
      }

      if (body.paid_amount != null && body.paid_amount < body.amount) {
        console.error(
          `[xendit-webhook] paid_amount (${body.paid_amount}) < amount (${body.amount}), not marking as PAID`
        )
        return Response.json({ error: "paid_amount mismatch" }, { status: 400 })
      }

      await prisma.purchase.updateMany({
        where: {
          xenditInvoiceId: body.id,
          status: "PENDING",
        },
        data: {
          status: "PAID",
          xenditPaymentId: body.external_id,
          xenditPaymentMethod: body.payment_method,
          xenditPaymentChannel: body.payment_channel,
          paidAt: body.paid_at ? new Date(body.paid_at) : new Date(),
        },
      })

      console.log(`[xendit-webhook] Purchase marked PAID: ${purchase.id}`)
    } else if (body.status === "EXPIRED" || body.status === "FAILED") {
      await prisma.purchase.updateMany({
        where: {
          xenditInvoiceId: body.id,
          status: "PENDING",
        },
        data: {
          status: "FAILED",
          failureReason: `Payment ${body.status.toLowerCase()}`,
        },
      })
      console.log(`[xendit-webhook] Purchase marked FAILED for invoice: ${body.id}`)
    } else {
      console.log(`[xendit-webhook] Unhandled status: ${body.status}`)
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("[xendit-webhook] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
