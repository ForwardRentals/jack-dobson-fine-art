import jackOutdoor from "figma:asset/0ee6729579f2641888d4a250f5aa50d9df3eeed9.png";
import { Link } from "react-router";

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      {/* Heading */}
      <div className="mb-16 md:mb-20">
        <h1
          className="text-black dark:text-white text-3xl md:text-4xl tracking-[0.12em] uppercase"
          style={{ fontWeight: 300 }}
        >
          About
        </h1>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Photo */}
        <div className="aspect-[3/4] overflow-hidden bg-black/3 dark:bg-white/3">
          <img
            src={jackOutdoor}
            alt="Jack Dobson"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-8 pt-2 md:pt-8">
          <div className="flex flex-col gap-5">
            <p
              className="text-black dark:text-white text-base leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              Jack Dobson is an artist and snowboarder based in Pemberton, British
              Columbia. Surrounded by some of the most dramatic mountain terrain in
              Canada, his work draws from the landscapes he navigates daily —
              snow-laden peaks, old-growth forest, and the quiet stillness found
              above the treeline.
            </p>
            <p
              className="text-black/60 dark:text-white/60 text-base leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              His prints are a reflection of a life lived outdoors — the light
              before a storm, a freshly tracked powder run, the long drive home
              through the valley. Each limited edition is printed on archival
              cotton rag paper and signed by Jack.
            </p>
            <p
              className="text-black/60 dark:text-white/60 text-base leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              Pemberton sits in the shadow of Mount Currie, just north of Whistler.
              It's a small town with big mountains — and that tension between
              intimacy and scale is something Jack returns to again and again in
              his work.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-black/8 dark:border-white/8" />

          {/* Details */}
          <div className="grid grid-cols-2 gap-8">
            {[
              { label: "Based in", value: "Pemberton, BC" },
              { label: "Medium", value: "Archival pigment print" },
              { label: "Edition sizes", value: "10–30 prints" },
              { label: "Paper", value: "Cotton rag, 310gsm" },
            ].map((item) => (
              <div key={item.label}>
                <p
                  className="text-xs text-black/30 dark:text-white/30 tracking-[0.15em] uppercase mb-1"
                  style={{ fontWeight: 300 }}
                >
                  {item.label}
                </p>
                <p
                  className="text-sm text-black dark:text-white"
                  style={{ fontWeight: 300 }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex gap-6 pt-2">
            <Link
              to="/"
              className="text-sm text-black dark:text-white border-b border-black dark:border-white pb-0.5 tracking-wide hover:opacity-50 transition-opacity"
              style={{ fontWeight: 300 }}
            >
              View prints
            </Link>
            <Link
              to="/contact"
              className="text-sm text-black/40 dark:text-white/40 border-b border-black/20 dark:border-white/20 pb-0.5 tracking-wide hover:opacity-50 transition-opacity"
              style={{ fontWeight: 300 }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}