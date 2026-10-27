export type ContactIconName =
  | "email"
  | "phone"
  | "linkedin"
  | "github"
  | "resume"
  | "copy"
  | "check"
  | "arrow";

export function ContactIcon({
  name,
  size = 20,
}: {
  name: ContactIconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "email" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </>
      )}
      {name === "phone" && (
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" />
      )}
      {name === "linkedin" && (
        <>
          <rect x="3" y="9" width="4" height="12" rx=".5" />
          <circle cx="5" cy="4.5" r="2" />
          <path d="M11 21V9h4v2a4 4 0 0 1 7 3v7h-4v-7a1.5 1.5 0 0 0-3 0v7Z" />
        </>
      )}
      {name === "github" && (
        <path
          d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.3a2.9 2.9 0 0 0-.8-2.2c2.8-.3 5.8-1.4 5.8-6.4A5 5 0 0 0 18.7 6a4.6 4.6 0 0 0-.1-4s-1.1-.4-4.1 1.5a14 14 0 0 0-7 0C4.5 1.6 3.4 2 3.4 2a4.6 4.6 0 0 0-.1 4A5 5 0 0 0 2 10.1c0 5 3 6.1 5.8 6.4a2.9 2.9 0 0 0-.8 2.2V22"
          transform="translate(1 0)"
        />
      )}
      {name === "resume" && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6M8 13h8M8 17h6" />
        </>
      )}
      {name === "copy" && (
        <>
          <rect x="8" y="8" width="12" height="13" rx="2" />
          <path d="M16 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h1" />
        </>
      )}
      {name === "check" && <path d="m5 12 4 4L19 6" />}
      {name === "arrow" && <path d="M7 17 17 7M7 7h10v10" />}
    </svg>
  );
}
