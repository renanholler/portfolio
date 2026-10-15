"use client";

import { localeLabels, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

const switcherClass =
  "locale-switcher inline-grid shrink-0 grid-cols-2 items-stretch rounded-full border border-current/15 text-[11px] leading-none tracking-[-0.11px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

export function LocaleSwitcher({ groupId }: { groupId: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(locale);

  useEffect(() => {
    setSelected(locale);
  }, [locale]);

  const nextLocale: Locale = selected === "en" ? "pt" : "en";

  return (
    <LayoutGroup id={groupId}>
      <button
        type="button"
        role="switch"
        aria-checked={selected === "pt"}
        aria-label="Language"
        className={switcherClass}
        onClick={() => {
          setSelected(nextLocale);
          router.replace(pathname, { locale: nextLocale });
        }}
      >
        {routing.locales.map((loc) => {
          const active = selected === loc;

          return (
            <span
              key={loc}
              className={`relative grid h-full w-9 place-items-center rounded-full ${
                active ? "text-(--nav-cta-fg)" : "text-current/70"
              }`}
              data-inactive={active ? undefined : ""}
            >
              {active ? (
                <motion.span
                  layoutId={`${groupId}-pill`}
                  className="pointer-events-none absolute inset-0 rounded-full bg-(--nav-cta-bg)"
                  style={{ borderRadius: 9999 }}
                  initial={false}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", visualDuration: 0.22, bounce: 0.1 }
                  }
                  aria-hidden
                />
              ) : null}
              <span className="locale-switcher-label relative z-10">{localeLabels[loc]}</span>
            </span>
          );
        })}
      </button>
    </LayoutGroup>
  );
}
