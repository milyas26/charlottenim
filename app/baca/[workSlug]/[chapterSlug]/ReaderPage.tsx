"use client";

import { useState, useEffect } from "react";
import { Work, Chapter } from "@/data/types";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useAuth } from "@/contexts/AuthContext";
import ChapterContent from "@/components/reader/ChapterContent";
import PaywallOverlay from "@/components/reader/PaywallOverlay";
import LoginGate from "@/components/reader/LoginGate";
import ReaderBottomNav from "@/components/reader/ReaderBottomNav";
import { useReaderGate } from "@/hooks/useReaderGate";
import { hapticTap } from "@/lib/haptics";
import { useMarkChapterRead, useSaveProgress } from "@/lib/api/chapters";

interface Props {
  work: Work;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  isUnlocked: boolean;
}

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
  const isUnlocked = initiallyUnlocked;
  const { mustLogin, loading: gateLoading } = useReaderGate(
    work.slug,
    chapter.slug,
    chapter.id,
    isUnlocked
  );
  const [progress, setProgress] = useState(0);
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
    if (!isUnlocked || mustLogin) return;
    chapterReadMutation.mutate(chapter.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id, isUnlocked, mustLogin]);

  useEffect(() => {
    if (!user) return;
    progressMutation.mutate({ workId: work.id, chapterId: chapter.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work.id, chapter.id, user]);

  const isDark = settings.readingMode === "black";
  const tagBgPremium = isDark ? premiumBgDark : premiumBgLight;

  if (gateLoading) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "var(--rm-bg)" }} />
    );
  }

  if (mustLogin) {
    return <LoginGate />;
  }

  return (
    <div className="font-ui min-h-screen w-full flex justify-center bg-[var(--rm-bg)] animate-page-enter">
      <div
        className="fixed top-0 left-0 h-[2px] z-50"
        style={{
          backgroundColor: "var(--rm-accent)",
          width: `${progress}%`,
          transition: "width 0.15s linear",
        }}
      />

      <div className="w-full max-w-[480px] flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-40 px-2 h-14 flex items-center gap-1 backdrop-blur-md"
          style={{
            backgroundColor: "var(--rm-header-bg)",
            borderBottom: "1px solid var(--rm-border)",
          }}
        >
          <a
            href={`/karya/${work.slug}`}
            onClick={hapticTap}
            aria-label="Kembali ke detail karya"
            className="size-10 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-[var(--rm-surface)] transition-colors tap-feedback"
            style={{ color: "var(--rm-fg)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>

          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-[11px] truncate" style={{ color: "var(--rm-muted)" }}>
              {work.title}
            </p>
            <p className="text-[13px] font-semibold truncate" style={{ color: "var(--rm-fg)" }}>
              Chapter {chapter.chapterNumber}
              <span className="font-normal" style={{ color: "var(--rm-muted)" }}> · {chapter.title}</span>
            </p>
          </div>

          {chapter.isPremium && (
            <span
              className="mr-2 text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: tagBgPremium,
                color: "var(--rm-accent)",
              }}
            >
              Premium
            </span>
          )}
        </header>

        <div className="flex-1 px-5 pt-4 pb-3">
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

          <div className="text-center pt-8 pb-10">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--rm-accent)" }}
            >
              Chapter {chapter.chapterNumber}
            </p>
            <h1
              className="font-title text-[1.6rem] font-semibold leading-tight mt-2 px-2"
              style={{ color: "var(--rm-fg)" }}
            >
              {chapter.title}
            </h1>
            <div className="mx-auto mt-5 h-px w-10" style={{ backgroundColor: "var(--rm-border)" }} />
          </div>

          {isUnlocked ? (
            <>
              <ChapterContent
                content={chapter.content}
                settings={settings}
                isPremium={chapter.isPremium}
                isUnlocked={true}
              />

              <div className="pt-10 pb-6 text-center">
                <p className="text-xs" style={{ color: "var(--rm-muted)" }}>
                  — Akhir chapter {chapter.chapterNumber} —
                </p>
                {nextChapter ? (
                  <a
                    href={`/baca/${nextChapter.workSlug}/${nextChapter.slug}`}
                    onClick={hapticTap}
                    className="mt-5 flex items-center gap-3 rounded-2xl p-4 text-left transition-opacity hover:opacity-90 tap-feedback"
                    style={{ backgroundColor: "var(--rm-surface)", border: "1px solid var(--rm-border)" }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium" style={{ color: "var(--rm-muted)" }}>
                        Selanjutnya · Chapter {nextChapter.chapterNumber}
                      </p>
                      <p className="text-sm font-semibold truncate mt-0.5" style={{ color: "var(--rm-fg)" }}>
                        {nextChapter.title}
                      </p>
                    </div>
                    <span
                      className="size-9 shrink-0 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--rm-accent)", color: "var(--rm-bg)" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                ) : (
                  <a
                    href={`/karya/${work.slug}`}
                    className="mt-4 inline-block text-[13px] font-semibold"
                    style={{ color: "var(--rm-accent)" }}
                  >
                    Kembali ke {work.title}
                  </a>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <ChapterContent
                  content={chapter.content}
                  settings={settings}
                  isPremium={true}
                  isUnlocked={false}
                  previewOnly={true}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "96px",
                    background: "linear-gradient(to bottom, transparent, var(--rm-bg))",
                  }}
                />
              </div>
              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full" style={{ borderTop: "1px dashed var(--rm-border)" }} />
                </div>
                <span className="relative px-3 text-[11px] font-medium text-[var(--rm-muted)] bg-[var(--rm-bg)]">
                  Lanjutan cerita terkunci
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

        <ReaderBottomNav
          work={work}
          chapter={chapter}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
          settings={settings}
          onSettingsChange={update}
        />
      </div>
    </div>
  );
}
