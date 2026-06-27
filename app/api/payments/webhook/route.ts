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

    if (!verifyWebhookToken(callbackToken)) {
      console.error("Xendit webhook: invalid callback token")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await req.json()) as WebhookPayload

    if (!body.external_id || !body.status) {
      return Response.json({ error: "Invalid payload" }, { status: 400 })
    }

    if (body.status === "PAID") {
      await prisma.purchase.updateMany({
        where: { xenditInvoiceId: body.id },
        data: {
          status: "PAID",
          xenditPaymentId: body.id,
          xenditPaymentMethod: body.payment_method,
          xenditPaymentChannel: body.payment_channel,
          paidAt: body.paid_at ? new Date(body.paid_at) : new Date(),
        },
      })
    } else if (body.status === "EXPIRED" || body.status === "FAILED") {
      await prisma.purchase.updateMany({
        where: { xenditInvoiceId: body.id },
        data: {
          status: "FAILED",
          failureReason: `Payment ${body.status.toLowerCase()}`,
        },
      })
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("POST /api/payments/webhook error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
