import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  getWorkBySlug,
  getChapterBySlug,
  getAdjacentChapters,
  isChapterPurchasedByUser,
} from "@/lib/queries";
import ReaderPage from "./ReaderPage";

async function getUserIdFromCookie(): Promise<string | null> {
  try {
    const jar = await cookies();
    const raw = jar.get("user-data")?.value;
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed.id ?? null;
  } catch {
    return null;
  }
}

export default async function BacaChapterPage({
  params,
}: {
  params: Promise<{ workSlug: string; chapterSlug: string }>;
}) {
  const { workSlug, chapterSlug } = await params;

  const work = await getWorkBySlug(workSlug);
  if (!work) notFound();

  const chapter = await getChapterBySlug(workSlug, chapterSlug);
  if (!chapter) notFound();

  const { prev, next } = await getAdjacentChapters(workSlug, chapterSlug);

  let isUnlocked = !chapter.isPremium;

  if (!isUnlocked) {
    const userId = await getUserIdFromCookie();
    if (userId) {
      isUnlocked = await isChapterPurchasedByUser(userId, chapter.id);
    }
  }

  return (
    <ReaderPage
      work={work}
      chapter={chapter}
      prevChapter={prev}
      nextChapter={next}
      isUnlocked={isUnlocked}
    />
  );
}
