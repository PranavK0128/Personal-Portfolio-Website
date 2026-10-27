import type { Metadata } from "next";
import { ContactCard } from "@/components/contact/contact-card";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactIcon } from "@/components/contact/contact-icon";
import { contact, socialLinks } from "@/data/contact";

export const metadata: Metadata = { title: "Contact | Pranav Kondapalli" };

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell contact-page">
      <header className="contact-intro">
        <h1>Get in Touch</h1>
        <p>
          Have a project in mind or just want to say hi? I&apos;d love to hear
          from you.
        </p>
      </header>
      <div className="contact-grid">
        <section aria-labelledby="message-heading" className="message-section">
          <div className="contact-section-heading">
            <h2 id="message-heading">Send a Message</h2>
            <p>
              Fill out the form below and I&apos;ll get back to you as soon as
              possible.
            </p>
          </div>
          <ContactForm />
        </section>
        <section
          aria-labelledby="information-heading"
          className="information-section"
        >
          <div className="contact-section-heading">
            <h2 id="information-heading">Contact Information</h2>
            <p>You can also reach me through the following channels.</p>
          </div>
          <div className="contact-cards">
            <ContactCard
              label="Email"
              value={contact.email}
              href={`mailto:${contact.email}`}
              icon="email"
            />
          </div>
          <div className="contact-socials">
            <h3>Social Media</h3>
            <div className="social-links">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} (opens in a new tab)`}
                  title={item.label}
                >
                  <ContactIcon name={item.icon} />
                  <span className="social-tooltip" aria-hidden="true">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
