"use client";

import { useState, useEffect } from "react";
import { Work, Chapter } from "@/data/types";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useAuth } from "@/contexts/AuthContext";
import ChapterContent from "@/components/reader/ChapterContent";
import ReadingCustomization from "@/components/reader/ReadingCustomization";
import PaywallOverlay from "@/components/reader/PaywallOverlay";
import CommentsSection from "@/components/reader/CommentsSection";
import { hapticTap } from "@/lib/haptics";
import { useMarkChapterRead, useSaveProgress } from "@/lib/api/chapters";
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
  isUnlocked: boolean;
}

const gratisBg = "rgba(91, 140, 90, 0.1)";
const gratisText = "#5B8C5A";
const premiumBgLight = "rgba(184, 123, 92, 0.1)";
const premiumBgDark = "rgba(212, 165, 116, 0.12)";

export default function ReaderPage({
  work,
  chapter,
  prevChapter,
  nextChapter,
  isUnlocked: initiallyUnlocked,
}: Props) {
  const { settings, update } = useReaderSettings();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const isUnlocked = initiallyUnlocked;
  const [paymentStatus] = useState(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("payment");
  });

  const chapterReadMutation = useMarkChapterRead()

  const progressMutation = useSaveProgress()

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("payment")) {
      url.searchParams.delete("payment");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const pct = Math.min((window.scrollY / scrollHeight) * 100, 100);
      setProgress(pct);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isUnlocked || !user) return;
    chapterReadMutation.mutate(chapter.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id, isUnlocked, user]);

  useEffect(() => {
    if (!user) return;
    progressMutation.mutate({ workId: work.id, chapterId: chapter.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work.id, chapter.id, user]);

  const isDark = settings.readingMode === "black";
  const tagBgPremium = isDark ? premiumBgDark : premiumBgLight;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[var(--rm-bg)] animate-page-enter">
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
        style={{
          backgroundColor: "var(--rm-accent)",
          width: `${progress}%`,
          transition: "width 0.15s linear",
        }}
      />

      <div className="w-full max-w-[480px] flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-40 px-5 py-3 flex items-center gap-3 backdrop-blur-md"
          style={{
            backgroundColor: "var(--rm-header-bg)",
            borderBottom: "1px solid var(--rm-border)",
          }}
        >
          <a
            href={`/karya/${work.slug}`}
            onClick={hapticTap}
            className="flex-shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-[var(--rm-surface)] transition-colors tap-feedback"
            style={{ color: "var(--rm-muted)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span
              className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 font-[family-name:var(--font-sans)]"
              style={{
                backgroundColor: chapter.isPremium ? tagBgPremium : gratisBg,
                color: chapter.isPremium ? "var(--rm-accent)" : gratisText,
              }}
            >
              {chapter.chapterNumber}
            </span>
            <span className="text-sm font-semibold truncate" style={{ color: "var(--rm-fg)" }}>
              {chapter.title}
            </span>
          </div>

          {chapter.isPremium && (
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0"
              style={{
                backgroundColor: tagBgPremium,
                color: "var(--rm-accent)",
              }}
            >
              PREMIUM
            </span>
          )}
        </header>

        <div className="flex-1 px-4 pt-4 pb-3">
          {paymentStatus === "success" && (
            <div
              className="rounded-xl p-3 mb-3 text-center text-sm font-medium"
              style={{
                backgroundColor: "color-mix(in srgb, #5B8C5A 10%, transparent)",
                color: "#5B8C5A",
              }}
            >
              Pembayaran sedang diproses. Refresh halaman jika chapter belum terbuka.
            </div>
          )}

          {isUnlocked ? (
            <ChapterContent
              content={chapter.content}
              settings={settings}
              isPremium={chapter.isPremium}
              isUnlocked={true}
            />
          ) : (
            <>
              <ChapterContent
                content={chapter.content}
                settings={settings}
                isPremium={true}
                isUnlocked={false}
                previewOnly={true}
              />
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full" style={{ borderTop: "1px dashed var(--rm-border)" }} />
                </div>
                <span className="relative px-4 text-xs tracking-wider uppercase font-semibold text-[var(--rm-muted)] bg-[var(--rm-bg)] font-[family-name:var(--font-sans)]">
                  konten terkunci
                </span>
              </div>
              <PaywallOverlay
                price={chapter.price}
                chapterId={chapter.id}
                workSlug={work.slug}
                chapterSlug={chapter.slug}
              />
            </>
          )}
        </div>

        <div
          className="sticky bottom-0 z-40 px-3 pb-1 pt-2"
        >
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
                <span className="flex items-center gap-2 px-3 py-2 rounded-full opacity-20 flex-shrink-0"
                  style={{ color: "var(--rm-muted)", border: "1.5px solid var(--rm-border)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  <span className="text-xs font-semibold">Prev</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Drawer>
                <DrawerTrigger className="flex flex-col items-center gap-0.5 px-3 rounded-xl transition-all hover:opacity-80 relative tap-feedback"
                  onClick={hapticTap}
                  aria-label="Komentar" style={{ color: "var(--rm-fg)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-[10px]">{chapter.commentCount}</span>
                </DrawerTrigger>
                <DrawerContent>
                  <CommentsSection chapterId={chapter.id} />
                </DrawerContent>
              </Drawer>

              <span
                className="flex flex-col items-center justify-center gap-0.5 px-3 rounded-xl"
                style={{ color: "var(--rm-muted)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span className="text-[10px] font-semibold">{chapter.chapterNumber}/{work.totalChapters}</span>
              </span>

              <Drawer>
                <DrawerTrigger className="flex flex-col items-center gap-0.5 px-3 rounded-xl transition-all hover:opacity-80 tap-feedback"
                  onClick={hapticTap}
                  aria-label="Pengaturan" style={{ color: "var(--rm-fg)" }}>
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
                    <ReadingCustomization settings={settings} onChange={update} />
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
                <span className="flex items-center gap-2 px-3 py-2 rounded-full opacity-20 flex-shrink-0"
                  style={{ color: "var(--rm-muted)", border: "1.5px solid var(--rm-border)" }}>
                  <span className="text-xs font-semibold">Next</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
