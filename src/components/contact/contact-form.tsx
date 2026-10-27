"use client";

import { type FormEvent, useRef, useState } from "react";
import {
  type ContactErrors,
  type ContactValues,
  submitContact,
  validateContact,
} from "@/lib/contact-form";

export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values: ContactValues = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    setStatus(null);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      form.querySelector<HTMLInputElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    busy.current = true;
    setPending(true);
    try {
      await submitContact(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT, values);
      setStatus({
        kind: "success",
        message:
          "Message sent! Thank you for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error &&
          error.name !== "TypeError" &&
          error.name !== "TimeoutError"
            ? error.message
            : "Unable to connect. Please try again or email me directly.",
      });
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  function field(
    name: keyof ContactValues,
    label: string,
    placeholder: string,
    maxLength: number,
    multiline = false,
  ) {
    const props = {
      id: `contact-${name}`,
      name,
      placeholder,
      maxLength,
      required: true,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
    return (
      <div className="form-field">
        <label htmlFor={props.id}>{label}</label>
        {multiline ? (
          <textarea
            {...props}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
        ) : (
          <input
            {...props}
            type={name === "email" ? "email" : "text"}
            autoComplete={
              name === "name" || name === "email" ? name : undefined
            }
          />
        )}
        {errors[name] && (
          <p className="field-error" id={`${name}-error`}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      className="contact-form"
      onSubmit={submit}
      noValidate
      aria-busy={pending}
    >
      <div className="form-pair">
        {field("name", "Name", "Full Name", 100)}
        {field("email", "Email", "email@example.com", 254)}
      </div>
      {field("subject", "Subject", "Project Inquiry", 200)}
      {field(
        "message",
        "Message",
        "Tell me about your project... (Press Ctrl+Enter to submit)",
        5000,
        true,
      )}
      <button className="submit-button" type="submit" disabled={pending}>
        {pending ? "Sending..." : "Submit Message"}
      </button>
      {status && (
        <p
          className={`form-status form-status-${status.kind}`}
          role={status.kind === "error" ? "alert" : "status"}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
