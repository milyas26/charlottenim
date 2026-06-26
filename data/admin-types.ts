export interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  role: "READER" | "ADMIN";
  joinedAt: string;
  totalPurchases: number;
  totalSpent: number;
  lastReadWork: string | null;
}

export interface Purchase {
  id: number;
  userId: number;
  userName: string;
  chapterTitle: string;
  workTitle: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
}

export interface AdminStats {
  totalWorks: number;
  totalChapters: number;
  totalUsers: number;
  totalRevenue: number;
  totalReads: number;
  premiumChapters: number;
  freeChapters: number;
}
