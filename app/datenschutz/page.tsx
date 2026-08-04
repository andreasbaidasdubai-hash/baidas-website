import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung der Baidas & Baidas AG.",
  robots: { index: false, follow: true },
};

const INK = "#16181A";
const BODY = "#5A5E63";
const SOFT = "#9A9DA2";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: "2.5rem" }}>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontSize: "clamp(1.5rem,3vw,2rem)", color: INK, margin: "0 0 1rem" }}>{title}</h2>
      <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15, lineHeight: 1.85, color: BODY }}>{children}</div>
    </section>
  );
}

export default function DatenschutzPage() {
  return (
    <main style={{ background: "#fff", minHeight: "100dvh", padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Link href="/" style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: SOFT, textDecoration: "none" }}>
          ← Baidas &amp; Baidas
        </Link>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.4rem,5vw,3.6rem)", color: INK, margin: "1.5rem 0 0.5rem" }}>
          Datenschutzerklärung
        </h1>

        <Section title="Verantwortlicher">
          <p style={{ margin: 0 }}>
            Baidas &amp; Baidas AG, Baarerstrasse 12, 6300 Zug, Schweiz.<br />
            E-Mail: <a href="mailto:info@baidas.ch" style={{ color: INK }}>info@baidas.ch</a>
          </p>
        </Section>

        <Section title="Bearbeitung von Personendaten">
          <p style={{ margin: 0 }}>
            Wir bearbeiten Personendaten im Einklang mit dem Schweizer Datenschutzgesetz (revDSG). Beim Besuch
            dieser Website werden durch unseren Hosting-Dienstleister technisch notwendige Daten (z. B. IP-Adresse,
            Datum und Uhrzeit des Zugriffs) verarbeitet, um die Website sicher und stabil bereitzustellen.
          </p>
        </Section>

        <Section title="Kontaktformular">
          <p style={{ margin: 0 }}>
            Wenn Sie uns über das Kontaktformular schreiben, verarbeiten wir die von Ihnen angegebenen Daten
            (Name, E-Mail-Adresse und Nachricht) ausschliesslich zur Bearbeitung Ihrer Anfrage. Der Versand
            erfolgt über einen Formular-Dienstleister; die Daten werden nur zu diesem Zweck verwendet und nicht
            an unbeteiligte Dritte weitergegeben.
          </p>
        </Section>

        <Section title="Cookies &amp; Analyse">
          <p style={{ margin: 0 }}>
            Diese Website verwendet keine Tracking- oder Marketing-Cookies und bindet keine Analyse-Dienste zur
            Erstellung von Nutzerprofilen ein.
          </p>
        </Section>

        <Section title="Ihre Rechte">
          <p style={{ margin: 0 }}>
            Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer bei uns gespeicherten Personendaten.
            Bitte richten Sie entsprechende Anliegen an <a href="mailto:info@baidas.ch" style={{ color: INK }}>info@baidas.ch</a>.
          </p>
        </Section>

        <p style={{ marginTop: "3rem", fontFamily: "var(--font-geist-sans)", fontSize: 12, color: SOFT }}>
          Stand: 2026. Diese Datenschutzerklärung wird bei Bedarf aktualisiert.
        </p>
      </div>
    </main>
  );
}
