"use client";

import { HorizontalScroll, ScrollSlide } from "@/components/HorizontalScroll";
import { social } from "@/data/portfolio";
import { Calendar, Github, Linkedin, Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/** Hover growth factor — rest state is 1/HOVER_GROW so hover lands at scale(1) (crisp text). */
const HOVER_GROW = 1.04;
const REST_SCALE = 1 / HOVER_GROW;

const hoverSpring = {
  type: "spring" as const,
  visualDuration: 0.38,
  bounce: 0.12,
};

type HeroActionLinkProps = {
  href: string;
  className: string;
  fullWidth?: boolean;
  target?: string;
  rel?: string;
  children: ReactNode;
};

function HeroActionLink({
  href,
  className,
  fullWidth = false,
  target,
  rel,
  children,
}: HeroActionLinkProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <a href={href} className={className} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <span
      className={
        fullWidth
          ? "inline-flex w-full shrink-0 items-center justify-center"
          : "inline-flex shrink-0 items-center justify-center"
      }
    >
      <motion.a
        href={href}
        className={className}
        target={target}
        rel={rel}
        initial={false}
        animate={{ scale: REST_SCALE }}
        whileHover={{ scale: 1 }}
        whileTap={{ scale: REST_SCALE * 0.96 }}
        transition={hoverSpring}
        style={{
          originX: "50%",
          originY: "50%",
          display: "inline-flex",
          width: fullWidth ? "100%" : undefined,
        }}
      >
        {children}
      </motion.a>
    </span>
  );
}

export function HeroActions() {
  const t = useTranslations("hero");

  return (
    <div className="mt-8">
      <HorizontalScroll bleed className="items-center desktop:hidden">
        <ScrollSlide width="sm">
          <HeroActionLink href="#contact" className="btn-pill-hero whitespace-nowrap" fullWidth>
            <Calendar className="size-4" /> {t("bookCall")}
          </HeroActionLink>
        </ScrollSlide>
        <ScrollSlide width="sm">
          <HeroActionLink
            href={social.github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost-hero whitespace-nowrap"
            fullWidth
          >
            <Github className="size-4" /> GitHub
          </HeroActionLink>
        </ScrollSlide>
        <ScrollSlide width="sm">
          <HeroActionLink
            href={social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost-hero whitespace-nowrap"
            fullWidth
          >
            <Linkedin className="size-4" /> LinkedIn
          </HeroActionLink>
        </ScrollSlide>
        <ScrollSlide width="sm">
          <HeroActionLink
            href={`mailto:${social.email}`}
            className="btn-ghost-hero whitespace-nowrap"
            fullWidth
          >
            <Mail className="size-4" /> Email
          </HeroActionLink>
        </ScrollSlide>
      </HorizontalScroll>

      <div className="hidden flex-wrap items-center gap-3 desktop:flex">
        <HeroActionLink href="#contact" className="btn-pill-hero">
          <Calendar className="size-4" /> {t("bookCall")}
        </HeroActionLink>
        <HeroActionLink
          href={social.github}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost-hero"
        >
          <Github className="size-4" /> GitHub
        </HeroActionLink>
        <HeroActionLink
          href={social.linkedin}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost-hero"
        >
          <Linkedin className="size-4" /> LinkedIn
        </HeroActionLink>
        <HeroActionLink href={`mailto:${social.email}`} className="btn-ghost-hero">
          <Mail className="size-4" /> Email
        </HeroActionLink>
      </div>
    </div>
  );
}
