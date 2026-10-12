import Link from "next/link";
import type { ContentItem } from "@/lib/fixtures";

export function ItemList({ items, hrefFor, linkLabel }: { items: ContentItem[]; hrefFor: (item: ContentItem) => string; linkLabel: (item: ContentItem) => string }) {
  return (
    <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {items.map((item) => (
        <li key={item.id} className="card">
          <h2 className="card-title">{item.title}</h2>
          <p className="card-text">{item.kind === "video" ? "Video" : "Carousel"} · {item.stage}</p>
          <Link href={hrefFor(item)} className="text-link" style={{ display: "inline-block", marginTop: 16 }}>{linkLabel(item)} →</Link>
        </li>
      ))}
    </ul>
  );
}
