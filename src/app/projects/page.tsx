import type { Metadata } from "next";
import { ProjectGrid } from "@/components/home/selected-projects";
import { projects } from "@/data/projects";
import "../home.css";
import "./projects.css";

export const metadata: Metadata = { title: "Projects | Pranav Kondapalli" };

export default function ProjectsPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="page-shell home-home projects-page"
    >
      <div className="projects-page-content">
        <h1>My Recent Projects I have Built:</h1>
        <ProjectGrid projects={projects} headingLevel={2} />
      </div>
    </main>
  );
}
