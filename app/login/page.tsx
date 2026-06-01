"use client";
import { motion } from "motion/react";
import { useLang } from "@/context/LanguageContext";

const DARK  = "#EBEEf3";
const t = (o: number) => `rgba(232,228,220,${o})`;

const L = {
  de: { sub: "Kundenportal", email: "E-Mail", pass: "Passwort", btn: "Anmelden" },
  en: { sub: "Client Portal", email: "Email",  pass: "Password", btn: "Sign In"  },
  fr: { sub: "Portail Client", email: "E-mail", pass: "Mot de passe", btn: "Connexion" },
};

export default function LoginPage() {
  const { lang } = useLang();
  const c = L[lang];
  const inputStyle = { width: "100%", background: "rgba(232,228,220,0.04)", border: `1px solid ${t(0.1)}`, borderRadius: 12, padding: "14px 20px", color: t(0.8), fontSize: 13.5, fontFamily: "var(--font-geist-sans)", outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ width: "100%", maxWidth: 360 }}>
        <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: t(0.22), marginBottom: 24 }}>{c.sub}</p>
        <h1 className="font-display font-light" style={{ fontSize: "3rem", color: t(0.82), letterSpacing: "-0.01em", marginBottom: "2.5rem", lineHeight: 1 }}>Login</h1>
        <form style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder={c.email} style={inputStyle} />
          <input type="password" placeholder={c.pass} style={inputStyle} />
          <button type="submit" style={{ background: "#1A3B5C", color: t(0.85), border: "none", borderRadius: 9999, padding: "15px", fontFamily: "var(--font-geist-sans)", fontSize: 12.5, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", marginTop: 4 }}>
            {c.btn}
          </button>
        </form>
      </motion.div>
    </div>
  );
}


