"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useLang, type Lang } from "@/context/LanguageContext";

const LANGS: Lang[] = ["de", "en", "fr"];

const nav: Record<Lang, { label: string; href: string }[]> = {
  de: [
    { label: "Über Uns",    href: "/" },
    { label: "Projekte",    href: "/projekte" },
    { label: "Akquisition", href: "/akquisition" },
    { label: "Login",       href: "/login" },
  ],
  en: [
    { label: "About Us",   href: "/" },
    { label: "Projects",   href: "/projekte" },
    { label: "Acquisition",href: "/akquisition" },
    { label: "Login",      href: "/login" },
  ],
  fr: [
    { label: "À Propos",   href: "/" },
    { label: "Projets",    href: "/projekte" },
    { label: "Acquisition",href: "/akquisition" },
    { label: "Login",      href: "/login" },
  ],
};

const LIGHT = "rgba(232,228,220,";
const t = (o: number) => `${LIGHT}${o})`;

export default function Navbar() {
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nextLang, setNextLang] = useState<Lang | null>(null);
  const reduce = useReducedMotion();
  const links = nav[lang];
  const onDark = pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const cycleLanguage = () => {
    const idx = LANGS.indexOf(lang);
    setLang(LANGS[(idx + 1) % LANGS.length]);
  };

  const light = onDark && !scrolled;

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "all 0.5s ease",
          padding: scrolled ? "12px 0" : "22px 0",
          background: scrolled ? "rgba(245,243,239,0.90)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(26,25,22,0.07)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Image
              src="/favicon.png" alt="B&B" width={22} height={22}
              style={{ objectFit: "contain", filter: light ? "brightness(0) invert(1)" : "none", opacity: light ? 0.7 : 1 }}
              priority
            />
            <span style={{ fontFamily: "var(--font-cormorant)", fontSize: 15, fontWeight: 400, fontStyle: "italic", letterSpacing: "0.01em", color: light ? t(0.65) : "#1A1916" }}>
              Baidas & Baidas
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden md:flex">
            {links.map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.16em",
                textTransform: "uppercase", textDecoration: "none",
                color: pathname === link.href
                  ? light ? t(0.9) : "#1A1C19"
                  : light ? t(0.38) : "#9A9693",
                transition: "color 0.3s",
              }}>
                {link.label}
              </Link>
            ))}
            {/* Language cycle button */}
            <button onClick={cycleLanguage} style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.18em",
              textTransform: "uppercase", background: "none", border: "none", cursor: "pointer",
              padding: "6px 12px", borderRadius: 9999,
              color: light ? t(0.32) : "#9A9693",
              outline: `1px solid ${light ? t(0.1) : "rgba(26,25,22,0.1)"}`,
              transition: "all 0.3s",
            }}>
              {lang.toUpperCase()}
            </button>
          </nav>

          {/* Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", width: 22, height: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: "100%", height: 1,
                background: light ? t(0.55) : "#1A1916",
                transition: "all 0.3s",
                transform: menuOpen && i===0 ? "rotate(45deg) translate(5px,5px)" :
                           menuOpen && i===1 ? "scaleX(0)" :
                           menuOpen && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
                opacity: menuOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(245,243,239,0.96)", backdropFilter: "blur(32px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}
          >
            {links.map((link, i) => (
              <div key={link.href} style={{ overflow: "hidden" }}>
                <motion.div
                  initial={reduce ? false : { y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={link.href} onClick={() => setMenuOpen(false)}
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, fontStyle: "italic", color: "#1A1916", textDecoration: "none", transition: "color 0.2s" }}>
                    {link.label}
                  </Link>
                </motion.div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              {LANGS.map(l => (
                <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }}
                  style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", background: lang===l ? "#1A1916" : "transparent", color: lang===l ? "#F5F3EF" : "#9A9693", border: "1px solid rgba(26,25,22,0.12)", padding: "7px 14px", borderRadius: 9999, cursor: "pointer" }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

