"use client";

import { Wand2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ideaCategories, ideas } from "@/lib/ideas";

export function IdeaBoard() {
  const [category, setCategory] = useState<(typeof ideaCategories)[number]>("Semua");
  const list = ideas.filter((i) => category === "Semua" || i.category === category);
  return (
    <div className="stack">
      <div className="chips" role="group" aria-label="Kategori">
        {ideaCategories.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      <div className="grid-3">
        {list.map((idea) => (
          <article key={idea.title} className="idea-card">
            <span className="badge">{idea.category}</span>
            <h3>{idea.title}</h3>
            <p className="idea-angle">{idea.angle}</p>
            <Link href={`/app?ide=${encodeURIComponent(`${idea.title}: ${idea.angle}`)}`} className="btn btn-primary btn-block">
              <Wand2 size={18} aria-hidden="true" /> Jadikan video
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
