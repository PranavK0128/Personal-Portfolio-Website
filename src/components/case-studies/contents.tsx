"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function CaseContents({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(false);
  const [menuSlot, setMenuSlot] = useState<HTMLElement | null>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    setMenuSlot(document.getElementById("project-contents-slot"));
  }, []);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent | FocusEvent) => {
      if (
        event.target instanceof Node &&
        !menu.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus({ preventScroll: true });
      }
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const resize = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = sections[0].id;
        for (const { id } of sections) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 210) current = id;
        }
        setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);
  const links = sections.map(({ id, label }, index) => (
    <a
      key={id}
      href={`#${id}`}
      style={{ "--section-index": index } as CSSProperties}
      aria-current={active === id ? "location" : undefined}
      onClick={() => {
        if (open) {
          setOpen(false);
          toggle.current?.focus({ preventScroll: true });
        }
      }}
    >
      {label}
    </a>
  ));
  return (
    <>
      <nav className="case-contents" aria-label="Project contents">
        <span>Contents</span>
        {links}
      </nav>
      {menuSlot &&
        createPortal(
          <div className="case-contents-menu" ref={menu} data-open={open}>
            <button
              type="button"
              className="case-contents-toggle"
              aria-label="Project contents"
              aria-expanded={open}
              aria-controls={panelId}
              title="Project contents"
              ref={toggle}
              onClick={() => setOpen((current) => !current)}
            >
              <span className="case-contents-icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
            <nav
              id={panelId}
              className="case-contents-panel"
              aria-label="Project sections"
              aria-hidden={!open}
              inert={!open}
            >
              <span className="case-contents-label">Contents</span>
              {links}
            </nav>
          </div>,
          menuSlot,
        )}
    </>
  );
}
