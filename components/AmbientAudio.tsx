"use client";
import { useRef, useState, useEffect } from "react";
import { SpeakerHigh, SpeakerX } from "@phosphor-icons/react";

export default function AmbientAudio() {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const ctxRef  = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const buildSynth = (ctx: AudioContext) => {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 5);
    master.connect(ctx.destination);
    gainRef.current = master;

    // Reverb buffer
    const conv = ctx.createConvolver();
    const bLen = ctx.sampleRate * 4;
    const buf  = ctx.createBuffer(2, bLen, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < bLen; i++)
        d[i] = (Math.random()*2-1) * Math.pow(1-i/bLen, 2.2);
    }
    conv.buffer = buf;

    const dry = ctx.createGain(); dry.gain.value = 0.35; dry.connect(master);
    const wet = ctx.createGain(); wet.gain.value = 0.65; wet.connect(conv); conv.connect(master);

    // Drone oscillators — 5 layers
    const layers = [
      { freq: 38,   amp: 0.32, type: "sine"     as OscillatorType, lfoRate: 0.04 },
      { freq: 57.5, amp: 0.20, type: "sine"     as OscillatorType, lfoRate: 0.06 },
      { freq: 76.4, amp: 0.13, type: "triangle" as OscillatorType, lfoRate: 0.08 },
      { freq: 114,  amp: 0.07, type: "sine"     as OscillatorType, lfoRate: 0.12 },
      { freq: 152,  amp: 0.04, type: "triangle" as OscillatorType, lfoRate: 0.05 },
    ];

    layers.forEach(({ freq, amp, type, lfoRate }) => {
      const osc  = ctx.createOscillator();
      const gn   = ctx.createGain();
      const lfo  = ctx.createOscillator();
      const lfoG = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      lfo.frequency.value = lfoRate;
      lfoG.gain.value = freq * 0.003;

      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      gn.gain.value = amp;
      osc.connect(gn);
      gn.connect(dry);
      gn.connect(wet);
      lfo.start();
      osc.start();
    });

    // High shimmer
    const sh = ctx.createOscillator();
    const sg = ctx.createGain();
    sh.frequency.value = 520;
    sg.gain.value = 0.012;
    sh.connect(sg); sg.connect(wet);
    sh.start();
  };

  const start = async () => {
    if (started) return;
    try {
      const ctx = new AudioContext();
      await ctx.resume();
      ctxRef.current = ctx;
      buildSynth(ctx);
      setStarted(true);
    } catch (_) {}
  };

  // Auto-start on first user interaction
  useEffect(() => {
    const handler = () => { start(); };
    window.addEventListener("click",      handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    window.addEventListener("keydown",    handler, { once: true });
    // Also try on scroll
    window.addEventListener("scroll",     handler, { once: true, passive: true });
    return () => {
      window.removeEventListener("click",      handler);
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("keydown",    handler);
      window.removeEventListener("scroll",     handler);
    };
  }, [started]);

  const toggleMute = () => {
    if (!gainRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const g = gainRef.current;
    if (muted) {
      g.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.5);
    } else {
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    }
    setMuted(!muted);
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: "rgba(8,10,8,0.75)",
        border: "1px solid rgba(232,228,220,0.1)",
        backdropFilter: "blur(12px)",
      }}
      aria-label={muted ? "Unmute" : "Mute music"}
    >
      {!muted
        ? <SpeakerHigh weight="light" className="w-4 h-4" style={{ color: "rgba(232,228,220,0.55)" }} />
        : <SpeakerX    weight="light" className="w-4 h-4" style={{ color: "rgba(232,228,220,0.22)" }} />
      }
    </button>
  );
}
