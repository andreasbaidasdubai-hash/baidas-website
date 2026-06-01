"use client";
import { useRef } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  duration?: number;
}

export default function MovingBorder({ children, className = "", containerClassName = "", duration = 4000 }: Props) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength?.() ?? 400;
    progress.set((time % duration) / duration);
  });

  const x = useTransform(progress, (v) => {
    const length = 400;
    const p = v * length;
    const perimeter = 400;
    const side = perimeter / 4;
    if (p < side) return p;
    if (p < side * 2) return side;
    if (p < side * 3) return side - (p - side * 2);
    return 0;
  });

  const y = useTransform(progress, (v) => {
    const length = 400;
    const p = v * length;
    const side = 100;
    if (p < side) return 0;
    if (p < side * 2) return p - side;
    if (p < side * 3) return side;
    return side - (p - side * 3);
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div className={`relative p-[1px] overflow-hidden rounded-2xl ${containerClassName}`}>
      <div className="absolute inset-0 rounded-2xl" style={{ border: "1px solid transparent" }}>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <rect ref={pathRef} fill="none" width="100%" height="100%" rx="16" ry="16" />
        </svg>
        <motion.div
          style={{ transform }}
          className="absolute h-16 w-16 opacity-80"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,#2563eb_0%,transparent_70%)] blur-sm" />
        </motion.div>
        <div className="absolute inset-0 rounded-2xl border border-brand/20" />
      </div>
      <div className={`relative rounded-2xl ${className}`}>{children}</div>
    </div>
  );
}
