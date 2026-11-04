export type CaseSection = {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  points?: { title: string; text: string }[];
  visual?: string;
  caption?: string;
  additionalVisuals?: { visual: string; caption: string }[];
};

export type CaseStudy = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  overview: string[];
  links: { label: string; href: string | null }[];
  sections: CaseSection[];
};
