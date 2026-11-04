import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell not-found-page">
      <h1>Page not found</h1>
      <p className="not-found-description">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <nav aria-label="Page recovery" className="not-found-actions">
        <Link href="/">Return home</Link>
        <Link href="/projects">Browse projects</Link>
      </nav>
    </main>
  );
}
