import { notFound } from "next/navigation";
import {
  getWorkBySlug,
  getChapterBySlug,
  getAdjacentChapters,
} from "@/data/dummy";
import ReaderPage from "./ReaderPage";

export default async function BacaChapterPage({
  params,
}: {
  params: Promise<{ workSlug: string; chapterSlug: string }>;
}) {
  const { workSlug, chapterSlug } = await params;

  const work = getWorkBySlug(workSlug);
  if (!work) notFound();

  const chapter = getChapterBySlug(workSlug, chapterSlug);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(workSlug, chapterSlug);

  return (
    <ReaderPage
      work={work}
      chapter={chapter}
      prevChapter={prev}
      nextChapter={next}
    />
  );
}
