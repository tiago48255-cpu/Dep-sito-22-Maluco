"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categoryEmoji: Record<string, string> = {
  cerveja: "🍺",
  destilado: "🥃",
  energético: "⚡",
  gelo: "🧊",
  refrigerante: "🥤",
  água: "💧",
  vinho: "🍷",
  combo: "📦",
};

export function CategoryFilter({
  categories,
  selected,
}: {
  categories: string[];
  selected?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(cat: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("categoria", cat);
    } else {
      params.delete("categoria");
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 flex-wrap mb-6">
      <button
        onClick={() => handleSelect(undefined)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !selected
            ? "bg-[#2233CC] text-white"
            : "bg-[#12122A] text-[#9999BB] border border-[#2A2A4A] hover:border-[#2233CC]"
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
            selected === cat
              ? "bg-[#2233CC] text-white"
              : "bg-[#12122A] text-[#9999BB] border border-[#2A2A4A] hover:border-[#2233CC]"
          }`}
        >
          {categoryEmoji[cat] ?? "🍾"} {cat}
        </button>
      ))}
    </div>
  );
}
