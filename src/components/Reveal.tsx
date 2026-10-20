"use client";

import { LocaleFade } from "@/components/LocaleFade";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ title, id }: { title: string; id?: string }) {
  return (
    <LocaleFade
      as="h2"
      id={id}
      fadeKey={id ? `section-${id}` : "section-heading"}
      text={title}
      className={`mb-8 font-display text-[28px] leading-[1.1] font-semibold tracking-tight desktop:mb-14 desktop:text-display-lg${id ? " nav-anchor" : ""}`}
    />
  );
}
