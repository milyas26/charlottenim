"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Work, Chapter, ReaderSettings } from "@/data/types";
import { useAuth } from "@/contexts/AuthContext";
import { hapticTap } from "@/lib/haptics";
import { fetchWorkChapters } from "@/lib/api/works";
import { useUnlockedChapterIds } from "@/lib/api/user";
import CommentsSection from "@/components/reader/CommentsSection";
import ReadingCustomization from "@/components/reader/ReadingCustomization";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Props {
  work: Work;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  settings: ReaderSettings;
  onSettingsChange: (settings: ReaderSettings) => void;
}

export default function ReaderBottomNav({
  work,
  chapter,
  prevChapter,
  nextChapter,
  settings,
  onSettingsChange,
}: Props) {
  const { user } = useAuth();
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", work.slug],
    queryFn: () => fetchWorkChapters(work.slug),
  });

  const { data: unlockedIds = [] } = useUnlockedChapterIds(work.id, !!user);

  const unlockedSet = new Set(unlockedIds);
  const [chapterDrawerOpen, setChapterDrawerOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const handleChapterDrawerOpenChange = useCallback((open: boolean) => {
    setChapterDrawerOpen(open);
    if (open) {
      setTimeout(() => {
        if (listRef.current && activeRef.current) {
          const container = listRef.current;
          const el = activeRef.current;
          container.scrollTop = el.offsetTop - container.offsetTop - 60;
        }
      }, 100);
    }
  }, []);

  return (
    <div className="sticky bottom-0 z-40 px-3 pb-1 pt-2">
      <div
        className="flex items-center justify-between px-2 py-2 rounded-4xl"
        style={{
          backgroundColor: "var(--rm-surface)",
          border: "1px solid var(--rm-border)",
        }}
      >
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {prevChapter ? (
            <a
              href={`/baca/${prevChapter.workSlug}/${prevChapter.slug}`}
              onClick={hapticTap}
              className="flex items-center gap-2 px-3 py-3 rounded-full transition-all hover:opacity-80 tap-feedback"
              style={{
                color: "var(--rm-fg)",
                border: "1.5px solid var(--rm-border)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="text-xs font-semibold">Prev</span>
            </a>
          ) : (
            <span
              className="flex items-center gap-2 px-3 py-2 rounded-full opacity-20 flex-shrink-0"
              style={{ color: "var(--rm-muted)", border: "1.5px solid var(--rm-border)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span className="text-xs font-semibold">Prev</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Drawer>
            <DrawerTrigger
              className="flex flex-col items-center gap-0.5 px-3 rounded-xl transition-all hover:opacity-80 relative tap-feedback"
              onClick={hapticTap}
              aria-label="Komentar"
              style={{ color: "var(--rm-fg)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-[10px]">{chapter.commentCount}</span>
            </DrawerTrigger>
            <DrawerContent>
              <CommentsSection chapterId={chapter.id} />
            </DrawerContent>
          </Drawer>

          <Drawer open={chapterDrawerOpen} onOpenChange={handleChapterDrawerOpenChange}>
            <DrawerTrigger
              className="flex flex-col items-center justify-center gap-0.5 px-3 rounded-xl transition-all hover:opacity-80 tap-feedback"
              onClick={hapticTap}
              aria-label="Daftar Chapter"
              style={{ color: "var(--rm-fg)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span className="text-[10px] font-medium">{chapter.chapterNumber}/{work.totalChapters}</span>
            </DrawerTrigger>
            <DrawerContent className="bg-[var(--rm-bg)] [&>div]:bg-[var(--rm-bg)]">
              <DrawerHeader>
                <DrawerTitle className="text-[var(--rm-fg)]">Daftar Chapter</DrawerTitle>
              </DrawerHeader>
              <div ref={listRef} className="px-3 pb-6 space-y-1.5 max-h-[65vh] overflow-y-auto">
                {chapters.map((ch) => {
                  const isActive = ch.id === chapter.id;
                  const isUnlocked = !ch.isPremium || unlockedSet.has(ch.id);

                  return (
                    <div
                      key={ch.id}
                      ref={isActive ? activeRef : undefined}
                    >
                      <a
                        href={`/baca/${ch.workSlug}/${ch.slug}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all tap-feedback"
                        style={{
                          backgroundColor: isActive ? "var(--rm-surface)" : "transparent",
                          border: isActive ? "1.5px solid var(--rm-accent)" : "1px solid var(--rm-border)",
                        }}
                      >
                        <span
                          className="text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: isActive
                              ? "var(--rm-accent)"
                              : ch.isPremium && !isUnlocked
                                ? "color-mix(in srgb, var(--rm-accent) 18%, transparent)"
                                : "color-mix(in srgb, #5B8C5A 18%, transparent)",
                            color: isActive
                              ? settings.readingMode === "black" ? "#1B1614" : "#fff"
                              : ch.isPremium && !isUnlocked
                                ? "var(--rm-accent)"
                                : "#5B8C5A",
                          }}
                        >
                          {ch.chapterNumber}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm font-medium leading-snug truncate"
                            style={{ color: isActive ? "var(--rm-accent)" : "var(--rm-fg)" }}
                          >
                            {ch.title}
                          </p>
                        </div>
                        {ch.isPremium ? (
                          isUnlocked ? (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0"
                              style={{
                                backgroundColor: "color-mix(in srgb, #5B8C5A 18%, transparent)",
                                color: "#5B8C5A",
                              }}
                            >
                              Dibeli
                            </span>
                          ) : (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0"
                              style={{
                                backgroundColor: "color-mix(in srgb, var(--rm-accent) 18%, transparent)",
                                color: "var(--rm-accent)",
                              }}
                            >
                              Rp {ch.price.toLocaleString("id-ID")}
                            </span>
                          )
                        ) : (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0"
                            style={{
                              backgroundColor: "color-mix(in srgb, #5B8C5A 18%, transparent)",
                              color: "#5B8C5A",
                            }}
                          >
                            Gratis
                          </span>
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            </DrawerContent>
          </Drawer>

          <Drawer>
            <DrawerTrigger
              className="flex flex-col items-center gap-0.5 px-3 rounded-xl transition-all hover:opacity-80 tap-feedback"
              onClick={hapticTap}
              aria-label="Pengaturan"
              style={{ color: "var(--rm-fg)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="text-[10px]">Set.</span>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Pengaturan Tampilan</DrawerTitle>
              </DrawerHeader>
              <div className="px-3 pt-1 pb-4">
                <ReadingCustomization settings={settings} onChange={onSettingsChange} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          {nextChapter ? (
            <a
              href={`/baca/${nextChapter.workSlug}/${nextChapter.slug}`}
              onClick={hapticTap}
              className="flex items-center gap-2 px-3 py-3 rounded-full transition-all hover:opacity-80 tap-feedback"
              style={{
                color: "var(--rm-fg)",
                border: "1.5px solid var(--rm-border)",
              }}
            >
              <span className="text-xs font-semibold">Next</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          ) : (
            <span
              className="flex items-center gap-2 px-3 py-2 rounded-full opacity-20 flex-shrink-0"
              style={{ color: "var(--rm-muted)", border: "1.5px solid var(--rm-border)" }}
            >
              <span className="text-xs font-semibold">Next</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
