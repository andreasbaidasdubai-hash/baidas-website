import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Baidas & Baidas AG, Zug.",
  robots: { index: false, follow: true },
};

const INK = "#16181A";
const BODY = "#5A5E63";
const SOFT = "#9A9DA2";

export default function ImpressumPage() {
  return (
    <main style={{ background: "#fff", minHeight: "100dvh", padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Link href="/" style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: SOFT, textDecoration: "none" }}>
          ← Baidas &amp; Baidas
        </Link>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.4rem,5vw,3.6rem)", color: INK, margin: "1.5rem 0 2.5rem" }}>
          Impressum
        </h1>

        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY }}>
          <p style={{ margin: "0 0 1.6rem" }}>
            <strong style={{ color: INK }}>Baidas &amp; Baidas AG</strong><br />
            Baarerstrasse 12<br />
            6300 Zug<br />
            Schweiz
          </p>
          <p style={{ margin: "0 0 1.6rem" }}>
            E-Mail: <a href="mailto:info@baidas.ch" style={{ color: INK }}>info@baidas.ch</a>
          </p>
          <p style={{ margin: "0 0 1.6rem" }}>
            Vertretungsberechtigte Person: Andreas Baidas
          </p>
          <p style={{ margin: "0 0 1.6rem" }}>
            Rechtsform: Aktiengesellschaft (AG)<br />
            Sitz: Zug<br />
            UID: CHE-327.201.018<br />
            Handelsregister-Nr.: CH-170-3050334-9
          </p>
          <p style={{ margin: 0, color: SOFT, fontSize: 13 }}>
            Weitere Niederlassung: Central Park Tower, DIFC, Dubai (VAE).
          </p>
        </div>
      </div>
    </main>
  );
}
