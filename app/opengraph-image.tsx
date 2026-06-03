import { ImageResponse } from "next/og";

export const alt = "Baidas & Baidas AG — Baukunst & Projektentwicklung";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#16181A",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top: eyebrow */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(244,240,233,0.5)",
            fontFamily: "sans-serif",
          }}
        >
          Baukunst &nbsp;·&nbsp; Projektentwicklung
        </div>

        {/* Center: brand name */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 130,
              fontWeight: 400,
              color: "#F4F0E9",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Baidas & Baidas
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontStyle: "italic",
              color: "rgba(244,240,233,0.65)",
              marginTop: 20,
            }}
          >
            Exklusive Immobilien in besten Lagen.
          </div>
        </div>

        {/* Bottom: locations + divider */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(244,240,233,0.18)",
              marginBottom: 28,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(244,240,233,0.55)",
              fontFamily: "sans-serif",
            }}
          >
            Zürich &nbsp;·&nbsp; Dubai &nbsp;·&nbsp; Abu Dhabi
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
