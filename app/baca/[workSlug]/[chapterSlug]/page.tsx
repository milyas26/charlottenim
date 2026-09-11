import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { apiFetch } from "@/lib/axios"
import { buildPreviewContent } from "@/lib/preview"
import type { Work, Chapter } from "@/data/types"
import type { DbUser } from "@/lib/cookies"
import ReaderPage from "./ReaderPage"

async function getAuthContext(): Promise<{ cookie: string; dbUser: DbUser | null }> {
  try {
    const jar = await cookies()
    const raw = jar.get("user-data")?.value
    let dbUser: DbUser | null = null
    if (raw) {
      try {
        dbUser = JSON.parse(decodeURIComponent(raw)) as DbUser
      } catch {
        dbUser = null
      }
    }
    return { cookie: jar.toString(), dbUser }
  } catch {
    return { cookie: "", dbUser: null }
  }
}

export default async function BacaChapterPage({
  params,
}: {
  params: Promise<{ workSlug: string; chapterSlug: string }>
}) {
  const { workSlug, chapterSlug } = await params
  const { cookie, dbUser } = await getAuthContext()

  const work = await apiFetch<Work>(`/api/works/${workSlug}`).catch(() => null)
  if (!work) notFound()

  const chapter = await apiFetch<Chapter>(
    `/api/chapters/by-slug/${workSlug}/${chapterSlug}`,
    { cookie }
  ).catch(() => null)
  if (!chapter) notFound()

  const adjacentData = await apiFetch<{
    prev: Chapter | null
    next: Chapter | null
  }>(`/api/chapters/adjacent/${workSlug}/${chapterSlug}`)

  let isUnlocked = !chapter.isPremium

  if (!isUnlocked) {
    if (dbUser) {
      if (dbUser.role === "ADMIN") {
        isUnlocked = true
      } else {
        try {
          const result = await apiFetch<{ purchased: boolean }>(
            `/api/chapters/${chapter.id}/purchased`,
            { cookie }
          )
          isUnlocked = result.purchased
        } catch {
          isUnlocked = false
        }
      }
    }
  }

  if (!isUnlocked) {
    chapter.content = buildPreviewContent(chapter.content)
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
