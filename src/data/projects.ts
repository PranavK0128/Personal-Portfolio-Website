export type Project = {
  id:
    | "stackhud"
    | "prompt-compression"
    | "pokernow-assistant"
    | "stock-options";
  name: string;
  description: string;
  technologies: readonly string[];
};

// Copy checked against the public project READMEs and the local QQQ research
// closeout on October 28, 2026. Research previews describe workflows, not live results.
export const projects: readonly Project[] = [
  {
    id: "stackhud",
    name: "Stack Society HUD",
    description:
      "A PokerNow analytics platform for exploring sessions, replaying hands, and understanding player tendencies.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "Docker",
    ],
  },
  {
    id: "prompt-compression",
    name: "Prompt Compression",
    description:
      "An NLP study exploring how shorter prompts affect text classification accuracy, input length, and inference cost.",
    technologies: [
      "Python",
      "PyTorch",
      "Transformers",
      "DistilBERT",
      "scikit-learn",
      "pandas",
      "NumPy",
      "IDF Compression",
      "Learned Compression",
    ],
  },
  {
    id: "pokernow-assistant",
    name: "PokerNow Deep Learning Assistant",
    description:
      "A poker decision-support tool combining CFR+/DCFR strategies, legal-action checks, and opponent-model diagnostics to help players evaluate their next move.",
    technologies: [
      "Python",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Playwright",
      "scikit-learn",
      "pandas",
      "NumPy",
      "LightGBM",
      "XGBoost",
      "CatBoost",
      "Extra Trees",
      "CFR+",
      "DCFR",
    ],
  },
  {
    id: "stock-options",
    name: "Stock Options Training Models",
    description:
      "A QQQ options research pipeline for training models, evaluating forecasts chronologically, and comparing strategies with transaction costs and account constraints.",
    technologies: [
      "Python",
      "PyTorch",
      "scikit-learn",
      "pandas",
      "NumPy",
      "Ridge Regression",
      "Decision Trees",
      "Two-Part Neural Networks",
    ],
  },
];

export const featuredProjects = projects.slice(0, 2);
