"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Spotlight({ className = "" }: { className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);
  const opacity = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 25 });
  const y = useSpring(rawY, { stiffness: 150, damping: 25 });

  return (
    <div
      ref={divRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      onMouseMove={(e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        rawX.set(e.clientX - rect.left);
        rawY.set(e.clientY - rect.top);
        opacity.set(1);
      }}
      onMouseLeave={() => opacity.set(0)}
      style={{ pointerEvents: "auto" }}
    >
      <motion.div
        className="pointer-events-none absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x,
          y,
          opacity,
          background: "radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
