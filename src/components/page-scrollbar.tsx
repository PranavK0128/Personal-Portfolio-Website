"use client";

import { useEffect, useRef } from "react";
import "./page-scrollbar.css";

// Reproduce Perry's edge scrollbar without replacing native document scrolling.
export function PageScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const root = document.documentElement;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    const highContrast = window.matchMedia("(forced-colors: active)");
    const controller = new AbortController();
    const { signal } = controller;
    let frame = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let enabled = false;
    let maxScroll = 0;
    let travel = 0;
    let thumbHeight = 0;
    let drag: { pointerId: number; grabOffset: number } | undefined;

    function sync() {
      if (!track || !thumb) return;
      const height = root.clientHeight;
      maxScroll = Math.max(0, root.scrollHeight - height);
      track.hidden = !enabled || maxScroll <= 0;
      track.tabIndex = track.hidden ? -1 : 0;
      const trackHeight = Math.max(0, height - 4);
      thumbHeight = Math.min(
        trackHeight,
        Math.max(24, (trackHeight * height) / root.scrollHeight),
      );
      travel = Math.max(0, trackHeight - thumbHeight);
      const progress = maxScroll
        ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
        : 0;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${progress * travel}px)`;
      track.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    }

    function scheduleSync() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        sync();
      });
    }

    function reveal() {
      if (!track || !enabled) return;
      track.dataset.scrolling = "true";
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        delete track.dataset.scrolling;
      }, 1500);
    }

    function onScroll() {
      reveal();
      scheduleSync();
    }

    function endDrag() {
      if (!track || !drag) return;
      const { pointerId } = drag;
      drag = undefined;
      delete track.dataset.dragging;
      if (track.hasPointerCapture(pointerId))
        track.releasePointerCapture(pointerId);
      reveal();
    }

    function updateMode() {
      enabled = desktop.matches && !highContrast.matches;
      if (enabled) root.setAttribute("data-page-scrollbar", "");
      else {
        endDrag();
        root.removeAttribute("data-page-scrollbar");
      }
      sync();
    }

    function scrollFromPointer(clientY: number, grabOffset: number) {
      if (!track || !travel) return;
      const y = clientY - track.getBoundingClientRect().top - 2 - grabOffset;
      window.scrollTo({
        top: Math.min(1, Math.max(0, y / travel)) * maxScroll,
        behavior: "instant",
      });
    }

    function onPointerDown(event: PointerEvent) {
      if (!track || !thumb || !enabled || !maxScroll || event.button !== 0)
        return;
      event.preventDefault();
      sync();
      const onThumb = event.target === thumb;
      const grabOffset = onThumb
        ? event.clientY - thumb.getBoundingClientRect().top
        : thumbHeight / 2;
      drag = { pointerId: event.pointerId, grabOffset };
      track.dataset.dragging = "true";
      track.setPointerCapture(event.pointerId);
      if (!onThumb) scrollFromPointer(event.clientY, grabOffset);
    }

    function onPointerMove(event: PointerEvent) {
      if (drag?.pointerId === event.pointerId)
        scrollFromPointer(event.clientY, drag.grabOffset);
    }

    function onKeyDown(event: KeyboardEvent) {
      let top = window.scrollY;
      switch (event.key) {
        case "ArrowDown":
          top += 40;
          break;
        case "ArrowUp":
          top -= 40;
          break;
        case "PageDown":
          top += root.clientHeight * 0.9;
          break;
        case "PageUp":
          top -= root.clientHeight * 0.9;
          break;
        case "Home":
          top = 0;
          break;
        case "End":
          top = maxScroll;
          break;
        case " ":
          top += root.clientHeight * (event.shiftKey ? -0.9 : 0.9);
          break;
        default:
          return;
      }
      event.preventDefault();
      reveal();
      window.scrollTo({
        top: Math.min(maxScroll, Math.max(0, top)),
        behavior: "instant",
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true, signal });
    window.addEventListener("resize", scheduleSync, { passive: true, signal });
    window.addEventListener("blur", endDrag, { signal });
    desktop.addEventListener("change", updateMode, { signal });
    highContrast.addEventListener("change", updateMode, { signal });
    track.addEventListener("pointerdown", onPointerDown, { signal });
    track.addEventListener("pointermove", onPointerMove, { signal });
    track.addEventListener("pointerup", endDrag, { signal });
    track.addEventListener("pointercancel", endDrag, { signal });
    track.addEventListener("lostpointercapture", endDrag, { signal });
    track.addEventListener("keydown", onKeyDown, { signal });

    // Includes route changes, fonts loading, and content expanding after load.
    const observer = new ResizeObserver(scheduleSync);
    observer.observe(document.body);
    updateMode();

    return () => {
      controller.abort();
      observer.disconnect();
      clearTimeout(hideTimer);
      cancelAnimationFrame(frame);
      root.removeAttribute("data-page-scrollbar");
      track.hidden = true;
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="page-scrollbar"
      role="scrollbar"
      aria-label="Page scroll"
      aria-controls="main-content"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      tabIndex={-1}
      hidden
    >
      <span ref={thumbRef} className="page-scrollbar-thumb" />
    </div>
  );
}
