import Image from "next/image";

// Original-color Devicon assets: https://github.com/devicons/devicon
// License retained alongside the local SVGs.
const tools = [
  { name: "Python", icon: "python" },
  { name: "TypeScript", icon: "typescript" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "PyTorch", icon: "pytorch" },
  { name: "scikit-learn", icon: "scikitlearn" },
  { name: "Docker", icon: "docker" },
  { name: "PostgreSQL", icon: "postgresql" },
] as const;

export function Tools() {
  return (
    <section className="home-tools" aria-labelledby="tools-heading">
      <h2 id="tools-heading">Tools I build with</h2>
      <ul className="home-tools-grid">
        {tools.map((tool) => (
          <li key={tool.icon} className="home-tool">
            <Image
              src={`/images/technologies/${tool.icon}.svg`}
              alt=""
              width={32}
              height={32}
              className={`home-tool-icon home-tool-icon-${tool.icon}`}
            />
            <span>{tool.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
