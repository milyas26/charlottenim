export interface AdminUser {
  id: string;
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
  id: string;
  userId: string;
  userName: string;
  chapterTitle: string;
  workTitle: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  xenditInvoiceUrl?: string | null;
  xenditPaymentChannel?: string | null;
  xenditPaymentMethod?: string | null;
  xenditExpiryDate?: string | null;
  paidAt?: string | null;
  failureReason?: string | null;
  createdAt: string;
}

export interface AdminComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  workTitle: string;
  workSlug: string;
  chapterTitle: string;
  content: string;
  createdAt: string;
}

export interface AdminStats {
  totalWorks: number
  totalChapters: number
  totalUsers: number
  totalRevenue: number
  totalReads: number
  premiumChapters: number
  freeChapters: number
  draftCount: number
  ongoingCount: number
  completedCount: number
}
