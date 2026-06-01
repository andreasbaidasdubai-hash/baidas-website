"use client";
import { motion } from "motion/react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "white";
}

export default function ShimmerButton({ children, href, onClick, variant = "primary" }: Props) {
  const inner = (
    <motion.span
      className={`
        relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-[13px]
        font-semibold tracking-[-0.005em] overflow-hidden cursor-pointer select-none
        ${variant === "primary"
          ? "bg-accent text-white shadow-[0_2px_20px_rgba(0,102,255,0.28)]"
          : "bg-white text-ink shadow-[0_2px_16px_rgba(0,0,0,0.08)]"}
      `}
      whileHover={{ scale: 1.025, y: -1 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
    >
      <motion.span
        className="absolute inset-0 -skew-x-12 pointer-events-none"
        initial={{ x: "-120%" }}
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" }}
      />
      {children}
    </motion.span>
  );

  if (href) return <Link href={href} className="inline-block">{inner}</Link>;
  return <button onClick={onClick} className="inline-block">{inner}</button>;
}
