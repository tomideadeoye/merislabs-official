"use client";

import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { OrionOpportunity } from '@repo/shared';
import { OpportunityPipelineCharts } from "@/app/(orion_admin)/admin/OrionOpportunity-pipeline/OpportunityPipelineCharts";

// Fetch a single OrionOpportunity from the API
async function fetchOpportunity(id: string): Promise<OrionOpportunity | null> {
  try {
    const res = await fetch(`/api/orion/OrionOpportunity/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.OrionOpportunity as OrionOpportunity;
  } catch {
    return null;
  }
}

// Fetch evaluation/AI analysis for an OrionOpportunity
async function fetchEvaluation(id: string): Promise<EvaluationOutput | null> {
  try {
    const res = await fetch(`/api/orion/OrionOpportunity/${id}/evaluation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.evaluation as EvaluationOutput;
  } catch {
    return null;
  }
}

// Fetch all opportunities for pipeline analytics
async function fetchAllOpportunities(): Promise<OrionOpportunity[]> {
  try {
    const res = await fetch("/api/orion/OrionOpportunity/list", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.opportunities as OrionOpportunity[];
  } catch {
    return [];
  }
}

export default function AnalyzePage() {
  const params = useParams() ?? {};
  const id = typeof (params as any).id === "string"
    ? (params as any).id
    : Array.isArray((params as any).id)
      ? (params as any).id[0]
      : "";
  const [OrionOpportunity, setOpportunity] = useState<OrionOpportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [profileSource, setProfileSource] = useState<string | null>(null);
  const [allOpportunities, setAllOpportunities] = useState<OrionOpportunity[]>([]);
  const [viewMode, setViewMode] = useState<"single" | "pipeline">("single");
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch evaluation with profile source and error
  async function fetchEvaluationWithSource(id: string) {
    try {
      const res = await fetch(`/api/orion/OrionOpportunity/${id}/evaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) return [null, null, null];
      const data = await res.json();
      return [data.evaluation as EvaluationOutput, data.profileSource as string, data.profileError as string | null];
    } catch {
      return [null, null, null];
    }
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      fetchOpportunity(id),
      fetchEvaluationWithSource(id),
      fetchAllOpportunities(),
    ]).then(([opp, [evalResult, profileSrc, profileErr], allOpps]) => {
      if (!mounted) return;
      setOpportunity(opp);
      // Only set if type matches
      setEvaluation(
        evalResult && typeof evalResult === "object" && "fitScorePercentage" in evalResult
          ? (evalResult as EvaluationOutput)
          : null
      );
      setProfileSource(
        typeof profileSrc === "string" ? profileSrc : null
      );
      setProfileError(
        typeof profileErr === "string" ? profileErr : null
      );
      setAllOpportunities(allOpps);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading analytics...</div>;
  }

  if (!OrionOpportunity) {
    notFound();
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>OrionOpportunity Analysis</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setViewMode("single")}
          style={{
            marginRight: 8,
            padding: "0.5rem 1rem",
            background: viewMode === "single" ? "#6366f1" : "#222",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          This OrionOpportunity
        </button>
        <button
          onClick={() => setViewMode("pipeline")}
          style={{
            padding: "0.5rem 1rem",
            background: viewMode === "pipeline" ? "#6366f1" : "#222",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Pipeline Analytics
        </button>
      </div>

      {viewMode === "single" && (
        <>
          <p>
            <strong>OrionOpportunity ID:</strong> {OrionOpportunity.id}
          </p>
          <p>
            <strong>Title:</strong> {OrionOpportunity.title}
          </p>
          <p>
            <strong>Organization:</strong> {OrionOpportunity.companyOrInstitution || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {OrionOpportunity.status}
          </p>
          <p>
            <strong>Type:</strong> {OrionOpportunity.type}
          </p>
          <p>
            <strong>Priority:</strong> {OrionOpportunity.priority}
          </p>
          <p>
            <strong>Description:</strong> {OrionOpportunity.content || "No description"}
          </p>
          <div style={{ margin: "2rem 0" }}>
            <OpportunityPipelineCharts opportunities={[OrionOpportunity]} />
          </div>
          {evaluation && (
            <div style={{ margin: "2rem 0", background: "#18181b", padding: "1rem", borderRadius: 8 }}>
              <h2>AI Evaluation</h2>
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{
                  display: "inline-block",
                  background: profileSource === "notion" ? "#22c55e" : "#f59e42",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "0.2rem 0.7rem",
                  fontSize: "0.95em",
                  fontWeight: 600,
                  marginRight: 8
                }}>
                  Profile Source: {profileSource ? profileSource.charAt(0).toUpperCase() + profileSource.slice(1) : "Unknown"}
                </span>
              </div>
              {profileError && (
                <div style={{
                  background: "#dc2626",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "0.5rem 1rem",
                  marginBottom: "1rem",
                  fontWeight: 500
                }}>
                  Profile Error: {profileError}
                </div>
              )}
              <p>
                <strong>Fit Score:</strong> {evaluation.fitScorePercentage}%
              </p>
              <p>
                <strong>Recommendation:</strong> {evaluation.recommendation}
              </p>
              <p>
                <strong>Score Explanation:</strong> {evaluation.scoreExplanation}
              </p>
              <div>
                <strong>Pros:</strong>
                <ul>
                  {evaluation.pros?.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
              </div>
              <div>
                <strong>Cons:</strong>
                <ul>
                  {evaluation.cons?.map((con, i) => <li key={i}>{con}</li>)}
                </ul>
              </div>
              <div>
                <strong>Missing Skills:</strong>
                <ul>
                  {evaluation.missingSkills?.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {viewMode === "pipeline" && (
        <div style={{ margin: "2rem 0" }}>
          <OpportunityPipelineCharts opportunities={allOpportunities} />
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h2>Suggestions for Enhanced Analytics</h2>
        <ul>
          <li>Show OrionOpportunity status and priority trends over time (timeline chart).</li>
          <li>Compare this OrionOpportunity to others in the pipeline (fit score, type, etc.).</li>
          <li>Visualize stakeholder alignment and risk as charts.</li>
          <li>Enable filtering and drill-down for related opportunities.</li>
          <li>Display a timeline of key events and status changes for this OrionOpportunity.</li>
          <li>Integrate evaluation/analysis results directly into the analytics view.</li>
        </ul>
      </div>
    </div>
  );
}
