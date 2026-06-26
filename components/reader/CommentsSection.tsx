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
  { id: 4, author: "CeritaMalam", text: "Deskripsi setting-nya dapet banget, kebayang suasananya.", date: "2 hari lalu" },
  { id: 5, author: "NovelHunter", text: "Karakter MC-nya kuat banget, growingnya kerasa dari awal.", date: "2 hari lalu" },
  { id: 6, author: "MataPenaku", text: "Aku reread dari awal lagi sambil nunggu update, gak bosen 😍", date: "3 hari lalu" },
  { id: 7, author: "BacaTerus", text: "Chapter ini short tapi impactful. Love it!", date: "3 hari lalu" },
  { id: 8, author: "KataKata", text: "Dialognya natural, gak kaku. Penulisnya berbakat!", date: "4 hari lalu" },
  { id: 9, author: "SastraDigital", text: "Akhirnya nemu novel bagus di sini. Langsung bookmark.", date: "4 hari lalu" },
  { id: 10, author: "HalamanLembar", text: "Gaya nulisnya flowing banget, gak terasa bacanya.", date: "5 hari lalu" },
  { id: 11, author: "RinduAksara", text: "Semoga cepet tamat, penasaran sama akhir ceritanya!", date: "6 hari lalu" },
  { id: 12, author: "BintangCerita", text: "Konfliknya dapet, bikin gregetan sendiri bacanya.", date: "6 hari lalu" },
  { id: 13, author: "TintaEmas", text: "Rekomendasi dari temen, ternyata beneran bagus 👍", date: "1 minggu lalu" },
  { id: 14, author: "PenaMalam", text: "Setiap chapter selalu ada plot yang gak terduga.", date: "1 minggu lalu" },
  { id: 15, author: "ImajiKertas", text: "Karakter sampingannya juga gak cuma tempelan, ada depth.", date: "1 minggu lalu" },
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

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
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
