import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects | Pranav Kondapalli" };

export default function ProjectsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell">
      <h1 className="sr-only">Projects</h1>
    </main>
  );
}
