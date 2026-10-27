import type { Metadata } from "next";

export const metadata: Metadata = { title: "About | Pranav Kondapalli" };

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <h1 className="sr-only">About</h1>
    </main>
  );
}
