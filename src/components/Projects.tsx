"use client";

import { LocaleFade } from "@/components/LocaleFade";
import { getPortfolio } from "@/data/get-portfolio";
import type { Project } from "@/data/portfolio";
import type { Locale } from "@/i18n/routing";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Plus, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import inventory from "../../public/inventory.png";
import unnichat from "../../public/unnichat.png";
import { TechIcon } from "./TechIcon";

const projectSources: Record<string, StaticImageData> = {
  "/inventory.png": inventory,
  "/unnichat.png": unnichat,
};

// Apple's product-viewer spring: stiffness = (2π/duration)², damping = (1−bounce)·4π/duration.
function appleSpring(duration: number, bounce: number) {
  const omega = (2 * Math.PI) / duration;
  return {
    type: "spring" as const,
    stiffness: omega * omega,
    damping: (1 - bounce) * 2 * omega,
    mass: 1,
  };
}

const easeInOut = [0.42, 0, 0.58, 1] as const;
const easeOut = [0, 0, 0.58, 1] as const;
const cardOpen = appleSpring(0.5, 0.42);
const cardSwap = appleSpring(0.5, 0.16);
const cardClose = appleSpring(0.32, 0);
const scaleIn = appleSpring(0.63, 0.39);
const scaleMove = appleSpring(0.63, 0);
const fadeMove = appleSpring(0.32, 0);
const CONTENT_OFFSET = 28;
const REVEAL_DELAY_MS = 16;

type MotionMode = "swap" | "open" | "close";

function cardSpring(mode: MotionMode) {
  if (mode === "swap") return cardSwap;
  if (mode === "close") return cardClose;
  return cardOpen;
}

function mediaShift() {
  if (typeof window === "undefined") return 315;
  return 0.5 * (window.innerWidth - 810);
}

type ImageMotion = { mode: MotionMode; dir: 1 | -1 };

const contentEnter = {
  y: { duration: 0.4, ease: easeInOut },
  opacity: { duration: 0.6, ease: easeInOut, delay: 0.25 },
};
const contentExit = {
  y: { duration: 0.4, ease: easeInOut },
  opacity: { duration: 0.3, ease: easeInOut },
};

const labelEnter = {
  opacity: { duration: 0.3, ease: easeOut, delay: 0.2 },
  scale: { duration: 0.3, ease: easeOut, delay: 0.2 },
};

const imageVariants = {
  enter: ({ mode, dir }: ImageMotion) => {
    if (mode === "swap") {
      const shift = mediaShift();
      return {
        x: dir * shift,
        scale: dir > 0 ? 0.83333 : 1.2,
        z: 0,
        rotateY: 0,
        opacity: 0,
        zIndex: 2,
      };
    }
    if (mode === "open") {
      return { x: 0, scale: 0.83333, z: 0, rotateY: 0, opacity: 0, zIndex: 1 };
    }
    return { x: 0, scale: 1, z: 0, rotateY: 0, opacity: 0, zIndex: 0 };
  },
  center: ({ mode }: ImageMotion) => ({
    x: 0,
    scale: 1,
    z: 0,
    rotateY: 0,
    opacity: 1,
    zIndex: 1,
    transition:
      mode === "swap"
        ? { x: scaleMove, scale: scaleMove, opacity: fadeMove }
        : { x: scaleMove, scale: scaleIn, opacity: fadeMove },
  }),
  exit: ({ mode, dir }: ImageMotion) => {
    if (mode === "swap") {
      const shift = mediaShift();
      return {
        x: -dir * shift,
        scale: dir > 0 ? 0.83333 : 1.2,
        z: 0,
        rotateY: 0,
        opacity: 0,
        zIndex: 0,
        transition: { x: scaleMove, scale: scaleMove, opacity: fadeMove },
      };
    }
    if (mode === "close") {
      return {
        x: 0,
        scale: 0.83333,
        z: 0,
        rotateY: 0,
        opacity: 0,
        zIndex: 1,
        transition: { scale: scaleMove, opacity: fadeMove },
      };
    }
    return {
      x: 0,
      scale: 1.2,
      z: 0,
      rotateY: 0,
      opacity: 0,
      zIndex: 0,
      transition: { scale: scaleIn, opacity: fadeMove },
    };
  },
};

function ProjectImage({
  name,
  src,
  layout = "desktop",
}: {
  name: string;
  src?: string;
  layout?: "desktop" | "mobile";
}) {
  if (!src) return null;
  const image = projectSources[src] ?? src;

  if (layout === "mobile") {
    return (
      <div className="relative h-full w-full">
        <Image
          src={image}
          alt={name}
          fill
          unoptimized
          sizes="100vw"
          className="object-contain object-center"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-y-0 right-0 h-full">
        <Image
          src={image}
          alt={name}
          unoptimized
          className="h-full w-auto max-w-none"
          style={{ width: "auto", height: "100%" }}
          draggable={false}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[42%]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(0 0 0), rgb(0 0 0 / 0.7) 28%, rgb(0 0 0 / 0.28) 62%, transparent)",
          }}
        />
      </div>
    </div>
  );
}

function StageAlignedBlur({
  src,
  stageRef,
}: {
  src: string;
  stageRef: RefObject<HTMLElement | null>;
}) {
  const clipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const clip = clipRef.current;
    const layer = clip?.firstElementChild as HTMLElement | null;
    if (!stage || !clip || !layer) return;

    const sync = () => {
      const s = stage.getBoundingClientRect();
      const c = clip.getBoundingClientRect();
      const pad = 80;
      layer.style.width = `${s.width + pad * 2}px`;
      layer.style.height = `${s.height + pad * 2}px`;
      layer.style.left = `${s.left - c.left - pad}px`;
      layer.style.top = `${s.top - c.top - pad}px`;
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(stage);
    observer.observe(clip);
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [src, stageRef]);

  return (
    <div
      ref={clipRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{ borderRadius: "var(--project-radius)" }}
    >
      <div className="absolute">
        <div className="h-full w-full" style={{ filter: "blur(80px)" }}>
          <ProjectImage name="" src={src} />
        </div>
      </div>
      <div className="absolute inset-0 bg-[rgb(30_30_32/0.72)]" />
    </div>
  );
}

function PillFrame({
  isOpen,
  className,
  children,
  frostSrc,
  stageRef,
  transition,
  layoutEnabled = true,
  pillRef,
}: {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
  frostSrc?: string;
  stageRef?: RefObject<HTMLElement | null>;
  transition: typeof cardOpen;
  layoutEnabled?: boolean;
  pillRef?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <motion.div
      ref={pillRef}
      layout={layoutEnabled}
      transition={transition}
      style={{ borderRadius: "28px", originX: 0, originY: 0 }}
      className={`relative overflow-hidden text-white ${isOpen ? "" : "project-pill-closed"} ${className ?? ""}`}
    >
      {isOpen && frostSrc && stageRef ? (
        <StageAlignedBlur src={frostSrc} stageRef={stageRef} />
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 project-pill" />
      )}
      <motion.div layout={layoutEnabled} transition={transition} className="relative">
        {children}
      </motion.div>
    </motion.div>
  );
}

function ExpandedBody({
  project,
  revealed,
  fromY,
  scope,
  exiting = false,
}: {
  project: Project;
  revealed: boolean;
  fromY: number;
  scope: "mobile" | "desktop";
  exiting?: boolean;
}) {
  return (
    <motion.div
      key={`${project.id}-reveal`}
      initial={exiting ? { opacity: 1, y: 0 } : { opacity: 0, x: 0, y: fromY }}
      animate={
        exiting
          ? { opacity: 0, y: CONTENT_OFFSET }
          : revealed
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 0, x: 0, y: fromY }
      }
      transition={exiting ? contentExit : revealed ? contentEnter : { duration: 0 }}
      transformTemplate={({ y }) => `translateY(${y ?? 0})`}
      className={exiting || revealed ? undefined : "invisible"}
    >
      <LocaleFade
        as="p"
        id={`project-tab-${project.id}`}
        fadeKey={`project-copy-${scope}-${project.id}`}
        text={`${project.name}\n${project.description}`}
        className="text-[13px] leading-[1.4] font-normal tracking-[-0.16px] text-body-muted desktop:text-body"
      >
        <span className="font-semibold tracking-[-0.16px] text-white desktop:tracking-[-0.374px]">
          {project.name}.{" "}
        </span>
        <span className="text-white">{project.description}</span>
      </LocaleFade>
      <ul className="no-scrollbar mt-2.5 flex gap-1.5 overflow-x-auto desktop:mt-4 desktop:flex-wrap desktop:gap-2 desktop:overflow-visible">
        {project.stack.map((s) => (
          <li
            key={s}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[11px] leading-[1.3] tracking-[-0.12px] desktop:gap-1.5 desktop:px-3.5 desktop:py-2 desktop:text-caption text-white"
          >
            <TechIcon name={s} className="size-2.5 desktop:size-3.5" /> {s}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Projects() {
  const locale = useLocale() as Locale;
  const t = useTranslations("projects");
  const projects = getPortfolio(locale).projects;
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [collapsingId, setCollapsingId] = useState<string | null>(null);
  const [mode, setMode] = useState<MotionMode>("open");
  const [dir, setDir] = useState<1 | -1>(1);
  const [fromY, setFromY] = useState(CONTENT_OFFSET);
  const [exitingId, setExitingId] = useState<string | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const choose = (id: string | null) => {
    if (selected !== null && id !== null) setMode("swap");
    else if (selected === null && id !== null) setMode("open");
    else setMode("close");
    if (id !== null) {
      const fromIndex = selected ? projects.findIndex((p) => p.id === selected) : -1;
      const toIndex = projects.findIndex((p) => p.id === id);
      setDir(fromIndex !== -1 && toIndex < fromIndex ? -1 : 1);
      setFromY(CONTENT_OFFSET);
      setExitingId(null);
    } else if (selected) {
      setExitingId(selected);
    }
    setCollapsingId(selected);
    setRevealed(false);
    setSelected(id);
  };

  useEffect(() => {
    if (!exitingId) return;
    const id = exitingId;
    const timer = window.setTimeout(() => {
      setExitingId((current) => (current === id ? null : current));
    }, 320);
    return () => window.clearTimeout(timer);
  }, [exitingId]);

  useEffect(() => {
    if (selected !== null || exitingId) return;
    const timer = window.setTimeout(() => {
      for (const node of Object.values(pillRefs.current)) {
        if (!node) continue;
        node.style.borderRadius = "28px";
        node.style.clipPath = "";
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [selected, exitingId]);

  useEffect(() => {
    if (!selected) return;
    const id = window.setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [selected]);

  useEffect(() => {
    if (!collapsingId) return;
    const id = window.setTimeout(() => setCollapsingId(null), REVEAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [collapsingId]);

  const selectedIndex = selected ? projects.findIndex((p) => p.id === selected) : -1;
  const preview = selectedIndex >= 0 ? projects[selectedIndex]! : projects[0]!;
  const hasSelection = selected !== null;

  const selectAt = (index: number) => {
    const next = projects[index];
    if (next) choose(next.id);
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" ? 1 : -1;
    const next = index + dir;
    if (next < 0 || next >= projects.length) return;
    refs.current[next]?.focus();
    if (selected) selectAt(next);
  };

  const onSwipeStart = (event: ReactPointerEvent) => {
    swipeX.current = event.clientX;
  };

  const onSwipeEnd = (event: ReactPointerEvent) => {
    if (swipeX.current === null || !hasSelection) {
      swipeX.current = null;
      return;
    }
    const dx = event.clientX - swipeX.current;
    swipeX.current = null;
    if (dx > 56) selectAt(Math.max(0, selectedIndex - 1));
    else if (dx < -56) selectAt(Math.min(projects.length - 1, selectedIndex + 1));
  };

  return (
    <section
      aria-labelledby="projects"
      className="tile-project pt-24 pb-12 text-on-dark desktop:px-5 desktop:pt-28 desktop:pb-20"
    >
      <div className="mx-auto flex w-full max-w-360 flex-col">
        <header className="mb-5 px-5 desktop:mb-10 desktop:px-0 desktop:pl-24">
          <LocaleFade
            as="h2"
            id="projects"
            fadeKey="projects-title"
            text={t("title")}
            className="nav-anchor text-display-md leading-[1.1] font-semibold tracking-tight desktop:text-display-lg"
          />
          <LocaleFade
            as="p"
            fadeKey="projects-lede"
            text={t("lede")}
            className="mt-2 max-w-xl text-[15px] leading-[1.4] tracking-[-0.24px] text-body-muted desktop:mt-3 desktop:text-body"
          />
        </header>

        <div
          ref={stageRef}
          className="@container relative isolate bg-black desktop:flex desktop:h-[85svh] desktop:min-h-120 desktop:max-h-[85svh] desktop:flex-col desktop:justify-end desktop:overflow-hidden desktop:rounded-(--project-radius)"
        >
          <div className="flex min-h-[70svh] flex-col desktop:hidden">
            <div
              className="relative min-h-[48svh] flex-1"
              style={{ perspective: 2400 }}
              onPointerDown={onSwipeStart}
              onPointerUp={onSwipeEnd}
            >
              <AnimatePresence initial={false} mode="sync" custom={{ mode, dir }}>
                <motion.div
                  key={hasSelection ? preview.id : "idle"}
                  custom={{ mode, dir }}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="pointer-events-none absolute inset-0"
                  style={{ transformStyle: "preserve-3d", transformOrigin: "50% 40%" }}
                >
                  {hasSelection && preview.image ? (
                    <ProjectImage name={preview.name} src={preview.image} layout="mobile" />
                  ) : hasSelection ? (
                    <div className="grid h-full place-items-center px-10 text-center font-display text-[17px] font-semibold text-white/40">
                      {preview.name}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                aria-label={t("closeProject")}
                aria-hidden={!hasSelection}
                tabIndex={hasSelection ? 0 : -1}
                onClick={() => choose(null)}
                className={`btn-icon-circle absolute top-4 right-4 z-20 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0,0,0.58,1)] ${
                  hasSelection ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                style={
                  hasSelection
                    ? { transform: "scale(1)", transition: "opacity 500ms cubic-bezier(0, 0, 0.58, 1), transform 0s" }
                    : { transform: "scale(0)", transition: "transform 110ms linear, opacity 110ms linear" }
                }
              >
                <X className="size-5" size={20} strokeWidth={3} absoluteStrokeWidth />
              </button>
            </div>

            <LayoutGroup>
              <div
                className={`flex items-center pb-3 ${
                  hasSelection
                    ? "gap-4 px-3"
                    : "no-scrollbar gap-2 overflow-x-auto overscroll-x-contain px-5"
                }`}
              >
                {hasSelection ? (
                  <button
                    type="button"
                    aria-label={t("previousProject")}
                    disabled={selectedIndex <= 0}
                    onClick={() => selectAt(selectedIndex - 1)}
                    className="btn-icon-circle"
                  >
                    <ChevronLeft className="size-6" size={24} strokeWidth={3.5} absoluteStrokeWidth />
                  </button>
                ) : null}

                {projects.map((p) => {
                  const isOpen = p.id === selected;
                  const exiting = p.id === exitingId;
                  if (hasSelection && !isOpen) return null;
                  return (
                    <PillFrame
                      key={p.id}
                      isOpen={isOpen}
                      transition={exiting ? cardClose : cardSpring(mode)}
                      className={isOpen ? "min-w-0 flex-1" : "shrink-0"}
                    >
                      {isOpen ? (
                        <div className="px-3.5 py-3">
                          <ExpandedBody project={p} revealed={revealed} fromY={fromY} scope="mobile" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => choose(p.id)}
                          className="flex items-center gap-2 px-3 py-2 text-left outline-none transition-transform active:scale-95"
                        >
                          <span className="grid size-4 shrink-0 place-items-center rounded-full border border-white/90">
                            <Plus
                              className="size-2.5"
                              size={10}
                              strokeWidth={2}
                              absoluteStrokeWidth
                              aria-hidden
                            />
                          </span>
                          <LocaleFade
                            fadeKey={`project-name-mobile-${p.id}`}
                            text={p.name}
                            className={`text-[13px] leading-[1.2] font-semibold tracking-[-0.16px] whitespace-nowrap text-white ${exiting ? "opacity-0" : ""}`}
                          />
                        </button>
                      )}
                    </PillFrame>
                  );
                })}

                {hasSelection ? (
                  <button
                    type="button"
                    aria-label={t("nextProject")}
                    disabled={selectedIndex >= projects.length - 1}
                    onClick={() => selectAt(selectedIndex + 1)}
                    className="btn-icon-circle"
                  >
                    <ChevronRight className="size-6" size={24} strokeWidth={3.5} absoluteStrokeWidth />
                  </button>
                ) : null}
              </div>
            </LayoutGroup>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden desktop:block desktop:rounded-(--project-radius)"
            style={{ perspective: 2400 }}
          >
            <AnimatePresence initial={false} mode="sync" custom={{ mode, dir }}>
              <motion.div
                key={hasSelection ? preview.id : "idle"}
                custom={{ mode, dir }}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="pointer-events-none absolute inset-0"
                style={{ transformStyle: "preserve-3d", transformOrigin: "70% 50%" }}
              >
                <ProjectImage name={preview.name} src={hasSelection ? preview.image : undefined} />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label={t("closeProject")}
            aria-hidden={!hasSelection}
            tabIndex={hasSelection ? 0 : -1}
            onClick={() => choose(null)}
            className={`btn-icon-circle absolute top-6 right-6 z-20 hidden transition-[opacity,transform] duration-500 ease-[cubic-bezier(0,0,0.58,1)] desktop:grid ${
              hasSelection ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={
              hasSelection
                ? { transform: "scale(1)", transition: "opacity 500ms cubic-bezier(0, 0, 0.58, 1), transform 0s" }
                : { transform: "scale(0)", transition: "transform 110ms linear, opacity 110ms linear" }
            }
          >
            <X className="size-5" size={20} strokeWidth={3} absoluteStrokeWidth />
          </button>

          <div className="relative z-10 hidden h-full flex-col px-0 pb-5 desktop:absolute desktop:inset-0 desktop:flex desktop:flex-row desktop:items-center desktop:justify-start desktop:gap-8 desktop:px-6 desktop:pb-0">
            <div
              aria-hidden={!hasSelection}
              className={`hidden w-9 shrink-0 flex-col gap-3 transition-opacity duration-500 ease-[cubic-bezier(0,0,0.58,1)] desktop:flex ${
                hasSelection ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <button
                type="button"
                aria-label={t("previousProject")}
                tabIndex={hasSelection ? 0 : -1}
                disabled={!hasSelection || selectedIndex <= 0}
                onClick={() => selectAt(selectedIndex - 1)}
                className="btn-icon-circle"
              >
                <ChevronUp className="size-6" size={24} strokeWidth={3.5} absoluteStrokeWidth />
              </button>
              <button
                type="button"
                aria-label={t("nextProject")}
                tabIndex={hasSelection ? 0 : -1}
                disabled={!hasSelection || selectedIndex >= projects.length - 1}
                onClick={() => selectAt(selectedIndex + 1)}
                className="btn-icon-circle"
              >
                <ChevronDown className="size-6" size={24} strokeWidth={3.5} absoluteStrokeWidth />
              </button>
            </div>

            <LayoutGroup>
              <ul className="hidden w-full flex-col gap-2.5 desktop:flex desktop:gap-3">
                {projects.map((p, i) => {
                  const isOpen = p.id === selected;
                  const exiting = p.id === exitingId;
                  const isCollapsing = p.id === collapsingId;
                  return (
                    <motion.li key={p.id} layout transition={cardSpring(mode)}>
                      <PillFrame
                        isOpen={isOpen}
                        layoutEnabled
                        pillRef={(node) => {
                          pillRefs.current[p.id] = node;
                        }}
                        transition={exiting ? cardClose : cardSpring(mode)}
                        frostSrc={isOpen ? p.image : undefined}
                        stageRef={isOpen ? stageRef : undefined}
                        className={`w-full desktop:w-fit ${
                          isOpen ? "desktop:max-w-[42cqw]" : "desktop:max-w-[85cqw]"
                        }`}
                      >
                        {isOpen ? (
                          <div
                            id={`project-panel-${p.id}`}
                            aria-labelledby={`project-tab-${p.id}`}
                            className="px-5 py-5 desktop:px-7 desktop:py-6"
                          >
                            <ExpandedBody project={p} revealed={revealed} fromY={fromY} scope="desktop" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            ref={(el) => {
                              refs.current[i] = el;
                            }}
                            id={`project-tab-${p.id}`}
                            aria-expanded={false}
                            onKeyDown={(e) => onKeyDown(e, i)}
                            onClick={() => choose(p.id)}
                            className="flex w-full min-w-0 items-center gap-3 px-4 py-3.5 text-left outline-none transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 desktop:px-6 desktop:py-4"
                          >
                            <motion.span
                              className="flex min-w-0 items-center gap-3"
                              initial={false}
                              animate={
                                exiting || isCollapsing
                                  ? { opacity: 0, y: 0 }
                                  : { opacity: 1, y: 0 }
                              }
                              transition={exiting || isCollapsing ? { duration: 0 } : labelEnter}
                              transformTemplate={({ y, scale }) =>
                                `translateY(${y ?? 0}) scale(${scale ?? 1})`
                              }
                            >
                              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/90">
                                <Plus
                                  className="size-3"
                                  size={12}
                                  strokeWidth={2}
                                  absoluteStrokeWidth
                                  aria-hidden
                                />
                              </span>
                              <LocaleFade
                                block
                                fadeKey={`project-name-desktop-${p.id}`}
                                text={p.name}
                                className="min-w-0 text-body-strong text-white desktop:truncate"
                              />
                            </motion.span>
                          </button>
                        )}
                      </PillFrame>
                    </motion.li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
