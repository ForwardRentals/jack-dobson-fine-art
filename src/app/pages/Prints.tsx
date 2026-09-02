import { useState } from "react";
import { useShopifyProducts, type EnrichedPrint } from "../hooks/useShopifyProducts";

type Filter = "all" | "available" | "sold";
type Sort = "newest" | "oldest" | "price-low" | "price-high";

/** Resolved display title: prefer the authoritative Shopify title, fall back to local */
function displayTitle(p: EnrichedPrint) {
  return p.liveTitle ?? p.title;
}

export function Prints() {
  const { prints, loading } = useShopifyProducts();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [selectedPrint, setSelectedPrint] = useState<EnrichedPrint | null>(null);

  const filtered = prints
    .filter((p) => {
      const available = p.liveAvailable ?? p.available;
      if (filter === "available") return available;
      if (filter === "sold") return !available;
      return true;
    })
    .sort((a, b) => {
      if (sort === "newest") return b.year - a.year || b.id - a.id;
      if (sort === "oldest") return a.year - b.year || a.id - b.id;
      const aPrice = a.livePrice ?? a.price ?? 0;
      const bPrice = b.livePrice ?? b.price ?? 0;
      if (sort === "price-low") return aPrice - bPrice;
      if (sort === "price-high") return bPrice - aPrice;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
      {/* Header */}
      <div className="text-center mb-14 md:mb-20">
        <h1
          className="text-black dark:text-white text-3xl md:text-4xl tracking-[0.12em] uppercase mb-4"
          style={{ fontWeight: 300 }}
        >
          Prints
        </h1>
        <p
          className="text-black/40 dark:text-white/40 text-sm max-w-md mx-auto leading-relaxed"
          style={{ fontWeight: 300 }}
        >
          Limited edition fine art prints. Each piece is numbered, signed, and
          printed on archival paper.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12 border-t border-b border-black/8 dark:border-white/8 py-4">
        <div className="flex items-center gap-6">
          {(["all", "available", "sold"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                filter === f
                  ? "text-black dark:text-white"
                  : "text-black/30 dark:text-white/30 hover:text-black/70 dark:hover:text-white/70"
              }`}
              style={{ fontWeight: 300 }}
            >
              {f === "all" ? "All" : f === "available" ? "Available" : "Sold Out"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs text-black/30 dark:text-white/30 tracking-[0.1em] uppercase"
            style={{ fontWeight: 300 }}
          >
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="text-xs text-black dark:text-white bg-transparent border-none outline-none tracking-wide cursor-pointer appearance-none"
            style={{ fontWeight: 300 }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-black/5 dark:bg-white/5 aspect-[4/5] mb-4" />
              <div className="h-3 bg-black/5 dark:bg-white/5 w-2/3 mb-2" />
              <div className="h-3 bg-black/5 dark:bg-white/5 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {filtered.map((print) => (
            <PrintCard
              key={print.id}
              print={print}
              onClick={() => setSelectedPrint(print)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPrint && (
        <Lightbox
          print={selectedPrint}
          prints={filtered}
          onClose={() => setSelectedPrint(null)}
          onNav={(p) => setSelectedPrint(p)}
        />
      )}
    </div>
  );
}

function PrintCard({
  print,
  onClick,
}: {
  print: EnrichedPrint;
  onClick: () => void;
}) {
  const available = print.liveAvailable ?? print.available;
  const price = print.livePrice ?? print.price;

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden bg-black/3 dark:bg-white/3 mb-4 aspect-[4/5]">
        {!available && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className="text-[10px] tracking-[0.15em] uppercase text-black/50 dark:text-white/50 bg-white dark:bg-black px-2 py-1"
              style={{ fontWeight: 300 }}
            >
              Sold Out
            </span>
          </div>
        )}
        <img
          src={print.image}
          alt={displayTitle(print)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            !available ? "opacity-60" : ""
          }`}
        />
      </div>
      <div>
        <p
          className="text-xs tracking-[0.15em] uppercase text-black dark:text-white mb-1"
          style={{ fontWeight: 300 }}
        >
          {displayTitle(print)}
        </p>
        <p
          className="text-xs text-black/30 dark:text-white/30 tracking-wide"
          style={{ fontWeight: 300 }}
        >
          {print.year} — {print.edition}
        </p>
        <p
          className="text-xs text-black/50 dark:text-white/50 mt-1 tracking-wide"
          style={{ fontWeight: 300 }}
        >
          {available && price ? `$${price} CAD` : "Sold Out"}
        </p>
      </div>
    </div>
  );
}

function Lightbox({
  print,
  prints,
  onClose,
  onNav,
}: {
  print: EnrichedPrint;
  prints: EnrichedPrint[];
  onClose: () => void;
  onNav: (p: EnrichedPrint) => void;
}) {
  const available = print.liveAvailable ?? print.available;
  const price = print.livePrice ?? print.price;
  const idx = prints.findIndex((p) => p.id === print.id);
  const prev = idx > 0 ? prints[idx - 1] : null;
  const next = idx < prints.length - 1 ? prints[idx + 1] : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 flex items-center justify-center p-6 md:p-16"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-8 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
        style={{ fontWeight: 300 }}
        onClick={onClose}
      >
        Close
      </button>

      {/* Prev arrow */}
      <button
        className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-xl transition-colors ${
          prev
            ? "text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white cursor-pointer"
            : "text-black/10 dark:text-white/10 cursor-default pointer-events-none"
        }`}
        onClick={(e) => { e.stopPropagation(); if (prev) onNav(prev); }}
        aria-label="Previous print"
      >
        ←
      </button>

      {/* Next arrow */}
      <button
        className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-xl transition-colors ${
          next
            ? "text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white cursor-pointer"
            : "text-black/10 dark:text-white/10 cursor-default pointer-events-none"
        }`}
        onClick={(e) => { e.stopPropagation(); if (next) onNav(next); }}
        aria-label="Next print"
      >
        →
      </button>

      <div
        className="flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 max-h-[70vh]">
          <img
            src={print.image}
            alt={displayTitle(print)}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="md:w-1/2 flex flex-col gap-4">
          <h2
            className="text-black dark:text-white text-2xl tracking-[0.1em] uppercase"
            style={{ fontWeight: 300 }}
          >
            {displayTitle(print)}
          </h2>
          <div
            className="flex flex-col gap-2 text-sm text-black/50 dark:text-white/50"
            style={{ fontWeight: 300 }}
          >
            <p>{print.year}</p>
            <p>{print.dimensions}</p>
            <p>{print.edition}</p>
            <p>Archival pigment print on cotton rag paper</p>
            <p>Signed & numbered by the artist</p>
          </div>
          <div className="border-t border-black/8 dark:border-white/8 pt-4 mt-2">
            {available ? (
              <div className="flex flex-col gap-3">
                <p
                  className="text-black dark:text-white text-base tracking-wide"
                  style={{ fontWeight: 300 }}
                >
                  ${price} CAD
                </p>
                <a
                  href={print.shopifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs text-black dark:text-white border border-black dark:border-white px-6 py-3 tracking-[0.15em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
                  style={{ fontWeight: 300 }}
                >
                  Buy Now
                </a>
              </div>
            ) : (
              <p
                className="text-xs text-black/30 dark:text-white/30 tracking-[0.2em] uppercase"
                style={{ fontWeight: 300 }}
              >
                Sold Out
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}