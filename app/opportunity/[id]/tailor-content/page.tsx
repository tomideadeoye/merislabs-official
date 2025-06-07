'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Sparkles, Clipboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useOpportunityMemory } from '@/hooks/useOpportunityMemory';
import { useSessionState, SessionStateKeys } from '@/hooks/useSessionState';

export default function TailorContentPage() {
  const params = useParams();
  const opportunityId = params?.id as string;

  const [opportunity, setOpportunity] = useState<any>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cvContent, setCVContent] = useState<string>('');
  const [aiSuggestion, setAISuggestion] = useState<string>('');
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Opportunity memory and profile context
  const { memories } = useOpportunityMemory(opportunityId || '');
  const [profile] = useSessionState(SessionStateKeys.TOMIDES_PROFILE_DATA);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch opportunity
        const oppRes = await fetch(`/api/orion/opportunity/${opportunityId}`);
        const oppData = await oppRes.json();
        if (!oppData.success) throw new Error(oppData.error || 'Failed to fetch opportunity');
        setOpportunity(oppData.opportunity);

        // Fetch CV components
        const compRes = await fetch(`/api/orion/cv-components?opportunityId=${opportunityId}`);
        const compData = await compRes.json();
        if (!compData.success) throw new Error(compData.error || 'Failed to fetch CV components');
        setComponents(compData.components);

        // Assemble initial CV content from all components
        const assembled = compData.components
          .map((c: any) =>
            `### ${c.component_name}\n${c.content_primary}\n`
          )
          .join('\n');
        setCVContent(assembled);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    if (opportunityId) fetchData();
  }, [opportunityId]);

  // AI Suggestion handler (real)
  async function handleAISuggestion() {
    setAISuggestion('Generating suggestions...');
    try {
      const res = await fetch('/api/orion/cv/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvContent,
          opportunity,
          jdAnalysis: opportunity?.description || ''
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setAISuggestion(data.suggestions);
      } else {
        setAISuggestion(data.error || 'Failed to generate suggestions.');
      }
    } catch (err: any) {
      setAISuggestion(err.message || 'Failed to generate suggestions.');
    }
  }

  // Export as PDF (real)
  async function handleExportPDF() {
    setExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      // Split content into lines to avoid overflow
      const lines = doc.splitTextToSize(cvContent, 180);
      doc.setFontSize(12);
      doc.text(lines, 10, 20);
      doc.save(`CV_${opportunity?.title || 'export'}.pdf`);
    } catch (err) {
      // [LOG][ERROR] PDF export failed, error object:
      if (err instanceof Error) {
        console.error('[EXPORT_PDF][ERROR]', { message: err.message, stack: err.stack });
        alert('Failed to export PDF: ' + err.message);
      } else {
        console.error('[EXPORT_PDF][ERROR][NON-ERROR]', { err });
        alert('Failed to export PDF: ' + JSON.stringify(err));
      }
    } finally {
      setExporting(false);
    }
  }

  // Auto-generate tailored CV
  async function handleAutoGenerateCV() {
    if (!opportunity) return;
    setCVContent('Generating tailored CV...');
    try {
      const res = await fetch('/api/orion/cv/assemble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity,
          jd: opportunity.description || '',
          memory: memories,
          profile,
        }),
      });

      if (!res.ok) {
        let errorMsg = `Server error: ${res.status}`;
        try {
          const errData = await res.json();
          if (errData && errData.error) errorMsg = errData.error;
        } catch {}
        setCVContent(errorMsg);
        alert(errorMsg);
        return;
      }

      const data = await res.json();
      if (data.success && data.cv) {
        setCVContent(data.cv);
      } else {
        const errorMsg = data.error || 'Failed to generate tailored CV.';
        setCVContent(errorMsg);
        alert(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Network or server error while generating tailored CV.';
      setCVContent(errorMsg);
      alert(errorMsg);
    }
  }

  // Copy to clipboard
  async function handleCopy() {
    await navigator.clipboard.writeText(cvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tailor CV Content for {opportunity?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
              onClick={handleExportPDF}
              disabled={exporting}
            >
              <Download className="inline-block mr-2 h-5 w-5" />
              {exporting ? 'Exporting...' : 'Export as PDF'}
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
              onClick={handleCopy}
              disabled={copied}
            >
              <Clipboard className="inline-block mr-2 h-5 w-5" />
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
              onClick={handleAISuggestion}
            >
              <Sparkles className="inline-block mr-2 h-5 w-5" />
              Get AI Suggestions
            </button>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
              onClick={handleAutoGenerateCV}
            >
              Auto Generate Tailored CV
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Edit CV (Markdown)</label>
              <textarea
                className="w-full min-h-[300px] border rounded p-2 mb-2"
                value={cvContent}
                onChange={e => setCVContent(e.target.value)}
                placeholder="Edit your CV content here..."
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Preview</label>
              <div className="w-full min-h-[300px] border rounded p-2 bg-gray-50 overflow-auto prose prose-sm max-w-none">
                {/* @ts-ignore */}
                <ReactMarkdown>{cvContent}</ReactMarkdown>
              </div>
            </div>
          </div>
          {aiSuggestion && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2 text-blue-800 whitespace-pre-line">
              <strong>AI Suggestions:</strong>
              <div>{aiSuggestion}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
