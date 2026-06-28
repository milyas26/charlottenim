"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/LoginDialog";
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
    <div className="px-4 pt-2.5 pb-3 min-h-[400px]">
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
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                }}
              >
                {c.userAvatar ? (
                  <img src={c.userAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  c.userName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                    {c.userName}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                    {formatTime(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
