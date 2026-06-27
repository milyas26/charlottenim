import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  getWorkBySlug,
  getChapterBySlug,
  getAdjacentChapters,
  isChapterPurchasedByUser,
} from "@/lib/queries";
import type { DbUser } from "@/lib/cookies";
import ReaderPage from "./ReaderPage";

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
    const dbUser = await getDbUserFromCookie();
    if (dbUser) {
      if (dbUser.role === "ADMIN") {
        isUnlocked = true;
      } else {
        isUnlocked = await isChapterPurchasedByUser(dbUser.id, chapter.id);
      }
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
