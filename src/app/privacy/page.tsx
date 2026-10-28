import type { Metadata } from "next";
import Link from "next/link";
import { contact, socialLinks } from "@/data/contact";

export const metadata: Metadata = {
  title: "Privacy | Pranav Kondapalli",
  description:
    "About Pranav Kondapalli's personal portfolio and ways to get in touch.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell privacy-page">
      <article>
        <header>
          <h1>Privacy</h1>
        </header>
        <section>
          <h2>About this site</h2>
          <p>
            Hey, thanks for stopping by. This is my personal portfolio where I
            share my work and projects. You can browse without creating an
            account. I don&apos;t run ads.
          </p>
        </section>
        <section>
          <h2>Data stored and why</h2>
          <p>
            The Visitors board saves and publicly displays the name you submit,
            your note, drawing, posting time, and card position. A browser
            cookie lasting up to one year and hashed browser and IP identifiers
            help prevent spam. Temporary cursor and selection data are shared
            with other viewers for live interaction.
          </p>
          <p>
            Your theme preference is saved in your browser. Contact form
            submissions (name, email, subject, and message) are processed by
            Formspree and delivered to me so I can respond.
          </p>
        </section>
        <section>
          <h2>When you contact me</h2>
          <p>
            You can email me at{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>, connect
            with me on{" "}
            <a
              href={socialLinks[0].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            , or find me on{" "}
            <a
              href={socialLinks[1].href}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </section>
        <section>
          <h2>Questions?</h2>
          <p>
            If you have questions, concerns, or just want to say hi, email me at{" "}
            <a href={`mailto:${contact.email}`}>{contact.email}</a> or use the{" "}
            <Link href="/contact">contact form</Link>. Happy to chat.
          </p>
        </section>
      </article>
    </main>
  );
}
