import type { Metadata } from "next";
import Image from "next/image";
import { EducationEntry } from "@/components/education-entry";
import { education, experiences, skillGroups } from "@/data/about";
import "./about.css";

export const metadata: Metadata = {
  title: "About | Pranav Kondapalli",
  description:
    "Get to know Pranav Kondapalli: Georgia Tech studies, machine learning interests, experience, and tools used to build useful software.",
};

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell about-page">
      <section className="about-intro" aria-labelledby="about-heading">
        <h1 id="about-heading">A little about me</h1>
        <div className="about-story">
          <p>
            Hello! I&apos;m Pranav, a passionate Software Engineer and current
            student at Georgia Tech pursuing my master&apos;s. I have a strong
            foundation in building applications, machine learning, and AI.
          </p>
          <p>
            I specialize in full-stack development and applied machine learning.
            A lot of my projects come from my interests in poker and finance. I
            like having a question to work through, then building the software
            to explore it. Sometimes that means training a model; other times,
            it&apos;s building a dashboard or automating a task. I enjoy working
            on both the backend and the interface, and I want the things I build
            to be easy for someone else to pick up and use.
          </p>
          <p>
            Outside of swe, I love to watch sports (boxing, ufc, soccer), read
            sci-fi and fantasy books, and occasionally play random video games.
          </p>
        </div>
      </section>

      <section
        id="education"
        tabIndex={-1}
        className="about-section"
        aria-labelledby="education-heading"
      >
        <h2 id="education-heading">Education</h2>
        <div className="about-education-grid">
          {education.map((entry) => (
            <article className="about-education-card" key={entry.degree}>
              <EducationEntry entry={entry} />
            </article>
          ))}
        </div>
      </section>

      <section
        id="experience"
        tabIndex={-1}
        className="about-section"
        aria-labelledby="experience-heading"
      >
        <h2 id="experience-heading">Work Experience</h2>
        <ol className="about-experience-list">
          {experiences.map((entry) => (
            <li className="about-experience-row" key={entry.id}>
              <div className="about-experience-details">
                <div className="about-experience-heading">
                  <h3>{entry.role}</h3>
                  <span className="about-experience-dates">{entry.dates}</span>
                </div>
                <p className="about-experience-organization">
                  {entry.organization}
                </p>
                <p className="about-experience-meta">{entry.location}</p>
                <ul className="about-experience-bullets">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="skills"
        tabIndex={-1}
        className="about-section"
        aria-labelledby="skills-heading"
      >
        <h2 id="skills-heading">Skills &amp; Tools</h2>
        <p className="about-section-description">
          Technologies I use across my projects, research, and internships.
        </p>
        <div className="about-skills-grid">
          {skillGroups.map((group) => (
            <div className="about-skill-group" key={group.name}>
              <h3>{group.name}</h3>
              <ul className="about-tool-list">
                {group.tools.map((tool) => (
                  <li className="about-tool" key={tool.name}>
                    {tool.icon && (
                      <Image
                        src={`/images/technologies/${tool.icon}.${tool.format ?? "svg"}`}
                        alt=""
                        width={
                          tool.icon === "oracle" || tool.icon === "xgboost"
                            ? 40
                            : 28
                        }
                        height={28}
                        className={`about-tool-icon about-tool-icon-${tool.icon}`}
                      />
                    )}
                    <span>{tool.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
