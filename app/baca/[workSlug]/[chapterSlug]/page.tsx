import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { apiFetch } from "@/lib/axios"
import type { Work, Chapter } from "@/data/types"
import type { DbUser } from "@/lib/cookies"
import ReaderPage from "./ReaderPage"

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

export default async function BacaChapterPage({
  params,
}: {
  params: Promise<{ workSlug: string; chapterSlug: string }>
}) {
  const { workSlug, chapterSlug } = await params

  const work = await apiFetch<Work>(`/api/works/${workSlug}`).catch(() => null)
  if (!work) notFound()

  const chapter = await apiFetch<Chapter>(
    `/api/chapters/by-slug/${workSlug}/${chapterSlug}`
  ).catch(() => null)
  if (!chapter) notFound()

  const adjacentData = await apiFetch<{
    prev: Chapter | null
    next: Chapter | null
  }>(`/api/chapters/adjacent/${workSlug}/${chapterSlug}`)

  let isUnlocked = !chapter.isPremium

  if (!isUnlocked) {
    const dbUser = await getDbUserFromCookie()
    if (dbUser) {
      if (dbUser.role === "ADMIN") {
        isUnlocked = true
      } else {
        try {
          const cookieStr = `user-data=${encodeURIComponent(JSON.stringify(dbUser))}`
          const result = await apiFetch<{ purchased: boolean }>(
            `/api/chapters/${chapter.id}/purchased`,
            { cookie: cookieStr }
          )
          isUnlocked = result.purchased
        } catch {
          isUnlocked = false
        }
      }
    }
  }

  return (
    <ReaderPage
      work={work}
      chapter={chapter}
      prevChapter={adjacentData.prev}
      nextChapter={adjacentData.next}
      isUnlocked={isUnlocked}
    />
  )
}
