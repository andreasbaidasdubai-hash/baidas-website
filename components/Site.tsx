"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useLang, type Lang } from "@/context/LanguageContext";
import { Reveal } from "@/components/Reveal";

/* ─── PALETTE — beyond-style: white / cream / ink ────────────────── */
const INK   = "#16181A";   // headings, nav-solid, footer
const BODY   = "#5A5E63";  // muted body text
const SOFT  = "#9A9DA2";   // faint labels / captions
const CREAM = "#F4F0E9";   // warm accent sections
const LINE  = "rgba(22,24,26,0.12)";

/* ─── REAL PROPERTY PHOTOS (from the Baidas Wix media library) ─────
   Each entry carries a `name` shown as an always-visible caption on the
   gallery tile. Leave `name` empty for an uncaptioned image. ── */
const PHOTOS: { src: string; name: string }[] = [
  /* Curated, interleaved order: the five Silvestris renders are spread
     evenly through the grid and repeated locations are broken apart so no
     two identical captions sit next to each other. Mix of local /public
     imagery and the existing Wix media library. ── */
  { src: "/projekte/silvestris-1.jpg", name: "Silvestris, Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_92d93a39a26349deae9dc2f1777f7924~mv2.jpg", name: "Haus am Tämberg, Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_30340c4d2d56484eb51be30d7d3f3201~mv2.jpg", name: "Haus am Tämberg, Zürich" },
  { src: "/projekte/saadiyat-villa-6-1.jpg", name: "Saadiyat Lagoons, Al Ghaf" },
  { src: "/projekte/seamont-autograph-1.jpg", name: "Seamont Autograph, Reem Island" },
  { src: "/projekte/seamont-autograph-2.jpg", name: "Seamont Autograph, Reem Island" },
  { src: "/projekte/seamont-autograph-3.jpg", name: "Seamont Autograph, Reem Island" },
  { src: "/projekte/seamont-autograph-4.jpg", name: "Seamont Autograph, Reem Island" },
  { src: "/projekte/seamont-autograph-5.jpg", name: "Seamont Autograph, Reem Island" },
  { src: "https://static.wixstatic.com/media/b3010c_60046ffe836a44ea89cb7410bbbf771d~mv2.jpg", name: "Haspelstrasse, 8041 Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_b88fc361c35d4e77b33ea2b863490de9~mv2.jpg", name: "Haus am Tämberg, Zürich" },
  { src: "/projekte/saadiyat-ethir-1.jpg", name: "Saadiyat Lagoons, Ethir" },
  { src: "/projekte/saadiyat-villa-4-3.jpg", name: "Saadiyat Lagoons, Ethir" },
  { src: "/projekte/silvestris-2.jpg", name: "Silvestris, Zürich" },
  { src: "/projekte/creek-edge-1.jpg", name: "Creek Edge Villas, Dubai" },
  { src: "/projekte/creek-edge-2.jpg", name: "Creek Edge Villas, Dubai" },
  { src: "/projekte/creek-edge-3.jpg", name: "Creek Edge Villas, Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_e877a03eef6140a49f9bd6e12336b8c5~mv2.jpeg", name: "Creek Edge Villas, Dubai" },
  { src: "/projekte/Saadiyat-4bed.jpg", name: "Saadiyat Lagoons, Al Ghaf" },
  { src: "https://static.wixstatic.com/media/b3010c_5d6b384f8d854a6f9223eadc54951d2c~mv2.jpeg", name: "Turbinenstrasse, 8005 Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_21d8d809f0ca43eb8b76d8852136c33f~mv2.jpg", name: "Haus am Tämberg, Zürich" },
  { src: "/projekte/saadiyat-villa-6-2.jpg", name: "Saadiyat Lagoons, Al Ghaf" },
  { src: "https://static.wixstatic.com/media/b3010c_01899069023c4a7eaa6330a88ccdef0d~mv2.jpg", name: "Haspelstrasse, 8041 Zürich" },
  { src: "/projekte/silvestris-3.jpg", name: "Silvestris, Zürich" },
  { src: "/projekte/grove-1.jpg", name: "Grove Residences, Saadiyat" },
  { src: "https://static.wixstatic.com/media/b3010c_dd33802823d641c9a1a8666c92d3104d~mv2.jpg", name: "Grove Residences, Saadiyat" },
  { src: "/projekte/saadiyat-villa-4-4.jpg", name: "Saadiyat Lagoons, Ethir" },
  { src: "https://static.wixstatic.com/media/b3010c_25f702170036409d99c3ac8b3fc67176~mv2.jpeg", name: "Creek Edge Villas, Dubai" },
  { src: "/projekte/saadiyat-villa-6-7.jpg", name: "Saadiyat Lagoons, Al Ghaf" },
  { src: "https://static.wixstatic.com/media/b3010c_61e6de8da72a47e397bd3c356cf0fbe4~mv2.jpg", name: "Haus am Tämberg, Zürich" },
  { src: "/projekte/silvestris-4.jpg", name: "Silvestris, Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_f7675e24b462404c93165f2aed7c7755~mv2.jpg", name: "Saadiyat Lagoons, Al Ghaf" },
  { src: "https://static.wixstatic.com/media/b3010c_064e4e85e00d4f56972e4848c9adf83d~mv2.jpeg", name: "Turbinenstrasse, 8005 Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_5b2633c90c194e7f8c060f43cf7aa85f~mv2.jpg", name: "Haspelstrasse, 8041 Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_060e28d385624cbeae4a1d26eff2a2b1~mv2.jpg", name: "Haus am Tämberg, Zürich" },
  { src: "/projekte/saadiyat-villa-6-11.jpg", name: "Saadiyat Lagoons, Al Ghaf" },
  { src: "/projekte/saadiyat-villa-6-13.jpg", name: "Saadiyat Lagoons, Ethir" },
  { src: "/projekte/silvestris-5.jpg", name: "Silvestris, Zürich" },
  { src: "https://static.wixstatic.com/media/b3010c_fba9859cbc0a46db9d0b1d70a65f2fb4~mv2.jpg", name: "Creek Edge Villas, Dubai" },
  { src: "https://static.wixstatic.com/media/b3010c_6f1c757e7d4a4befa1cf19217c17b98d~mv2.jpg", name: "Haus am Tämberg, Zürich" },
  { src: "/projekte/the-cape-2.jpg", name: "The Cape, Al Barari" },
  { src: "/projekte/the-cape-4.jpg", name: "The Cape, Al Barari" },
  { src: "/projekte/the-cape-1.jpg", name: "The Cape, Al Barari" },
  { src: "/projekte/the-cape-3.jpg", name: "The Cape, Al Barari" },
  { src: "https://static.wixstatic.com/media/b3010c_7fe5112632b64edba0cd1a4a723bf3e1~mv2.jpg", name: "The Cape, Al Barari" },
  { src: "/projekte/flow25-front.jpg", name: "Flow25, Reem Island" },
  { src: "/projekte/flow25-1.jpg", name: "Flow25, Reem Island" },
  { src: "/projekte/flow25-2.jpg", name: "Flow25, Reem Island" },
  { src: "/projekte/ramhan-3.jpg", name: "Ramhan Island" },
  { src: "/projekte/ramhan-2.jpg", name: "Ramhan Island" },
  { src: "/projekte/ramhan-4.jpg", name: "Ramhan Island" },
  { src: "/projekte/ramhan-1.jpg", name: "Ramhan Island" },
  { src: "https://static.wixstatic.com/media/b3010c_7a702d59c13e4df3b01e8cab8ec9f8b1~mv2.webp", name: "Ramhan Island" },
  { src: "https://static.wixstatic.com/media/b3010c_93f7bdc73bca4a3b89e332d6d73119b3~mv2.jpg", name: "Haus am Tämberg, Zürich" },
];

/* Group the photos into one tile per project (curated display order). Tiles
   with more than one image become a slider so the gallery stays compact. */
const PROJECT_ORDER = [
  "Silvestris, Zürich",
  "Ramhan Island",
  "The Cape, Al Barari",
  "Seamont Autograph, Reem Island",
  "Haus am Tämberg, Zürich",
  "Creek Edge Villas, Dubai",
  "Saadiyat Lagoons, Al Ghaf",
  "Haspelstrasse, 8041 Zürich",
  "Flow25, Reem Island",
  "Turbinenstrasse, 8005 Zürich",
  "Saadiyat Lagoons, Ethir",
  "Grove Residences, Saadiyat",
];
/* Build phase / status per project (keyed by canonical name). */
const PROJECT_STATUS: Record<string, string> = {
  "Silvestris, Zürich": "aushub",
  "Ramhan Island": "rohbau",
  "The Cape, Al Barari": "rohbau",
  "Seamont Autograph, Reem Island": "aushub",
  "Haus am Tämberg, Zürich": "realisiert",
  "Creek Edge Villas, Dubai": "realisiert",
  "Saadiyat Lagoons, Al Ghaf": "innenausbau",
  "Haspelstrasse, 8041 Zürich": "realisiert",
  "Flow25, Reem Island": "aushub",
  "Turbinenstrasse, 8005 Zürich": "realisiert",
  "Saadiyat Lagoons, Ethir": "innenausbau",
  "Grove Residences, Saadiyat": "abnahme",
};

/* Status label translations (de/en/fr/ar). */
const STATUS_LABEL: Record<string, Record<Lang, string>> = {
  aushub:         { de: "Aushub", en: "Excavation", fr: "Terrassement", ar: "الحفر" },
  rohbau:         { de: "Rohbau", en: "Structural Works", fr: "Gros œuvre", ar: "الأعمال الإنشائية" },
  innenausbau:    { de: "Innenausbau", en: "Interior Fit-out", fr: "Aménagement intérieur", ar: "التشطيبات الداخلية" },
  abnahme:        { de: "Abnahme", en: "Handover", fr: "Réception", ar: "التسليم" },
  fertiggestellt: { de: "Fertiggestellt", en: "Completed", fr: "Achevé", ar: "مكتمل" },
  realisiert:     { de: "Realisiert", en: "Realised", fr: "Réalisé", ar: "منجز" },
};
const DONE_STATUS = ["fertiggestellt", "realisiert"];

const PROJECTS: { name: string; images: string[]; status?: string }[] = PROJECT_ORDER
  .map(name => ({ name, images: PHOTOS.filter(p => p.name === name).map(p => p.src), status: PROJECT_STATUS[name] }))
  .filter(p => p.images.length > 0);

/* ─── CONTENT — German is verbatim from baidas Wix site; EN/FR are
   faithful translations of that same content (nothing invented). ── */
const T = {
  de: {
    nav: [["Über Uns", "#about"], ["Ankauf", "#akquisition"], ["Projekte", "#projekte"]],
    heroEyebrow: "Immobilienentwicklung & Investments",
    heroTitle: "Baidas & Baidas",
    discover: "Entdecken",
    contactCta: "Kontakt",
    aboutLabel: "Über Uns",
    aboutTitle: "Exklusive Immobilien",
    aboutP: [
      "Baidas & Baidas baut exklusive Immobilien in besonders ausgewählten und werthaltigen Lagen.",
      "Das Entwickeln und Bauen hochwertiger Wohnimmobilien auf exklusiven Grundstücken auf der Grundlage einer Baukunst von höchster handwerklicher Perfektion ist unser Versprechen.",
      "Alle Bauphasen, von der Planung bis zu den verschiedenen Ausführungsstadien, sind einem kompromisslosen Qualitätsanspruch unterworfen: von der Auswahl erstklassiger Grundstücke und Standorte, der Beauftragung führender, stilprägender Architekten, der Zusammenarbeit mit ausgewählten Handwerksbetrieben, bis hin zur kreativen Ausgestaltung der Objekte durch Kooperationen mit führenden Interior Designern und Landschaftsarchitekten.",
    ],
    founderLabel: "Inhaber",
    founderName: "Andreas Baidas",
    founderRole: "Immobilienentwickler & Investor",
    founderP: [
      "Andreas Baidas ist ein Schweizer Immobilienentwickler, Investor und Gründer von Baidas & Baidas. Aufgewachsen in London, begann er seine Laufbahn in der Immobilienentwicklung in Zürich und lebt heute zwischen der Schweiz und den Vereinigten Arabischen Emiraten.",
      "Er ist persönlich in jedes Projekt eingebunden - von der Standortwahl über die architektonische Ausrichtung bis zur finalen Ausführung, mit einem klaren Fokus auf Qualität, Design und langfristigen Wert.",
    ],
    projLabel: "Immobilien",
    projTitle: "Projekte",
    projIntro: "Unsere Immobilienprojekte erstrecken sich über Zürich, Dubai und Abu Dhabi. In unserer Rolle als Projektentwickler übernehmen wir den gesamten Prozess – von der Anschaffung der Grundstücke bis hin zur Fertigstellung der Bauvorhaben. Darüber hinaus engagieren wir uns auch als Investoren in Bauprojekten, um deren Erfolg und Rentabilität zu sichern.",
    acqLabel: "Ankauf",
    acqTitle: "Grundstück anbieten",
    acqP1: "Baidas & Baidas kauft bebaubare Grundstücke in guten und sehr guten Wohnlagen in Zürich, Dubai und Abu Dhabi, um auf ihnen besonders hochwertige Eigentumswohnungen oder Einfamilienhäuser zu errichten.",
    acqP2: "Sie haben ein passendes Grundstück oder eine Bestandsimmobilie und wollen diese zum Kauf anbieten? Selbstverständlich können Sie uns aus Diskretionsgründen auch direkt und persönlich kontaktieren. Wir freuen uns über Ihre Kontaktaufnahme.",
    coTitle: "Co-Investment",
    coLead: "Sie sind ein etablierter und renommierter Projektentwickler und suchen einen Partner für die Co-Investition in Ihr Vorhaben?",
    coBody: "Baidas & Baidas beteiligt sich als verlässlicher Kapital- und Entwicklungspartner an ausgewählten Bauprojekten in Zürich, Dubai und Abu Dhabi. Wir freuen uns auf eine vertrauliche Kontaktaufnahme.",
    namePh: "Ihr Name", emailPh: "Ihre E-Mail", msgPh: "Ihre Nachricht",
    send: "Anfrage senden", sent: "Vielen Dank — wir melden uns in Kürze.",
    footerNav: [["Über Uns", "#about"], ["Ankauf", "#akquisition"], ["Immobilien", "#projekte"]],
    close: "Schliessen",
  },
  en: {
    nav: [["About", "#about"], ["Acquisition", "#akquisition"], ["Projects", "#projekte"]],
    heroEyebrow: "Real Estate Development & Investments",
    heroTitle: "Baidas & Baidas",
    discover: "Discover",
    contactCta: "Contact",
    aboutLabel: "About Us",
    aboutTitle: "Exclusive Properties",
    aboutP: [
      "Baidas & Baidas builds exclusive properties in specially selected, value-retaining locations.",
      "The development and construction of high-quality residential properties on exclusive plots, founded on architectural craftsmanship of the highest perfection, is our promise.",
      "Every construction phase, from planning through the various stages of execution, is subject to an uncompromising standard of quality: from the selection of first-class plots and locations, the commissioning of leading, style-defining architects, the collaboration with selected craftsmen, through to the creative design of the properties in cooperation with leading interior designers and landscape architects.",
    ],
    founderLabel: "Owner",
    founderName: "Andreas Baidas",
    founderRole: "Real Estate Developer & Investor",
    founderP: [
      "Andreas Baidas is a Swiss real estate developer, investor, and founder of Baidas & Baidas. Raised in London, he began his career in real estate development in Zurich and now divides his time between Switzerland and the UAE.",
      "He is personally involved in every project, from site selection and architectural direction to final execution, with a clear focus on quality, design, and long-term value.",
    ],
    projLabel: "Properties",
    projTitle: "Projects",
    projIntro: "Our real-estate projects span Zürich, Dubai and Abu Dhabi. As project developers we manage the entire process — from acquiring the land through to completion of the buildings. Beyond that, we also act as investors in construction projects to secure their success and profitability.",
    acqLabel: "Acquisition",
    acqTitle: "Offer a property",
    acqP1: "Baidas & Baidas purchases buildable plots in good and very good residential locations in Zürich, Dubai and Abu Dhabi, in order to build particularly high-quality condominiums or single-family homes on them.",
    acqP2: "Do you have a suitable plot or an existing property you would like to offer for sale? For reasons of discretion, you are of course welcome to contact us directly and personally. We look forward to hearing from you.",
    coTitle: "Co-Investment",
    coLead: "Are you an established and reputable developer seeking a partner to co-invest in your project?",
    coBody: "Baidas & Baidas participates as a reliable capital and development partner in selected construction projects in Zürich, Dubai and Abu Dhabi. We would welcome a confidential conversation.",
    namePh: "Your name", emailPh: "Your email", msgPh: "Your message",
    send: "Send enquiry", sent: "Thank you — we will be in touch shortly.",
    footerNav: [["About", "#about"], ["Acquisition", "#akquisition"], ["Properties", "#projekte"]],
    close: "Close",
  },
  fr: {
    nav: [["À Propos", "#about"], ["Acquisition", "#akquisition"], ["Projets", "#projekte"]],
    heroEyebrow: "Développement Immobilier & Investissements",
    heroTitle: "Baidas & Baidas",
    discover: "Découvrir",
    contactCta: "Contact",
    aboutLabel: "À Propos",
    aboutTitle: "Propriétés Exclusives",
    aboutP: [
      "Baidas & Baidas construit des propriétés exclusives dans des emplacements spécialement sélectionnés et de grande valeur.",
      "Le développement et la construction de biens résidentiels de haute qualité sur des terrains exclusifs, fondés sur un art architectural d'une perfection artisanale absolue, telle est notre promesse.",
      "Chaque phase de construction, de la planification aux différents stades d'exécution, est soumise à une exigence de qualité sans compromis : de la sélection de terrains et d'emplacements de premier choix, au mandat d'architectes de renom au style affirmé, à la collaboration avec des artisans sélectionnés, jusqu'à l'aménagement créatif des biens en coopération avec des architectes d'intérieur et paysagistes de premier plan.",
    ],
    founderLabel: "Propriétaire",
    founderName: "Andreas Baidas",
    founderRole: "Promoteur Immobilier & Investisseur",
    founderP: [
      "Andreas Baidas est un promoteur immobilier suisse, investisseur et fondateur de Baidas & Baidas. Élevé à Londres, il a débuté sa carrière dans le développement immobilier à Zurich et partage aujourd'hui son temps entre la Suisse et les Émirats arabes unis.",
      "Il s'implique personnellement dans chaque projet, du choix du site à la direction architecturale jusqu'à l'exécution finale, avec une attention claire portée à la qualité, au design et à la valeur à long terme.",
    ],
    projLabel: "Immobilier",
    projTitle: "Projets",
    projIntro: "Nos projets immobiliers s'étendent sur Zurich, Dubaï et Abu Dhabi. En tant que promoteurs, nous prenons en charge l'ensemble du processus — de l'acquisition des terrains jusqu'à l'achèvement des constructions. Par ailleurs, nous nous engageons également comme investisseurs dans des projets de construction afin d'en garantir le succès et la rentabilité.",
    acqLabel: "Acquisition",
    acqTitle: "Proposer un terrain",
    acqP1: "Baidas & Baidas achète des terrains constructibles dans de bons et très bons emplacements résidentiels à Zurich, Dubaï et Abu Dhabi, afin d'y édifier des appartements en propriété ou des maisons individuelles de très haute qualité.",
    acqP2: "Vous possédez un terrain approprié ou un bien existant et souhaitez le proposer à la vente ? Pour des raisons de discrétion, vous pouvez bien entendu nous contacter directement et personnellement. Nous nous réjouissons de votre prise de contact.",
    coTitle: "Co-Investissement",
    coLead: "Vous êtes un promoteur établi et reconnu à la recherche d'un partenaire pour co-investir dans votre projet ?",
    coBody: "Baidas & Baidas s'engage comme partenaire fiable en capital et en développement dans des projets de construction sélectionnés à Zurich, Dubaï et Abu Dhabi. Nous serions ravis d'un échange confidentiel.",
    namePh: "Votre nom", emailPh: "Votre e-mail", msgPh: "Votre message",
    send: "Envoyer", sent: "Merci — nous vous contacterons bientôt.",
    footerNav: [["À Propos", "#about"], ["Acquisition", "#akquisition"], ["Immobilier", "#projekte"]],
    close: "Fermer",
  },
  ar: {
    nav: [["من نحن", "#about"], ["الاستحواذ", "#akquisition"], ["المشاريع", "#projekte"]],
    heroEyebrow: "تطوير عقاري واستثمارات",
    heroTitle: "Baidas & Baidas",
    discover: "اكتشف",
    contactCta: "تواصل",
    aboutLabel: "من نحن",
    aboutTitle: "عقارات حصرية",
    aboutP: [
      "تبني بيداس آند بيداس عقارات حصرية في مواقع مختارة بعناية وذات قيمة عالية.",
      "إنّ تطوير وبناء عقارات سكنية فاخرة على أراضٍ حصرية، استناداً إلى فنّ معماري يبلغ أعلى درجات الإتقان الحِرفي، هو وعدنا.",
      "تخضع جميع مراحل البناء، من التخطيط وحتى مختلف مراحل التنفيذ، لمعيار جودة لا يقبل المساومة: من اختيار الأراضي والمواقع من الطراز الأول، وتكليف نخبة من المعماريين أصحاب الطابع المميّز، والتعاون مع ورشٍ حِرفية منتقاة، وصولاً إلى التصميم الإبداعي للمشاريع بالتعاون مع روّاد مصممي الديكور الداخلي ومهندسي تنسيق الحدائق.",
    ],
    founderLabel: "المالك",
    founderName: "أندرياس بيداس",
    founderRole: "مطوّر عقاري ومستثمر",
    founderP: [
      "أندرياس بيداس مطوّر عقاري سويسري ومستثمر ومؤسس بيداس آند بيداس. نشأ في لندن، وبدأ مسيرته المهنية في مجال التطوير العقاري في زيورخ، ويتنقّل اليوم بين سويسرا ودولة الإمارات العربية المتحدة.",
      "يشارك شخصياً في كل مشروع، من اختيار الموقع والتوجيه المعماري وصولاً إلى التنفيذ النهائي، مع تركيز واضح على الجودة والتصميم والقيمة على المدى الطويل.",
    ],
    projLabel: "العقارات",
    projTitle: "المشاريع",
    projIntro: "تمتدّ مشاريعنا العقارية عبر زيورخ ودبي وأبوظبي. وبصفتنا مطوّرين عقاريين، نتولّى العملية بأكملها — من شراء الأراضي وحتى إنجاز المشاريع الإنشائية. كما نساهم أيضاً كمستثمرين في المشاريع الإنشائية لضمان نجاحها ورِبحيتها.",
    acqLabel: "الاستحواذ",
    acqTitle: "اعرض أرضك",
    acqP1: "تشتري بيداس آند بيداس أراضيَ قابلة للبناء في مواقع سكنية جيدة وممتازة في زيورخ ودبي وأبوظبي، لتشييد شققٍ تمليك أو فللٍ سكنية فائقة الجودة عليها.",
    acqP2: "هل لديك أرض مناسبة أو عقار قائم وترغب في عرضه للبيع؟ يمكنك بالطبع التواصل معنا مباشرةً وبشكل شخصي حفاظاً على السرّية. يسعدنا تواصلك معنا.",
    coTitle: "الاستثمار المشترك",
    coLead: "هل أنت مطوّر عقاري راسخ وذو سمعة طيبة وتبحث عن شريك للاستثمار المشترك في مشروعك؟",
    coBody: "تشارك بيداس آند بيداس كشريك موثوق في رأس المال والتطوير في مشاريع إنشائية مختارة في زيورخ ودبي وأبوظبي. يسعدنا تواصلك السرّي معنا.",
    namePh: "اسمك", emailPh: "بريدك الإلكتروني", msgPh: "رسالتك",
    send: "إرسال الطلب", sent: "شكراً جزيلاً — سنتواصل معك قريباً.",
    footerNav: [["من نحن", "#about"], ["الاستحواذ", "#akquisition"], ["العقارات", "#projekte"]],
    close: "إغلاق",
  },
} as const;

const LANGS = ["de", "en", "fr", "ar"] as const;

/* ─── DEPLOY CONFIG — fill these in for production ───────────────── */
// Hero video via Vimeo: upload the video to Vimeo, then paste its numeric ID
// (from the URL vimeo.com/XXXXXXXXX). While empty, the local graded hero video is used.
const VIMEO_ID = "";
// Contact form via Formspree: create a form at formspree.io (recipient
// info@baidas.ch) and paste the endpoint URL here.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkoawapo";
// WhatsApp floating button: international number, digits only, no "+" (e.g. "971501234567").
// Empty = button hidden.
const WHATSAPP_NUMBER = ""; // hidden for a more exclusive feel — visitors use the contact form / info@baidas.ch. Restore the number to re-enable.
const WHATSAPP_MSG = "Guten Tag, ich interessiere mich für Baidas & Baidas.";
// Optional looping construction video under the project gallery.
// Set a Vimeo ID (preferred) or a local /public path to enable it. Empty = hidden.
const PROJECT_VIDEO_VIMEO_ID = "";
const PROJECT_VIDEO_SRC = "/bau.mov";

// Live construction-site camera (embedded via iframe). Empty = hidden.
const LIVECAM_SRC = "https://bau-cam.ch/dba02/livebild.php";

// Ramhan Island film — self-hosted (mirrored from the Eagle Hills CDN so we
// don't depend on it). Autoplays muted + looped. Poster reuses the Ramhan
// render from the gallery for an instant first paint. Empty = hidden.
const RAMHAN_VIDEO = "/ramhan-island.mp4";
const RAMHAN_POSTER = "/projekte/ramhan-3.jpg";
const CAM: Record<string, { label: string; title: string; intro: string }> = {
  de: { label: "Baustelle", title: "Live von der Baustelle", intro: "Ein Blick in Echtzeit auf eines unserer laufenden Bauvorhaben." },
  en: { label: "Construction Site", title: "Live from the Site", intro: "A real-time view of one of our ongoing developments." },
  fr: { label: "Chantier", title: "En direct du chantier", intro: "Une vue en temps réel de l'un de nos projets en cours." },
  ar: { label: "موقع البناء", title: "بث مباشر من موقع البناء", intro: "إطلالة مباشرة على أحد مشاريعنا الجارية." },
};

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

/* Cinematic autoplay film band (full-bleed 16:9), muted + looped, poster for
   an instant first paint. */
function FeatureVideo({ src, poster, label, sub }: { src: string; poster: string; label: string; sub: string }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", background: "#0E1B2A" }}>
      <video autoPlay muted loop playsInline preload="none" poster={poster}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
        <source src={src} type="video/mp4" />
      </video>
      <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,4rem) clamp(1.25rem,3vw,2rem)", background: "linear-gradient(to top, rgba(14,27,42,0.6), rgba(14,27,42,0))", pointerEvents: "none", textAlign: "left" }}>
        <span style={{ display: "block", fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,3rem)", lineHeight: 1.1, letterSpacing: "-0.01em", color: "#fff" }}>{label}</span>
        {sub && <span style={{ display: "block", marginTop: 8, fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>{sub}</span>}
      </span>
    </div>
  );
}

/* One project = one gallery tile. Multiple images become a crossfade slider. */
function ProjectCard({ project, statusLabel, statusDone, onOpen }: { project: { name: string; images: string[] }; statusLabel?: string; statusDone?: boolean; onOpen: (i: number) => void }) {
  const [i, setI] = useState(0);
  const n = project.images.length;
  const step = (d: number) => setI(p => (p + d + n) % n);
  const [hover, setHover] = useState(false);
  const arrow: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 3,
    width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
    background: "rgba(14,27,42,0.55)", color: "#fff", fontSize: 16, lineHeight: 1,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(4px)", transition: "background 0.25s, opacity 0.25s",
  };
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", overflow: "hidden", background: "#E9E3D8",
        boxShadow: hover ? "0 20px 44px -22px rgba(14,27,42,0.38)" : "none",
        transition: "box-shadow 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
      {project.images.map((src, k) => (
        <Image key={src} src={src} alt={`${project.name} – Immobilienprojekt von Baidas & Baidas`} fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          onClick={() => onOpen(i)}
          style={{ objectFit: "cover", cursor: "pointer",
            opacity: k === i ? 1 : 0,
            transform: hover ? "scale(1.045)" : "scale(1)",
            transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)" }} />
      ))}
      {statusLabel && (
        <span style={{ position: "absolute", top: 12, left: 12, zIndex: 3, padding: "5px 11px", borderRadius: 999,
          background: statusDone ? "rgba(244,240,233,0.94)" : "rgba(14,27,42,0.62)",
          color: statusDone ? "#16181A" : "#fff", backdropFilter: "blur(6px)",
          fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap", pointerEvents: "none" }}>
          {statusLabel}
        </span>
      )}
      <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "2.6rem 1.1rem 0.95rem", lineHeight: 1.2, textAlign: "left", background: "linear-gradient(to top, rgba(14,27,42,0.85), rgba(14,27,42,0))", color: "#fff", fontFamily: "var(--font-cormorant)", fontWeight: 400, fontSize: "1.18rem", letterSpacing: "0.005em", pointerEvents: "none", zIndex: 2 }}>{project.name}</span>
      {n > 1 && (
        <>
          <button aria-label="Vorheriges Bild" onClick={() => step(-1)}
            style={{ ...arrow, left: 10 }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(14,27,42,0.85)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(14,27,42,0.55)")}>‹</button>
          <button aria-label="Nächstes Bild" onClick={() => step(1)}
            style={{ ...arrow, right: 10 }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(14,27,42,0.85)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(14,27,42,0.55)")}>›</button>
          <span style={{ position: "absolute", top: 10, right: 10, zIndex: 3, padding: "3px 9px", borderRadius: 999, background: "rgba(14,27,42,0.6)", color: "#fff", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.06em", pointerEvents: "none" }}>{i + 1} / {n}</span>
          <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, zIndex: 3, display: "flex", justifyContent: "center", gap: 6 }}>
            {project.images.map((s, k) => (
              <button key={s} aria-label={`Bild ${k + 1}`} onClick={() => setI(k)}
                style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 999, border: "none", padding: 0, cursor: "pointer",
                  background: k === i ? "#fff" : "rgba(255,255,255,0.5)", transition: "width 0.3s, background 0.3s" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* Full language names shown inside the dropdown menu (trigger shows the code). */
const LANG_LABEL: Record<Lang, string> = { de: "Deutsch", en: "English", fr: "Français", ar: "العربية" };

/* Language selector as a dropdown menu. Trigger shows the active code (DE),
   the panel lists all languages. Closes on outside-click / Escape, and aligns
   to the inline-end edge so it mirrors correctly in Arabic (RTL). */
function LanguageDropdown({ lang, scrolled }: { lang: Lang; scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const color = scrolled ? INK : "#fff";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button" aria-haspopup="listbox" aria-expanded={open} aria-label="Sprache / Language"
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
          padding: "6px 2px", color, opacity: 0.82, transition: "opacity 0.25s",
          fontFamily: "var(--font-geist-sans)", fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "0.82")}
      >
        {lang.toUpperCase()}
        <svg width="9" height="9" viewBox="0 0 10 6" aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>
          <path d="M1 1l4 4 4-4" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}
            style={{
              position: "absolute", insetInlineEnd: 0, top: "calc(100% + 12px)", listStyle: "none", margin: 0, padding: 6,
              minWidth: 148, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 12,
              boxShadow: "0 18px 44px -20px rgba(14,27,42,0.35)", zIndex: 300,
            }}
          >
            {LANGS.map(l => {
              const active = l === lang;
              return (
                <li key={l} role="option" aria-selected={active}>
                  <button
                    type="button" onClick={() => { window.location.href = l === "de" ? "/" : "/" + l; }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, width: "100%",
                      padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "start",
                      background: active ? CREAM : "transparent", color: INK,
                      fontFamily: "var(--font-geist-sans)", fontSize: 13.5, letterSpacing: "0.01em",
                      opacity: active ? 1 : 0.72, transition: "background 0.18s, opacity 0.18s",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(22,24,26,0.045)"; e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = active ? "1" : "0.72"; }}
                  >
                    <span>{LANG_LABEL[l]}</span>
                    <span style={{ fontSize: 10.5, letterSpacing: "0.14em", color: SOFT }}>{l.toUpperCase()}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Wrap any "&" in prose with a clear upright ampersand (the italic serif "&" reads like an "e"). */
function amp(text: string): React.ReactNode {
  if (!text.includes("&")) return text;
  const out: React.ReactNode[] = [];
  text.split("&").forEach((part, i) => {
    if (i > 0) out.push(<span key={"amp" + i} className="amp">{"&"}</span>);
    out.push(part);
  });
  return out;
}

export default function Home() {
  const { lang } = useLang();
  const t = T[lang];
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [sent, setSent] = useState(false);
  const [lb, setLb] = useState<{ images: string[]; name: string; i: number } | null>(null);
  const [camTick, setCamTick] = useState(0);
  const [active, setActive] = useState("about");

  // Refresh the live construction-cam frame every 15s.
  useEffect(() => {
    if (!LIVECAM_SRC) return;
    const id = setInterval(() => setCamTick(t => t + 1), 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Scroll-spy: highlight the nav item for the section currently in view.
  useEffect(() => {
    const ids = ["about", "akquisition", "projekte"];
    const fn = () => {
      const y = window.scrollY + 130;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
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

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,3vw,26px)" }}>
          <nav className="hidden md:flex" style={{ gap: "clamp(12px,2.4vw,28px)", alignItems: "center" }}>
            {t.nav.map(([l, h]) => {
              const isActive = h === `#${active}`;
              return (
                <button key={h} onClick={() => goTo(h)}
                  style={{ ...navLink, whiteSpace: "nowrap", opacity: isActive ? 1 : 0.82, borderBottom: `1px solid ${isActive ? navTextColor : "transparent"}`, paddingBottom: 3 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = isActive ? "1" : "0.82")}>{l}</button>
              );
            })}
          </nav>
          <span className="hidden md:inline-block" style={{ width: 1, height: 16, background: scrolled ? LINE : "rgba(255,255,255,0.4)", flexShrink: 0 }} />
          <LanguageDropdown lang={lang} scrolled={scrolled} />
          <a href="https://portal.baidas.ch" aria-label="Portal"
            style={{ display: "inline-flex", alignItems: "center", background: "transparent", color: navTextColor, border: `1px solid ${navTextColor}`, borderRadius: 999, padding: "8px 18px", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, whiteSpace: "nowrap", textDecoration: "none", transition: "background 0.3s ease, color 0.3s ease, border-color 0.4s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = navTextColor; e.currentTarget.style.color = scrolled ? "#fff" : INK; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = navTextColor; }}>
            {lang === "fr" ? "Portail" : lang === "ar" ? "البوابة" : "Portal"}
          </a>
          <button onClick={() => goTo("#kontakt")} className="hidden md:inline-flex"
            style={{ alignItems: "center", background: navTextColor, color: scrolled ? "#fff" : INK, border: "none", borderRadius: 999, padding: "9px 20px", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, whiteSpace: "nowrap", transition: "background 0.4s ease, color 0.4s ease" }}>
            {t.contactCta}
          </button>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section id="top" style={{ position: "relative", height: "100dvh", overflow: "hidden", background: "#0E1B2A" }}>
        {/* Poster (video first frame) paints instantly while the Vimeo player loads. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero-poster.jpg" alt="" aria-hidden="true" fetchPriority="high"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
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
          <video autoPlay muted loop playsInline preload="auto" poster="/hero-poster.jpg"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
            <source src="/silvestris-landing.mp4" type="video/mp4" />
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
      <section id="about" style={{ padding: "clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,4rem)", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal><Eyebrow>{t.aboutLabel}</Eyebrow></Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]" style={{ gap: "clamp(2rem,5vw,5rem)", alignItems: "start", marginTop: "clamp(1.25rem,3vw,2.25rem)" }}>
          <Reveal delay={0.08}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.6rem,6vw,4.5rem)", color: INK, lineHeight: 1.08, letterSpacing: "-0.01em", margin: 0, maxWidth: "12ch" }}>
              {t.aboutTitle}
            </h2>
          </Reveal>
          <div>
            <Reveal delay={0.12}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.5rem,2.6vw,2rem)", lineHeight: 1.4, color: INK, margin: "0 0 26px" }}>{amp(t.aboutP[0])}</p>
            </Reveal>
            <Reveal delay={0.2}><p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY, marginBottom: 22 }}>{t.aboutP[1]}</p></Reveal>
            <Reveal delay={0.3}><p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY, margin: 0 }}>{t.aboutP[2]}</p></Reveal>
          </div>
        </div>

        {/* ── FOUNDER — Andreas Baidas portrait + short intro ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr]"
          style={{ gap: "clamp(2.5rem,5vw,5rem)", alignItems: "center", marginTop: "clamp(4.5rem,9vw,7rem)", paddingTop: "clamp(3rem,6vw,4.5rem)", borderTop: `1px solid ${LINE}` }}
        >
          <Reveal>
            <div style={{ position: "relative", width: "100%", maxWidth: 420, aspectRatio: "1 / 1", overflow: "hidden", background: "#E9E3D8" }}>
              <Image
                src="/team/andreas-baidas-bw.jpg"
                alt={`${t.founderName} – ${t.founderRole}, Baidas & Baidas`}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                style={{ objectFit: "cover", objectPosition: "50% 50%" }}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>{t.founderLabel}</Eyebrow>
            <h3 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2rem,4vw,3rem)", color: INK, lineHeight: 1.1, letterSpacing: "-0.01em", margin: 0 }}>
              {t.founderName}
            </h3>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: SOFT, margin: "12px 0 26px" }}>
              {t.founderRole}
            </p>
            {t.founderP.map((para, i) => (
              <p key={i} style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY, margin: i === 0 ? "0 0 18px" : 0, maxWidth: "60ch" }}>
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── RAMHAN ISLAND — feature film (autoplay, muted, looped) ── */}
      {RAMHAN_VIDEO && (
        <section id="ramhan" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
          <FeatureVideo src={RAMHAN_VIDEO} poster={RAMHAN_POSTER} label="Ramhan Island" sub="" />
        </section>
      )}

      {/* ── AKQUISITION / KONTAKT ── */}
      <section id="akquisition" style={{ padding: "clamp(6rem,12vw,11rem) clamp(1.5rem,5vw,4rem)", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal><Eyebrow>{t.acqLabel}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.4rem,5vw,3.6rem)", color: INK, lineHeight: 1.08, letterSpacing: "-0.01em", margin: "0 0 2rem" }}>{t.acqTitle}</h2>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "clamp(2rem,5vw,5rem)", marginBottom: "clamp(2rem,4vw,3rem)" }}>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.4rem,2.4vw,1.85rem)", lineHeight: 1.45, color: INK, margin: 0 }}>{amp(t.acqP1)}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY, margin: 0 }}>{t.acqP2}</p>
          </Reveal>
        </div>

        {/* Co-investment — same layout/style as the Grundstück-anbieten block above */}
        <div style={{ marginTop: "clamp(3.5rem,7vw,5rem)", marginBottom: "clamp(3.5rem,7vw,5.5rem)", paddingTop: "clamp(3rem,6vw,4.5rem)", borderTop: `1px solid ${LINE}` }}>
          <Reveal>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.4rem,5vw,3.6rem)", color: INK, lineHeight: 1.08, letterSpacing: "-0.01em", margin: "0 0 2rem" }}>{t.coTitle}</h2>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "clamp(2rem,5vw,5rem)" }}>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.4rem,2.4vw,1.85rem)", lineHeight: 1.45, color: INK, margin: 0 }}>{amp(t.coLead)}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY, margin: 0 }}>{t.coBody}</p>
            </Reveal>
          </div>
        </div>

        <div id="kontakt" className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "clamp(3rem,6vw,6rem)", alignItems: "start", paddingTop: "clamp(2.5rem,5vw,3.5rem)", borderTop: `1px solid ${LINE}`, scrollMarginTop: 90 }}>
          <Reveal>
            <div style={{ marginBottom: 24 }}><LogoLockup color={INK} iconSize={50} fontSize="21px" stacked /></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.75rem,4vw,3rem)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: SOFT, margin: "0 0 8px" }}>Zug</p>
                <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: BODY, lineHeight: 1.8, margin: 0 }}>Baarerstrasse 12<br />6300 Zug</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: SOFT, margin: "0 0 8px" }}>Dubai</p>
                <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: BODY, lineHeight: 1.8, margin: 0 }}>Central Park Tower<br />DIFC, Dubai</p>
              </div>
            </div>
            <a href="mailto:info@baidas.ch" style={{ display: "inline-block", marginTop: 20, fontFamily: "var(--font-geist-sans)", fontSize: 14.5, color: INK, textDecoration: "none", borderBottom: `1px solid ${INK}`, paddingBottom: 2 }}>info@baidas.ch</a>
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

      {/* ── CONSTRUCTION VIDEO BAND (optional, looping) ── */}
      {(PROJECT_VIDEO_VIMEO_ID || PROJECT_VIDEO_SRC) && (
        <section style={{ background: "#0E1B2A", borderBottom: `1px solid ${LINE}` }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden" }}>
            {PROJECT_VIDEO_VIMEO_ID ? (
              <iframe
                src={`https://player.vimeo.com/video/${PROJECT_VIDEO_VIMEO_ID}?background=1&autoplay=1&loop=1&muted=1&dnt=1`}
                allow="autoplay; fullscreen" title="Baidas & Baidas — Bau"
                style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "100vw", height: "56.25vw", minHeight: "100%", minWidth: "177.78vh", border: 0, pointerEvents: "none" }}
              />
            ) : (
              <video autoPlay muted loop playsInline preload="none" src={PROJECT_VIDEO_SRC}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
        </section>
      )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
            {PROJECTS.map((project, i) => (
              <Reveal key={project.name} delay={(i % 3) * 0.06}>
                <ProjectCard project={project} statusLabel={project.status ? STATUS_LABEL[project.status][lang] : undefined} statusDone={DONE_STATUS.includes(project.status || "")} onOpen={(idx) => setLb({ images: project.images, name: project.name, i: idx })} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BAUSTELLE LIVE-CAM — full-bleed band (below the contact form) ── */}
      {LIVECAM_SRC && (
        <section id="baustelle" style={{ background: "#0E1B2A", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/livecam?t=${camTick}`} alt={CAM[lang].title} loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{ position: "absolute", top: "clamp(1rem,3vw,2rem)", left: "clamp(1rem,3vw,2rem)", display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 15px", borderRadius: 999, background: "rgba(14,27,42,0.55)", backdropFilter: "blur(6px)", color: "#fff", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              <motion.span aria-hidden animate={reduce ? {} : { opacity: [1, 0.25, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#e5484d", display: "inline-block" }} />
              {CAM[lang].label} · Live
            </span>
          </div>
        </section>
      )}

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
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>Baarerstrasse 12<br />6300 Zug</p>
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, marginTop: 14 }}>Central Park Tower<br />DIFC, Dubai</p>
              <a href="mailto:info@baidas.ch" style={{ display: "inline-block", marginTop: 12, fontFamily: "var(--font-geist-sans)", fontSize: 13.5, color: "#fff", textDecoration: "none" }}>info@baidas.ch</a>
            </div>
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "3rem 0 1.5rem" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>© {new Date().getFullYear()} Baidas &amp; Baidas AG</p>
            <a href="/impressum" style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Impressum</a>
            <a href="/datenschutz" style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Datenschutz</a>
          </div>
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
                <Image src={lb.images[lb.i]} alt={lb.name} fill sizes="100vw" style={{ objectFit: "contain" }} unoptimized />
              </div>
              <p style={{ textAlign: "center", marginTop: 14, fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "1.5rem", color: "#fff", letterSpacing: "0.01em" }}>
                {lb.name}{lb.images.length > 1 && <span style={{ fontSize: "1rem", opacity: 0.6 }}>{"  ·  "}{lb.i + 1} / {lb.images.length}</span>}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 18 }}>
                <button onClick={() => setLb({ ...lb, i: (lb.i - 1 + lb.images.length) % lb.images.length })} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>←</button>
                <button onClick={() => setLb(null)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{t.close}</button>
                <button onClick={() => setLb({ ...lb, i: (lb.i + 1) % lb.images.length })} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-geist-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>→</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {WHATSAPP_NUMBER && (
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
          target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
          style={{
            position: "fixed", bottom: 24, right: 22, zIndex: 120,
            width: 48, height: 48, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#25D366", boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
            textDecoration: "none",
          }}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      )}
    </main>
  );
}
