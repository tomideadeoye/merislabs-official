import React from "react";
import { notFound } from "next/navigation";

interface AnalyzePageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// TODO: Replace with real API call or data fetching logic
async function fetchOpportunityAnalysis(id: string) {
  // Example: fetch from an API route if available
  // const res = await fetch(`/api/orion/opportunity/${id}/evaluation`);
  // if (!res.ok) return null;
  // return await res.json();

  // Placeholder: Simulate analysis data
  if (!id) return null;
  return {
    id,
    fitScore: 82,
    stakeholderAlignment: 75,
    riskAnalysis: "Moderate",
    notes: "This is a placeholder analysis. Integrate with backend API."
  };
}

export default async function AnalyzePage({ params }: AnalyzePageProps) {
  const { id } = params;
  const analysis = await fetchOpportunityAnalysis(id);

  if (!analysis) {
    notFound();
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Opportunity Analysis</h1>
      <p>
        <strong>Opportunity ID:</strong> {analysis.id}
      </p>
      <p>
        <strong>Fit Score:</strong> {analysis.fitScore}
      </p>
      <p>
        <strong>Stakeholder Alignment:</strong> {analysis.stakeholderAlignment}
      </p>
      <p>
        <strong>Risk Analysis:</strong> {analysis.riskAnalysis}
      </p>
      <div style={{ marginTop: "1rem", color: "#888" }}>
        <em>{analysis.notes}</em>
      </div>
    </div>
  );
}
