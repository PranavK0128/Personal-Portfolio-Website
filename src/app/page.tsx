import Link from "next/link";
import { ContactIcon } from "@/components/contact/contact-icon";
import { ExperienceEducation } from "@/components/home/experience-education";
import { SelectedProjects } from "@/components/home/selected-projects";
import { Tools } from "@/components/home/tools";
import { contact, resumeLink, socialLinks } from "@/data/contact";
import "./home.css";

function DownArrow({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 4v24M6 18l10 10 10-10" />
    </svg>
  );
}

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className={`page-shell home-home`}>
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-window-outline">
          <div className="home-window">
            <div className="home-toolbar" aria-hidden="true">
              <div className="home-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="home-plus">+</span>
            </div>
            <div className="home-content">
              <h1 id="hero-heading" className="home-heading">
                <span>Hi, I&rsquo;m Pranav</span>
                <span>Software Engineer</span>
              </h1>
              <p className="home-description">
                CS student at Georgia Tech studying artificial intelligence. In
                my free time I love building useful tools, turning random ideas
                into fun projects, and reading.
              </p>
              <div className="home-actions">
                <Link href="/projects" className="home-primary">
                  View Projects <ContactIcon name="arrow" size={20} />
                </Link>
                <Link href="/about" className="home-secondary">
                  About Me
                </Link>
              </div>
              <div className="home-socials">
                {socialLinks
                  .filter((item) => item.icon !== "resume")
                  .map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ContactIcon name={item.icon} size={22} />
                      {item.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                <Link href="/contact">
                  <ContactIcon name="email" size={22} />
                  Contact
                </Link>
                <a
                  href={resumeLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ContactIcon name="resume" size={22} />
                  Resume
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
              <a
                className="home-scroll-cue"
                href="#experience-education"
                aria-label="Scroll to experience and education"
              >
                <DownArrow size={36} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <ExperienceEducation />
      <section
        id="featured-projects"
        tabIndex={-1}
        className="home-projects-intro"
        aria-labelledby="projects-heading"
      >
        <div className="home-projects-header">
          <h2 id="projects-heading">Featured Projects</h2>
        </div>
        <SelectedProjects />
        <div className="home-projects-action">
          <Link href="/projects" className="home-projects-button">
            View All Projects <ContactIcon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <Tools />
      <section className="home-contact" aria-labelledby="home-contact-heading">
        <div className="home-contact-panel">
          <h2 id="home-contact-heading">Have something in mind?</h2>
          <p>
            Have an opportunity, a project idea, or just want to say hi?
            I&rsquo;d love to hear from you.
          </p>
          <div className="home-contact-actions">
            <Link href="/contact" className="home-projects-button">
              Get in Touch <ContactIcon name="arrow" size={18} />
            </Link>
            <a href={`mailto:${contact.email}`} className="home-contact-email">
              <ContactIcon name="email" size={20} />
              {contact.email}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
