"use client";

import { useEffect, useRef, useState } from "react";

export function CaseContents({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState("overview");
  const menu = useRef<HTMLDetailsElement>(null);
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
  const links = sections.map(({ id, label }) => (
    <a
      key={id}
      href={`#${id}`}
      aria-current={active === id ? "location" : undefined}
      onClick={() => {
        if (menu.current) menu.current.open = false;
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
      <details className="case-mobile-contents" ref={menu}>
        <summary>
          Contents <span>{sections.find((s) => s.id === active)?.label}</span>
        </summary>
        <nav aria-label="Project sections">{links}</nav>
      </details>
    </>
  );
}
