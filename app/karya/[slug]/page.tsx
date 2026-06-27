import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getWorkBySlug, getChaptersByWorkSlug, getReadingProgress } from "@/lib/queries";
import type { DbUser } from "@/lib/cookies";
import DetailPage from "./DetailPage";

async function getDbUserFromCookie(): Promise<DbUser | null> {
  try {
    const jar = await cookies();
    const raw = jar.get("user-data")?.value;
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed as DbUser;
  } catch {
    return null;
  }
}

export default async function KaryaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const chapters = await getChaptersByWorkSlug(slug);
  const firstChapterSlug = chapters[0]?.slug ?? "pertemuan-pertama";

  const dbUser = await getDbUserFromCookie();
  let readingProgress = null;
  if (dbUser) {
    const progress = await getReadingProgress(dbUser.id, work.id);
    if (progress) {
      readingProgress = {
        chapterId: "",
        chapterSlug: progress.chapterSlug,
        chapterNumber: progress.chapterNumber,
        chapterTitle: progress.chapterTitle,
        workSlug: slug,
        lastReadAt: new Date().toISOString(),
      };
    }
  }

  return (
    <DetailPage
      work={work}
      chapters={chapters}
      firstChapterSlug={firstChapterSlug}
      readingProgress={readingProgress}
    />
  );
}
