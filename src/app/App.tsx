import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useShopifyProducts, type EnrichedPrint } from "./hooks/useShopifyProducts";
import jackPhoto from "figma:asset/2f2db7c7289f6eee97c8f24f185e236f4067569a.png";

import migration from "figma:asset/e0b708ff6603c76fd37fd215f5e6f97b35be4085.png";
import alpenglow from "figma:asset/a70245acab034155d8e19a5310d3e68e2af85fb2.png";
import lastLight from "figma:asset/eb1a8fdf1f7b41775b7d9021634f03a83422c5d2.png";
import sparkWater from "figma:asset/11d13bfd1c6f863f125873e106e04a0a602afc28.png";

const slideshowImages = [
  { src: lastLight,  position: "center center" },
  { src: migration,  position: "center 70%",   mobilePosition: "center center", mobileTransform: "scale(1.5) translateY(8%)" },
  { src: alpenglow,  position: "50% 60%",       mobilePosition: "50% 60%" },
  { src: sparkWater, position: "center center" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <SEO />
        <Site />
      </ThemeProvider>
    </HelmetProvider>
  );
}

/* ────────────────────── SEO ─────────────────────── */
const OG_IMAGE = "https://images.unsplash.com/photo-1633141425586-16218dc3f60d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHNub3dib2FyZCUyMGJyaXRpc2glMjBjb2x1bWJpYSUyMGFscGluZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzE2MzQ1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1200";
// 👆 Replace with a hosted URL to one of Jack's actual prints once the site is live.

function SEO() {
  const TITLE       = "Jack Dobson — Artist & Snowboarder | Pemberton, BC";
  const DESCRIPTION = "Limited edition fine art prints by Jack Dobson — snowboarder and artist based in Pemberton, British Columbia. Archival prints of mountain landscapes, powder runs, and the wild beauty of the Coast Mountains.";
  const SITE_URL    = "https://jackdobson.ca";

  return (
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta name="keywords" content="Jack Dobson, fine art prints, snowboarding art, Pemberton BC, British Columbia landscape prints, limited edition prints, mountain photography, Coast Mountains art, archival prints" />
      <meta name="author" content="Jack Dobson" />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="CA-BC" />
      <meta name="geo.placename" content="Pemberton, British Columbia" />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={SITE_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:site_name" content="Jack Dobson" />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="800" />
      <meta property="og:image:alt" content="Dramatic alpine landscape from the Coast Mountains near Pemberton, BC — Jack Dobson fine art prints" />
      <meta property="og:locale" content="en_CA" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content="Jack Dobson — fine art prints from Pemberton, BC" />
    </Helmet>
  );
}

/* ─────────────────────── SITE ─────────────────────── */
function Site() {
  const { theme, toggleTheme } = useTheme();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 90]);

  // Slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevSlide(currentSlide);
      setTransitioning(true);
      setCurrentSlide((s) => (s + 1) % slideshowImages.length);
      setTimeout(() => { setPrevSlide(null); setTransitioning(false); }, 3000);
    }, 10000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  // Nav scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollTo = (id: string) => {
    const delay = mobileMenuOpen ? 350 : 0;
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, delay);
  };

  const goToSlide = (i: number) => {
    setPrevSlide(currentSlide);
    setTransitioning(true);
    setCurrentSlide(i);
    setTimeout(() => { setPrevSlide(null); setTransitioning(false); }, 3000);
  };

  const isDark = theme === "dark";
  const navBg = scrolled
    ? isDark ? "rgba(0,0,0,0.92)" : "rgba(255,255,255,0.93)"
    : "transparent";
  const navBorder = scrolled
    ? isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)"
    : "none";
  const logoColor = scrolled
    ? isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)"
    : "rgba(255,255,255,1)";
  const linkColor = scrolled
    ? isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
    : "rgba(255,255,255,0.65)";

  const { prints: livePrints, loading: shopifyLoading } = useShopifyProducts();

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">

      {/* ── NAV ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{ background: navBg, backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: navBorder }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-14 md:h-16 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="tracking-[0.22em] uppercase transition-colors duration-300 text-[1rem] md:text-[0.82rem]"
            style={{ fontWeight: 300, color: logoColor }}
          >
            Jack Dobson
          </button>

          {/* Desktop nav — centred absolutely */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease }}
                onClick={() => scrollTo(item.id)}
                className="text-[11px] tracking-[0.25em] uppercase transition-opacity duration-300 hover:opacity-100"
                style={{ fontWeight: 300, color: linkColor }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Right: theme toggle (always) + hamburger (mobile only) */}
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} color={logoColor} />
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] w-5 h-5"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease }}
                className="block h-px w-full"
                style={{ background: logoColor }}
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="block h-px w-full"
                style={{ background: logoColor }}
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease }}
                className="block h-px w-full"
                style={{ background: logoColor }}
              />
            </button>
          </div>

        </div>
      </motion.header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-30 md:hidden flex flex-col items-center justify-center"
            style={{ background: isDark ? "rgba(0,0,0,0.97)" : "rgba(255,255,255,0.98)" }}
          >
            <nav className="flex flex-col items-center gap-9">
              {navLinks.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.06 }}
                  onClick={() => scrollTo(item.id)}
                  className="text-[13px] tracking-[0.35em] uppercase text-black dark:text-white"
                  style={{ fontWeight: 300 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-10 text-[9px] tracking-[0.25em] uppercase text-black/25 dark:text-white/25"
              style={{ fontWeight: 300 }}
            >
              Pemberton, BC
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative w-full overflow-hidden" style={{ height: "100svh" }}>

        <motion.div className="absolute inset-0 w-full h-full" style={{ y: heroY }}>
          {slideshowImages.map((img, i) => {
            const isCurrent = i === currentSlide;
            const isPrev = i === prevSlide;
            return (
              <img
                key={i}
                src={img.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: isCurrent ? 1 : isPrev && transitioning ? 1 : 0,
                  transition: (isCurrent || (isPrev && transitioning)) ? "opacity 3s ease-in-out" : "none",
                  zIndex: isCurrent ? 2 : isPrev ? 1 : 0,
                  objectPosition: isMobile ? (img.mobilePosition ?? img.position) : img.position,
                  transform: isMobile ? (img.mobileTransform ?? "scale(1.04)") : "scale(1.04)",
                }}
              />
            );
          })}
        </motion.div>

        {/* Vignette */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />

        {/* Hero text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.5 }}
            className="text-white/55 text-[9px] tracking-[0.4em] uppercase mb-4"
            style={{ fontWeight: 300 }}
          >
            Pemberton, British Columbia
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease, delay: 0.72 }}
            className="text-white"
            style={{
              fontWeight: 300,
              fontSize: "clamp(2.6rem, 11vw, 6rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            Jack Dobson
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 1.02 }}
            className="text-white/50 text-[10px] tracking-[0.3em] uppercase mt-5"
            style={{ fontWeight: 300 }}
          >
            Artist &amp; Snowboarder
          </motion.p>
        </div>

        {/* Scroll cue */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5, ease }}
          onClick={() => scrollTo("prints")}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 group"
        >
          <span className="hidden sm:block text-[9px] text-white/60 tracking-[0.4em] uppercase mb-1" style={{ fontWeight: 300 }}>
            View Paintings
          </span>
          <span className="block w-px bg-white/45 group-hover:bg-white/80 transition-colors duration-300" style={{ height: 26 }} />
          <svg width="9" height="5" viewBox="0 0 10 6" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2">
            <polyline points="1,1 5,5 9,1" />
          </svg>
        </motion.button>

        {/* Slide dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="absolute bottom-7 right-5 md:right-8 z-20 flex gap-1.5 items-center"
        >
          {slideshowImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className="transition-all duration-500"
              style={{
                width: i === currentSlide ? 16 : 4,
                height: 3,
                borderRadius: 2,
                background: i === currentSlide ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </motion.div>

      </section>

      {/* ── PRINTS ── */}
      <section id="prints" className="py-16 md:py-28 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, ease }}
            className="text-black/30 dark:text-white/30 text-[9px] tracking-[0.3em] uppercase mb-8 md:mb-12"
            style={{ fontWeight: 300 }}
          >
            Limited edition paintings
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-9 md:gap-x-6 md:gap-y-14">
            {livePrints.map((print, i) => (
              <motion.div
                key={print.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.85, ease, delay: (i % 4) * 0.07 }}
              >
                <PrintCard print={print} onClick={() => setLightboxIndex(i)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-16 md:py-28 border-t border-black/6 dark:border-white/6 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 items-start">

            {/* Photo */}
            <motion.div
              className="w-full overflow-hidden"
              style={{ aspectRatio: "3 / 4", maxHeight: "75vw" }}
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.1, ease }}
            >
              <motion.img
                src={jackPhoto}
                alt="Jack Dobson"
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease }}
              />
            </motion.div>

            {/* Bio */}
            <div className="flex flex-col gap-6 md:gap-8 md:pt-4">
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, ease, delay: 0.1 }}
                className="text-[9px] tracking-[0.3em] uppercase text-black/30 dark:text-white/30"
                style={{ fontWeight: 300 }}
              >
                About
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, ease, delay: 0.18 }}
                className="text-black dark:text-white leading-relaxed text-base"
                style={{ fontWeight: 300 }}
              >
                Jack Dobson is an artist and snowboarder based in Pemberton,
                British Columbia. Surrounded by some of the most dramatic
                mountain terrain in Canada, his work draws from the landscapes
                he navigates daily; snow-laden peaks, old-growth forest, and
                the quiet stillness found above the treeline.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, ease, delay: 0.26 }}
                className="text-black/50 dark:text-white/50 text-sm leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                His paintings are a reflection of a life lived outdoors; the
                light before a storm, a freshly tracked powder run, the long
                drive home through the valley. Each limited edition is printed
                on 200 GSM, 80 lb matte finish, FSC certified paper.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, ease, delay: 0.34 }}
                className="border-t border-black/8 dark:border-white/8 pt-6 md:pt-8 grid grid-cols-2 gap-x-5 gap-y-5 md:gap-x-8 md:gap-y-6"
              >
                {[
                  { label: "Based in",      value: "Pemberton, BC" },
                  { label: "Medium",        value: "Acrylic on canvas" },
                  { label: "Paper",         value: "200 GSM / 80 lb, matte finish" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.44 + i * 0.07 }}
                  >
                    <p className="text-[9px] text-black/30 dark:text-white/30 tracking-[0.2em] uppercase mb-1" style={{ fontWeight: 300 }}>
                      {item.label}
                    </p>
                    <p className="text-sm text-black dark:text-white" style={{ fontWeight: 300 }}>
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-16 md:py-28 border-t border-black/6 dark:border-white/6 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <ContactForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease }}
        className="border-t border-black/6 dark:border-white/6 py-6 md:py-8 bg-white dark:bg-black"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">
          <p className="text-[9px] text-black/25 dark:text-white/25 tracking-[0.18em] uppercase" style={{ fontWeight: 300 }}>
            © {new Date().getFullYear()} Jack Dobson
          </p>
          <p className="text-[9px] text-black/25 dark:text-white/25 tracking-[0.18em] uppercase" style={{ fontWeight: 300 }}>
            Pemberton, BC
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-10 mt-3 flex justify-center">
          <a
            href="https://freesitecompany.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.15em] uppercase transition-colors duration-200 text-black/80 dark:text-white/80"
            style={{ fontWeight: 300 }}
          >
            Website made for free by{" "}
            <span className="text-black/80 dark:text-white/80">freesitecompany.com</span>
          </a>
        </div>
      </motion.footer>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            prints={livePrints}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
            onNext={() => setLightboxIndex((i) => Math.min(livePrints.length - 1, (i ?? 0) + 1))}
            onInquire={() => {
              setLightboxIndex(null);
              setTimeout(() => scrollTo("contact"), 150);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

/* ─────────────────────── NAV LINKS ─────────────────────── */
const navLinks = [
  { label: "Paintings",  id: "prints" },
  { label: "About",   id: "about" },
  { label: "Contact", id: "contact" },
];

/* ─────────────────────── THEME TOGGLE ────────────────────── */
function ThemeToggle({ theme, toggleTheme, color }: { theme: string; toggleTheme: () => void; color: string }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.65, ease }}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="transition-colors duration-300 p-1"
      style={{ color }}
    >
      {theme === "light" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </motion.button>
  );
}

/* ─────────────────────── PRINT CARD ─────────────────────── */
function PrintCard({ print, onClick }: { print: EnrichedPrint; onClick: () => void }) {
  // Prefer live Shopify data; fall back to static
  const title     = print.liveTitle    ?? print.title;
  const price     = print.livePrice    ?? print.price;
  const available = print.liveAvailable ?? print.available;

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden bg-black/3 dark:bg-white/3 mb-3 aspect-[4/5]">
        {!available && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[8px] tracking-[0.12em] uppercase text-black/50 dark:text-white/50 bg-white dark:bg-black px-1.5 py-0.5" style={{ fontWeight: 300 }}>
              Sold Out
            </span>
          </div>
        )}
        <img
          src={print.image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!available ? "opacity-50" : ""}`}
          style={{ objectPosition: print.objectPosition ?? "center center" }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-500" />
      </div>
      <p className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-black dark:text-white mb-0.5" style={{ fontWeight: 300 }}>
        {title}
      </p>
      <p className="text-[10px] md:text-[11px] text-black/35 dark:text-white/35 tracking-wide" style={{ fontWeight: 300 }}>
        {available && price ? `$${price} CAD` : "Sold Out"} — {print.edition}
      </p>
    </div>
  );
}

/* ─────────────────────── LIGHTBOX ─────────────────────── */
function Lightbox({ prints, index, onClose, onPrev, onNext, onInquire }: {
  prints: EnrichedPrint[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onInquire: () => void;
}) {
  const print    = prints[index];
  const hasPrev  = index > 0;
  const hasNext  = index < prints.length - 1;
  const price    = print.livePrice    ?? print.price;
  const available = print.liveAvailable ?? print.available;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft"  && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-white dark:bg-black"
    >
      {/* Top bar: close + counter */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-5 md:px-8 h-14">
        <p className="text-[9px] tracking-[0.25em] uppercase text-black/30 dark:text-white/30" style={{ fontWeight: 300 }}>
          {index + 1} / {prints.length}
        </p>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-black/35 dark:text-white/35 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
          </svg>
          <span className="hidden sm:inline text-[9px] tracking-[0.25em] uppercase" style={{ fontWeight: 300 }}>Close</span>
        </button>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous print"
        className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 transition-opacity duration-200 disabled:opacity-0"
        style={{ opacity: hasPrev ? 1 : 0 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
          <polyline points="11,3 5,9 11,15" />
        </svg>
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next print"
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 transition-opacity duration-200 disabled:opacity-0"
        style={{ opacity: hasNext ? 1 : 0 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.1" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
          <polyline points="7,3 13,9 7,15" />
        </svg>
      </button>

      {/* Scrollable content, keyed to print so it resets on navigation */}
      <div className="h-full overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={print.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease }}
            className="min-h-full flex flex-col md:flex-row md:items-center gap-8 md:gap-14 px-10 md:px-20 pt-20 pb-12 max-w-5xl mx-auto"
          >
            {/* Image */}
            <div className="w-full md:w-3/5 flex items-center justify-center">
              <img
                src={print.image}
                alt={print.liveTitle ?? print.title}
                className="w-full max-h-[52vh] md:max-h-[76vh] object-contain"
              />
            </div>

            {/* Details */}
            <div className="w-full md:w-2/5 flex flex-col gap-5 border-t border-black/8 dark:border-white/8 pt-7 md:border-0 md:pt-0">
              <h2 className="text-black dark:text-white text-lg tracking-[0.1em] uppercase" style={{ fontWeight: 300 }}>
                {print.liveTitle ?? print.title}
              </h2>
              <div className="flex flex-col gap-1.5 text-sm text-black/45 dark:text-white/45" style={{ fontWeight: 300 }}>
                <p>{print.year}</p>
                <p>{print.dimensions}</p>
                <p>{print.edition}</p>
                <p>200 GSM, 80 lb matte finish, FSC certified</p>
                <p>Numbered</p>
              </div>
              <div className="border-t border-black/8 dark:border-white/8 pt-5">
                {available ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-black dark:text-white" style={{ fontWeight: 300 }}>
                      ${price} CAD
                    </p>
                    <a
                      href={print.shopifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-center text-white dark:text-black bg-black dark:bg-white border border-black dark:border-white px-6 py-3.5 tracking-[0.2em] uppercase hover:opacity-75 transition-opacity duration-200"
                      style={{ fontWeight: 300 }}
                    >
                      Buy Now
                    </a>
                    <button
                      onClick={onInquire}
                      className="text-[10px] text-black dark:text-white border border-black/25 dark:border-white/25 px-6 py-3.5 tracking-[0.2em] uppercase hover:border-black dark:hover:border-white transition-colors duration-200 text-left"
                      style={{ fontWeight: 300 }}
                    >
                      Inquire
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-black/30 dark:text-white/30 tracking-[0.25em] uppercase" style={{ fontWeight: 300 }}>
                    Sold Out
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── CONTACT FORM ─────────────────────── */
function ContactForm() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const labelColor = (name: string) =>
    focused === name
      ? isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)"
      : isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)";

  const borderColor = (name: string) =>
    focused === name
      ? isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"
      : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="py-12 md:py-16 max-w-md"
      >
        <div className="w-8 h-px bg-black/20 dark:bg-white/20 mb-8" />
        <p className="text-black dark:text-white mb-2.5" style={{ fontWeight: 300, fontSize: "1.05rem" }}>Thank you.</p>
        <p className="text-black/40 dark:text-white/40 text-sm" style={{ fontWeight: 300 }}>
          Jack will get back to you within a few days.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24">

      {/* Left */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease }}
        className="flex flex-col gap-6 md:gap-10 md:justify-between"
      >
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-black/30 dark:text-white/30 mb-5" style={{ fontWeight: 300 }}>
            Get in Touch
          </p>
          <p className="text-black dark:text-white leading-snug" style={{ fontWeight: 300, fontSize: "clamp(1.2rem,4vw,1.5rem)", lineHeight: 1.4 }}>
            Interested in a print?<br className="hidden sm:block" /> Have a question? Reach out.
          </p>
        </div>
        <div>
          <p className="text-[9px] text-black/30 dark:text-white/30 tracking-[0.15em] uppercase mb-1.5" style={{ fontWeight: 300 }}>
            Response time
          </p>
          <p className="text-sm text-black/55 dark:text-white/55" style={{ fontWeight: 300 }}>
            Jack responds personally, usually within a few days.
          </p>
        </div>
      </motion.div>

      {/* Right: form */}
      <motion.form
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease, delay: 0.14 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          {[
            { label: "Name",  name: "name",  type: "text",  placeholder: "Your name" },
            { label: "Email", name: "email", type: "email", placeholder: "your@email.com" },
          ].map((f) => (
            <div key={f.name} className="flex flex-col gap-2">
              <label htmlFor={f.name} className="text-[9px] tracking-[0.22em] uppercase transition-colors duration-200" style={{ fontWeight: 300, color: labelColor(f.name) }}>
                {f.label}
              </label>
              <input
                id={f.name} type={f.type} name={f.name}
                value={form[f.name as "name" | "email"]}
                onChange={handleChange}
                onFocus={() => setFocused(f.name)}
                onBlur={() => setFocused(null)}
                placeholder={f.placeholder}
                required
                className="bg-transparent border-b text-black dark:text-white text-sm py-2.5 outline-none transition-colors duration-200 placeholder:text-black/20 dark:placeholder:text-white/20"
                style={{ fontWeight: 300, borderColor: borderColor(f.name) }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-[9px] tracking-[0.22em] uppercase transition-colors duration-200" style={{ fontWeight: 300, color: labelColor("message") }}>
            Message
          </label>
          <textarea
            id="message" name="message" value={form.message}
            onChange={handleChange}
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
            placeholder="What are you interested in?"
            required rows={5}
            className="bg-transparent border-b text-black dark:text-white text-sm py-2.5 outline-none transition-colors duration-200 resize-none placeholder:text-black/20 dark:placeholder:text-white/20"
            style={{ fontWeight: 300, borderColor: borderColor("message") }}
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            className="group flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-black dark:text-white hover:opacity-55 transition-opacity duration-200"
            style={{ fontWeight: 300 }}
          >
            <span>Send Message</span>
            <span className="block h-px w-9 bg-black dark:bg-white transition-all duration-300 group-hover:w-16" />
          </button>
        </div>
      </motion.form>

    </div>
  );
}