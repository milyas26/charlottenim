import { prisma } from "./prisma"
import type { Work, Chapter } from "@/data/types"
import type { AdminUser, Purchase } from "@/data/admin-types"

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const work = await prisma.work.findUnique({
    where: { slug },
    include: { _count: { select: { chapters: true } } }
  })
  if (!work) return null
  return {
    id: work.id,
    title: work.title,
    slug: work.slug,
    synopsis: work.synopsis,
    coverUrl: work.coverUrl,
    genres: work.genres,
    status: work.status as Work["status"],
    totalChapters: work._count.chapters,
    deletedAt: work.deletedAt?.toISOString() ?? null,
  }
}

export async function getWorkById(id: string): Promise<Work | null> {
  const work = await prisma.work.findUnique({
    where: { id },
    include: { _count: { select: { chapters: true } } }
  })
  if (!work) return null
  return {
    id: work.id,
    title: work.title,
    slug: work.slug,
    synopsis: work.synopsis,
    coverUrl: work.coverUrl,
    genres: work.genres,
    status: work.status as Work["status"],
    totalChapters: work._count.chapters,
    deletedAt: work.deletedAt?.toISOString() ?? null,
  }
}

export async function getAllWorks(): Promise<(Work & { totalReads: number })[]> {
  const works = await prisma.work.findMany({
    where: { deletedAt: null },
    include: {
      _count: { select: { chapters: true } },
      chapters: {
        where: { deletedAt: null },
        include: { readStats: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  })
  return works.map((w) => ({
    id: w.id,
    title: w.title,
    slug: w.slug,
    synopsis: w.synopsis,
    coverUrl: w.coverUrl,
    genres: w.genres,
    status: w.status as Work["status"],
    totalChapters: w._count.chapters,
    totalReads: w.chapters.reduce((sum, ch) => sum + (ch.readStats?.count ?? 0), 0),
    deletedAt: w.deletedAt?.toISOString() ?? null,
  } as Work & { totalReads: number }))
}

export type WorkCreateData = {
  title: string
  slug: string
  synopsis: string
  coverUrl?: string
  genres?: string[]
  status?: Work["status"]
}

export async function createWork(data: WorkCreateData): Promise<Work> {
  const work = await prisma.work.create({
    data: {
      title: data.title,
      slug: data.slug,
      synopsis: data.synopsis,
      coverUrl: data.coverUrl ?? "",
      genres: data.genres ?? [],
      status: data.status ?? "DRAFT",
    },
  })
  return {
    id: work.id,
    title: work.title,
    slug: work.slug,
    synopsis: work.synopsis,
    coverUrl: work.coverUrl,
    genres: work.genres,
    status: work.status as Work["status"],
    totalChapters: 0,
    deletedAt: null,
  }
}

export type WorkUpdateData = {
  title?: string
  slug?: string
  synopsis?: string
  coverUrl?: string
  genres?: string[]
  status?: Work["status"]
}

export async function updateWork(slug: string, data: WorkUpdateData): Promise<Work | null> {
  const existing = await prisma.work.findUnique({ where: { slug } })
  if (!existing) return null

  const work = await prisma.work.update({
    where: { slug },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.synopsis !== undefined && { synopsis: data.synopsis }),
      ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
      ...(data.genres !== undefined && { genres: data.genres }),
      ...(data.status !== undefined && { status: data.status }),
    },
    include: { _count: { select: { chapters: true } } },
  })

  return {
    id: work.id,
    title: work.title,
    slug: work.slug,
    synopsis: work.synopsis,
    coverUrl: work.coverUrl,
    genres: work.genres,
    status: work.status as Work["status"],
    totalChapters: work._count.chapters,
    deletedAt: work.deletedAt?.toISOString() ?? null,
  }
}

export async function updateWorkById(id: string, data: WorkUpdateData): Promise<Work | null> {
  const existing = await prisma.work.findUnique({ where: { id } })
  if (!existing) return null

  const work = await prisma.work.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.synopsis !== undefined && { synopsis: data.synopsis }),
      ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
      ...(data.genres !== undefined && { genres: data.genres }),
      ...(data.status !== undefined && { status: data.status }),
    },
    include: { _count: { select: { chapters: true } } },
  })

  return {
    id: work.id,
    title: work.title,
    slug: work.slug,
    synopsis: work.synopsis,
    coverUrl: work.coverUrl,
    genres: work.genres,
    status: work.status as Work["status"],
    totalChapters: work._count.chapters,
    deletedAt: work.deletedAt?.toISOString() ?? null,
  }
}

export async function deleteWork(slug: string): Promise<boolean> {
  const existing = await prisma.work.findUnique({ where: { slug } })
  if (!existing) return false
  await prisma.work.update({
    where: { slug },
    data: { deletedAt: new Date() },
  })
  return true
}

export async function deleteWorkById(id: string): Promise<boolean> {
  const existing = await prisma.work.findUnique({ where: { id } })
  if (!existing) return false
  await prisma.work.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
  return true
}

export type ChapterListItem = Omit<Chapter, "content"> & { content?: never }

export async function getChaptersByWorkSlugLight(workSlug: string): Promise<ChapterListItem[]> {
  const work = await prisma.work.findUnique({
    where: { slug: workSlug },
    select: { id: true, slug: true }
  })
  if (!work) return []

  const chapters = await prisma.chapter.findMany({
    where: { workId: work.id, deletedAt: null },
    orderBy: { chapterNumber: "asc" },
    select: {
      id: true,
      workId: true,
      chapterNumber: true,
      slug: true,
      title: true,
      isPremium: true,
      price: true,
      status: true,
      deletedAt: true,
      readStats: { select: { count: true } },
    },
  })

  return chapters.map((c) => ({
    id: c.id,
    workId: c.workId,
    workSlug: work.slug,
    chapterNumber: c.chapterNumber,
    slug: c.slug,
    title: c.title,
    content: "" as never,
    isPremium: c.isPremium,
    price: c.price,
    readCount: c.readStats?.count ?? 0,
    status: c.status as Chapter["status"],
    deletedAt: c.deletedAt?.toISOString() ?? null,
  })) as ChapterListItem[]
}

export type ChapterCreateData = {
  chapterNumber: number
  slug: string
  title: string
  content: string
  isPremium?: boolean
  price?: number
  status?: Chapter["status"]
}

export async function getChaptersByWorkIdLight(workId: string): Promise<ChapterListItem[]> {
  const work = await prisma.work.findUnique({
    where: { id: workId },
    select: { id: true, slug: true }
  })
  if (!work) return []

  const chapters = await prisma.chapter.findMany({
    where: { workId: work.id, deletedAt: null },
    orderBy: { chapterNumber: "asc" },
    select: {
      id: true,
      workId: true,
      chapterNumber: true,
      slug: true,
      title: true,
      isPremium: true,
      price: true,
      status: true,
      deletedAt: true,
      readStats: { select: { count: true } },
    },
  })

  return chapters.map((c) => ({
    id: c.id,
    workId: c.workId,
    workSlug: work.slug,
    chapterNumber: c.chapterNumber,
    slug: c.slug,
    title: c.title,
    content: "" as never,
    isPremium: c.isPremium,
    price: c.price,
    readCount: c.readStats?.count ?? 0,
    status: c.status as Chapter["status"],
    deletedAt: c.deletedAt?.toISOString() ?? null,
  })) as ChapterListItem[]
}

export async function createChapter(workSlug: string, data: ChapterCreateData): Promise<Chapter | null> {
  const work = await prisma.work.findUnique({ where: { slug: workSlug } })
  if (!work) return null

  const status = data.status === "DELETED" ? "DRAFT" : (data.status ?? "DRAFT")

  const chapter = await prisma.chapter.create({
    data: {
      workId: work.id,
      chapterNumber: data.chapterNumber,
      slug: data.slug,
      title: data.title,
      content: data.content,
      isPremium: data.isPremium ?? false,
      price: data.price ?? 0,
      status: status as "DRAFT" | "PUBLISHED",
    },
    include: { readStats: true, work: { select: { slug: true } } },
  })

  return {
    id: chapter.id,
    workId: chapter.workId,
    workSlug: chapter.work.slug,
    chapterNumber: chapter.chapterNumber,
    slug: chapter.slug,
    title: chapter.title,
    content: chapter.content,
    isPremium: chapter.isPremium,
    price: chapter.price,
    readCount: chapter.readStats?.count ?? 0,
    status: chapter.status as Chapter["status"],
    deletedAt: chapter.deletedAt?.toISOString() ?? null,
  }
}

export async function createChapterByWorkId(workId: string, data: ChapterCreateData): Promise<Chapter | null> {
  const work = await prisma.work.findUnique({ where: { id: workId } })
  if (!work) return null

  const status = data.status === "DELETED" ? "DRAFT" : (data.status ?? "DRAFT")

  const chapter = await prisma.chapter.create({
    data: {
      workId: work.id,
      chapterNumber: data.chapterNumber,
      slug: data.slug,
      title: data.title,
      content: data.content,
      isPremium: data.isPremium ?? false,
      price: data.price ?? 0,
      status: status as "DRAFT" | "PUBLISHED",
    },
    include: { readStats: true, work: { select: { slug: true } } },
  })

  return {
    id: chapter.id,
    workId: chapter.workId,
    workSlug: chapter.work.slug,
    chapterNumber: chapter.chapterNumber,
    slug: chapter.slug,
    title: chapter.title,
    content: chapter.content,
    isPremium: chapter.isPremium,
    price: chapter.price,
    readCount: chapter.readStats?.count ?? 0,
    status: chapter.status as Chapter["status"],
    deletedAt: chapter.deletedAt?.toISOString() ?? null,
  }
}

export type ChapterUpdateData = {
  chapterNumber?: number
  slug?: string
  title?: string
  content?: string
  isPremium?: boolean
  price?: number
  status?: Chapter["status"]
}

export async function updateChapter(chapterId: string, data: ChapterUpdateData): Promise<Chapter | null> {
  const existing = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { work: { select: { slug: true } } },
  })
  if (!existing) return null

  const updateData: Record<string, unknown> = {}
  if (data.chapterNumber !== undefined) updateData.chapterNumber = data.chapterNumber
  if (data.slug !== undefined) updateData.slug = data.slug
  if (data.title !== undefined) updateData.title = data.title
  if (data.content !== undefined) updateData.content = data.content
  if (data.isPremium !== undefined) updateData.isPremium = data.isPremium
  if (data.price !== undefined) updateData.price = data.price
  if (data.status !== undefined) {
    updateData.status = data.status === "DELETED" ? "DRAFT" : (data.status as "DRAFT" | "PUBLISHED")
  }

  const chapter = await prisma.chapter.update({
    where: { id: chapterId },
    data: updateData,
    include: { readStats: true, work: { select: { slug: true } } },
  })

  return {
    id: chapter.id,
    workId: chapter.workId,
    workSlug: chapter.work.slug,
    chapterNumber: chapter.chapterNumber,
    slug: chapter.slug,
    title: chapter.title,
    content: chapter.content,
    isPremium: chapter.isPremium,
    price: chapter.price,
    readCount: chapter.readStats?.count ?? 0,
    status: chapter.status as Chapter["status"],
    deletedAt: chapter.deletedAt?.toISOString() ?? null,
  }
}

export async function deleteChapter(chapterId: string): Promise<boolean> {
  const existing = await prisma.chapter.findUnique({ where: { id: chapterId } })
  if (!existing) return false
  await prisma.chapter.update({
    where: { id: chapterId },
    data: { deletedAt: new Date() },
  })
  return true
}

export async function reorderChapters(workSlug: string, chapterIds: string[]): Promise<boolean> {
  const work = await prisma.work.findUnique({ where: { slug: workSlug } })
  if (!work) return false

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < chapterIds.length; i++) {
      await tx.chapter.update({
        where: { id: chapterIds[i] },
        data: { chapterNumber: -(i + 1) },
      })
    }
    for (let i = 0; i < chapterIds.length; i++) {
      await tx.chapter.update({
        where: { id: chapterIds[i] },
        data: { chapterNumber: i + 1 },
      })
    }
  })
  return true
}

export async function reorderChaptersByWorkId(workId: string, chapterIds: string[]): Promise<boolean> {
  const work = await prisma.work.findUnique({ where: { id: workId } })
  if (!work) return false

  await prisma.$transaction(async (tx) => {
    for (let i = 0; i < chapterIds.length; i++) {
      await tx.chapter.update({
        where: { id: chapterIds[i] },
        data: { chapterNumber: -(i + 1) },
      })
    }
    for (let i = 0; i < chapterIds.length; i++) {
      await tx.chapter.update({
        where: { id: chapterIds[i] },
        data: { chapterNumber: i + 1 },
      })
    }
  })
  return true
}

export async function getChaptersByWorkSlug(workSlug: string): Promise<Chapter[]> {
  const work = await prisma.work.findUnique({
    where: { slug: workSlug },
    select: { id: true, slug: true }
  })
  if (!work) return []

  const chapters = await prisma.chapter.findMany({
    where: { workId: work.id, deletedAt: null },
    orderBy: { chapterNumber: "asc" },
    include: { readStats: true }
  })

  return chapters.map((c) => ({
    id: c.id,
    workId: c.workId,
    workSlug: work.slug,
    chapterNumber: c.chapterNumber,
    slug: c.slug,
    title: c.title,
    content: c.content,
    isPremium: c.isPremium,
    price: c.price,
    readCount: c.readStats?.count ?? 0,
    status: c.status as Chapter["status"],
    deletedAt: c.deletedAt?.toISOString() ?? null,
  }))
}

export async function getChapterBySlug(
  workSlug: string,
  chapterSlug: string
): Promise<Chapter | null> {
  const work = await prisma.work.findUnique({
    where: { slug: workSlug },
    select: { id: true, slug: true }
  })
  if (!work) return null

  const chapter = await prisma.chapter.findUnique({
    where: { workId_slug: { workId: work.id, slug: chapterSlug } },
    include: { readStats: true }
  })
  if (!chapter) return null

  return {
    id: chapter.id,
    workId: chapter.workId,
    workSlug: work.slug,
    chapterNumber: chapter.chapterNumber,
    slug: chapter.slug,
    title: chapter.title,
    content: chapter.content,
    isPremium: chapter.isPremium,
    price: chapter.price,
    readCount: chapter.readStats?.count ?? 0,
    status: chapter.status as Chapter["status"],
    deletedAt: chapter.deletedAt?.toISOString() ?? null,
  }
}

export async function getChapterById(chapterId: string): Promise<Chapter | null> {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { readStats: true, work: { select: { id: true, slug: true } } }
  })
  if (!chapter) return null

  return {
    id: chapter.id,
    workId: chapter.workId,
    workSlug: chapter.work.slug,
    chapterNumber: chapter.chapterNumber,
    slug: chapter.slug,
    title: chapter.title,
    content: chapter.content,
    isPremium: chapter.isPremium,
    price: chapter.price,
    readCount: chapter.readStats?.count ?? 0,
    status: chapter.status as Chapter["status"],
    deletedAt: chapter.deletedAt?.toISOString() ?? null,
  }
}

export async function getAdjacentChapters(
  workSlug: string,
  currentSlug: string
): Promise<{ prev: Chapter | null; next: Chapter | null }> {
  const chapters = await getChaptersByWorkSlug(workSlug)
  const currentIndex = chapters.findIndex((c) => c.slug === currentSlug)
  return {
    prev: currentIndex > 0 ? chapters[currentIndex - 1] : null,
    next: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null,
  }
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const users = await prisma.user.findMany({
    include: {
      purchases: {
        where: { status: "PAID" },
        select: { amount: true },
      },
      readingProgresses: {
        orderBy: { lastReadAt: "desc" },
        take: 1,
        include: {
          chapter: {
            select: {
              work: { select: { title: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return users.map((u, i) => {
    const totalSpent = u.purchases.reduce((sum, p) => sum + p.amount, 0)
    const lastReadWork =
      u.readingProgresses[0]?.chapter?.work?.title ?? null
    return {
      id: u.id,
      name: u.name || u.email.split("@")[0],
      email: u.email,
      avatarUrl: u.avatarUrl || "",
      role: u.role as AdminUser["role"],
      joinedAt: u.createdAt.toISOString(),
      totalPurchases: u.purchases.length,
      totalSpent,
      lastReadWork,
    }
  })
}

export async function getUserWithPurchases(
  userId: string
): Promise<AdminUser & { purchases: Purchase[] } | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      purchases: {
        where: { status: "PAID" },
        select: { amount: true },
      },
      readingProgresses: {
        orderBy: { lastReadAt: "desc" },
        take: 1,
        include: {
          chapter: {
            select: {
              work: { select: { title: true } },
            },
          },
        },
      },
    },
  })

  if (!u) return null

  const allPurchases = await prisma.purchase.findMany({
    where: { userId: u.id },
    include: {
      chapter: {
        select: {
          title: true,
          work: { select: { title: true } },
        },
      },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const totalSpent = u.purchases.reduce((sum, p) => sum + p.amount, 0)
  const lastReadWork =
    u.readingProgresses[0]?.chapter?.work?.title ?? null

  return {
    id: u.id,
    name: u.name || u.email.split("@")[0],
    email: u.email,
    avatarUrl: u.avatarUrl || "",
    role: u.role as AdminUser["role"],
    joinedAt: u.createdAt.toISOString(),
    totalPurchases: u.purchases.length,
    totalSpent,
    lastReadWork,
    purchases: allPurchases.map((p) => ({
      id: p.id,
      userId: p.userId,
      userName: p.user.name || p.user.email.split("@")[0],
      chapterTitle: p.chapter.title,
      workTitle: p.chapter.work.title,
      amount: p.amount,
      status: p.status as Purchase["status"],
      xenditInvoiceUrl: p.xenditInvoiceUrl,
      xenditPaymentChannel: p.xenditPaymentChannel,
      xenditPaymentMethod: p.xenditPaymentMethod,
      xenditExpiryDate: p.xenditExpiryDate?.toISOString() ?? undefined,
      paidAt: p.paidAt?.toISOString() ?? undefined,
      failureReason: p.failureReason,
      createdAt: p.createdAt.toISOString(),
    })),
  }
}

export async function getAdminStats() {
  const [totalWorks, totalChapters, totalUsers, purchases, chapterReads, statusCounts] =
    await Promise.all([
      prisma.work.count({ where: { deletedAt: null } }),
      prisma.chapter.count({ where: { deletedAt: null } }),
      prisma.user.count(),
      prisma.purchase.findMany({
        where: { status: "PAID" },
        select: { amount: true },
      }),
      prisma.chapterRead.findMany({ select: { count: true } }),
      prisma.work.groupBy({
        by: ["status"],
        where: { deletedAt: null },
        _count: true,
      }),
    ])

  const premiumChapters = await prisma.chapter.count({
    where: { deletedAt: null, isPremium: true },
  })

  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0)
  const totalReads = chapterReads.reduce((sum, cr) => sum + cr.count, 0)
  const freeChapters = totalChapters - premiumChapters

  const draftCount = statusCounts.find((s) => s.status === "DRAFT")?._count ?? 0
  const ongoingCount = statusCounts.find((s) => s.status === "ONGOING")?._count ?? 0
  const completedCount = statusCounts.find((s) => s.status === "COMPLETED")?._count ?? 0

  return {
    totalWorks,
    totalChapters,
    totalUsers,
    totalRevenue,
    totalReads,
    premiumChapters,
    freeChapters,
    draftCount,
    ongoingCount,
    completedCount,
  }
}

export async function getAllPurchases(): Promise<Purchase[]> {
  const purchases = await prisma.purchase.findMany({
    include: {
      chapter: {
        select: {
          title: true,
          work: { select: { title: true } },
        },
      },
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return purchases.map((p) => ({
    id: p.id,
    userId: p.userId,
    userName: p.user.name || p.user.email.split("@")[0],
    chapterTitle: p.chapter.title,
    workTitle: p.chapter.work.title,
    amount: p.amount,
    status: p.status as Purchase["status"],
    xenditInvoiceUrl: p.xenditInvoiceUrl,
    xenditPaymentChannel: p.xenditPaymentChannel,
    xenditPaymentMethod: p.xenditPaymentMethod,
    xenditExpiryDate: p.xenditExpiryDate?.toISOString() ?? undefined,
    paidAt: p.paidAt?.toISOString() ?? undefined,
    failureReason: p.failureReason,
    createdAt: p.createdAt.toISOString(),
  }))
}

export async function isChapterPurchasedByUser(
  userId: string,
  chapterId: string
): Promise<boolean> {
  const purchase = await prisma.purchase.findFirst({
    where: { userId, chapterId, status: "PAID" },
  })
  return !!purchase
}

export async function getUserPurchasedChapters(userId: string) {
  const purchases = await prisma.purchase.findMany({
    where: { userId, status: "PAID" },
    include: {
      chapter: {
        select: {
          id: true,
          title: true,
          slug: true,
          chapterNumber: true,
          isPremium: true,
          price: true,
          work: { select: { id: true, slug: true, title: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return purchases.map((p) => ({
    chapterId: p.chapter.id,
    chapterTitle: p.chapter.title,
    chapterSlug: p.chapter.slug,
    chapterNumber: p.chapter.chapterNumber,
    isPremium: p.chapter.isPremium,
    price: p.chapter.price,
    workId: p.chapter.work.id,
    workSlug: p.chapter.work.slug,
    workTitle: p.chapter.work.title,
    purchaseStatus: p.status as string,
  }))
}
