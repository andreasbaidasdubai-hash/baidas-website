"use client";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

type Dir = "up" | "left" | "right" | "none";

export function Reveal({
  children, delay = 0, dir = "up", className = "", style = {},
}: {
  children: React.ReactNode; delay?: number; dir?: Dir; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const offset = { up: { y: 28 }, left: { x: -28 }, right: { x: 28 }, none: {} }[dir];
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* Word-by-word mask reveal for serif headings */
export function RevealText({
  text, className = "", delay = 0, italic = false,
}: {
  text: string; className?: string; delay?: number; italic?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  return (
    <span ref={ref} className={className} style={{ fontStyle: italic ? "italic" : "normal" }}>
      {text.split(" ").map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <motion.span
            style={{ display: "inline-block", paddingRight: "0.22em" }}
            initial={reduce ? false : { y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 0.8, delay: delay + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
