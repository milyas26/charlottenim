import { PrismaClient, ChapterStatus, WorkStatus } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { works, chapters } from "../data/dummy"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  for (const work of works) {
    const workChapters = chapters
      .filter(c => c.workSlug === work.slug)
      .sort((a, b) => a.chapterNumber - b.chapterNumber)

    const createdWork = await prisma.work.create({
      data: {
        title: work.title,
        slug: work.slug,
        synopsis: work.synopsis,
        coverUrl: work.coverUrl,
        genres: work.genres,
        status: work.status as WorkStatus,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-06-01"),
        chapters: {
          create: workChapters.map((c, i) => ({
            chapterNumber: c.chapterNumber,
            slug: c.slug,
            title: c.title,
            content: c.content,
            isPremium: c.isPremium,
            price: c.price,
            status: "PUBLISHED" as ChapterStatus,
            createdAt: new Date(`2025-01-${String(i + 1).padStart(2, "0")}`),
            updatedAt: new Date(`2025-06-${String(i + 1).padStart(2, "0")}`),
            readStats: {
              create: { count: c.readCount }
            }
          }))
        }
      }
    })

    console.log(`✓ Created: ${createdWork.title} (${workChapters.length} chapters)`)
  }

  const totalWorks = await prisma.work.count()
  const totalChapters = await prisma.chapter.count()
  const totalReads = await prisma.chapterRead.aggregate({ _sum: { count: true } })

  console.log(`\nSeeded: ${totalWorks} works, ${totalChapters} chapters, ${totalReads._sum.count} total reads`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
