"use client";

import { useState, useEffect } from "react";
import { Work, Chapter } from "@/data/types";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import ChapterContent from "@/components/reader/ChapterContent";
import ReadingCustomization from "@/components/reader/ReadingCustomization";
import PaywallOverlay from "@/components/reader/PaywallOverlay";

interface Props {
  work: Work;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
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
}: Props) {
  const { settings, update } = useReaderSettings();
  const [showCustomization, setShowCustomization] = useState(false);
  const [progress, setProgress] = useState(0);

  const isUnlocked = !chapter.isPremium;

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

  const tagBgPremium = settings.darkMode ? premiumBgDark : premiumBgLight;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[var(--background)]">
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-50"
        style={{
          backgroundColor: "var(--accent)",
          width: `${progress}%`,
          transition: "width 0.15s linear",
        }}
      />

      <div className="w-full max-w-[480px] flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-40 px-5 py-3 flex items-center gap-3 backdrop-blur-md"
          style={{
            backgroundColor: settings.darkMode
              ? "rgba(27, 22, 20, 0.85)"
              : "rgba(249, 245, 239, 0.85)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <a
            href={`/karya/${work.slug}`}
            className="flex-shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors"
            style={{ color: "var(--muted)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span
              className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 font-[family-name:var(--font-sans)]"
              style={{
                backgroundColor: chapter.isPremium ? tagBgPremium : gratisBg,
                color: chapter.isPremium ? "var(--accent)" : gratisText,
              }}
            >
              {chapter.chapterNumber}
            </span>
            <span className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
              {chapter.title}
            </span>
          </div>

          {chapter.isPremium && (
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded flex-shrink-0"
              style={{
                backgroundColor: tagBgPremium,
                color: "var(--accent)",
              }}
            >
              PREMIUM
            </span>
          )}
        </header>

        <div className="flex-1 px-5 pt-6 pb-4">
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
              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div
                    className="w-full"
                    style={{ borderTop: "1px dashed var(--border)" }}
                  />
                </div>
                <span className="relative px-4 text-xs tracking-wider uppercase font-semibold text-[var(--muted)] bg-[var(--background)] font-[family-name:var(--font-sans)]">
                  konten terkunci
                </span>
              </div>
              <PaywallOverlay price={chapter.price} />
            </>
          )}
        </div>

        <div className="sticky bottom-0 z-40 bg-[var(--background)]" style={{ borderTop: "1px solid var(--border)" }}>
          {showCustomization && (
            <div className="px-5 pt-4 pb-2">
              <ReadingCustomization settings={settings} onChange={update} />
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-2.5">
            {prevChapter ? (
              <a
                href={`/baca/${prevChapter.workSlug}/${prevChapter.slug}`}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-[var(--surface)] flex-shrink-0"
                style={{
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Prev
              </a>
            ) : (
              <div className="flex-shrink-0 w-[56px]" />
            )}

            <div className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
              <span>Chapter {chapter.chapterNumber} dari {work.totalChapters}</span>
            </div>

            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0"
              style={{
                color: showCustomization ? "#fff" : "var(--foreground)",
                backgroundColor: showCustomization ? "var(--accent)" : "transparent",
                border: showCustomization ? "1px solid var(--accent)" : "1px solid var(--border)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              {showCustomization ? "Tutup" : "Tampilan"}
            </button>

            {nextChapter ? (
              <a
                href={`/baca/${nextChapter.workSlug}/${nextChapter.slug}`}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-[var(--surface)] flex-shrink-0"
                style={{
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                Next
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            ) : (
              <div className="flex-shrink-0 w-[56px]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
