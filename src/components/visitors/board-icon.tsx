export type BoardIconName =
  | "grid"
  | "move"
  | "plus"
  | "shuffle"
  | "undo"
  | "redo"
  | "eraser"
  | "trash"
  | "size"
  | "close";
export function BoardIcon({ name }: { name: BoardIconName }) {
  const paths: Record<BoardIconName, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    move: (
      <>
        <path d="M10 20H4V4h16v6M12 12l3 10 2-5 5-2Z" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    shuffle: (
      <>
        <path d="M20 4v6h-6M4 20v-6h6M5 9a8 8 0 0 1 13-5l2 2M4 18l2 2a8 8 0 0 0 13-5" />
      </>
    ),
    undo: <path d="m8 4-5 5 5 5M3 9h11a7 7 0 0 1 7 7v4" />,
    redo: <path d="m16 4 5 5-5 5M21 9H10a7 7 0 0 0-7 7v4" />,
    eraser: (
      <>
        <path d="m3 14 10-10a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-9 9H8l-5-4a2 2 0 0 1 0-3ZM8 9l9 9M12 21h10" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
      </>
    ),
    size: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
