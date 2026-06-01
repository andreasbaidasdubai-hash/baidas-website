"use client";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

const NAVY = "#1A3B5C";
const PALE = "#8AA0B5";

export default function Footer() {
  const { lang } = useLang();
  const labels = { de:["Kontakt","Navigation"], en:["Contact","Navigation"], fr:["Contact","Navigation"] };
  const navs = {
    de:[["Über Uns","/"],["Projekte","/projekte"],["Akquisition","/akquisition"]],
    en:[["About Us","/"],["Projects","/projekte"],["Acquisition","/akquisition"]],
    fr:[["À Propos","/"],["Projets","/projekte"],["Acquisition","/akquisition"]],
  };
  return (
    <footer style={{ background:"#E4E8EE", borderTop:"1px solid rgba(26,59,92,0.08)" }}>
      <div style={{ maxWidth:1300, margin:"0 auto", padding:"5rem 4rem", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:48 }} className="grid-cols-1 md:grid-cols-3">
        <div>
          <p style={{ fontFamily:"var(--font-geist-sans)", fontSize:9.5, letterSpacing:"0.22em", textTransform:"uppercase", color:PALE, marginBottom:20 }}>BAIDAS & BAIDAS AG</p>
          <p style={{ fontFamily:"var(--font-geist-sans)", fontSize:12.5, color:"rgba(26,59,92,0.45)", lineHeight:1.8 }}>
            Baarerstrasse 12<br/>6300 Zug, Switzerland
          </p>
        </div>
        <div>
          <p style={{ fontFamily:"var(--font-geist-sans)", fontSize:9.5, letterSpacing:"0.22em", textTransform:"uppercase", color:PALE, marginBottom:20 }}>{labels[lang][0]}</p>
          <a href="mailto:info@baidas.ch" style={{ display:"block", fontFamily:"var(--font-geist-sans)", fontSize:12.5, color:"rgba(26,59,92,0.55)", textDecoration:"none", marginBottom:8 }}>info@baidas.ch</a>
          <a href="mailto:andreas@baidas.ch" style={{ display:"block", fontFamily:"var(--font-geist-sans)", fontSize:12.5, color:"rgba(26,59,92,0.35)", textDecoration:"none" }}>andreas@baidas.ch</a>
        </div>
        <div>
          <p style={{ fontFamily:"var(--font-geist-sans)", fontSize:9.5, letterSpacing:"0.22em", textTransform:"uppercase", color:PALE, marginBottom:20 }}>{labels[lang][1]}</p>
          {navs[lang].map(([l,h]) => (
            <Link key={h} href={h} style={{ display:"block", fontFamily:"var(--font-geist-sans)", fontSize:12.5, color:"rgba(26,59,92,0.4)", textDecoration:"none", marginBottom:8 }}>{l}</Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop:"1px solid rgba(26,59,92,0.07)", maxWidth:1300, margin:"0 auto", padding:"1.2rem 4rem", display:"flex", justifyContent:"space-between" }}>
        <p style={{ fontFamily:"var(--font-geist-sans)", fontSize:10.5, color:"rgba(26,59,92,0.28)" }}>© {new Date().getFullYear()} Baidas & Baidas AG</p>
        <p style={{ fontFamily:"var(--font-geist-sans)", fontSize:9.5, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(26,59,92,0.2)" }}>Zürich · Dubai · Abu Dhabi</p>
      </div>
    </footer>
  );
}
