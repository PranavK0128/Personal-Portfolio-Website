import type { Metadata } from "next";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pranav Kondapalli | Software Engineer",
  description: "Pranav Kondapalli's personal portfolio website.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Static bootstrap with no user-controlled content restores the theme before paint.
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("portfolio-theme-v1")==="light")document.documentElement.dataset.theme="light"}catch{}`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
