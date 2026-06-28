export type WorkStatus = "DRAFT" | "ONGOING" | "COMPLETED";

export type ChapterStatus = "DRAFT" | "PUBLISHED" | "DELETED";

export interface Work {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  coverUrl: string;
  genres: string[];
  status: WorkStatus;
  totalChapters: number;
  deletedAt?: string | null;
}

export interface ChapterRead {
  count: number;
}

export interface Chapter {
  id: string;
  workId: string;
  workSlug: string;
  chapterNumber: number;
  slug: string;
  title: string;
  content: string;
  isPremium: boolean;
  price: number;
  readCount: number;
  status: ChapterStatus;
  deletedAt?: string | null;
}

export interface ReadingProgressInfo {
  chapterId: string;
  chapterSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  workSlug: string;
  lastReadAt: string;
}

export interface Comment {
  id: string;
  content: string;
  likeCount: number;
  isLikedByCharlotte: boolean;
  isFirst: boolean;
  userId: string;
  userName: string;
  userAvatar: string | null;
  chapterId: string;
  createdAt: string;
}

export interface ReaderSettings {
  fontSize: "small" | "medium" | "large";
  lineSpacing: "tight" | "normal" | "relaxed";
  fontFamily: "lora" | "georgia" | "sans";
  darkMode: boolean;
}
