"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const replayUrl = "/demos/stackhud/replay.html?v=7";

function measureReplay(frame: HTMLIFrameElement | null) {
  if (!frame) return;
  frame.contentWindow?.postMessage(
    { type: "stackhud-demo-measure" },
    window.location.origin,
  );
}

export function StackComparison() {
  const [selected, setSelected] = useState(0);
  const views = [
    {
      label: "Comparison results",
      image: "comparison-detail",
      alt: "Actual StackHUD comparison of sb, tiger, and Jh, showing hand counts, financial results, preflop statistics, continuation bets, and opportunities",
    },
    {
      label: "Player selection",
      image: "comparison-selection",
      alt: "Actual StackHUD player selection table with sb, tiger, and Jh selected for comparison",
    },
  ];
  const view = views[selected];
  const src = `/images/case-studies/${view.image}.webp`;
  return (
    <div>
      <fieldset
        className="case-controls"
        aria-label="Player comparison screenshots"
      >
        {views.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {label}
          </button>
        ))}
      </fieldset>
      <a
        className="case-screenshot"
        href={src}
        target="_blank"
        rel="noreferrer"
        aria-label={`${view.alt}. Open full-size image in a new tab`}
      >
        <Image
          src={src}
          alt={view.alt}
          width={selected === 0 ? 2092 : 2752}
          height={selected === 0 ? 2104 : 934}
          unoptimized
        />
        <span className="case-image-hint">View full size ↗</span>
      </a>
    </div>
  );
}

export function StackReplay() {
  const frame = useRef<HTMLIFrameElement>(null);
  const configured = useRef(false);
  const [height, setHeight] = useState(850);
  useEffect(() => {
    configured.current = false;
    const resize = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.current?.contentWindow
      )
        return;
      if (
        event.data?.type !== "stackhud-demo-height" ||
        typeof event.data.height !== "number" ||
        !Number.isFinite(event.data.height)
      )
        return;
      setHeight(
        Math.ceil(Math.max(280, Math.min(2000, event.data.height))) + 2,
      );
      // The child's first report confirms its listener is ready. Complete the
      // handshake here because the load event can precede the child's effect.
      if (!configured.current) {
        configured.current = true;
        measureReplay(frame.current);
      }
    };
    window.addEventListener("message", resize);
    // The iframe can finish loading before hydration or a hot refresh attaches
    // this listener. Ask for its current height instead of missing that update.
    const measure = () => measureReplay(frame.current);
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("message", resize);
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <div className="case-replay-demo">
      <div className="case-replay-toolbar">
        <span>9 players · Single board · $8,083 final pot</span>
        <a href={replayUrl} target="_blank" rel="noreferrer">
          Open larger replay ↗
        </a>
      </div>
      <iframe
        ref={frame}
        src={replayUrl}
        title="StackHUD interactive replay of a real nine-player, single-board hand"
        loading="lazy"
        height={height}
        onLoad={() => {
          configured.current = false;
          measureReplay(frame.current);
        }}
      />
      <p className="case-diagram-note">
        Drag the timeline and select an action. Arrows step through the hand;
        double arrows jump to the start or showdown.
      </p>
    </div>
  );
}
