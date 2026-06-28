"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/LoginDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/axios";
import type { Comment } from "@/data/types";

interface Props {
  chapterId: string;
}

export default function CommentsSection({ chapterId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    api
      .get<Comment[]>(`/api/comments?chapterId=${chapterId}`)
      .then(({ data }) => setComments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [chapterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    setSubmitting(true);
    try {
      const { data } = await api.post<Comment>("/api/comments", {
        chapterId,
        content: newComment.trim(),
      });
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user || likingIds.has(commentId)) return;
    setLikingIds((prev) => new Set(prev).add(commentId));
    try {
      const { data } = await api.post<Comment>(`/api/comments/${commentId}/like`);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? data : c))
      );
    } catch {
      // ignore
    } finally {
      setLikingIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks} minggu lalu`;
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="px-4 pt-2.5 pb-3 min-h-[200px]">
      <h3
        className="text-sm font-semibold uppercase tracking-wider mb-2"
        style={{ color: "var(--foreground)" }}
      >
        Komentar ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar..."
            maxLength={1000}
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
            style={{
              backgroundColor: "var(--accent)",
              color: "#fff",
              border: "1px solid var(--accent)",
            }}
          >
            {submitting ? "..." : "Kirim"}
          </button>
        </form>
      ) : (
        <div
          className="flex items-center justify-between gap-2 mb-3 px-3 py-2 rounded-xl"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            Silakan login untuk menulis komentar.
          </span>
          <LoginDialog>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
              }}
            >
              Login
            </button>
          </LoginDialog>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-center py-4" style={{ color: "var(--muted)" }}>
          Memuat komentar...
        </p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-center py-4" style={{ color: "var(--muted)" }}>
          Belum ada komentar. Jadilah yang pertama!
        </p>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="size-8">
                <AvatarImage src={c.userAvatar || undefined} alt={c.userName} referrerPolicy="no-referrer" />
                <AvatarFallback className="text-xs font-bold"
                  style={{ backgroundColor: "var(--surface)", color: "var(--accent)", border: "1px solid var(--border)" }}
                >
                  {c.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    {c.userName}
                  </span>
                  {c.isFirst && (
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                        color: "var(--accent)",
                        opacity: 0.8,
                      }}
                    >
                      pertama
                    </span>
                  )}
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {formatTime(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-1.5" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                  {c.content}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLike(c.id)}
                    disabled={!user || likingIds.has(c.id)}
                    className="flex items-center gap-1 text-xs transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ color: "var(--muted)" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={c.isLikedByCharlotte ? "var(--accent)" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    <span>{c.likeCount}</span>
                  </button>
                  {c.isLikedByCharlotte && (
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                      style={{
                        color: "var(--accent)",
                        opacity: 0.6,
                      }}
                    >
                      Liked by Charlotte
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
