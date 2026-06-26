export type WorkStatus = "DRAFT" | "ONGOING" | "COMPLETED";

export interface Work {
  id: number;
  title: string;
  slug: string;
  synopsis: string;
  coverUrl: string;
  genres: string[];
  status: WorkStatus;
  totalChapters: number;
}

export interface Chapter {
  id: number;
  workId: number;
  workSlug: string;
  chapterNumber: number;
  slug: string;
  title: string;
  content: string;
  isPremium: boolean;
  price: number;
  readCount: number;
}

export interface ReaderSettings {
  fontSize: "small" | "medium" | "large";
  lineSpacing: "tight" | "normal" | "relaxed";
  fontFamily: "lora" | "georgia" | "sans";
  darkMode: boolean;
}
