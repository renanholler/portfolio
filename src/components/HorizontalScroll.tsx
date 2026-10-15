"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

type HorizontalScrollProps = {
  children: ReactNode;
  className?: string;
  bleed?: boolean;
  /** Keep a single row and overflow on desktop too (default: mobile-only scroller). */
  desktopScroll?: boolean;
  /**
   * Edge fade/mask. Off by default — Apple overflow-rows clip the next item
   * at full opacity (peek), they do not wipe or dim it.
   */
  fade?: boolean;
  /** Accessible labels for the desktopScroll paddles. */
  prevLabel?: string;
  nextLabel?: string;
};

function DesktopScroller({
  children,
  className,
  prevLabel,
  nextLabel,
}: {
  children: ReactNode;
  className: string;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startLeft: number } | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 1);
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollHalf = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const step = max / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: dir * step,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    // blocks text selection from starting mid-drag
    e.preventDefault();
    drag.current = { startX: e.clientX, startLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current) return;
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div className="overflow-visible">
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`no-scrollbar skills-scroll flex flex-nowrap justify-start gap-4 pb-1 desktop:cursor-grab desktop:active:cursor-grabbing ${className}`}
      >
        {children}
      </div>
      <div className="mt-5 hidden justify-end gap-3 desktop:flex">
        <button
          type="button"
          aria-label={prevLabel}
          disabled={!canPrev}
          onClick={() => scrollHalf(-1)}
          className="skills-paddle"
        >
          <ChevronLeft size={19} strokeWidth={2.5} aria-hidden />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={!canNext}
          onClick={() => scrollHalf(1)}
          className="skills-paddle"
        >
          <ChevronRight size={19} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** Apple-style horizontal scroll: edge bleed, hidden scrollbar, snap. Desktop is not a scroller unless desktopScroll. */
export function HorizontalScroll({
  children,
  className = "",
  bleed = true,
  desktopScroll = false,
  fade = false,
  prevLabel,
  nextLabel,
}: HorizontalScrollProps) {
  const fadeMask = fade
    ? "[mask-image:linear-gradient(to_right,transparent,black_1.25rem,black_calc(100%-1.25rem),transparent)]"
    : "";

  if (desktopScroll) {
    return (
      <DesktopScroller className={className} prevLabel={prevLabel} nextLabel={nextLabel}>
        {children}
      </DesktopScroller>
    );
  }

  return (
    <div className={bleed ? "min-w-0 mobile:-mx-5" : "min-w-0"}>
      <div
        className={`no-scrollbar flex w-full min-w-0 flex-nowrap justify-start gap-4 scroll-smooth pb-1 mobile:snap-x mobile:snap-mandatory mobile:overflow-x-auto mobile:overscroll-x-contain mobile:px-5 ${fadeMask} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

type ScrollSlideProps = {
  children: ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg";
  desktopScroll?: boolean;
};

const slideWidth = {
  sm: "mobile:w-[min(72vw,16rem)]",
  md: "mobile:w-[min(78vw,20rem)]",
  lg: "mobile:w-[min(88vw,24rem)]",
};

/** Fixed-width slide that peeks the next item. Full width of the grid cell on desktop, unless desktopScroll. */
export function ScrollSlide({
  children,
  className = "",
  width = "md",
  desktopScroll = false,
}: ScrollSlideProps) {
  /* Skills: always 20rem, one row, never a fraction of the column. */
  if (desktopScroll) {
    return (
      <div className={`w-80 min-w-80 shrink-0 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`${slideWidth[width]} mobile:shrink-0 mobile:snap-start desktop:w-full desktop:min-w-0 ${className}`}
    >
      {children}
    </div>
  );
}
