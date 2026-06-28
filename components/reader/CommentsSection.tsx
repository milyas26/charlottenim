"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "@/components/LoginDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchComments, createComment, likeComment } from "@/lib/api/comments";
import type { Comment } from "@/data/types";

interface Props {
  chapterId: string;
}

export default function CommentsSection({ chapterId }: Props) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", chapterId],
    queryFn: () => fetchComments(chapterId),
  })

  const submitMutation = useMutation({
    mutationFn: (content: string) => createComment(chapterId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", chapterId] })
      setNewComment("")
    },
  })

  const likeMutation = useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", chapterId] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newComment.trim()
    if (!trimmed || !user || submitMutation.isPending) return;
    submitMutation.mutate(trimmed);
  };

  const handleLike = (commentId: string) => {
    if (!user || likeMutation.isPending) return;
    likeMutation.mutate(commentId);
  };

  const formattedTimes = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now()
    const map = new Map<string, string>()
    for (const c of comments) {
      const diff = now - new Date(c.createdAt).getTime()
      const mins = Math.floor(diff / 60000)
      let text: string
      if (mins < 1) text = "Baru saja"
      else if (mins < 60) text = `${mins} menit lalu`
      else {
        const hours = Math.floor(mins / 60)
        if (hours < 24) text = `${hours} jam lalu`
        else {
          const days = Math.floor(hours / 24)
          if (days < 7) text = `${days} hari lalu`
          else {
            const weeks = Math.floor(days / 7)
            text = weeks < 5 ? `${weeks} minggu lalu` : new Date(c.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          }
        }
      }
      map.set(c.id, text)
    }
    return map
  }, [comments])

  const formatTime = (id: string) => formattedTimes.get(id) ?? ""

  return (
    <div className="px-4 pt-2.5 pb-3 min-h-[200px]">
      <h3
        className="text-xs font-semibold uppercase tracking-wider mb-2"
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
            className="flex-1 px-3 py-2 rounded-xl text-xs outline-none transition-colors"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || submitMutation.isPending}
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-40"
            style={{
              backgroundColor: "var(--accent)",
              color: "#fff",
              border: "1px solid var(--accent)",
            }}
          >
            {submitMutation.isPending ? "..." : "Kirim"}
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

      {isLoading ? (
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
                    {formatTime(c.id)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-1.5" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                  {c.content}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLike(c.id)}
                    disabled={!user || likeMutation.isPending}
                    className="flex items-center gap-1 text-xs transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{ color: "var(--muted)" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={c.isLiked ? "var(--accent)" : "none"}
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
