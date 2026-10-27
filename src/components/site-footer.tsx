import Link from "next/link";
import { socialLinks } from "@/data/contact";
import { footerNavigation, profile } from "@/data/navigation";
import { ContactIcon } from "./contact/contact-icon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-groups">
        <nav aria-labelledby="footer-main-heading" className="footer-group">
          <h2 id="footer-main-heading">Main</h2>
          <div className="footer-main-links">
            {footerNavigation.map((column) => (
              <div className="footer-link-column" key={column[0].href}>
                {column.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </nav>
        <nav aria-labelledby="footer-contact-heading" className="footer-group">
          <h2 id="footer-contact-heading">Contact</h2>
          <div className="footer-contact-links">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ContactIcon name={item.icon} size={18} />
                <span>{item.label}</span>
                <span className="footer-arrow">
                  <ContactIcon name="arrow" size={14} />
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
      <p className="footer-copyright">
        © {new Date().getFullYear()} {profile.name}. All rights reserved.
        <span className="copyright-privacy">
          <span aria-hidden="true"> | </span>
          <Link href="/privacy">privacy</Link>
        </span>
      </p>
    </footer>
  );
}
