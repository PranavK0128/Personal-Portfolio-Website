import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { CaseContents } from "@/components/case-studies/contents";
import { CaseVisual } from "@/components/case-studies/visuals";
import { caseStudies } from "@/data/case-studies";
import "./case-study.css";
import "./architecture.css";
import "./research-charts.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return caseStudies.map(({ id }) => ({ slug: id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudies.find((p) => p.id === slug);
  return {
    title: project
      ? `${project.title} | Pranav Kondapalli`
      : "Project not found",
    description: project?.overview[0],
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = caseStudies.find((p) => p.id === slug);
  if (!project) notFound();
  const next =
    caseStudies[(caseStudies.indexOf(project) + 1) % caseStudies.length];
  const contents = [
    { id: "overview", label: "Overview" },
    ...project.sections.map(({ id, label }) => ({ id, label })),
  ];
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`page-shell case-page case-${project.id}`}
      style={{ "--case-accent-dark": project.accent } as CSSProperties}
    >
      <Link href="/projects" className="case-back">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 5-7 7 7 7M5 12h15" />
        </svg>
        All projects
      </Link>
      <CaseContents sections={contents} />
      <header className="case-hero">
        <h1>{project.title}</h1>
        <p>{project.subtitle}</p>
        <div className="case-hero-visual">
          <CaseVisual name={`${project.id}-hero`} />
        </div>
        {project.id === "stackhud" && (
          <p className="case-diagram-note">
            Product screenshot. Displayed figures reflect the captured dataset.
          </p>
        )}
      </header>
      <div className="case-body">
        <section
          id="overview"
          className="case-section case-overview"
          aria-labelledby="overview-title"
        >
          <div className="case-overline">Overview</div>
          <h2 id="overview-title" className="sr-only">
            Overview
          </h2>
          <div className="case-overview-copy">
            {project.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="case-links">
            {project.links.map((link) =>
              link.href ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 18 18 6M6 6h12v12" />
                  </svg>
                </a>
              ) : (
                <span key={link.label} className="case-link-unavailable">
                  {link.label}
                </span>
              ),
            )}
          </div>
        </section>
        {project.sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="case-section"
            aria-labelledby={`${section.id}-title`}
          >
            <div className="case-overline">
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.label}
            </div>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <div className="case-editorial">
              <h3>{section.subtitle ?? section.label}</h3>
              <div className="case-prose">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            {section.points && (
              <div className="case-points">
                {section.points.map((point, i) => (
                  <div key={point.title}>
                    <span className="case-point-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3>{point.title}</h3>
                    <p>{point.text}</p>
                  </div>
                ))}
              </div>
            )}
            {section.visual && (
              <figure className="case-figure">
                <CaseVisual name={section.visual} />
                <figcaption>{section.caption}</figcaption>
              </figure>
            )}
            {section.additionalVisuals?.map(({ visual, caption }) => (
              <figure className="case-figure" key={visual}>
                <CaseVisual name={visual} />
                <figcaption>{caption}</figcaption>
              </figure>
            ))}
          </section>
        ))}
        <Link className="case-next" href={`/projects/${next.id}`}>
          <span>Next project</span>
          <strong>{next.title}</strong>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h16m-7-7 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
