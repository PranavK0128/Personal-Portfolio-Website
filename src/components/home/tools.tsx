import Image from "next/image";
import Link from "next/link";
import { featuredTools } from "@/data/about";

// Original-color Devicon assets; license retained alongside the local SVGs.
export function Tools() {
  return (
    <section className="home-tools" aria-labelledby="tools-heading">
      <h2 id="tools-heading">Tools I Build With: </h2>
      <ul className="home-tools-grid">
        {featuredTools.map((tool) => (
          <li key={tool.icon}>
            <Link
              href="/about#skills"
              className="home-tool"
              aria-label={`${tool.name} — view Skills & Tools`}
            >
              <Image
                src={`/images/technologies/${tool.icon}.svg`}
                alt=""
                width={32}
                height={32}
                className={`home-tool-icon home-tool-icon-${tool.icon}`}
              />
              <span>{tool.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
