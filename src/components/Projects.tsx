"use client";

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

const layoutDrawer = { type: "spring" as const, visualDuration: 0.35, bounce: 0.1 };
const revealSpring = { type: "spring" as const, visualDuration: 0.7, bounce: 0.16 };
const swapEase = [0.645, 0.045, 0.355, 1] as const;
const REVEAL_DELAY_MS = 250;

type MotionMode = "swap" | "open" | "close";

const imageVariants = {
  enter: (mode: MotionMode) => {
    if (mode === "swap") {
      return { x: "22%", scale: 1.05, z: 48, rotateY: -4, opacity: 1, zIndex: 2 };
    }
    if (mode === "open") {
      return {
        x: 0,
        scale: 1.08,
        z: 180,
        rotateY: 0,
        opacity: 0,
        zIndex: 1,
        transition: { duration: 0.38, ease: swapEase },
      };
    }
    return { x: 0, scale: 1, z: 0, rotateY: 0, opacity: 0, zIndex: 0 };
  },
  center: { x: 0, scale: 1, z: 0, rotateY: 0, opacity: 1, zIndex: 1 },
  exit: (mode: MotionMode) => {
    if (mode === "swap") {
      return {
        x: "-18%",
        scale: 0.9,
        z: -90,
        rotateY: 5,
        opacity: 0,
        zIndex: 0,
        transition: {
          duration: 0.45,
          ease: swapEase,
          opacity: { duration: 0.28, ease: "easeOut" },
        },
      };
    }
    if (mode === "close") {
      return {
        x: 0,
        scale: 1.08,
        z: 180,
        rotateY: 0,
        opacity: 0,
        zIndex: 1,
        transition: { duration: 0.38, ease: swapEase },
      };
    }
    return { x: 0, scale: 1, z: 0, rotateY: 0, opacity: 0, zIndex: 0 };
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
}: {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
  frostSrc?: string;
  stageRef?: RefObject<HTMLElement | null>;
}) {
  return (
    <motion.div
      layout
      transition={layoutDrawer}
      style={{ borderRadius: "var(--project-radius)", originX: 0, originY: 0 }}
      className={`relative overflow-hidden text-white ${isOpen ? "" : "project-pill-closed"} ${className ?? ""}`}
    >
      {isOpen && frostSrc && stageRef ? (
        <StageAlignedBlur src={frostSrc} stageRef={stageRef} />
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 project-pill" />
      )}
      <motion.div layout transition={layoutDrawer} className="relative">
        {children}
      </motion.div>
    </motion.div>
  );
}

function ExpandedBody({
  project,
  revealed,
  fromY,
}: {
  project: Project;
  revealed: boolean;
  fromY: number;
}) {
  return (
    <motion.div
      key={`${project.id}-reveal`}
      initial={{ opacity: 0, x: 0, y: fromY }}
      animate={revealed ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 0, y: fromY }}
      transition={revealed ? revealSpring : { duration: 0 }}
      transformTemplate={({ y }) => `translateY(${y ?? 0})`}
      className={revealed ? undefined : "invisible"}
    >
      <p
        id={`project-tab-${project.id}`}
        className="text-[13px] leading-[1.4] font-normal tracking-[-0.16px] text-body-muted desktop:text-body"
      >
        <span className="font-semibold tracking-[-0.16px] text-white desktop:tracking-[-0.374px]">
          {project.name}.{" "}
        </span>
        <span className="text-white">{project.description}</span>
      </p>
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
  const [fromY, setFromY] = useState(-6);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const choose = (id: string | null) => {
    if (selected !== null && id !== null) setMode("swap");
    else if (selected === null && id !== null) setMode("open");
    else setMode("close");
    if (id !== null) {
      const fromIndex = selected ? projects.findIndex((p) => p.id === selected) : -1;
      const toIndex = projects.findIndex((p) => p.id === id);
      setFromY(fromIndex !== -1 && toIndex < fromIndex ? 6 : -6);
    }
    setCollapsingId(selected);
    setRevealed(false);
    setSelected(id);
  };

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
          <h2
            id="projects"
            className="nav-anchor text-display-md leading-[1.1] font-semibold tracking-tight desktop:text-display-lg"
          >
            {t("title")}
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-[1.4] tracking-[-0.24px] text-body-muted desktop:mt-3 desktop:text-body">
            {t("lede")}
          </p>
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
              <AnimatePresence initial={false} mode="sync" custom={mode}>
                <motion.div
                  key={hasSelection ? preview.id : "idle"}
                  custom={mode}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={
                    mode === "swap"
                      ? { duration: 0.7, ease: swapEase }
                      : { duration: 0.38, ease: swapEase }
                  }
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
                className={`btn-icon-circle absolute top-4 right-4 z-20 size-10 transition-[opacity,transform] ${
                  hasSelection ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <X className="size-3.5" size={14} strokeWidth={2.25} absoluteStrokeWidth />
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
                    className="btn-icon-circle size-10"
                  >
                    <ChevronLeft className="size-4" strokeWidth={2.5} />
                  </button>
                ) : null}

                {projects.map((p) => {
                  const isOpen = p.id === selected;
                  if (hasSelection && !isOpen) return null;
                  return (
                    <PillFrame
                      key={p.id}
                      isOpen={isOpen}
                      className={isOpen ? "min-w-0 flex-1" : "shrink-0"}
                    >
                      {isOpen ? (
                        <div className="px-3.5 py-3">
                          <ExpandedBody project={p} revealed={revealed} fromY={fromY} />
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
                          <span className="text-[13px] leading-[1.2] font-semibold tracking-[-0.16px] whitespace-nowrap text-white">
                            {p.name}
                          </span>
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
                    className="btn-icon-circle size-10"
                  >
                    <ChevronRight className="size-4" strokeWidth={2.5} />
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
            <AnimatePresence initial={false} mode="sync" custom={mode}>
              <motion.div
                key={hasSelection ? preview.id : "idle"}
                custom={mode}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={
                  mode === "swap"
                    ? { duration: 0.7, ease: swapEase }
                    : { duration: 0.38, ease: swapEase }
                }
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
            className={`btn-icon-circle absolute top-6 right-6 z-20 hidden transition-[opacity,transform] desktop:grid ${
              hasSelection ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <X className="size-4" size={16} strokeWidth={2.25} absoluteStrokeWidth />
          </button>

          <div className="relative z-10 hidden h-full flex-col px-0 pb-5 desktop:absolute desktop:inset-0 desktop:flex desktop:flex-row desktop:items-center desktop:justify-start desktop:gap-6 desktop:px-6 desktop:pb-0">
            <div
              aria-hidden={!hasSelection}
              className={`hidden w-11 shrink-0 flex-col gap-3 transition-opacity duration-200 desktop:flex ${
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
                <ChevronUp className="size-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                aria-label={t("nextProject")}
                tabIndex={hasSelection ? 0 : -1}
                disabled={!hasSelection || selectedIndex >= projects.length - 1}
                onClick={() => selectAt(selectedIndex + 1)}
                className="btn-icon-circle"
              >
                <ChevronDown className="size-5" strokeWidth={2.5} />
              </button>
            </div>

            <LayoutGroup>
              <ul className="hidden w-full flex-col gap-2.5 desktop:flex desktop:gap-3">
                {projects.map((p, i) => {
                  const isOpen = p.id === selected;
                  const isCollapsing = p.id === collapsingId;
                  return (
                    <motion.li key={p.id} layout transition={layoutDrawer}>
                      <PillFrame
                        isOpen={isOpen}
                        frostSrc={isOpen ? preview.image : undefined}
                        stageRef={stageRef}
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
                            <ExpandedBody project={p} revealed={revealed} fromY={fromY} />
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
                                isCollapsing
                                  ? { opacity: 0, x: 0, y: 8 }
                                  : { opacity: 1, x: 0, y: 0 }
                              }
                              transition={isCollapsing ? { duration: 0 } : revealSpring}
                              transformTemplate={({ y }) => `translateY(${y ?? 0})`}
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
                              <span className="min-w-0 text-body-strong text-white desktop:truncate">
                                {p.name}
                              </span>
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
