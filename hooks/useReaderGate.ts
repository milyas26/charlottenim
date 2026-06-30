"use client";

import { useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "read-chapters";

interface ReadChapter {
  chapterId: string;
  workSlug: string;
  chapterSlug: string;
}

function getReadChapters(): ReadChapter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ReadChapter[];
  } catch {
    return [];
  }
}

function addReadChapter(chapter: ReadChapter): void {
  const existing = getReadChapters();
  if (existing.some((c) => c.chapterId === chapter.chapterId)) return;
  existing.push(chapter);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {}
}

function clearReadChapters(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

interface UseReaderGateResult {
  mustLogin: boolean;
  loading: boolean;
}

export function useReaderGate(
  workSlug: string,
  chapterSlug: string,
  chapterId: string,
  isUnlocked: boolean
): UseReaderGateResult {
  const { user, loading: authLoading } = useAuth();

  const result = useMemo<UseReaderGateResult>(() => {
    if (typeof window === "undefined" || authLoading) {
      return { mustLogin: false, loading: true };
    }

    if (user) {
      return { mustLogin: false, loading: false };
    }

    const chapters = getReadChapters();
    const alreadyRead = chapters.filter((c) => c.chapterId !== chapterId);

    if (alreadyRead.length >= 2) {
      return { mustLogin: true, loading: false };
    }

    return { mustLogin: false, loading: false };
  }, [user, authLoading, chapterId]);

  useEffect(() => {
    if (typeof window === "undefined" || authLoading) return;

    if (user) {
      clearReadChapters();
      return;
    }

    if (!isUnlocked) return;
    if (result.mustLogin) return;

    addReadChapter({ chapterId, workSlug, chapterSlug });
  }, [user, authLoading, chapterId, workSlug, chapterSlug, result.mustLogin, isUnlocked]);

  return result;
}
