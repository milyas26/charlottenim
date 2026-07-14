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
  totalReads?: number;
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
  commentCount: number;
  status: ChapterStatus;
  deletedAt?: string | null;
  bundleTitle?: string | null;
}

export interface BundleInfo {
  id: string;
  workId: string;
  workTitle: string;
  workSlug: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  chapterCount: number;
  chapters: BundleChapterInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface BundleChapterInfo {
  id: string;
  chapterNumber: number;
  title: string;
  slug: string;
  isPremium: boolean;
  price: number;
}

export interface BundleListItem {
  id: string;
  workId: string;
  workTitle: string;
  workSlug: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  chapterCount: number;
  createdAt: string;
}

export interface ChapterBundleInfo {
  id: string;
  title: string;
  slug: string;
  price: number;
  chapterCount: number;
  workTitle: string;
}

export interface PublicBundle {
  id: string;
  workId: string;
  workTitle: string;
  workSlug: string;
  workCoverUrl: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  chapterCount: number;
  chapters: BundleChapterInfo[];
}

export interface PublicBundleListItem {
  id: string;
  workTitle: string;
  workCoverUrl: string;
  title: string;
  slug: string;
  price: number;
  chapterCount: number;
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
  isLiked: boolean;
  isFirst: boolean;
  userId: string;
  userName: string;
  userAvatar: string | null;
  chapterId: string;
  createdAt: string;
}

export type ReadingMode = "white" | "cream" | "black";

export interface ReaderSettings {
  fontSize: "small" | "medium" | "large";
  lineSpacing: "tight" | "normal" | "relaxed";
  fontFamily: "lora" | "georgia" | "sans";
  readingMode: ReadingMode;
}
