import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router";
import { Sun, Moon, Instagram, ShoppingBag } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Work", to: "/work" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 font-['Inter',sans-serif]">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-black dark:text-white tracking-wide lowercase"
            style={{ fontWeight: 300, fontSize: "1.1rem", letterSpacing: "0.04em" }}
          >
            jackdobson
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-wide transition-colors duration-200 ${
                  isActive(link.to)
                    ? "text-black dark:text-white border-b border-black dark:border-white pb-0.5"
                    : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                }`}
                style={{ fontWeight: 300 }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/jackwdobson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <button
              onClick={toggleTheme}
              className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? (
                <Moon size={18} strokeWidth={1.5} />
              ) : (
                <Sun size={18} strokeWidth={1.5} />
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 ml-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span
                className={`block w-5 h-px bg-black dark:bg-white transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              />
              <span
                className={`block w-5 h-px bg-black dark:bg-white transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-px bg-black dark:bg-white transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t border-black/5 dark:border-white/5 px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm tracking-wide transition-colors duration-200 ${
                  isActive(link.to)
                    ? "text-black dark:text-white"
                    : "text-black/50 dark:text-white/50"
                }`}
                style={{ fontWeight: 300 }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/5 mt-24 px-6 md:px-10 py-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          className="text-black/30 dark:text-white/30 text-xs tracking-wide"
          style={{ fontWeight: 300 }}
        >
          © 2026 Jack Dobson. Pemberton, BC.
        </p>
        <a
          href="https://instagram.com/jackwdobson"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white text-xs tracking-wide transition-colors"
          style={{ fontWeight: 300 }}
        >
          @jackwdobson
        </a>
      </footer>
    </div>
  );
}
