"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
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
  const [on, setOn] = useState(true);     // intended playing state (icon)
  const [hint, setHint] = useState(true);  // pulse until the first interaction
  const [idx, setIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Autostart on the first user gesture (browsers block silent autoplay).
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    const start = () => { a.play().then(() => fade(a, VOLUME, 1500)).catch(() => {}); };
    let done = false;
    const evts = ["pointerdown", "keydown", "scroll", "touchstart", "click"] as const;
    const remove = () => evts.forEach(e => window.removeEventListener(e, kick));
    const kick = () => { if (done) return; done = true; setHint(false); start(); remove(); };
    start(); // attempt immediately (usually blocked until a gesture)
    evts.forEach(e => window.addEventListener(e, kick, { passive: true }));
    return remove;
  }, []);

  // keep playing across track changes (multi-track playlists)
  useEffect(() => {
    const a = audioRef.current;
    if (a && on) a.play().then(() => fade(a, VOLUME, 600)).catch(() => {});
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    setHint(false);
    if (!a.paused && a.volume > 0.02) { fade(a, 0, 700); setOn(false); }
    else { a.play().then(() => fade(a, VOLUME, 700)).catch(() => {}); setOn(true); }
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
      <motion.button
        onClick={toggle}
        aria-label={on ? "Musik ausschalten" : "Musik einschalten"}
        title={TRACKS[idx].title}
        animate={hint
          ? { boxShadow: ["0 0 0 0 rgba(255,255,255,0.45)", "0 0 0 13px rgba(255,255,255,0)"] }
          : { boxShadow: "0 0 0 0 rgba(255,255,255,0)" }}
        transition={hint
          ? { duration: 1.9, repeat: Infinity, ease: "easeOut" }
          : { duration: 0.3 }}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 120,
          width: 44, height: 44, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(22,24,26,0.7)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer",
        }}
        whileHover={{ scale: 1.08 }}
      >
        {on
          ? <MusicNotes weight="light" size={18} color="rgba(255,255,255,0.9)" />
          : <SpeakerSimpleX weight="light" size={18} color="rgba(255,255,255,0.55)" />}
      </motion.button>
    </>
  );
}
