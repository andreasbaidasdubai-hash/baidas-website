"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useLang } from "@/context/LanguageContext";
import { Reveal } from "@/components/Reveal";
import Music from "@/components/Music";

/* ─── PALETTE — beyond-style: white / cream / ink ────────────────── */
const INK   = "#16181A";   // headings, nav-solid, footer
const BODY   = "#5A5E63";  // muted body text
const SOFT  = "#9A9DA2";   // faint labels / captions
const CREAM = "#F4F0E9";   // warm accent sections
const LINE  = "rgba(22,24,26,0.12)";

/* ─── REAL PROPERTY PHOTOS (from the Baidas Wix media library) ───── */
const PHOTOS = [
  /* curated project imagery (local /public/projekte) */
  "/projekte/Seamont.jpg",
  "/projekte/Flow25.png",
  "/projekte/saadiyat-villa-6-1.jpg",
  "/projekte/Saadiyat-4bed.jpg",
  "/projekte/saadiyat-villa-6-2.jpg",
  "/projekte/saadiyat-villa-6-7.jpg",
  "/projekte/saadiyat-villa-6-11.jpg",
  "/projekte/saadiyat-villa-4-3.jpg",
  "/projekte/saadiyat-villa-4-4.jpg",
  "/projekte/saadiyat-villa-6-13.jpg",
  /* existing Wix media */
  "https://static.wixstatic.com/media/b3010c_60046ffe836a44ea89cb7410bbbf771d~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_01899069023c4a7eaa6330a88ccdef0d~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_5b2633c90c194e7f8c060f43cf7aa85f~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_30340c4d2d56484eb51be30d7d3f3201~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_b88fc361c35d4e77b33ea2b863490de9~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_5d6b384f8d854a6f9223eadc54951d2c~mv2.jpeg",
  "https://static.wixstatic.com/media/b3010c_064e4e85e00d4f56972e4848c9adf83d~mv2.jpeg",
  "https://static.wixstatic.com/media/b3010c_21d8d809f0ca43eb8b76d8852136c33f~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_92d93a39a26349deae9dc2f1777f7924~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_61e6de8da72a47e397bd3c356cf0fbe4~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_060e28d385624cbeae4a1d26eff2a2b1~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_6f1c757e7d4a4befa1cf19217c17b98d~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_e877a03eef6140a49f9bd6e12336b8c5~mv2.jpeg",
  "https://static.wixstatic.com/media/b3010c_25f702170036409d99c3ac8b3fc67176~mv2.jpeg",
  "https://static.wixstatic.com/media/b3010c_fba9859cbc0a46db9d0b1d70a65f2fb4~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_f7675e24b462404c93165f2aed7c7755~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_dd33802823d641c9a1a8666c92d3104d~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_7fe5112632b64edba0cd1a4a723bf3e1~mv2.jpg",
  "https://static.wixstatic.com/media/b3010c_7a702d59c13e4df3b01e8cab8ec9f8b1~mv2.webp",
  "https://static.wixstatic.com/media/b3010c_93f7bdc73bca4a3b89e332d6d73119b3~mv2.jpg",
];

/* ─── CONTENT — German is verbatim from baidas Wix site; EN/FR are
   faithful translations of that same content (nothing invented). ── */
const T = {
  de: {
    nav: [["Projekte", "#projekte"], ["Akquisition", "#akquisition"]],
    heroEyebrow: "Baukunst & Projektentwicklung",
    heroTitle: "Baidas & Baidas",
    discover: "Entdecken",
    aboutLabel: "Unser Versprechen",
    aboutTitle: "Exklusive Immobilien",
    aboutP: [
      "Baidas & Baidas baut exklusive Immobilien in besonders ausgewählten und werthaltigen Lagen.",
      "Das Entwickeln und Bauen hochwertiger Wohnimmobilien auf exklusiven Grundstücken auf der Grundlage einer Baukunst von höchster handwerklicher Perfektion ist unser Versprechen.",
      "Alle Bauphasen, von der Planung bis zu den verschiedenen Ausführungsstadien, sind einem kompromisslosen Qualitätsanspruch unterworfen: von der Auswahl erstklassiger Grundstücke und Standorte, der Beauftragung führender, stilprägender Architekten, der Zusammenarbeit mit ausgewählten Handwerksbetrieben, bis hin zur kreativen Ausgestaltung der Objekte durch Kooperationen mit führenden Interior Designern und Landschaftsarchitekten.",
    ],
    projLabel: "Immobilien",
    projTitle: "Projekte",
    projIntro: "Unsere Immobilienprojekte erstrecken sich über Zürich, Dubai und Abu Dhabi. In unserer Rolle als Projektentwickler übernehmen wir den gesamten Prozess – von der Anschaffung der Grundstücke bis hin zur Fertigstellung der Bauvorhaben. Darüber hinaus engagieren wir uns auch als Investoren in Bauprojekten, um deren Erfolg und Rentabilität zu sichern.",
    acqLabel: "Akquisition",
    acqTitle: "Grundstück anbieten",
    acqP1: "Baidas & Baidas kauft bebaubare Grundstücke in guten und sehr guten Wohnlagen in Zürich, Dubai und Abu Dhabi, um auf ihnen besonders hochwertige Eigentumswohnungen oder Einfamilienhäuser zu errichten.",
    acqP2: "Sie haben ein passendes Grundstück oder eine Bestandsimmobilie und wollen diese zum Kauf anbieten? Selbstverständlich können Sie uns aus Diskretionsgründen auch direkt und persönlich kontaktieren. Wir freuen uns über Ihre Kontaktaufnahme.",
    namePh: "Ihr Name", emailPh: "Ihre E-Mail", msgPh: "Ihre Nachricht",
    send: "Anfrage senden", sent: "Vielen Dank — wir melden uns in Kürze.",
    footerNav: [["Über Uns", "#about"], ["Immobilien", "#projekte"], ["Akquisition", "#akquisition"]],
    close: "Schliessen",
  },
  en: {
    nav: [["Projects", "#projekte"], ["Acquisition", "#akquisition"]],
    heroEyebrow: "Architectural Art & Project Development",
    heroTitle: "Baidas & Baidas",
    discover: "Discover",
    aboutLabel: "Our Promise",
    aboutTitle: "Exclusive Properties",
    aboutP: [
      "Baidas & Baidas builds exclusive properties in specially selected, value-retaining locations.",
      "The development and construction of high-quality residential properties on exclusive plots, founded on architectural craftsmanship of the highest perfection, is our promise.",
      "Every construction phase, from planning through the various stages of execution, is subject to an uncompromising standard of quality: from the selection of first-class plots and locations, the commissioning of leading, style-defining architects, the collaboration with selected craftsmen, through to the creative design of the properties in cooperation with leading interior designers and landscape architects.",
    ],
    projLabel: "Properties",
    projTitle: "Projects",
    projIntro: "Our real-estate projects span Zürich, Dubai and Abu Dhabi. As project developers we manage the entire process — from acquiring the land through to completion of the buildings. Beyond that, we also act as investors in construction projects to secure their success and profitability.",
    acqLabel: "Acquisition",
    acqTitle: "Offer a property",
    acqP1: "Baidas & Baidas purchases buildable plots in good and very good residential locations in Zürich, Dubai and Abu Dhabi, in order to build particularly high-quality condominiums or single-family homes on them.",
    acqP2: "Do you have a suitable plot or an existing property you would like to offer for sale? For reasons of discretion, you are of course welcome to contact us directly and personally. We look forward to hearing from you.",
    namePh: "Your name", emailPh: "Your email", msgPh: "Your message",
    send: "Send enquiry", sent: "Thank you — we will be in touch shortly.",
    footerNav: [["About", "#about"], ["Properties", "#projekte"], ["Acquisition", "#akquisition"]],
    close: "Close",
  },
  fr: {
    nav: [["Projets", "#projekte"], ["Acquisition", "#akquisition"]],
    heroEyebrow: "Art Architectural & Développement de Projets",
    heroTitle: "Baidas & Baidas",
    discover: "Découvrir",
    aboutLabel: "Notre Promesse",
    aboutTitle: "Propriétés Exclusives",
    aboutP: [
      "Baidas & Baidas construit des propriétés exclusives dans des emplacements spécialement sélectionnés et de grande valeur.",
      "Le développement et la construction de biens résidentiels de haute qualité sur des terrains exclusifs, fondés sur un art architectural d'une perfection artisanale absolue, telle est notre promesse.",
      "Chaque phase de construction, de la planification aux différents stades d'exécution, est soumise à une exigence de qualité sans compromis : de la sélection de terrains et d'emplacements de premier choix, au mandat d'architectes de renom au style affirmé, à la collaboration avec des artisans sélectionnés, jusqu'à l'aménagement créatif des biens en coopération avec des architectes d'intérieur et paysagistes de premier plan.",
    ],
    projLabel: "Immobilier",
    projTitle: "Projets",
    projIntro: "Nos projets immobiliers s'étendent sur Zurich, Dubaï et Abu Dhabi. En tant que promoteurs, nous prenons en charge l'ensemble du processus — de l'acquisition des terrains jusqu'à l'achèvement des constructions. Par ailleurs, nous nous engageons également comme investisseurs dans des projets de construction afin d'en garantir le succès et la rentabilité.",
    acqLabel: "Acquisition",
    acqTitle: "Proposer un terrain",
    acqP1: "Baidas & Baidas achète des terrains constructibles dans de bons et très bons emplacements résidentiels à Zurich, Dubaï et Abu Dhabi, afin d'y édifier des appartements en propriété ou des maisons individuelles de très haute qualité.",
    acqP2: "Vous possédez un terrain approprié ou un bien existant et souhaitez le proposer à la vente ? Pour des raisons de discrétion, vous pouvez bien entendu nous contacter directement et personnellement. Nous nous réjouissons de votre prise de contact.",
    namePh: "Votre nom", emailPh: "Votre e-mail", msgPh: "Votre message",
    send: "Envoyer", sent: "Merci — nous vous contacterons bientôt.",
    footerNav: [["À Propos", "#about"], ["Immobilier", "#projekte"], ["Acquisition", "#akquisition"]],
    close: "Fermer",
  },
  ar: {
    nav: [["المشاريع", "#projekte"], ["الاستحواذ", "#akquisition"]],
    heroEyebrow: "فنّ العمارة وتطوير المشاريع",
    heroTitle: "Baidas & Baidas",
    discover: "اكتشف",
    aboutLabel: "وعدنا",
    aboutTitle: "عقارات حصرية",
    aboutP: [
      "تبني بيداس آند بيداس عقارات حصرية في مواقع مختارة بعناية وذات قيمة عالية.",
      "إنّ تطوير وبناء عقارات سكنية فاخرة على أراضٍ حصرية، استناداً إلى فنّ معماري يبلغ أعلى درجات الإتقان الحِرفي، هو وعدنا.",
      "تخضع جميع مراحل البناء، من التخطيط وحتى مختلف مراحل التنفيذ، لمعيار جودة لا يقبل المساومة: من اختيار الأراضي والمواقع من الطراز الأول، وتكليف نخبة من المعماريين أصحاب الطابع المميّز، والتعاون مع ورشٍ حِرفية منتقاة، وصولاً إلى التصميم الإبداعي للمشاريع بالتعاون مع روّاد مصممي الديكور الداخلي ومهندسي تنسيق الحدائق.",
    ],
    projLabel: "العقارات",
    projTitle: "المشاريع",
    projIntro: "تمتدّ مشاريعنا العقارية عبر زيورخ ودبي وأبوظبي. وبصفتنا مطوّرين عقاريين، نتولّى العملية بأكملها — من شراء الأراضي وحتى إنجاز المشاريع الإنشائية. كما نساهم أيضاً كمستثمرين في المشاريع الإنشائية لضمان نجاحها ورِبحيتها.",
    acqLabel: "الاستحواذ",
    acqTitle: "اعرض أرضك",
    acqP1: "تشتري بيداس آند بيداس أراضيَ قابلة للبناء في مواقع سكنية جيدة وممتازة في زيورخ ودبي وأبوظبي، لتشييد شققٍ تمليك أو فللٍ سكنية فائقة الجودة عليها.",
    acqP2: "هل لديك أرض مناسبة أو عقار قائم وترغب في عرضه للبيع؟ يمكنك بالطبع التواصل معنا مباشرةً وبشكل شخصي حفاظاً على السرّية. يسعدنا تواصلك معنا.",
    namePh: "اسمك", emailPh: "بريدك الإلكتروني", msgPh: "رسالتك",
    send: "إرسال الطلب", sent: "شكراً جزيلاً — سنتواصل معك قريباً.",
    footerNav: [["من نحن", "#about"], ["العقارات", "#projekte"], ["الاستحواذ", "#akquisition"]],
    close: "إغلاق",
  },
} as const;

const LANGS = ["de", "en", "fr", "ar"] as const;

/* ─── DEPLOY CONFIG — fill these in for production ───────────────── */
// Hero video via Vimeo: upload the video to Vimeo, then paste its numeric ID
// (from the URL vimeo.com/XXXXXXXXX). While empty, local /landing.mp4 is used.
const VIMEO_ID = "1197377063";
// Contact form via Formspree: create a form at formspree.io (recipient
// info@baidas.ch) and paste the endpoint URL here.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_ID";

/* original brand mark (icon extracted from logo.svg) — recolors via `color` */
function LogoIcon({ color, size = 42 }: { color: string; size?: number }) {
  return (
    <svg viewBox="33.5 2.8 33 33" width={size} height={size} aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <g fill={color} style={{ transition: "fill 0.4s ease" }}>
        <path d="M55.27,9.82c-.02-.14-.04-.27-.08-.41-.18-.74-.55-1.38-1.1-1.93l-4.09-4.09-15.82,15.82,4.09,4.09c.81.81,1.68,1.37,2.62,1.68.21.07.42.12.63.17,1.18.24,2.33.18,3.44-.2s2.09-.99,2.93-1.83c.83-.83,1.43-1.78,1.81-2.86.37-1.08.43-2.2.17-3.36-.14-.62-.38-1.22-.73-1.79.03.01.07.03.1.04.75.25,1.52.28,2.31.08.79-.2,1.52-.65,2.21-1.33.67-.67,1.12-1.4,1.36-2.18.19-.64.24-1.27.15-1.88ZM48.93,19.89c-.34.96-.9,1.83-1.66,2.59-.78.78-1.66,1.34-2.65,1.7-.99.35-2,.43-3.03.21-1.03-.21-1.97-.74-2.82-1.6l-3.46-3.46,8.7-8.7,3.24,3.24c.08.08.15.15.23.22h0c.89.89,1.44,1.84,1.65,2.85.22,1.01.15,1.99-.19,2.95ZM54.55,10.46c-.05.97-.52,1.9-1.4,2.79-.91.91-1.85,1.35-2.81,1.33-.96-.03-1.83-.43-2.6-1.2l-3.24-3.24,5.55-5.55.08-.08,3.47,3.46c.22.23.41.47.55.73.3.52.43,1.11.39,1.77Z"/>
        <path d="M61.83,15.22c-.89-.89-1.87-1.49-2.93-1.77-.11-.03-.21-.06-.32-.08-1.18-.24-2.32-.18-3.44.2-1.11.38-2.09.99-2.93,1.83-.83.83-1.43,1.78-1.81,2.86-.37,1.08-.43,2.2-.18,3.36.14.62.38,1.22.73,1.79-.03-.01-.07-.03-.1-.04-.75-.25-1.52-.28-2.31-.08-.79.2-1.52.65-2.21,1.33s-1.12,1.4-1.35,2.18c-.22.73-.25,1.44-.1,2.14,0,.05.02.1.03.14.18.74.55,1.38,1.1,1.93l4.09,4.09,15.82-15.82-4.09-4.09ZM51.18,18.62c.34-.96.9-1.83,1.66-2.59.78-.78,1.66-1.34,2.65-1.7.99-.35,2-.43,3.03-.22.64.13,1.25.39,1.83.77h0c.34.23.67.51.99.82l3.47,3.47-.08.08-8.61,8.62-3.24-3.24c-.08-.08-.15-.15-.23-.22h0c-.89-.89-1.44-1.84-1.65-2.85-.22-1.01-.15-1.99.19-2.95ZM45.56,28.05c.05-.97.52-1.9,1.4-2.78.91-.91,1.85-1.35,2.81-1.33.96.03,1.83.43,2.6,1.19l3.24,3.24-5.64,5.63-3.47-3.47c-.69-.69-1-1.52-.95-2.49Z"/>
        <path d="M50,3.39l-15.82,15.82-.11.11,15.93,15.93,15.93-15.93-15.93-15.93ZM55.66,28.42l-5.66,5.66-5.12-5.12-3.99-3.99-5.66-5.66,14.77-14.77.05.05,4.1,4.1,1.12,1.12,3.63,3.64,1.44,1.44h0s4.37,4.37,4.37,4.37l.05.05-9.11,9.11Z"/>
      </g>
    </svg>
  );
}

/* full logo lockup: icon + "Baidas & Baidas" (original-style grey ampersand) */
function LogoLockup({ color, iconSize = 42, fontSize = "22px", gap = 13, stacked = false, hideText = false }: { color: string; iconSize?: number; fontSize?: string; gap?: number; stacked?: boolean; hideText?: boolean }) {
  return (
    <span className="brand" style={{ display: "inline-flex", flexDirection: stacked ? "column" : "row", alignItems: stacked ? "flex-start" : "center", gap: stacked ? 12 : gap }}>
      <LogoIcon color={color} size={iconSize} />
      <span className={hideText ? "hidden sm:inline" : undefined} style={{ fontFamily: "var(--font-poppins)", fontWeight: 600, fontSize, letterSpacing: "0.01em", color, whiteSpace: "nowrap", transition: "color 0.4s" }}>
        Baidas<span style={{ fontSize: "0.66em", fontWeight: 600, opacity: 0.5, margin: "0 0.2em" }}>&amp;</span>Baidas
      </span>
    </span>
  );
}

/* eyebrow label */
const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: light ? "rgba(255,255,255,0.75)" : SOFT, marginBottom: 22 }}>
    {children}
  </p>
);

export default function Home() {
  const { lang, setLang } = useLang();
  const t = T[lang];
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [sent, setSent] = useState(false);
  const [lb, setLb] = useState<number | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Arabic reads right-to-left — flip document direction + language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const goTo = (href: string) => {
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.href = href;
  };

  const navTextColor = scrolled ? INK : "#fff";
  const navLink: React.CSSProperties = {
    fontFamily: "var(--font-geist-sans)", fontSize: 11.5, letterSpacing: "0.16em",
    textTransform: "uppercase", textDecoration: "none", background: "none", border: "none",
    cursor: "pointer", transition: "opacity 0.25s", color: navTextColor, opacity: 0.82,
  };

  return (
    <main style={{ background: "#fff", overflowX: "hidden" }}>
      {/* ── NAV ── */}
      <motion.header
        initial={reduce ? false : { y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 74,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(1.25rem,4vw,2.75rem)",
          background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? `1px solid ${LINE}` : "1px solid transparent",
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <button onClick={() => goTo("#top")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 13, padding: 0 }} aria-label="Baidas & Baidas">
          <LogoLockup color={navTextColor} iconSize={44} fontSize="clamp(17px,2vw,23px)" hideText />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,3vw,28px)" }}>
          <nav style={{ display: "flex", gap: "clamp(14px,2.4vw,28px)", alignItems: "center" }}>
            {t.nav.map(([l, h]) => (
              <button key={h} onClick={() => goTo(h)} style={navLink}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.82")}>{l}</button>
            ))}
          </nav>
          <span style={{ width: 1, height: 16, background: scrolled ? LINE : "rgba(255,255,255,0.4)" }} />
          <div style={{ display: "flex", gap: 10 }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{ ...navLink, opacity: lang === l ? 1 : 0.5, fontWeight: lang === l ? 600 : 400 }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section id="top" style={{ position: "relative", height: "100dvh", overflow: "hidden", background: "#0E1B2A" }}>
        {VIMEO_ID ? (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <iframe
              src={`https://player.vimeo.com/video/${VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&dnt=1`}
              allow="autoplay; fullscreen"
              title="Baidas & Baidas"
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "100vw", height: "75vw", minHeight: "100%", minWidth: "133.34vh", border: 0, pointerEvents: "none" }}
            />
          </div>
        ) : (
          <video autoPlay muted loop playsInline preload="auto"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
            <source src="/landing.mp4" type="video/mp4" />
          </video>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,18,28,0.5) 0%, rgba(10,18,28,0.3) 45%, rgba(10,18,28,0.62) 100%)" }} />

        <motion.button onClick={() => goTo("#about")}
          initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}
          style={{ position: "absolute", bottom: 34, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>{t.discover}</span>
          <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>↓</motion.span>
        </motion.button>
      </section>

      {/* ── ABOUT / VERSPRECHEN ── */}
      <section id="about" style={{ padding: "clamp(6rem,12vw,11rem) clamp(1.5rem,5vw,4rem)", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal><Eyebrow>{t.aboutLabel}</Eyebrow></Reveal>
        <Reveal delay={0.08}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.6rem,6vw,4.5rem)", color: INK, lineHeight: 1.08, letterSpacing: "-0.01em", margin: "0 0 3rem", maxWidth: "14ch" }}>
            {t.aboutTitle}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "clamp(2rem,5vw,5rem)" }}>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.5rem,2.6vw,2rem)", lineHeight: 1.4, color: INK, margin: 0 }}>{t.aboutP[0]}</p>
          </Reveal>
          <div>
            <Reveal delay={0.2}><p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY, marginBottom: 22 }}>{t.aboutP[1]}</p></Reveal>
            <Reveal delay={0.3}><p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY, margin: 0 }}>{t.aboutP[2]}</p></Reveal>
          </div>
        </div>
      </section>

      {/* ── IMMOBILIEN / PROJEKTE — gallery ── */}
      <section id="projekte" style={{ background: CREAM, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: "clamp(6rem,12vw,10rem) 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 clamp(1.5rem,5vw,4rem)" }}>
          <Reveal><Eyebrow>{t.projLabel}</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.4rem,5vw,3.6rem)", color: INK, letterSpacing: "-0.01em", margin: "0 0 1.6rem" }}>{t.projTitle}</h2>
          </Reveal>
          <Reveal delay={0.1} style={{ maxWidth: "68ch", marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY }}>{t.projIntro}</p>
          </Reveal>
          <div className="[column-count:1] sm:[column-count:2] lg:[column-count:3]" style={{ columnGap: 16 }}>
            {PHOTOS.map((src, i) => (
              <Reveal key={src} delay={(i % 3) * 0.06} style={{ breakInside: "avoid", marginBottom: 16 }}>
                <button onClick={() => setLb(i)}
                  style={{ display: "block", width: "100%", overflow: "hidden", border: `1px solid ${LINE}`, cursor: "pointer", padding: 0, background: "#fff", lineHeight: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy"
                    style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AKQUISITION / KONTAKT ── */}
      <section id="akquisition" style={{ padding: "clamp(6rem,12vw,11rem) clamp(1.5rem,5vw,4rem)", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal><Eyebrow>{t.acqLabel}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.4rem,5vw,3.6rem)", color: INK, lineHeight: 1.08, letterSpacing: "-0.01em", margin: "0 0 2rem" }}>{t.acqTitle}</h2>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "clamp(2rem,5vw,5rem)", marginBottom: "clamp(3.5rem,7vw,5.5rem)" }}>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.4rem,2.4vw,1.85rem)", lineHeight: 1.45, color: INK, margin: 0 }}>{t.acqP1}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY, margin: 0 }}>{t.acqP2}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "clamp(3rem,6vw,6rem)", alignItems: "start", paddingTop: "clamp(2.5rem,5vw,3.5rem)", borderTop: `1px solid ${LINE}` }}>
          <Reveal>
            <div style={{ marginBottom: 20 }}><LogoLockup color={INK} iconSize={50} fontSize="21px" stacked /></div>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: BODY, lineHeight: 1.8 }}>Baidas &amp; Baidas AG<br />Baarerstrasse 12<br />6300 Zug</p>
            <a href="mailto:info@baidas.ch" style={{ display: "inline-block", marginTop: 16, fontFamily: "var(--font-geist-sans)", fontSize: 14.5, color: INK, textDecoration: "none", borderBottom: `1px solid ${INK}`, paddingBottom: 2 }}>info@baidas.ch</a>
          </Reveal>

          <Reveal dir="right" delay={0.15}>
            {sent ? (
              <div style={{ display: "flex", alignItems: "center", minHeight: 280 }}>
                <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.9rem", color: INK, maxWidth: "22ch", lineHeight: 1.3 }}>{t.sent}</p>
              </div>
            ) : (
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  if (FORMSPREE_ENDPOINT.includes("REPLACE")) { setSent(true); return; } // demo until endpoint is set
                  try {
                    const res = await fetch(FORMSPREE_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
                    if (res.ok) { setSent(true); form.reset(); }
                  } catch { /* network error — silently ignore */ }
                }}
                style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[[t.namePh, "text", "name"], [t.emailPh, "email", "email"]].map(([ph, ty, nm]) => (
                  <input key={ph} name={nm} type={ty} required placeholder={ph}
                    style={{ background: "transparent", border: "none", borderBottom: `1px solid ${LINE}`, padding: "14px 2px", fontFamily: "var(--font-geist-sans)", fontSize: 15, color: INK, outline: "none" }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = INK)}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = LINE)} />
                ))}
                <input type="hidden" name="_subject" value="Neue Anfrage über baidas.ch" />
                <textarea name="message" required placeholder={t.msgPh} rows={4}
                  style={{ background: "transparent", border: "none", borderBottom: `1px solid ${LINE}`, padding: "14px 2px", fontFamily: "var(--font-geist-sans)", fontSize: 15, color: INK, outline: "none", resize: "none" }}
                  onFocus={e => (e.currentTarget.style.borderBottomColor = INK)}
                  onBlur={e => (e.currentTarget.style.borderBottomColor = LINE)} />
                <button type="submit" style={{ marginTop: 14, alignSelf: "flex-start", padding: "14px 34px", borderRadius: 999, background: INK, color: "#fff", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500 }}>
                  {t.send}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: INK, padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,4rem) 2.5rem" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr]" style={{ gap: "3rem" }}>
            <div>
              <LogoLockup color="#fff" iconSize={40} fontSize="22px" />
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: 14 }}>{t.heroEyebrow}</p>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>Navigation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {t.footerNav.map(([l, h]) => (
                  <button key={l} onClick={() => goTo(h)} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 13.5, color: "rgba(255,255,255,0.72)" }}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>Kontakt</p>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>Baidas &amp; Baidas AG<br />Baarerstrasse 12<br />6300 Zug</p>
              <a href="mailto:info@baidas.ch" style={{ display: "inline-block", marginTop: 12, fontFamily: "var(--font-geist-sans)", fontSize: 13.5, color: "#fff", textDecoration: "none" }}>info@baidas.ch</a>
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "3rem 0 1.5rem" }} />
          <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>© {new Date().getFullYear()} Baidas &amp; Baidas AG</p>
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lb !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLb(null)}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,14,14,0.94)", backdropFilter: "blur(18px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} onClick={e => e.stopPropagation()}
              style={{ position: "relative", maxWidth: 1000, width: "100%" }}>
              <div style={{ position: "relative", width: "100%", height: "80vh" }}>
                <Image src={PHOTOS[lb]} alt="" fill sizes="100vw" style={{ objectFit: "contain" }} unoptimized />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 18 }}>
                <button onClick={() => setLb((lb - 1 + PHOTOS.length) % PHOTOS.length)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>←</button>
                <button onClick={() => setLb(null)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{t.close}</button>
                <button onClick={() => setLb((lb + 1) % PHOTOS.length)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>→</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Music />
    </main>
  );
}
