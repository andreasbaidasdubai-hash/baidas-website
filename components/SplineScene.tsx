"use client";
import Spline from "@splinetool/react-spline";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────
   HOW TO USE YOUR OWN SPLINE SCENE:
   1. Go to spline.design → sign up free
   2. Create a new scene or search Community for "mountain", "landscape",
      "terrain", "alpine" — many free scenes exist
   3. Click "Export" → "Web (Viewer)" → copy the URL
      It looks like: https://prod.spline.design/XXXXXXXX/scene.splinecode
   4. Paste that URL as the SCENE_URL below
   ─────────────────────────────────────────────────────────────────── */
const SCENE_URL = "https://prod.spline.design/iZt5RNWzXANFbJpB/scene.splinecode";

export default function SplineScene({ onLoad }: { onLoad?: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#080A08" }}>
          <div style={{ width: 32, height: 32, border: "1px solid rgba(232,228,220,0.15)", borderTopColor: "rgba(232,228,220,0.6)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      )}
      <Spline
        scene={SCENE_URL}
        onLoad={() => { setLoaded(true); onLoad?.(); }}
        style={{ width: "100%", height: "100%", opacity: loaded ? 1 : 0, transition: "opacity 1.2s ease" }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
