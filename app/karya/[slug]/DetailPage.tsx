"use client";

import { Work, Chapter, ReadingProgressInfo } from "@/data/types";
import Navbar from "@/components/landing/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import WorkHeader from "@/components/work/WorkHeader";
import ChapterList from "@/components/work/ChapterList";

interface Props {
  work: Work;
  chapters: Chapter[];
  firstChapterSlug: string;
  readingProgress: ReadingProgressInfo | null;
  unlockedChapterIds: string[];
}

export default function DetailPage({ work, chapters, firstChapterSlug, readingProgress, unlockedChapterIds }: Props) {
  return (
    <div className="min-h-screen bg-[var(--background)] animate-page-enter">
      <Navbar />

      <main className="max-w-[480px] mx-auto px-4 pt-4 pb-28">
        <WorkHeader work={work} firstChapterSlug={firstChapterSlug} readingProgress={readingProgress} />
        <ChapterList chapters={chapters} workSlug={work.slug} unlockedChapterIds={unlockedChapterIds} />
      </main>

      <BottomNav />


    </div>
  );
}
