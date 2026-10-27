import type { Metadata } from "next";
import { VisitorsBoard } from "@/components/visitors/visitors-board";
import "./visitors.css";

export const metadata: Metadata = {
  title: "Visitors | Pranav Kondapalli",
  description: "Leave a drawing and a little note on my visitors board.",
};

export default function VisitorsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell visitors-page">
      <h1 className="sr-only">Visitors</h1>
      <p className="visitors-invitation">Leave a note/drawing :)</p>
      <VisitorsBoard />
    </main>
  );
}
