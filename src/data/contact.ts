export const contact = {
  email: "PranavK0128@gmail.com",
};

export const resumeLink = {
  label: "Resume",
  icon: "resume",
  href: "/documents/resume.pdf",
} as const;

export const socialLinks = [
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/in/pranav-kondapalli/",
  },
  { label: "GitHub", icon: "github", href: "https://github.com/PranavK0128" },
  resumeLink,
] as const;
