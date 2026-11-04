import Image from "next/image";
import type { education } from "@/data/about";
import "./education-entry.css";

export function EducationEntry({
  entry,
  headingLevel = "h3",
}: {
  entry: (typeof education)[number];
  headingLevel?: "h3" | "h4";
}) {
  const Heading = headingLevel;
  return (
    <div className="education-entry">
      <div className="education-logo">
        <Image src="/images/georgia-tech.png" alt="" width={36} height={36} />
      </div>
      <div className="education-copy">
        <div className="education-heading">
          <Heading>{entry.institution}</Heading>
          <span className="education-date">{entry.date}</span>
        </div>
        <p className="education-degree">{entry.degree}</p>
        {entry.detail && <p className="education-detail">{entry.detail}</p>}
      </div>
    </div>
  );
}
