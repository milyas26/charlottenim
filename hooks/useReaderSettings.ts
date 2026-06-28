"use client";

import { useState, useCallback, useEffect } from "react";
import { ReaderSettings } from "@/data/types";

const STORAGE_KEY = "reader-settings";

const defaultSettings: ReaderSettings = {
  fontSize: "medium",
  lineSpacing: "normal",
  fontFamily: "lora",
  readingMode: "cream",
};

const fsValues: Record<ReaderSettings["fontSize"], string> = {
  small: "15px",
  medium: "17px",
  large: "19px",
};

const lhValues: Record<ReaderSettings["lineSpacing"], string> = {
  tight: "1.75",
  normal: "2.1",
  relaxed: "2.5",
};

const ffValues: Record<ReaderSettings["fontFamily"], string> = {
  lora: "var(--font-lora)",
  georgia: "Georgia, 'Times New Roman', serif",
  sans: "var(--font-geist-sans)",
};

const modeColors: Record<ReaderSettings["readingMode"], Record<string, string>> = {
  white: { bg: "#FFFFFF", fg: "#1A1A1A", sf: "#F5F5F5", bd: "#E0E0E0", mu: "#6B7280", ac: "#B87B5C" },
  cream: { bg: "#F9F5EF", fg: "#2C241A", sf: "#F3ECE1", bd: "#E0D5C5", mu: "#8C7B6E", ac: "#B87B5C" },
  black: { bg: "#1B1614", fg: "#E8DDD0", sf: "#241E1A", bd: "#3D342C", mu: "#8C8074", ac: "#D4A574" },
};

const headerBg: Record<ReaderSettings["readingMode"], string> = {
  white: "rgba(255,255,255,0.85)",
  cream: "rgba(249,245,239,0.85)",
  black: "rgba(27,22,20,0.85)",
};

function readStoredSettings(): ReaderSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;
    const parsed = JSON.parse(stored);
    const merged = { ...defaultSettings, ...parsed };
    if (parsed.darkMode === true && parsed.readingMode === undefined) {
      merged.readingMode = "black";
    }
    return merged;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: ReaderSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

function applySettingsToDOM(settings: ReaderSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.classList.remove("dark");

  const m = modeColors[settings.readingMode];
  root.style.setProperty("--rm-bg", m.bg);
  root.style.setProperty("--rm-fg", m.fg);
  root.style.setProperty("--rm-surface", m.sf);
  root.style.setProperty("--rm-border", m.bd);
  root.style.setProperty("--rm-muted", m.mu);
  root.style.setProperty("--rm-accent", m.ac);
  root.style.setProperty("--rm-header-bg", headerBg[settings.readingMode]);

  root.style.setProperty("--r-fs", fsValues[settings.fontSize]);
  root.style.setProperty("--r-lh", lhValues[settings.lineSpacing]);
  root.style.setProperty("--r-ff", ffValues[settings.fontFamily]);
}

export function getModeHeaderBg(mode: ReaderSettings["readingMode"]) {
  return headerBg[mode];
}

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const stored = readStoredSettings();
    applySettingsToDOM(stored);
    setHydrated(true);
    setSettings(stored);
  }, []);

  const update = useCallback((next: ReaderSettings) => {
    setSettings(next);
    saveSettings(next);
    applySettingsToDOM(next);
  }, []);

  return { settings, update, hydrated };
}
