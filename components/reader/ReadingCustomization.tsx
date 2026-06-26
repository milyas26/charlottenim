"use client";

import { ReaderSettings } from "@/data/types";

interface Props {
  settings: ReaderSettings;
  onChange: (settings: ReaderSettings) => void;
}

const sizes = [
  { key: "small" as const, label: "Kecil" },
  { key: "medium" as const, label: "Sedang" },
  { key: "large" as const, label: "Besar" },
];

const spacings = [
  { key: "tight" as const, label: "Rapat" },
  { key: "normal" as const, label: "Normal" },
  { key: "relaxed" as const, label: "Longgar" },
];

const fonts = [
  { key: "lora" as const, label: "Lora", sample: "Serif" },
  { key: "georgia" as const, label: "Georgia", sample: "Serif" },
  { key: "sans" as const, label: "Sans", sample: "Sans" },
];

const fontFamilyClass: Record<ReaderSettings["fontFamily"], string> = {
  lora: "font-[family-name:var(--font-lora)]",
  georgia: "font-[family-name:var(--font-georgia)]",
  sans: "font-[family-name:var(--font-geist-sans)]",
};

export default function ReadingCustomization({ settings, onChange }: Props) {
  const update = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div
      className="rounded-2xl p-3.5 space-y-3.5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "var(--muted)" }}
        >
          Jenis Font
        </label>
        <div className="grid grid-cols-3 gap-2">
          {fonts.map(({ key, label, sample }) => (
            <button
              key={key}
              onClick={() => update("fontFamily", key)}
              className={`py-2 px-3 rounded-xl text-center transition-all ${fontFamilyClass[key]}`}
              style={{
                backgroundColor:
                  settings.fontFamily === key
                    ? "var(--accent)"
                    : "transparent",
                color:
                  settings.fontFamily === key
                    ? "#fff"
                    : "var(--foreground)",
                border:
                  settings.fontFamily === key
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                opacity: settings.fontFamily === key ? 1 : 0.6,
              }}
            >
              <span className="text-sm font-semibold block leading-tight">{sample}</span>
              <span className="text-[10px] opacity-70">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "var(--muted)" }}
        >
          Ukuran Font
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => update("fontSize", key)}
              className="py-2 px-3 rounded-xl text-center text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  settings.fontSize === key
                    ? "var(--accent)"
                    : "transparent",
                color:
                  settings.fontSize === key
                    ? "#fff"
                    : "var(--foreground)",
                border:
                  settings.fontSize === key
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                fontSize: key === "small" ? "13px" : key === "medium" ? "15px" : "17px",
                opacity: settings.fontSize === key ? 1 : 0.6,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "var(--muted)" }}
        >
          Spasi Baris
        </label>
        <div className="grid grid-cols-3 gap-2">
          {spacings.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => update("lineSpacing", key)}
              className="py-2 rounded-xl text-center text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  settings.lineSpacing === key
                    ? "var(--accent)"
                    : "transparent",
                color:
                  settings.lineSpacing === key
                    ? "#fff"
                    : "var(--foreground)",
                border:
                  settings.lineSpacing === key
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                opacity: settings.lineSpacing === key ? 1 : 0.6,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          Mode Gelap
        </label>
        <button
          onClick={() => update("darkMode", !settings.darkMode)}
          className="relative w-11 h-6 rounded-full transition-colors"
          style={{
            backgroundColor: settings.darkMode
              ? "var(--accent)"
              : "var(--border)",
          }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
            style={{
              left: settings.darkMode ? "calc(100% - 1.375rem)" : "0.125rem",
            }}
          />
        </button>
      </div>
    </div>
  );
}
