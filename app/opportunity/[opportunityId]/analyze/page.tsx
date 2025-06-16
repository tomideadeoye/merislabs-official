'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { EvaluationOutput, OrionOpportunity } from '@repo/shared';

import { CardContent } from '@/ui/components/ui';
import { OpportunityPipelineCharts } from '../../../(orion_admin)/admin/opportunity-pipeline/OpportunityPipelineCharts';

// Fetch a single OrionOpportunity from the API
async function fetchOpportunity(id: string): Promise<OrionOpportunity | null> {
  try {
    const res = await fetch(`/api/orion/OrionOpportunity/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.OrionOpportunity as OrionOpportunity;
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return null;
  }
}

// Fetch all opportunities for pipeline analytics
async function fetchAllOpportunities(): Promise<OrionOpportunity[]> {
  try {
    const res = await fetch('/api/orion/OrionOpportunity/list', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.opportunities as OrionOpportunity[];
  } catch (error) {
    console.error('Error fetching all opportunities:', error);
    return [];
  }
}

export default function AnalyzePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';
  const [OrionOpportunity, setOpportunity] = useState<OrionOpportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [allOpportunities, setAllOpportunities] = useState<OrionOpportunity[]>([]);
  const [viewMode, setViewMode] = useState<'single' | 'pipeline'>('single');
  const [loading, setLoading] = useState(true);

  // Fetch evaluation with profile source and error
  async function fetchEvaluationWithSource(opportunityId: string): Promise<EvaluationOutput | null> {
    try {
      const res = await fetch(`/api/orion/OrionOpportunity/${opportunityId}/evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.evaluation as EvaluationOutput | null;
    } catch (error) {
      console.error('Error fetching evaluation with source:', error);
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([fetchOpportunity(id), fetchEvaluationWithSource(id), fetchAllOpportunities()]).then(
      ([opp, evalResult, allOpps]) => {
        if (!mounted) return;
        setOpportunity(opp);
        setEvaluation(evalResult);
        setAllOpportunities(allOpps);
        setLoading(false);
      }
    );
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading analytics...</div>;
  }

  if (!OrionOpportunity) {
    notFound();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>OrionOpportunity Analysis</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setViewMode('single')}
          style={{
            marginRight: 8,
            padding: '0.5rem 1rem',
            background: viewMode === 'single' ? '#6366f1' : '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          This OrionOpportunity
        </button>
        <button
          onClick={() => setViewMode('pipeline')}
          style={{
            padding: '0.5rem 1rem',
            background: viewMode === 'pipeline' ? '#6366f1' : '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Pipeline Analytics
        </button>
      </div>

      {viewMode === 'single' && (
        <>
          <p>
            <strong>OrionOpportunity ID:</strong> {OrionOpportunity.id}
          </p>
          <p>
            <strong>Title:</strong> {OrionOpportunity.title}
          </p>
          <p>
            <strong>Organization:</strong> {OrionOpportunity.companyOrInstitution || 'N/A'}
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
            <strong>Description:</strong> {OrionOpportunity.content || 'No description'}
          </p>
          <div style={{ margin: '2rem 0' }}>
            <OpportunityPipelineCharts opportunities={[OrionOpportunity]} />
          </div>
          {evaluation && (
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Evaluation Summary</h3>
                  <p className="text-gray-300">{evaluation.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-purple-300 mb-2">Missing Skills / Gaps</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {evaluation.gaps?.map((gap, i: number) => (
                        <li key={i}>
                          {gap.skill}: {gap.reasoning}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-purple-300 mb-2">Matching Highlights</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {evaluation.alignmentHighlights?.map((highlight, i: number) => (
                        <li key={i}>
                          {highlight.title}: {highlight.reasoning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-purple-300 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {evaluation.strengths?.map((strength, i: number) => (
                      <li key={i}>
                        {strength.title}: {strength.reasoning}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-purple-300 mb-2">Suggested Next Steps</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {evaluation.suggestedNextSteps?.map((step: string, i: number) => <li key={i}>{step}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </>
      )}

      {viewMode === 'pipeline' && (
        <div style={{ margin: '2rem 0' }}>
          <OpportunityPipelineCharts opportunities={allOpportunities} />
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
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
