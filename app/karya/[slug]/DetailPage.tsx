"use client";

import { Work, Chapter, ReadingProgressInfo } from "@/data/types";
import TopBar from "@/components/layout/TopBar";
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
    <div className="font-ui min-h-screen bg-[var(--background)] animate-page-enter">
      <TopBar backHref="/" title={work.title} overlay />

      <main className="max-w-[480px] mx-auto px-4 pb-28">
        <WorkHeader work={work} firstChapterSlug={firstChapterSlug} readingProgress={readingProgress} />
        <ChapterList chapters={chapters} workSlug={work.slug} unlockedChapterIds={unlockedChapterIds} />
      </main>

      <BottomNav />
    </div>
  );
}
