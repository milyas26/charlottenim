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
  {
    key: "tight" as const,
    lines: [
      { w: "85%", mb: 1.5 },
      { w: "100%", mb: 1.5 },
      { w: "65%", mb: 0 },
    ],
  },
  {
    key: "normal" as const,
    lines: [
      { w: "85%", mb: 3.5 },
      { w: "100%", mb: 3.5 },
      { w: "65%", mb: 0 },
    ],
  },
  {
    key: "relaxed" as const,
    lines: [
      { w: "85%", mb: 6 },
      { w: "100%", mb: 6 },
      { w: "65%", mb: 0 },
    ],
  },
];

const fonts = [
  { key: "lora" as const, label: "Lora", sample: "Serif" },
  { key: "georgia" as const, label: "Georgia", sample: "Serif" },
  { key: "sans" as const, label: "Sans", sample: "Sans" },
];

const readingModes = [
  { key: "white" as const, bg: "#FFFFFF", fg: "#1A1A1A" },
  { key: "cream" as const, bg: "#F9F5EF", fg: "#2C241A" },
  { key: "black" as const, bg: "#1B1614", fg: "#E8DDD0" },
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
      className="rounded-xl p-2 space-y-1.5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div>
        <label
          className="block text-[10px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--muted)" }}
        >
          Jenis Font
        </label>
        <div className="grid grid-cols-3 gap-1">
          {fonts.map(({ key, label, sample }) => (
            <button
              key={key}
              onClick={() => update("fontFamily", key)}
              className={`py-1 px-1.5 rounded-lg text-center transition-all ${fontFamilyClass[key]}`}
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
              <span className="text-[10px] font-semibold block leading-tight">{sample}</span>
              <span className="text-[8px] opacity-70">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className="block text-[10px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--muted)" }}
        >
          Ukuran Font
        </label>
        <div className="grid grid-cols-3 gap-1">
          {sizes.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => update("fontSize", key)}
              className="py-1 rounded-lg text-center text-[11px] font-medium transition-all"
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
                fontSize: key === "small" ? "12px" : key === "medium" ? "14px" : "16px",
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
          className="block text-[10px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--muted)" }}
        >
          Spasi Baris
        </label>
        <div className="grid grid-cols-3 gap-1">
          {spacings.map(({ key, lines }) => (
            <button
              key={key}
              onClick={() => update("lineSpacing", key)}
              className="py-1.5 px-1 rounded-lg flex flex-col items-center gap-0.5 transition-all"
              style={{
                backgroundColor:
                  settings.lineSpacing === key
                    ? "var(--accent)"
                    : "transparent",
                border:
                  settings.lineSpacing === key
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                opacity: settings.lineSpacing === key ? 1 : 0.6,
              }}
            >
              {lines.map((l, i) => (
                <div
                  key={i}
                  style={{
                    width: l.w,
                    height: "2px",
                    borderRadius: "1px",
                    backgroundColor: settings.lineSpacing === key ? "#fff" : "var(--foreground)",
                    marginBottom: `${l.mb}px`,
                    opacity: settings.lineSpacing === key ? 1 : 0.4,
                  }}
                />
              ))}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className="block text-[10px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--muted)" }}
        >
          Mode
        </label>
        <div className="grid grid-cols-3 gap-1">
          {readingModes.map(({ key, bg, fg }) => (
            <button
              key={key}
              onClick={() => update("readingMode", key)}
              className="py-4 rounded-lg flex items-center justify-center transition-all"
              style={{
                backgroundColor: bg,
                border:
                  settings.readingMode === key
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border)",
                opacity: settings.readingMode === key ? 1 : 0.6,
              }}
            >
              <span
                className="text-[8px] font-semibold uppercase tracking-widest"
                style={{ color: fg }}
              >
                Aa
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
