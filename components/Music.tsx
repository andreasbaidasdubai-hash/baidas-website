"use client";
import { useRef, useState, useEffect } from "react";
import { MusicNotes, SpeakerSimpleX } from "@phosphor-icons/react";

/* Background music player.
   Add your own .mp3 files to /public/music and list them in TRACKS to choose tracks. */
const TRACKS = [
  { src: "/music/blacktrendmusic-classical.mp3", title: "BlackTrendMusic — Classical" },
];

const VOLUME = 0.5;

function fade(a: HTMLAudioElement, target: number, ms: number) {
  const steps = 24;
  const start = a.volume;
  const delta = (target - start) / steps;
  let i = 0;
  const id = setInterval(() => {
    i++;
    a.volume = Math.max(0, Math.min(1, start + delta * i));
    if (i >= steps) { clearInterval(id); if (target === 0) a.pause(); }
  }, ms / steps);
}

export default function Music() {
  const [on, setOn] = useState(true);   // default ON (begins on first user gesture)
  const [idx, setIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // autostart: browsers block autoplay with sound until a gesture
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    const tryPlay = () => { a.play().then(() => fade(a, VOLUME, 1800)).catch(() => {}); };
    let done = false;
    const evts = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const remove = () => evts.forEach(e => window.removeEventListener(e, kick));
    const kick = () => { if (done) return; done = true; tryPlay(); remove(); };
    tryPlay();
    evts.forEach(e => window.addEventListener(e, kick, { passive: true }));
    return remove;
  }, []);

  // when the track changes, keep playing if enabled
  useEffect(() => {
    const a = audioRef.current;
    if (a && on) a.play().then(() => fade(a, VOLUME, 600)).catch(() => {});
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (on) { fade(a, 0, 800); setOn(false); }
    else { a.play().then(() => fade(a, VOLUME, 800)).catch(() => {}); setOn(true); }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACKS[idx].src}
        loop={TRACKS.length === 1}
        preload="auto"
        onEnded={() => { if (TRACKS.length > 1) setIdx(i => (i + 1) % TRACKS.length); }}
      />
      <button
        onClick={toggle}
        aria-label={on ? "Musik ausschalten" : "Musik einschalten"}
        title={TRACKS[idx].title}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 120,
          width: 44, height: 44, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(22,24,26,0.7)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer",
          transition: "transform 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {on
          ? <MusicNotes weight="light" size={18} color="rgba(255,255,255,0.9)" />
          : <SpeakerSimpleX weight="light" size={18} color="rgba(255,255,255,0.55)" />}
      </button>
    </>
  );
}
