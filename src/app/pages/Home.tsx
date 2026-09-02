import { useState } from "react";
import { prints, type Print } from "../data/prints";

export function Home() {
  const [selectedPrint, setSelectedPrint] = useState<Print | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-16">
      {/* Subtle intro line */}
      <div className="mb-10 md:mb-14">
        <p
          className="text-black/30 dark:text-white/30 text-xs tracking-[0.25em] uppercase"
          style={{ fontWeight: 300 }}
        >
          Limited edition prints — Pemberton, BC
        </p>
      </div>

      {/* Print grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
        {prints.map((print) => (
          <PrintCard
            key={print.id}
            print={print}
            onClick={() => setSelectedPrint(print)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedPrint && (
        <Lightbox
          print={selectedPrint}
          onClose={() => setSelectedPrint(null)}
        />
      )}
    </div>
  );
}

function PrintCard({ print, onClick }: { print: Print; onClick: () => void }) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden bg-black/3 dark:bg-white/3 mb-4 aspect-[4/5]">
        {!print.available && (
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
          alt={print.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            !print.available ? "opacity-50" : ""
          }`}
        />
      </div>
      <div>
        <p
          className="text-xs tracking-[0.15em] uppercase text-black dark:text-white mb-1"
          style={{ fontWeight: 300 }}
        >
          {print.title}
        </p>
        <p
          className="text-xs text-black/30 dark:text-white/30 tracking-wide"
          style={{ fontWeight: 300 }}
        >
          {print.year} — {print.edition}
        </p>
        <p
          className="text-xs text-black/50 dark:text-white/50 mt-0.5 tracking-wide"
          style={{ fontWeight: 300 }}
        >
          {print.available && print.price ? `$${print.price} CAD` : "Sold Out"}
        </p>
      </div>
    </div>
  );
}

function Lightbox({ print, onClose }: { print: Print; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-white/96 dark:bg-black/96 flex items-center justify-center p-6 md:p-16"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-8 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
        style={{ fontWeight: 300 }}
        onClick={onClose}
      >
        Close
      </button>
      <div
        className="flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 max-h-[70vh]">
          <img
            src={print.image}
            alt={print.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="md:w-1/2 flex flex-col gap-4">
          <h2
            className="text-black dark:text-white text-2xl tracking-[0.1em] uppercase"
            style={{ fontWeight: 300 }}
          >
            {print.title}
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
            {print.available ? (
              <div className="flex flex-col gap-3">
                <p
                  className="text-black dark:text-white text-base tracking-wide"
                  style={{ fontWeight: 300 }}
                >
                  ${print.price} CAD
                </p>
                <a
                  href="/contact"
                  className="inline-block text-xs text-black dark:text-white border border-black dark:border-white px-6 py-3 tracking-[0.15em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
                  style={{ fontWeight: 300 }}
                >
                  Inquire to Purchase
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
