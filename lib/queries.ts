import { prisma } from "./prisma"
import type { Work, Chapter } from "@/data/types"

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
