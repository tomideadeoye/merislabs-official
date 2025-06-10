// Merged CVTailoringStudio: combines best features from both original and enhanced versions
'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useCVTailoring } from '@shared/hooks/useCVTailoring';
import { CVComponent } from '@shared/lib/cv';
import { generatePDF, generatePDFFilename } from '@shared/lib/pdf-generator';
import { generateWordDoc, generateWordFilename } from '@shared/lib/word-generator';
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox, Textarea, Input, Progress } from '@repo/ui';
import {
  Loader2, FileText, Edit, Check, X, RefreshCw, Download, MoveVertical, AlertTriangle, FileOutput, ThumbsUp, ThumbsDown
} from 'lucide-react';

interface CVTailoringStudioProps {
  jdAnalysis?: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  webResearchContext?: string;
  opportunityId?: string;
  onCVAssembled?: (cv: string) => void;
}

export function CVTailoringStudio({
  jdAnalysis: jdAnalysisProp,
  jobTitle,
  companyName,
  jobDescription = '',
  webResearchContext = '',
  opportunityId = '',
  onCVAssembled
}: CVTailoringStudioProps) {
  const {
    components,
    suggestedComponentIds,
    selectedComponentIds,
    tailoredContentMap,
    setTailoredContentMap,
    assembledCV,
    isLoading,
    error,
    fetchComponents,
    suggestComponents,
    selectComponent,
    deselectComponent,
    rephraseSelectedComponent,
    tailorSummaryComponent,
    assembleSelectedComponents,
    getComponentById,
    isComponentSelected,
    clearError
  } = useCVTailoring();

  // --- State ---
  const [activeTab, setActiveTab] = useState('select');
  const [headerInfo, setHeaderInfo] = useState('**TOMIDE ADEOYE**\ntomideadeoye@gmail.com | +234 818 192 7251');
  const [selectedTemplate, setSelectedTemplate] = useState('Standard');
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderedComponentIds, setOrderedComponentIds] = useState<string[]>([]);
  const [tailoringProgress, setTailoringProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState('markdown');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = useState(false);
  // For legacy: support fetching JD analysis if not provided
  const [fetchedJdAnalysis, setFetchedJdAnalysis] = useState<string | null>(jdAnalysisProp || null);
  const [isAnalyzingJd, setIsAnalyzingJd] = useState<boolean>(false);
  const [jdAnalysisError, setJdAnalysisError] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => { fetchComponents(); }, [fetchComponents]);

  // Fetch JD analysis if not provided
  useEffect(() => {
    if (jdAnalysisProp) return;
    if (!jobDescription) return;
    setIsAnalyzingJd(true);
    setJdAnalysisError(null);
    fetch('/api/orion/llm/jd-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jobDescription, opportunity_title: jobTitle, company_name: companyName })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.analysis) setFetchedJdAnalysis(data.analysis);
        else setJdAnalysisError(data.error || 'Failed to analyze job description.');
      })
      .catch(err => setJdAnalysisError(err.message || 'An unexpected error occurred during JD analysis.'))
      .finally(() => setIsAnalyzingJd(false));
  }, [jdAnalysisProp, jobDescription, jobTitle, companyName]);

  // Suggest components when JD analysis is available
  useEffect(() => {
    const analysis = jdAnalysisProp || fetchedJdAnalysis;
    if (analysis && components.length > 0) {
      suggestComponents(analysis, jobTitle, companyName);
    }
  }, [jdAnalysisProp, fetchedJdAnalysis, jobTitle, companyName, components, suggestComponents]);

  // Update ordered components when selected components change
  useEffect(() => {
    setOrderedComponentIds(Array.from(selectedComponentIds));
  }, [selectedComponentIds]);

  // Update tailoring progress
  useEffect(() => {
    if (selectedComponentIds.length === 0) setTailoringProgress(0);
    else {
      const tailoredCount = Object.keys(tailoredContentMap).filter(id => selectedComponentIds.includes(id)).length;
      setTailoringProgress(Math.round((tailoredCount / selectedComponentIds.length) * 100));
    }
  }, [selectedComponentIds, tailoredContentMap]);

  // Notify parent when CV is assembled
  useEffect(() => { if (assembledCV && onCVAssembled) onCVAssembled(assembledCV); }, [assembledCV, onCVAssembled]);

  // --- Utility: group components by type ---
  const componentsByType: Record<string, CVComponent[]> = {};
  components.forEach((component: CVComponent) => {
    if (!componentsByType[component.component_type]) componentsByType[component.component_type] = [];
    componentsByType[component.component_type].push(component);
  });

  // --- Handlers ---
type CheckedState = boolean | "indeterminate";
const handleComponentToggle = (componentId: string, checked: CheckedState) => {
  if (checked === true) selectComponent(componentId);
  else deselectComponent(componentId);
};

  const handleRephraseComponent = async (component: CVComponent) => {
    const analysis = jdAnalysisProp || fetchedJdAnalysis || '';
    if (component.component_type === 'Profile Summary') {
      await tailorSummaryComponent(component.unique_id, analysis, webResearchContext);
    } else {
      await rephraseSelectedComponent(component.unique_id, analysis, webResearchContext);
    }
  };

  const startEditing = (component: CVComponent) => {
    setEditingComponentId(component.unique_id);
    setEditedContent(tailoredContentMap[component.unique_id] || component.content_primary);
  };
  const saveEditing = () => {
    if (editingComponentId) {
      const updatedMap = {...tailoredContentMap};
      updatedMap[editingComponentId] = editedContent;
      setTailoredContentMap(updatedMap);
      setEditingComponentId(null);
    }
  };
  const cancelEditing = () => {
    setEditingComponentId(null);
    setEditedContent('');
  };

  const handleAssembleCV = async () => {
    await assembleSelectedComponents(selectedTemplate as "Standard" | "Modern" | "Compact", headerInfo);
    setActiveTab('preview');
  };

  // Drag-and-drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(orderedComponentIds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrderedComponentIds(items);
  };

  // Export logic (markdown, plain, pdf, word)
  const handleExport = async () => {
    if (!assembledCV) return;
    setIsExporting(true);
    try {
      let blob: Blob;
      let filename: string;
      if (exportFormat === 'pdf') {
        blob = await generatePDF(assembledCV, selectedTemplate);
        filename = generatePDFFilename(jobTitle);
      } else if (exportFormat === 'word') {
        blob = await generateWordDoc(assembledCV, selectedTemplate);
        filename = generateWordFilename(jobTitle);
      } else {
        let content = assembledCV;
        if (exportFormat === 'plain') {
          content = assembledCV.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/\*\*\*(.*?)\*\*\*/g, '$1');
        }
        blob = new Blob([content], { type: exportFormat === 'plain' ? 'text/plain' : 'text/markdown' });
        filename = `cv_${jobTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.${exportFormat === 'plain' ? 'txt' : 'md'}`;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage('Failed to export CV');
    } finally {
      setIsExporting(false);
    }
  };

  // --- Tailoring quality indicator ---
  const getTailoringQualityIndicator = (componentId: string) => {
    const originalContent = getComponentById(componentId)?.content_primary || '';
    const tailoredContent = tailoredContentMap[componentId] || '';
    if (!tailoredContent) return 'red';
    const originalWords = originalContent.split(/\s+/).length;
    const tailoredWords = tailoredContent.split(/\s+/).length;
    const wordDiff = Math.abs(tailoredWords - originalWords) / (originalWords || 1);
    const analysis = jdAnalysisProp || fetchedJdAnalysis || '';
    const hasKeywords = analysis && tailoredContent && analysis.split(/\s+/).some(word => tailoredContent.includes(word));
    if (!hasKeywords || tailoredWords < 0.7 * originalWords) return 'red';
    if (wordDiff < 0.15) return 'yellow';
    return 'green';
  };

  // --- Feedback for tailored component ---
  const submitFeedback = async (componentId: string, rating: 'positive' | 'negative') => {
    if (!opportunityId) return;
    try {
      const component = getComponentById(componentId);
      if (!component) return;
      const tailoredContent = tailoredContentMap[componentId] || '';
      const response = await fetch('/api/orion/cv/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentId, opportunityId, tailoredContent, rating })
      });
      const data = await response.json();
      if (data.success) {
        setFeedbackSubmitted(prev => ({ ...prev, [componentId]: true }));
      } else {
        setErrorMessage('Failed to submit feedback');
      }
    } catch (error) {
      setErrorMessage('Failed to submit feedback');
    }
  };

  // --- Tailoring quality summary ---
  const qualitySummary = orderedComponentIds.map(id => getTailoringQualityIndicator(id));
  const greenCount = qualitySummary.filter(q => q === 'green').length;
  const yellowCount = qualitySummary.filter(q => q === 'yellow').length;
  const redCount = qualitySummary.filter(q => q === 'red').length;
  const total = orderedComponentIds.length;
  const progressGreen = total ? Math.round((greenCount / total) * 100) : 0;
  let overallStatus = 'CV Not Ready';
  if (redCount === 0 && yellowCount > 0) overallStatus = 'Nearly Ready';
  if (redCount === 0 && yellowCount === 0 && greenCount === total) overallStatus = 'Submission Ready';

  // --- Render ---
  return (
    <div className="space-y-4">
      {(error || errorMessage) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error || errorMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={clearError}>
            <X className="h-5 w-5" />
          </span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="select">1. Select Components</TabsTrigger>
          <TabsTrigger value="tailor">
            2. Tailor Content
            {tailoringProgress > 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                {tailoringProgress}%
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="preview">3. Preview & Export</TabsTrigger>
        </TabsList>

        {/* --- Select Tab --- */}
        <TabsContent value="select" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select CV Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  Select the components to include in your tailored CV. Suggested components based on the job description are pre-selected.
                </p>
                {isAnalyzingJd ? (
                  <div className="flex items-center text-blue-400">
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Analyzing Job Description...
                  </div>
                ) : jdAnalysisError ? (
                   <div className="text-red-500 text-sm">
                      <AlertTriangle className="inline mr-1 h-4 w-4" />
                      {jdAnalysisError}
                   </div>
                ) : (
                   <Button
                    onClick={() => suggestComponents(fetchedJdAnalysis!, jobTitle, companyName)}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Re-suggest Components
                  </Button>
                )}
              </div>

              {Object.entries(componentsByType).map(([type, typeComponents]: [string, CVComponent[]]) => (
                <div key={type} className="mb-6">
                  <h3 className="font-medium text-lg mb-2">{type}</h3>
                  <div className="space-y-2">
                    {typeComponents.map((component: CVComponent) => (
                      <div key={component.unique_id} className="flex items-start space-x-2">
                        <Checkbox
                          id={component.unique_id}
                          checked={isComponentSelected(component.unique_id)}
                          onCheckedChange={(checked) => handleComponentToggle(component.unique_id, checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={component.unique_id}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              suggestedComponentIds.includes(component.unique_id) ? 'text-blue-600 font-semibold' : ''
                            }`}
                          >
                            {component.component_name}
                            {suggestedComponentIds.includes(component.unique_id) && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">Suggested</span>
                            )}
                          </label>
                          <p className="text-xs text-gray-500 line-clamp-2">{component.content_primary.substring(0, 100)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button onClick={() => setActiveTab('tailor')} disabled={selectedComponentIds.length === 0}>
                Next: Tailor Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tailor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tailor CV Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Tailor each selected component to match the job description. You can use AI to rephrase the content or edit it manually.
                </p>
              </div>

              {selectedComponentIds.map((id: string) => {
                const component = getComponentById(id);
                if (!component) return null;

                const isTailored = !!tailoredContentMap[id];
                const displayContent = tailoredContentMap[id] || component.content_primary;
                const isEditing = editingComponentId === id;

                return (
                  <div key={id} className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{component.component_name}</h3>
                      <div className="flex space-x-2">
                        {!isEditing ? (
                          <>
                            <Button
                              onClick={() => handleRephraseComponent(component)}
                              disabled={isLoading}
                            >
                              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                              AI Tailor
                            </Button>
                            <Button
                              onClick={() => startEditing(component)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={saveEditing}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button
                              onClick={cancelEditing}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[150px]"
                      />
                    ) : (
                      <div className={`text-sm ${isTailored ? 'bg-green-50 p-2 rounded' : ''}`}>
                        {isTailored && <span className="text-xs text-green-600 block mb-1">✓ Tailored</span>}
                        {displayContent}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-between">
                <Button onClick={() => setActiveTab('select')}>
                  Back
                </Button>
                <Button onClick={handleAssembleCV} disabled={isLoading || selectedComponentIds.length === 0}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                  Assemble CV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview & Export CV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium">CV Template</label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Modern">Modern</SelectItem>
                        <SelectItem value="Compact">Compact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Header Information</label>
                    <Input
                      value={headerInfo}
                      onChange={(e) => setHeaderInfo(e.target.value)}
                      placeholder="Name, contact info, etc."
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAssembleCV}
                  disabled={isLoading || selectedComponentIds.length === 0}
                  className="mb-4"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Regenerate CV
                </Button>
              </div>

              {assembledCV ? (
                <div className="border p-4 rounded-md bg-white">
                  <div className="prose max-w-none">
                    {assembledCV.split('\n').map((line: string, i: number) => (
                      <div key={i} className={line.startsWith('**') ? 'font-bold' : ''}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
<div className="text-center py-8 text-gray-500">
  Click "Assemble CV" to generate your tailored CV
</div>
              )}

              <div className="mt-4 flex justify-between">
                <Button onClick={() => setActiveTab('tailor')}>
                  Back
                </Button>
                <div className="space-x-2">
                  <Button
                    onClick={() => {
                      if (assembledCV) {
                        navigator.clipboard.writeText(assembledCV);
                        alert("CV copied to clipboard!");
                      }
                    }}
                    disabled={!assembledCV}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button
                    onClick={() => {
                      if (assembledCV && onCVAssembled) {
                        onCVAssembled(assembledCV);
                      }
                    }}
                    disabled={!assembledCV}
                  >
                    Save CV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
