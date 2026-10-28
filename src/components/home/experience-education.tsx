import Link from "next/link";
import { ContactIcon } from "@/components/contact/contact-icon";

export function ExperienceEducation() {
  return (
    <section
      className="home-background-section"
      aria-labelledby="background-heading"
    >
      <h2 id="background-heading">Experience &amp; Education</h2>
      <div className="home-background-grid">
        <Link
          href="/about"
          className="home-background-panel"
          aria-labelledby="experience-heading"
        >
          <h3 id="experience-heading">Experience</h3>
          <ol className="home-timeline">
            {[
              [
                "Most recent role",
                "A short summary of your responsibilities, what you built, and the impact of your work will go here.",
              ],
              [
                "Previous role",
                "Highlights from an earlier internship, job, or research role will go here.",
              ],
            ].map(([title, description]) => (
              <li className="home-timeline-entry" key={title}>
                <span className="home-draft-label">Placeholder</span>
                <h4>{title}</h4>
                <p className="home-entry-meta">Organization · Dates to add</p>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </Link>
        <Link
          href="/about"
          className="home-background-panel"
          aria-labelledby="education-heading"
        >
          <h3 id="education-heading">Education</h3>
          <ol className="home-timeline">
            <li className="home-timeline-entry">
              <span className="home-entry-status">Pursuing</span>
              <h4>Graduate studies in Machine Learning</h4>
              <p className="home-entry-meta">Georgia Institute of Technology</p>
              <p>Master’s studies focused on machine learning.</p>
            </li>
            <li className="home-timeline-entry">
              <span className="home-entry-status">Graduated</span>
              <h4>BS in Computer Science</h4>
              <p className="home-entry-meta">Georgia Institute of Technology</p>
              <p>Concentrations in AI and People/Design.</p>
            </li>
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
