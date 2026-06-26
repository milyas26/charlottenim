"use client";

import { useState } from "react";

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

const dummyComments: Comment[] = [
  { id: 1, author: "Pembaca Setia", text: "Keren banget chapter ini, gak sabar nunggu kelanjutannya!", date: "2 jam lalu" },
  { id: 2, author: "BukuLover99", text: "Plot twist-nya bikin merinding...", date: "5 jam lalu" },
  { id: 3, author: "NimReader", text: "Tolong update lagi kak, udah gak tahan nunggu 😭", date: "1 hari lalu" },
];

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      author: "Kamu",
      text: newComment.trim(),
      date: "Baru saja",
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  return (
    <div className="px-4 pt-2.5 pb-3">
      <h3
        className="text-sm font-semibold uppercase tracking-wider mb-2"
        style={{ color: "var(--foreground)" }}
      >
        Komentar ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis komentar..."
          className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-colors"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
          style={{
            backgroundColor: "var(--accent)",
            color: "#fff",
            border: "1px solid var(--accent)",
          }}
        >
          Kirim
        </button>
      </form>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--accent)",
                border: "1px solid var(--border)",
              }}
            >
              {c.author.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  {c.author}
                </span>
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {c.date}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                {c.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
