type NavIconName = "Home" | "Projects" | "About" | "Visitors" | "Contact";

export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      className="nav-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "Home" ? (
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1Z" />
      ) : null}
      {name === "Projects" ? (
        <>
          <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
          <path d="m10 11-2 2 2 2m4-4 2 2-2 2" />
        </>
      ) : null}
      {name === "About" ? (
        <>
          <circle cx="12" cy="7" r="4" />
          <path d="M5 21v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v3" />
        </>
      ) : null}
      {name === "Contact" ? (
        <>
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </>
      ) : null}
      {name === "Visitors" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M7 13c2 5 8 5 10 0M8 8h.01M16 8h.01" />
        </>
      ) : null}
    </svg>
  );
}
