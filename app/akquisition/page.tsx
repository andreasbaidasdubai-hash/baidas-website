"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useLang } from "@/context/LanguageContext";

const DARK  = "#EBEEf3";
const t = (o: number) => `rgba(232,228,220,${o})`;

const C = {
  de: {
    label: "Grundstück & Akquisition",
    title: "Wir kaufen in erstklassigen Lagen",
    body: "Baidas & Baidas kauft bebaubare Grundstücke in guten und sehr guten Wohnlagen in Zürich, Dubai und Abu Dhabi.",
    offerTitle: "Haben Sie ein Grundstück?",
    offerBody: "Kontaktieren Sie uns diskret. Wir melden uns umgehend.",
    contactTitle: "Direktkontakt",
    namePh: "Ihr Name", emailPh: "E-Mail", phonePh: "Telefon (optional)", msgPh: "Objekt / Lage",
    send: "Anfrage senden", sent: "Vielen Dank", sentSub: "Wir melden uns in Kürze.",
    criteria: [
      { t: "Lage",               b: "Gute bis sehr gute Wohnlagen in Zürich, Dubai und Abu Dhabi." },
      { t: "Grundstücksgrösse",  b: "Ab 500 m² aufwärts, je nach Lage und Bebauungspotenzial." },
      { t: "Baurecht",           b: "Parzellen mit Bewilligungspotenzial für Wohnbau." },
      { t: "Bestandsimmobilien", b: "Auch Objekte mit Entwicklungs- oder Abbruchpotenzial." },
    ],
  },
  en: {
    label: "Land & Acquisition",
    title: "We buy in prime locations",
    body: "Baidas & Baidas purchases buildable plots in prime residential areas in Zürich, Dubai and Abu Dhabi.",
    offerTitle: "Do you have a property?",
    offerBody: "Contact us discreetly. We will respond promptly.",
    contactTitle: "Direct Contact",
    namePh: "Your name", emailPh: "Email", phonePh: "Phone (optional)", msgPh: "Property / location",
    send: "Send enquiry", sent: "Thank you", sentSub: "We will be in touch shortly.",
    criteria: [
      { t: "Location",            b: "Prime residential areas in Zürich, Dubai and Abu Dhabi." },
      { t: "Plot size",           b: "From 500 m² upwards depending on location and potential." },
      { t: "Building rights",     b: "Parcels with planning permission for residential construction." },
      { t: "Existing properties", b: "Properties with development or redevelopment potential." },
    ],
  },
  fr: {
    label: "Terrain & Acquisition",
    title: "Nous achetons dans des emplacements de premier choix",
    body: "Baidas & Baidas achète des terrains constructibles dans des zones résidentielles premium à Zurich, Dubaï et Abu Dhabi.",
    offerTitle: "Vous avez un terrain?",
    offerBody: "Contactez-nous discrètement. Nous vous répondrons rapidement.",
    contactTitle: "Contact Direct",
    namePh: "Votre nom", emailPh: "E-mail", phonePh: "Téléphone (optionnel)", msgPh: "Bien / emplacement",
    send: "Envoyer", sent: "Merci", sentSub: "Nous vous contacterons bientôt.",
    criteria: [
      { t: "Emplacement",          b: "Zones résidentielles premium à Zurich, Dubaï et Abu Dhabi." },
      { t: "Surface",              b: "A partir de 500 m², selon l'emplacement et le potentiel." },
      { t: "Droit à bâtir",        b: "Parcelles avec potentiel de permis de construire." },
      { t: "Biens existants",      b: "Propriétés avec potentiel de développement ou démolition." },
    ],
  },
};

function FadeUp({ children, delay = 0, right = false }: { children: React.ReactNode; delay?: number; right?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 18, x: right ? 18 : 0 }} animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22,1,0.36,1] }}>
      {children}
    </motion.div>
  );
}

export default function AkquisitionPage() {
  const { lang } = useLang();
  const c = C[lang];
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", message:"" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(f => ({...f,[k]:e.target.value}));

  const inputStyle = { width: "100%", background: "rgba(232,228,220,0.04)", border: `1px solid ${t(0.1)}`, borderRadius: 12, padding: "14px 20px", color: t(0.8), fontSize: 13.5, fontFamily: "var(--font-geist-sans)", outline: "none", transition: "border 0.3s", boxSizing: "border-box" as const };

  return (
    <div style={{ minHeight: "100vh", background: DARK }}>

      {/* Header */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "9rem 2rem 5rem" }}>
        <FadeUp>
          <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: t(0.2), marginBottom: 28 }}>{c.label}</p>
          <h1 className="font-display font-light" style={{ fontSize: "clamp(2.8rem,6vw,5rem)", color: t(0.85), lineHeight: 0.95, letterSpacing: "-0.01em", marginBottom: "1.5rem", maxWidth: "18ch" }}>
            {c.title}
          </h1>
          <p style={{ fontSize: 14, color: t(0.28), lineHeight: 1.75, maxWidth: "48ch" }}>{c.body}</p>
        </FadeUp>
      </div>

      {/* Criteria */}
      <div style={{ background: "rgba(232,228,220,0.03)", borderTop: `1px solid ${t(0.06)}`, borderBottom: `1px solid ${t(0.06)}`, padding: "4rem 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {c.criteria.map((cr, i) => (
            <FadeUp key={cr.t} delay={i * 0.07}>
              <div style={{ padding: "28px", border: `1px solid ${t(0.07)}`, borderRadius: "1.2rem" }}>
                <div style={{ width: 28, height: 1, background: t(0.15), marginBottom: 20 }} />
                <p style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 500, fontSize: 13, color: t(0.7), marginBottom: 8 }}>{cr.t}</p>
                <p style={{ fontSize: 12.5, color: t(0.28), lineHeight: 1.7 }}>{cr.b}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "6rem 2rem 8rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem" }} className="grid-cols-1 lg:grid-cols-2">
        <FadeUp>
          <h2 className="font-display font-light" style={{ fontSize: "clamp(2rem,4vw,3rem)", color: t(0.82), letterSpacing: "-0.01em", marginBottom: "1.5rem" }}>{c.offerTitle}</h2>
          <p style={{ fontSize: 14, color: t(0.28), lineHeight: 1.75, marginBottom: "3rem" }}>{c.offerBody}</p>
          <div style={{ padding: "24px", border: `1px solid ${t(0.07)}`, borderRadius: "1.2rem" }}>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: t(0.2), marginBottom: 16 }}>{c.contactTitle}</p>
            <p className="font-display" style={{ fontSize: 20, fontStyle: "italic", color: t(0.7) }}>Andreas Baidas</p>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 11.5, color: t(0.3), marginTop: 4 }}>{lang === "de" ? "Geschäftsführer" : lang === "fr" ? "Directeur Général" : "Managing Director"}</p>
            <a href="mailto:andreas@baidas.ch" style={{ display: "block", marginTop: 16, fontFamily: "var(--font-geist-sans)", fontSize: 13, color: t(0.5), textDecoration: "none" }}>andreas@baidas.ch</a>
            <a href="mailto:info@baidas.ch" style={{ display: "block", marginTop: 6, fontFamily: "var(--font-geist-sans)", fontSize: 12.5, color: t(0.25), textDecoration: "none" }}>info@baidas.ch</a>
            <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: t(0.2), marginTop: 16, lineHeight: 1.6 }}>Baarerstrasse 12<br />6300 Zug, Switzerland</p>
          </div>
        </FadeUp>

        <FadeUp right delay={0.15}>
          {submitted ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "4rem 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1px solid ${t(0.18)}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <span style={{ color: t(0.6), fontSize: 20 }}>✓</span>
              </div>
              <p className="font-display" style={{ fontSize: 28, fontStyle: "italic", color: t(0.75), marginBottom: 8 }}>{c.sent}</p>
              <p style={{ fontSize: 13, color: t(0.25) }}>{c.sentSub}</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[{k:"name",ph:c.namePh,ty:"text",req:true},{k:"email",ph:c.emailPh,ty:"email",req:true},{k:"phone",ph:c.phonePh,ty:"tel",req:false}].map(f => (
                <input key={f.k} type={f.ty} required={f.req} placeholder={f.ph} value={form[f.k as keyof typeof form]} onChange={set(f.k)} style={inputStyle} />
              ))}
              <textarea required placeholder={c.msgPh} rows={5} value={form.message} onChange={set("message")} style={{ ...inputStyle, resize: "none" }} />
              <button type="submit" style={{ background: "#1A3B5C", color: t(0.85), border: "none", borderRadius: 9999, padding: "15px 32px", fontFamily: "var(--font-geist-sans)", fontSize: 12.5, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.3s" }}>
                {c.send}
              </button>
            </form>
          )}
        </FadeUp>
      </div>
    </div>
  );
}


