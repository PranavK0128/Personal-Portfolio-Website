export const profile = {
  name: "Pranav Kondapalli",
  role: "Software Engineer",
};

const pages = {
  home: { label: "Home", href: "/" },
  projects: { label: "Projects", href: "/projects" },
  about: { label: "About", href: "/about" },
  contact: { label: "Contact", href: "/contact" },
  visitors: { label: "Visitors", href: "/visitors" },
} as const;

export const navigation = [
  pages.home,
  pages.projects,
  pages.about,
  pages.contact,
  pages.visitors,
] as const;

export const footerNavigation = [
  [pages.home, pages.about, pages.projects],
  [pages.visitors, pages.contact],
] as const;
