"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { navigation, profile } from "@/data/navigation";
import { NavIcon } from "./nav-icon";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const activeIndex = navigation.findIndex(({ href }) =>
    href === "/" ? pathname === href : pathname.startsWith(href),
  );

  return (
    <header className="site-header">
      <Link
        href="/"
        className="site-identity"
        aria-label={`${profile.name}, home`}
      >
        <span className="site-name">{profile.name}</span>
        <span className="site-role">{profile.role}</span>
      </Link>
      <nav
        aria-label="Primary navigation"
        className="nav-pill"
        style={
          {
            "--active-index": activeIndex,
            "--nav-count": navigation.length,
          } as CSSProperties
        }
      >
        {activeIndex >= 0 ? (
          <span className="nav-indicator" aria-hidden="true">
            <span className="nav-glow" />
          </span>
        ) : null}
        {navigation.map(({ href, label }, index) => (
          <Link
            key={href}
            href={href}
            className="nav-link"
            aria-current={index === activeIndex ? "page" : undefined}
          >
            <NavIcon name={label} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <ThemeToggle />
    </header>
  );
}
