"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import { useLang } from "@/context/LanguageContext";

const DARK  = "#EBEEf3";
const LIGHT = "rgba(232,228,220,";
const t = (o: number) => `${LIGHT}${o})`;

const content = {
  de: { title: "Projekte", body: "Unsere Immobilienprojekte erstrecken sich über Zürich, Dubai und Abu Dhabi.", all: "Alle", close: "Schliessen" },
  en: { title: "Projects",  body: "Our real estate projects span Zürich, Dubai, and Abu Dhabi.",              all: "All",  close: "Close"     },
  fr: { title: "Projets",   body: "Nos projets immobiliers s'étendent sur Zurich, Dubaï et Abu Dhabi.",       all: "Tous", close: "Fermer"    },
};

const images = [
  { src: "https://static.wixstatic.com/media/b3010c_60046ffe836a44ea89cb7410bbbf771d~mv2.jpg",  location: "Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_01899069023c4a7eaa6330a88ccdef0d~mv2.jpg",  location: "Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_5b2633c90c194e7f8c060f43cf7aa85f~mv2.jpg",  location: "Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_30340c4d2d56484eb51be30d7d3f3201~mv2.jpg",  location: "Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_b88fc361c35d4e77b33ea2b863490de9~mv2.jpg",  location: "Abu Dhabi" },
  { src: "https://static.wixstatic.com/media/b3010c_5d6b384f8d854a6f9223eadc54951d2c~mv2.jpeg", location: "Abu Dhabi" },
  { src: "https://static.wixstatic.com/media/b3010c_064e4e85e00d4f56972e4848c9adf83d~mv2.jpeg", location: "Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_21d8d809f0ca43eb8b76d8852136c33f~mv2.jpg",  location: "Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_92d93a39a26349deae9dc2f1777f7924~mv2.jpg",  location: "Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_61e6de8da72a47e397bd3c356cf0fbe4~mv2.jpg",  location: "Abu Dhabi" },
  { src: "https://static.wixstatic.com/media/b3010c_060e28d385624cbeae4a1d26eff2a2b1~mv2.jpg",  location: "Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_6f1c757e7d4a4befa1cf19217c17b98d~mv2.jpg",  location: "Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_e877a03eef6140a49f9bd6e12336b8c5~mv2.jpeg", location: "Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_25f702170036409d99c3ac8b3fc67176~mv2.jpeg", location: "Abu Dhabi" },
  { src: "https://static.wixstatic.com/media/b3010c_fba9859cbc0a46db9d0b1d70a65f2fb4~mv2.jpg",  location: "Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_f7675e24b462404c93165f2aed7c7755~mv2.jpg",  location: "Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_dd33802823d641c9a1a8666c92d3104d~mv2.jpg",  location: "Abu Dhabi" },
  { src: "https://static.wixstatic.com/media/b3010c_7fe5112632b64edba0cd1a4a723bf3e1~mv2.jpg",  location: "Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_7a702d59c13e4df3b01e8cab8ec9f8b1~mv2.webp", location: "Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_93f7bdc73bca4a3b89e332d6d73119b3~mv2.jpg",  location: "Zürich" },
];
const locs = ["Zürich", "Dubai", "Abu Dhabi"];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22,1,0.36,1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ProjektePage() {
  const { lang } = useLang();
  const c = content[lang];
  const [filter, setFilter] = useState<string | null>(null);
  const [lb, setLb] = useState<number | null>(null);
  const filtered = filter ? images.filter(i => i.location === filter) : images;

  return (
    <div style={{ minHeight: "100vh", background: DARK }}>

      {/* Header */}
      <div style={{ paddingTop: "9rem", paddingBottom: "4rem", maxWidth: 1280, margin: "0 auto", padding: "9rem 2rem 4rem" }}>
        <FadeUp>
          <h1 className="font-display font-light" style={{ fontSize: "clamp(3rem,8vw,6rem)", color: t(0.85), lineHeight: 0.93, letterSpacing: "-0.01em", marginBottom: "1.5rem" }}>
            {c.title}
          </h1>
          <p style={{ fontSize: 14, color: t(0.28), lineHeight: 1.75, maxWidth: "48ch" }}>{c.body}</p>
        </FadeUp>
      </div>

      {/* Filter */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem 2.5rem", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[null, ...locs].map(loc => (
          <button key={loc ?? "all"} onClick={() => setFilter(loc)}
            style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 18px", borderRadius: 9999, cursor: "pointer", transition: "all 0.3s",
              background: filter === loc ? t(0.9) : "transparent",
              color: filter === loc ? DARK : t(0.3),
              border: `1px solid ${filter === loc ? t(0.9) : t(0.1)}` }}>
            {loc ?? c.all}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem 8rem" }}>
        <motion.div layout style={{ columns: "1", gap: 12 }} className="sm:columns-2 lg:columns-3 space-y-3">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div key={img.src} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
                style={{ breakInside: "avoid", position: "relative", overflow: "hidden", borderRadius: "1.2rem", cursor: "pointer", border: `1px solid ${t(0.06)}` }}
                onClick={() => setLb(images.indexOf(img))}>
                <div style={{ position: "relative", paddingBottom: i%3===0?"130%":i%3===1?"75%":"100%" }}>
                  <Image src={img.src} alt={img.location} fill style={{ objectFit: "cover", transition: "transform 0.6s ease" }} unoptimized />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,18,9,0.7) 0%, transparent 45%)", opacity: 0, transition: "opacity 0.4s" }}
                    className="group-hover:opacity-100" />
                  <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                    <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: t(0.7) }}>{img.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lb !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(12,18,9,0.96)", backdropFilter: "blur(24px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
            onClick={() => setLb(null)}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }}
              style={{ position: "relative", maxWidth: 1000, width: "100%", maxHeight: "82vh" }}
              onClick={e => e.stopPropagation()}>
              <div style={{ position: "relative", width: "100%", height: "78vh", borderRadius: "1.2rem", overflow: "hidden" }}>
                <Image src={images[lb].src} alt="Project" fill style={{ objectFit: "contain" }} unoptimized />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: t(0.4) }}>{images[lb].location}</p>
                <div style={{ display: "flex", gap: 20 }}>
                  {[["← prev", (lb-1+images.length)%images.length], ["next →", (lb+1)%images.length]].map(([label, idx]) => (
                    <button key={String(label)} onClick={() => setLb(Number(idx))}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.12em", color: t(0.35) }}>
                      {String(label)}
                    </button>
                  ))}
                  <button onClick={() => setLb(null)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: t(0.25) }}>
                    {c.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


