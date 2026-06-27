import { createInvoice, buildRedirectUrls, type CreateInvoiceParams } from "@/lib/xendit"
import { requireAuth } from "@/lib/auth-guard"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId } = await requireAuth(req)
    const body = await req.json()
    const { chapterId, workSlug, chapterSlug, payerEmail } = body as {
      chapterId: string
      workSlug: string
      chapterSlug: string
      payerEmail?: string
    }

    if (!chapterId || !workSlug || !chapterSlug) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { work: { select: { title: true } } },
    })
    if (!chapter) {
      return Response.json({ error: "Chapter not found" }, { status: 404 })
    }
    if (!chapter.isPremium || chapter.price <= 0) {
      return Response.json({ error: "Chapter is not for sale" }, { status: 400 })
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId, chapterId: chapter.id, status: "PAID" },
    })
    if (existingPurchase) {
      return Response.json({ error: "Anda sudah membeli chapter ini" }, { status: 409 })
    }

    const { successRedirectUrl, failureRedirectUrl } = buildRedirectUrls(workSlug, chapterSlug)

    const description = `${chapter.work.title} - ${chapter.title} (#${chapter.chapterNumber})`

    const invoiceParams: CreateInvoiceParams = {
      externalId: `charlottenim-${userId.slice(0, 8)}-${chapter.id.slice(0, 8)}-${Date.now()}`,
      amount: chapter.price,
      payerEmail,
      description,
      successRedirectUrl,
      failureRedirectUrl,
      items: [{ name: description, quantity: 1, price: chapter.price }],
    }

    const invoice = await createInvoice(invoiceParams)

    await prisma.purchase.create({
      data: {
        userId,
        chapterId: chapter.id,
        amount: chapter.price,
        status: "PENDING",
        xenditInvoiceId: invoice.id,
        xenditInvoiceUrl: invoice.invoice_url,
        xenditExpiryDate: new Date(invoice.expiry_date),
      },
    })

    return Response.json({
      invoiceUrl: invoice.invoice_url,
      invoiceId: invoice.id,
    })
  } catch (error) {
    if (error instanceof Response) return error
    console.error("POST /api/payments/create error:", error)
    return Response.json({ error: "Gagal membuat invoice pembayaran" }, { status: 500 })
  }
}
