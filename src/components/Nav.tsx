"use client";

import { LocaleFade } from "@/components/LocaleFade";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const SECTION_IDS = ["about", "projects", "experience", "contact"] as const;
const NAV_H = 52;
/* Anchor scrolls rest the heading at scroll-padding (NAV_H + 1) + scroll-margin (24px),
   so the spy threshold must sit past that point or a nav click never activates its own link. */
const NAV_ANCHOR_OFFSET = NAV_H + 1 + 24 + 4;

const linkClass =
  "text-button-utility outline-none hover:text-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

const inkEase = [0.32, 0.72, 0, 1] as const;

export function Nav() {
  const t = useTranslations("nav");
  const reduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [active, setActive] = useState<string | null>(null);
  const pendingHref = useRef<string | null>(null);

  const links = [
    { href: "#about", label: t("about") },
    { href: "#projects", label: t("projects") },
    { href: "#experience", label: t("experience") },
    { href: "#contact", label: t("contact") },
  ];

  const inkTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: inkEase };

  useEffect(() => {
    const probe = () => {
      const heading = document.getElementById("projects");
      const surface = heading?.closest("section") ?? heading;
      if (!surface) return;
      const { top, bottom } = surface.getBoundingClientRect();
      const next = top <= 26 && bottom > 26 ? "dark" : "light";
      setTheme((prev) => (prev === next ? prev : next));
    };

    probe();
    window.addEventListener("scroll", probe, { passive: true });
    window.addEventListener("resize", probe);
    return () => {
      window.removeEventListener("scroll", probe);
      window.removeEventListener("resize", probe);
    };
  }, []);

  useEffect(() => {
    const spy = () => {
      const pending = pendingHref.current;
      if (pending) {
        const target = document.getElementById(pending.slice(1));
        const doc = document.scrollingElement;
        const atBottom =
          doc && doc.scrollTop + window.innerHeight >= doc.scrollHeight - 2;
        const arrived =
          pending === `#${SECTION_IDS[SECTION_IDS.length - 1]}`
            ? atBottom
            : target && target.getBoundingClientRect().top <= NAV_ANCHOR_OFFSET;
        if (!arrived) return;
        pendingHref.current = null;
      }

      let next: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= NAV_ANCHOR_OFFSET) next = `#${id}`;
      }
      // The last section may be too short to ever cross the threshold — at the
      // bottom of the page it is the active one regardless.
      const doc = document.scrollingElement;
      if (doc && doc.scrollTop + window.innerHeight >= doc.scrollHeight - 2) {
        next = `#${SECTION_IDS[SECTION_IDS.length - 1]}`;
      }
      setActive((prev) => (prev === next ? prev : next));
    };

    const observer = new IntersectionObserver(spy, {
      rootMargin: `-${NAV_H}px 0px 0px 0px`,
      threshold: [0, 0.15, 0.4, 0.7, 1],
    });
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    spy();
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", spy);
      window.removeEventListener("resize", spy);
    };
  }, []);

  const closeMenu = () => {
    const input = document.getElementById("nav-menu") as HTMLInputElement | null;
    if (input) input.checked = false;
  };

  const onNavClick = (href: string) => {
    setActive(href);
    pendingHref.current = href;
    closeMenu();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <input id="nav-menu" type="checkbox" className="peer sr-only" />
      <div
        className={`nav-frost peer-checked:[&_.line-a]:translate-y-[3.5px] peer-checked:[&_.line-a]:rotate-45 peer-checked:[&_.line-b]:translate-y-[-3.5px] peer-checked:[&_.line-b]:-rotate-45 peer-checked:[&_.nav-panel]:grid-rows-[1fr] peer-checked:[&_.nav-link]:translate-y-0 peer-checked:[&_.nav-link]:opacity-100`}
        data-theme={theme}
      >
        <nav
          aria-label={t("main")}
          className="relative z-10 mx-auto flex h-13 max-w-360 items-center justify-between px-64"
        >
          <a
            href="#top"
            aria-label={t("home")}
            onClick={closeMenu}
            className="text-tagline text-current outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            RH
          </a>

          <div className="hidden h-full items-center gap-5 desktop:flex">
            <LayoutGroup id="nav-desktop">
              <ul className="flex h-full items-stretch gap-5">
                {links.map((l) => {
                  const isActive = active === l.href;
                  return (
                    <li key={l.href} className="relative flex items-center">
                      <a
                        href={l.href}
                        onClick={() => onNavClick(l.href)}
                        aria-current={isActive ? "true" : undefined}
                        className={`${linkClass} ${isActive ? "text-current" : "text-current/80"}`}
                      >
                        <LocaleFade fadeKey={`nav-desktop-${l.href}`} text={l.label} />
                      </a>
                      {isActive ? (
                        <motion.span
                          layoutId="nav-ink-desktop"
                          className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-current"
                          transition={inkTransition}
                          aria-hidden
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
            <LocaleSwitcher groupId="locale-desktop" />
          </div>

          <div className="flex items-center gap-3 desktop:hidden">
            <LocaleSwitcher groupId="locale-mobile" />
            <label
              htmlFor="nav-menu"
              aria-label={t("menu")}
              className="grid size-11 place-items-center text-current"
            >
              <span className="relative block h-3.5 w-4" aria-hidden>
                <span className="line-a absolute top-0.5 left-0 h-[1.5px] w-4 bg-current transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                <span className="line-b absolute bottom-0.5 left-0 h-[1.5px] w-4 bg-current transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]" />
              </span>
            </label>
          </div>
        </nav>

        <div className="nav-panel grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] desktop:hidden">
          <div className="min-h-0 overflow-hidden">
            <LayoutGroup id="nav-mobile">
              <ul className="flex min-h-[calc(100svh-3.25rem)] flex-col px-5 pt-3 pb-10">
                {links.map((l, i) => {
                  const isActive = active === l.href;
                  return (
                    <li key={l.href} className="border-b border-current/10 last:border-b-0">
                      <a
                        href={l.href}
                        onClick={() => onNavClick(l.href)}
                        aria-current={isActive ? "true" : undefined}
                        style={{ transitionDelay: `${80 + i * 50}ms` }}
                        className="nav-link flex min-h-14 translate-y-2 items-center py-3 text-lead font-semibold text-current opacity-0 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                      >
                        <span className="relative">
                          <LocaleFade fadeKey={`nav-mobile-${l.href}`} text={l.label} />
                          {isActive ? (
                            <motion.span
                              layoutId="nav-ink-mobile"
                              className="pointer-events-none absolute inset-x-0 -bottom-1 h-px bg-current"
                              transition={inkTransition}
                              aria-hidden
                            />
                          ) : null}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </header>
  );
}
