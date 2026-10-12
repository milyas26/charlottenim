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
import { ChevronLeft, ChevronRight, List, Lock, MessageCircle, Type } from "lucide-react";

const navBtn = "size-11 shrink-0 rounded-full flex items-center justify-center transition-opacity hover:opacity-85 tap-feedback";
const actionBtn = "flex flex-col items-center justify-center gap-0.5 w-16 h-11 rounded-full transition-colors hover:bg-[var(--rm-bg)] tap-feedback";

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
    <div className="font-ui sticky bottom-0 z-40 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div
        className="flex items-center justify-between p-1.5 rounded-full backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, var(--rm-surface) 92%, transparent)",
          border: "1px solid var(--rm-border)",
          boxShadow: "0 8px 24px -10px rgba(0,0,0,0.25)",
        }}
      >
        {prevChapter ? (
          <a
            href={`/baca/${prevChapter.workSlug}/${prevChapter.slug}`}
            onClick={hapticTap}
            aria-label="Chapter sebelumnya"
            className={navBtn}
            style={{ color: "var(--rm-fg)", backgroundColor: "var(--rm-bg)" }}
          >
            <ChevronLeft className="size-5" />
          </a>
        ) : (
          <span className={`${navBtn} opacity-30`} style={{ color: "var(--rm-muted)" }} aria-hidden="true">
            <ChevronLeft className="size-5" />
          </span>
        )}

        <div className="flex items-center gap-1">
          <Drawer>
            <DrawerTrigger
              className={actionBtn}
              onClick={hapticTap}
              aria-label="Komentar"
              style={{ color: "var(--rm-fg)" }}
            >
              <MessageCircle className="size-[19px]" strokeWidth={1.75} />
              <span className="text-[10px] font-medium tabular-nums">{chapter.commentCount}</span>
            </DrawerTrigger>
            <DrawerContent>
              <CommentsSection chapterId={chapter.id} />
            </DrawerContent>
          </Drawer>

          <Drawer open={chapterDrawerOpen} onOpenChange={handleChapterDrawerOpenChange}>
            <DrawerTrigger
              className={actionBtn}
              onClick={hapticTap}
              aria-label="Daftar Chapter"
              style={{ color: "var(--rm-fg)" }}
            >
              <List className="size-[19px]" strokeWidth={1.75} />
              <span className="text-[10px] font-medium tabular-nums">{chapter.chapterNumber}/{work.totalChapters}</span>
            </DrawerTrigger>
            <DrawerContent className="bg-[var(--rm-bg)] [&>div]:bg-[var(--rm-bg)]">
              <DrawerHeader>
                <DrawerTitle className="text-[var(--rm-fg)]">Daftar Chapter</DrawerTitle>
              </DrawerHeader>
              <div ref={listRef} className="font-ui px-3 pb-6 space-y-0.5 max-h-[65vh] overflow-y-auto">
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
                        className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors tap-feedback"
                        style={{ backgroundColor: isActive ? "var(--rm-surface)" : "transparent" }}
                      >
                        <span
                          className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums"
                          style={{ color: isActive ? "var(--rm-accent)" : "var(--rm-muted)" }}
                        >
                          {ch.chapterNumber}
                        </span>
                        <p
                          className={`min-w-0 flex-1 text-sm leading-snug truncate ${isActive ? "font-semibold" : "font-medium"}`}
                          style={{ color: isActive ? "var(--rm-accent)" : "var(--rm-fg)" }}
                        >
                          {ch.title}
                        </p>
                        {isActive ? (
                          <span className="shrink-0 text-[10px] font-semibold" style={{ color: "var(--rm-accent)" }}>
                            Sedang dibaca
                          </span>
                        ) : !isUnlocked ? (
                          <span
                            className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold"
                            style={{ color: "var(--rm-accent)" }}
                          >
                            <Lock className="size-3" />
                            Rp {ch.price.toLocaleString("id-ID")}
                          </span>
                        ) : ch.isPremium ? (
                          <span className="shrink-0 text-[10px] font-semibold text-[#5B8C5A]">Dibeli</span>
                        ) : null}
                      </a>
                    </div>
                  );
                })}
              </div>
            </DrawerContent>
          </Drawer>

          <Drawer>
            <DrawerTrigger
              className={actionBtn}
              onClick={hapticTap}
              aria-label="Pengaturan"
              style={{ color: "var(--rm-fg)" }}
            >
              <Type className="size-[19px]" strokeWidth={1.75} />
              <span className="text-[10px] font-medium">Tampilan</span>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Pengaturan Tampilan</DrawerTitle>
              </DrawerHeader>
              <div className="font-ui px-3 pt-1 pb-4">
                <ReadingCustomization settings={settings} onChange={onSettingsChange} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {nextChapter ? (
          <a
            href={`/baca/${nextChapter.workSlug}/${nextChapter.slug}`}
            onClick={hapticTap}
            aria-label="Chapter selanjutnya"
            className={navBtn}
            style={{ color: "var(--rm-bg)", backgroundColor: "var(--rm-accent)" }}
          >
            <ChevronRight className="size-5" />
          </a>
        ) : (
          <span className={`${navBtn} opacity-30`} style={{ color: "var(--rm-muted)" }} aria-hidden="true">
            <ChevronRight className="size-5" />
          </span>
        )}
      </div>
    </div>
  );
}
