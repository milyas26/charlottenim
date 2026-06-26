"use client";

import { Work, Chapter } from "@/data/types";
import Navbar from "@/components/landing/Navbar";
import WorkHeader from "@/components/work/WorkHeader";
import ChapterList from "@/components/work/ChapterList";

interface Props {
  work: Work;
  chapters: Chapter[];
}

export default function DetailPage({ work, chapters }: Props) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main className="max-w-[480px] mx-auto px-5 pt-6 pb-16">
        <WorkHeader work={work} />
        <ChapterList chapters={chapters} workSlug={work.slug} />
      </main>

      <footer className="text-center py-8">
        <p
          className="text-xs tracking-widest uppercase font-medium"
          style={{ color: "var(--muted)", opacity: 0.4 }}
        >
          charlottenimmm
        </p>
      </footer>
    </div>
  );
}
