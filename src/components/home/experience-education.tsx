import Link from "next/link";
import { ContactIcon } from "@/components/contact/contact-icon";
import { EducationEntry } from "@/components/education-entry";
import { education, experiences } from "@/data/about";

export function ExperienceEducation() {
  return (
    <section
      id="experience-education"
      tabIndex={-1}
      className="home-background-section"
      aria-labelledby="background-heading"
    >
      <h2 id="background-heading">Experience &amp; Education</h2>
      <div className="home-background-grid">
        <Link
          href="/about#experience"
          className="home-background-panel"
          aria-labelledby="experience-heading"
        >
          <h3 id="experience-heading">Experience</h3>
          <ol className="home-timeline">
            {experiences.slice(0, 3).map((entry) => (
              <li className="home-timeline-entry" key={entry.id}>
                <h4>{entry.role}</h4>
                <p className="home-entry-organization">{entry.organization}</p>
                <p className="home-entry-meta">{entry.dates}</p>
                <p>{entry.summary}</p>
              </li>
            ))}
          </ol>
        </Link>
        <Link
          href="/about#education"
          className="home-background-panel"
          aria-labelledby="education-heading"
        >
          <h3 id="education-heading">Education</h3>
          <ol className="home-education-list">
            {education.map((entry) => (
              <li key={entry.degree}>
                <EducationEntry entry={entry} headingLevel="h4" />
              </li>
            ))}
          </ol>
        </Link>
      </div>
      <div className="home-projects-action">
        <Link href="/about" className="home-projects-button">
          More About Me <ContactIcon name="arrow" size={18} />
        </Link>
      </div>
    </section>
  );
}
