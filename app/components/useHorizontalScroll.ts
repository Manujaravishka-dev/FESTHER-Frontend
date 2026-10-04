"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Shared horizontal-scroll behavior.
 *
 * - Native browser scrolling handles touchpad two-finger swipes and
 *   mobile one-finger swipes (no JS needed, no wheel hijacking).
 * - This hook only adds: arrow navigation (scrollBy one step) and
 *   mouse-only click-and-drag scrolling.
 * - Touch / pen pointers are intentionally left alone so the browser
 *   performs native panning.
 */
export function useHorizontalScroll(step?: () => number) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const stepPx = useCallback(() => {
    const el = ref.current;
    if (!el) return 320;
    if (step) {
      const s = step();
      if (s > 0) return s;
    }
    const first = el.querySelector<HTMLElement>(":scope > *");
    if (first) {
      const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
      return first.getBoundingClientRect().width + gap;
    }
    return Math.max(240, el.clientWidth * 0.8);
  }, [step]);

  const prev = useCallback(() => {
    ref.current?.scrollBy({ left: -stepPx(), behavior: "smooth" });
  }, [stepPx]);

  const next = useCallback(() => {
    ref.current?.scrollBy({ left: stepPx(), behavior: "smooth" });
  }, [stepPx]);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    // Mouse only — touch/pen use native scrolling.
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    setDragging(true);
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || e.pointerType !== "mouse") return;
    // Only start moving after a small threshold so clicks still work.
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) {
      e.currentTarget.scrollLeft = drag.current.left - dx;
    }
  }, []);

  const endDrag = useCallback(() => {
    drag.current = null;
    setDragging(false);
  }, []);

  return { ref, dragging, prev, next, onPointerDown, onPointerMove, endDrag };
}
