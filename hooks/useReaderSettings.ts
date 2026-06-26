"use client";

import { useState, useCallback, useEffect } from "react";
import { ReaderSettings } from "@/data/types";

const STORAGE_KEY = "reader-settings";

const defaultSettings: ReaderSettings = {
  fontSize: "medium",
  lineSpacing: "normal",
  fontFamily: "lora",
  darkMode: false,
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

function readStoredSettings(): ReaderSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;
    const parsed = JSON.parse(stored);
    return { ...defaultSettings, ...parsed };
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

  if (settings.darkMode) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.style.setProperty("--r-fs", fsValues[settings.fontSize]);
  root.style.setProperty("--r-lh", lhValues[settings.lineSpacing]);
  root.style.setProperty("--r-ff", ffValues[settings.fontFamily]);
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
