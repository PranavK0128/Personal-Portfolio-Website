"use client";

import { useEffect, useRef, useState } from "react";
import { ContactIcon } from "./contact-icon";

export function ContactCard({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: "email" | "phone";
}) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied`);
    } catch {
      setStatus("Copy unavailable. Please select and copy the text.");
    }
    timer.current = setTimeout(() => setStatus(""), 4000);
  }

  return (
    <div className="contact-card-wrap">
      <div className="contact-card">
        <a href={href} className="contact-card-link">
          <span className="contact-card-icon">
            <ContactIcon name={icon} />
          </span>
          <span className="contact-card-text">
            <span className="contact-card-label">{label}</span>
            <span className="contact-card-value">{value}</span>
          </span>
        </a>
        <button
          type="button"
          className="copy-button"
          onClick={copy}
          aria-label={`Copy ${label.toLowerCase()}`}
          title={`Copy ${label.toLowerCase()}`}
        >
          <ContactIcon
            name={status === `${label} copied` ? "check" : "copy"}
            size={16}
          />
        </button>
      </div>
      <span className="copy-status" role="status">
        {status}
      </span>
    </div>
  );
}
