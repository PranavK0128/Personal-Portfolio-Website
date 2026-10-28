import Image from "next/image";
import { featuredProjects, type Project } from "@/data/projects";
import { ResearchPreview } from "./research-preview";
import { OptionsPreview, PokerPreview } from "./workflow-preview";

// Decorative browser chrome, proportioned to the supplied Perry reference.
// The controls are part of the preview, not interactive browser buttons.
function BrowserChrome() {
  return (
    <svg
      className="project-browser-chrome"
      viewBox="0 0 1190 67"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="var(--browser-base)" d="M0 0h1190v67H0z" />
      <path
        fill="var(--browser-toolbar)"
        d="M0 33h58q6 0 6-6V14q0-5 6-5h140q6 0 6 5v13q0 6 6 6h968v34H0Z"
      />
      <circle cx="18" cy="18" r="4.2" fill="#ff5f57" />
      <circle cx="32" cy="18" r="4.2" fill="#ffbd2e" />
      <circle cx="46" cy="18" r="4.2" fill="#28c840" />
      <rect
        x="86"
        y="38"
        width="1044"
        height="22"
        rx="11"
        fill="var(--browser-base)"
      />
      <g
        stroke="var(--browser-icon)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M228 21h7m-3.5-3.5v7M22 48H12m4-4-4 4 4 4m22-4h10m-4-4 4 4-4 4M71 44a5 5 0 1 0 1 7m0-8v5h-5" />
        <circle cx="1150" cy="49" r="6" />
        <circle
          cx="1150"
          cy="47"
          r="1.5"
          fill="var(--browser-icon)"
          stroke="none"
        />
        <path d="M1146 53q4-5 8 0" />
      </g>
      <g fill="var(--browser-icon)">
        <circle cx="1173" cy="45" r="1" />
        <circle cx="1173" cy="49" r="1" />
        <circle cx="1173" cy="53" r="1" />
      </g>
    </svg>
  );
}

export function SelectedProjects() {
  return <ProjectGrid projects={featuredProjects} />;
}

export function ProjectGrid({
  projects,
  headingLevel = 3,
}: {
  projects: readonly Project[];
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="home-project-grid">
      {projects.map((project) => (
        <article
          className="project-outline"
          key={project.id}
          aria-labelledby={`${project.id}-title`}
        >
          <div className={`project-card project-card-${project.id}`}>
            <div className="project-visual">
              <div className="project-browser">
                <BrowserChrome />
                <div className="project-browser-content">
                  {project.id === "stackhud" ? (
                    <Image
                      src="/images/projects/stackhud-dashboard-4k.png"
                      alt="Stack Society HUD dashboard showing session totals, player statistics, and analytics"
                      fill
                      unoptimized
                      loading="eager"
                      sizes="(max-width: 899px) 90vw, (max-width: 1536px) 43vw, 640px"
                      className="project-dashboard-image"
                    />
                  ) : project.id === "pokernow-assistant" ? (
                    <PokerPreview />
                  ) : project.id === "stock-options" ? (
                    <OptionsPreview />
                  ) : (
                    <ResearchPreview />
                  )}
                </div>
              </div>
            </div>
            <div className="project-info">
              <Heading id={`${project.id}-title`}>{project.name}</Heading>
              <p>{project.description}</p>
              <ul
                className="project-technologies"
                aria-label={`${project.name} technologies and methods`}
              >
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
