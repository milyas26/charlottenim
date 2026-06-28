import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { apiFetch } from "@/lib/axios"
import type { Work, Chapter, ReadingProgressInfo } from "@/data/types"
import type { DbUser } from "@/lib/cookies"
import DetailPage from "./DetailPage"

async function getDbUserFromCookie(): Promise<DbUser | null> {
  try {
    const jar = await cookies()
    const raw = jar.get("user-data")?.value
    if (!raw) return null
    const parsed = JSON.parse(decodeURIComponent(raw))
    return parsed as DbUser
  } catch {
    return null
  }
}

export default async function KaryaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const work = await apiFetch<Work>(`/api/works/${slug}`).catch(() => null)
  if (!work) notFound()

  const chapters = await apiFetch<Chapter[]>(`/api/works/${slug}/chapters`)
  const firstChapterSlug = chapters[0]?.slug ?? "pertemuan-pertama"

  const dbUser = await getDbUserFromCookie()
  let readingProgress: ReadingProgressInfo | null = null
  if (dbUser) {
    try {
      const cookieStr = `user-data=${encodeURIComponent(JSON.stringify(dbUser))}`
      const progressData = await apiFetch<{
        chapterSlug: string
        chapterNumber: number
        chapterTitle: string
      } | null>(`/api/user/progress/${work.id}`, { cookie: cookieStr })

      if (progressData) {
        readingProgress = {
          chapterId: "",
          chapterSlug: progressData.chapterSlug,
          chapterNumber: progressData.chapterNumber,
          chapterTitle: progressData.chapterTitle,
          workSlug: slug,
          lastReadAt: new Date().toISOString(),
        }
      }
    } catch { /* no progress */ }
  }

  return (
    <DetailPage
      work={work}
      chapters={chapters}
      firstChapterSlug={firstChapterSlug}
      readingProgress={readingProgress}
    />
  )
}
