import { notFound } from "next/navigation";
import {
  getWorkBySlug,
  getChapterBySlug,
  getAdjacentChapters,
} from "@/lib/queries";
import ReaderPage from "./ReaderPage";

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

  return (
    <ReaderPage
      work={work}
      chapter={chapter}
      prevChapter={prev}
      nextChapter={next}
    />
  );
}
