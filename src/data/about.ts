// Sourced from the current resume. Graduation dates do not imply start dates.
export const education = [
  {
    degree: "M.S. Computer Science: Artificial Intelligence",
    institution: "Georgia Institute of Technology",
    date: "Expected Dec 2027",
    detail: "Currently pursuing",
  },
  {
    degree: "B.S. Computer Science",
    institution: "Georgia Institute of Technology",
    date: "May 2026",
    detail: "",
  },
] as const;

export const experiences = [
  {
    id: "florida-commerce",
    role: "Software Engineer Intern",
    organization: "Florida Department of Commerce",
    dates: "May 2025 \u2013 Sep 2025",
    location: "Tallahassee, Florida",
    summary:
      "Automated SQL reporting and streamlined claimant-record retrieval.",
    bullets: [
      "Automated SQL retrieval for daily team reporting, reducing spreadsheet preparation time by 50\u201375% and saving 30\u201345 minutes a day.",
      "Developed Oracle SQL queries to retrieve claimant records for information requests, cutting ticket-processing time by 40%.",
    ],
  },
  {
    id: "georgia-tech-research",
    role: "Undergraduate Researcher",
    organization: "Georgia Institute of Technology",
    dates: "Aug 2024 \u2013 Dec 2025",
    location: "Atlanta, Georgia",
    summary:
      "Led a finance research group exploring reinforcement learning for portfolio management.",
    bullets: [
      "Led the finance research group in developing DQN and DDPG portfolio-management models with Python and TensorFlow, using experience replay, target networks, and cost-aware reward functions.",
      "In simulations, the group\u2019s DQN model improved returns by 7% versus a market-long baseline, while DDPG reduced portfolio volatility by 30%.",
    ],
  },
  {
    id: "amg-2024",
    role: "Software Engineer Intern",
    organization: "AMG Invest",
    dates: "May 2024 \u2013 Sep 2024",
    location: "Houston, Texas",
    summary:
      "Built investment dashboards and interactive visualizations for 100+ traded stocks.",
    bullets: [
      "Developed and deployed Next.js/React dashboards for 100+ traded stocks, helping investors run trading algorithms, review results, and monitor performance; automated updates and deployments through CI/CD pipelines.",
      "Created interactive D3.js and Highcharts.js visualizations for stock performance, algorithm outputs, and trading results.",
      "Integrated client-provided REST APIs for stock and algorithm data, reducing retrieval and loading time by 17.5%.",
    ],
  },
  {
    id: "amg-2023",
    role: "Software Engineer Intern",
    organization: "AMG Invest",
    dates: "May 2023 \u2013 Aug 2023",
    location: "Houston, Texas",
    summary:
      "Built a full-stack investment application with user management and AWS services.",
    bullets: [
      "Led the design and development of a full-stack Next.js/React application for 15+ investors to execute trading algorithms, analyze results, and track performance; deployed it on AWS Amplify.",
      "Implemented authentication and user management with NextAuth.js, Prisma, and MongoDB, and integrated AWS Lambda, S3, and DynamoDB for investor-data workflows.",
    ],
  },
] as const;

export const featuredTools = [
  { name: "Python", icon: "python" },
  { name: "TypeScript", icon: "typescript" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Node.js", icon: "nodejs" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "PyTorch", icon: "pytorch" },
  { name: "scikit-learn", icon: "scikitlearn" },
] as const;

type Tool = { name: string; icon: string; format?: "png" };
export const skillGroups: readonly { name: string; tools: readonly Tool[] }[] =
  [
    {
      name: "Languages",
      tools: [
        { name: "Python", icon: "python" },
        { name: "Java", icon: "java" },
        { name: "JavaScript", icon: "javascript" },
        { name: "TypeScript", icon: "typescript" },
        { name: "SQL", icon: "sql" },
        { name: "HTML", icon: "html5" },
        { name: "CSS", icon: "css3" },
      ],
    },
    {
      name: "Web & application development",
      tools: [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "nextdotjs" },
        { name: "Node.js", icon: "nodejs" },
        { name: "Fastify", icon: "fastify" },
        { name: "Tailwind CSS", icon: "tailwindcss" },
        { name: "NextAuth.js", icon: "nextauth", format: "png" },
        { name: "REST APIs", icon: "rest-api" },
        { name: "D3.js", icon: "d3js" },
        { name: "Highcharts.js", icon: "highcharts" },
      ],
    },
    {
      name: "Machine learning & data",
      tools: [
        { name: "PyTorch", icon: "pytorch" },
        { name: "TensorFlow", icon: "tensorflow" },
        { name: "scikit-learn", icon: "scikitlearn" },
        { name: "Hugging Face Transformers", icon: "huggingface" },
        { name: "DistilBERT", icon: "huggingface" },
        { name: "pandas", icon: "pandas" },
        { name: "NumPy", icon: "numpy" },
        { name: "LightGBM", icon: "lightgbm" },
        { name: "XGBoost", icon: "xgboost", format: "png" },
        { name: "CatBoost", icon: "catboost", format: "png" },
      ],
    },
    {
      name: "Databases & storage",
      tools: [
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "MongoDB", icon: "mongodb" },
        { name: "Oracle", icon: "oracle" },
        { name: "Prisma", icon: "prisma" },
        { name: "Firebase", icon: "firebase" },
        { name: "DynamoDB", icon: "dynamodb" },
        { name: "Amazon S3", icon: "aws-s3" },
      ],
    },
    {
      name: "Cloud & deployment",
      tools: [
        { name: "AWS", icon: "amazonwebservices" },
        { name: "AWS Amplify", icon: "aws-amplify" },
        { name: "AWS Lambda", icon: "aws-lambda" },
        { name: "DigitalOcean", icon: "digitalocean" },
        { name: "Docker", icon: "docker" },
        { name: "CI/CD", icon: "cicd" },
      ],
    },
    {
      name: "Development & testing",
      tools: [
        { name: "Git", icon: "git" },
        { name: "GitHub", icon: "github" },
        { name: "Playwright", icon: "playwright" },
      ],
    },
  ];
