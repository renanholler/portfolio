"use client";

import { MapPin } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

const CHAR_MS = 18;
const TARGET_MS = 640;
const MAX_MS = 800;

type Mode = "idle" | "wait" | "type";

type Clock = {
  id: number;
  mode: Mode;
  startedAt: number;
  frame: number;
};

const IDLE: Clock = { id: 0, mode: "idle", startedAt: 0, frame: 0 };

let clock: Clock = IDLE;
let loopId = 0;
const listeners = new Set<() => void>();
const settledText = new Map<string, string>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function reducedNow() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function beginTyping() {
  const id = clock.id;
  loopId += 1;
  const token = loopId;
  clock = { id, mode: "type", startedAt: performance.now(), frame: 0 };
  emit();

  const loop = () => {
    if (token !== loopId || clock.id !== id || clock.mode !== "type") return;
    if (performance.now() - clock.startedAt >= TARGET_MS) {
      clock = { id, mode: "idle", startedAt: 0, frame: 0 };
      emit();
      return;
    }
    clock = { ...clock, frame: clock.frame + 1 };
    emit();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

export function startLocaleSequence() {
  if (reducedNow()) {
    clock = { id: clock.id + 1, mode: "idle", startedAt: 0, frame: 0 };
    emit();
    return;
  }
  clock = { id: clock.id + 1, mode: "wait", startedAt: 0, frame: 0 };
  emit();
}

export function markLocaleArrived() {
  if (clock.mode !== "wait") return;
  if (reducedNow()) {
    clock = { ...clock, mode: "idle" };
    emit();
    return;
  }
  beginTyping();
}

function useLocaleClock() {
  return useSyncExternalStore(subscribe, () => clock, () => IDLE);
}

/** Short lines type character by character and finish within 500–700ms.
 *  Longer copy uses the same window, in batches, and never runs past 800ms. */
export function typedCount(length: number, elapsed: number) {
  if (length <= 0) return 0;
  const duration = Math.min(MAX_MS, Math.max(length * CHAR_MS, 1));
  const capped = duration > TARGET_MS ? TARGET_MS : duration;
  const progress = Math.min(1, Math.max(0, elapsed) / capped);
  return Math.min(length, Math.max(1, Math.ceil(progress * length)));
}

type TagName = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";

export function LocaleFade({
  fadeKey,
  text,
  children,
  className,
  as = "span",
  id,
  block = false,
}: {
  fadeKey: string;
  text: string;
  children?: ReactNode | ((label: string) => ReactNode);
  className?: string;
  as?: TagName;
  id?: string;
  block?: boolean;
}) {
  const prefersReduce = useReducedMotion() === true || reducedNow();
  const current = useLocaleClock();
  const typing = !prefersReduce && current.mode === "type";
  const waiting = !prefersReduce && current.mode === "wait";
  const renderLabel = typeof children === "function";
  const previous = settledText.get(fadeKey);
  const unchanged = previous === undefined || previous === text;
  const elapsed = typing ? performance.now() - current.startedAt : 0;
  const count = typing && !unchanged ? typedCount(text.length, elapsed) : text.length;
  const partial = text.slice(0, count);
  const label = waiting && previous !== undefined ? previous : partial;
  const done = !typing || unchanged || count >= text.length;

  if (!typing && !waiting) settledText.set(fadeKey, text);

  const shown = renderLabel
    ? (children as (label: string) => ReactNode)(done && !waiting ? text : label)
    : done && !waiting
      ? (children ?? text)
      : label;

  const layout = as === "span" && !block ? "inline" : "block";
  const classes = [layout === "block" && as === "span" ? "block" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  const props = {
    id,
    className: classes || undefined,
    "data-locale-typing": typing && !unchanged && !done ? "" : undefined,
  };

  if (as === "p") return <p {...props}>{shown}</p>;
  if (as === "h1") return <h1 {...props}>{shown}</h1>;
  if (as === "h2") return <h2 {...props}>{shown}</h2>;
  if (as === "h3") return <h3 {...props}>{shown}</h3>;
  if (as === "h4") return <h4 {...props}>{shown}</h4>;
  if (as === "div") return <div {...props}>{shown}</div>;
  return <span {...props}>{shown}</span>;
}

export function LocationLine({ text }: { text: string }) {
  return (
    <LocaleFade
      as="p"
      fadeKey="hero-location"
      text={text}
      className="mt-4 inline-flex items-center gap-2 text-fine-print text-muted-foreground"
    >
      {(label) => (
        <>
          <MapPin className="size-3.5" />
          {label}
        </>
      )}
    </LocaleFade>
  );
}
