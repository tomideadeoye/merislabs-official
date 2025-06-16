/* eslint-disable react/no-unescaped-entities */
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// FILE PATH

// Merged CVTailoringStudio: combines best features from both original and enhanced versions
'use client';

import { useEffect, useState } from 'react';
import { useCVTailoring } from '@/app/hooks/useCVTailoring';
import { CVComponent } from '@/types/orion';
// import { generatePDF, generatePDFFilename } from '@repo/shared/pdf-generator'; // Removed as export functions are commented out
import { generateWordDoc, generateWordFilename } from '@/lib/word-generator';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Textarea,
  Input,
} from '@/ui/components/ui';
import { Loader2, FileText, Edit, Check, X, RefreshCw, AlertTriangle } from 'lucide-react';

interface CVTailoringStudioProps {
  jdAnalysis?: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  webResearchContext?: string;
  onCVAssembled?: (cv: string) => void;
  opportunityId: string;
}

export function CVTailoringStudio({
  jdAnalysis: jdAnalysisProp,
  jobTitle,
  companyName,
  jobDescription = '',
  webResearchContext = '',
  onCVAssembled,
  opportunityId,
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
    clearError,
  } = useCVTailoring();

  // --- State ---
  const [activeTab, setActiveTab] = useState('select');
  const [headerInfo, setHeaderInfo] = useState('TOMIDE ADEOYE\ntomideadeoye@gmail.com / +234 818 192 7251');
  const [selectedTemplate, setSelectedTemplate] = useState('Standard');
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [tailoringProgress, setTailoringProgress] = useState(0);
  const [fetchedJdAnalysis, setFetchedJdAnalysis] = useState<string | null>(jdAnalysisProp || null);
  const [isAnalyzingJd, setIsAnalyzingJd] = useState<boolean>(false);
  const [jdAnalysisError, setJdAnalysisError] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  // Fetch JD analysis if not provided
  useEffect(() => {
    if (jdAnalysisProp) return;
    if (!jobDescription) return;
    setIsAnalyzingJd(true);
    setJdAnalysisError(null);
    fetch('/api/orion/llm/jd-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jobDescription, opportunity_title: jobTitle, company_name: companyName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.analysis) setFetchedJdAnalysis(data.analysis);
        else setJdAnalysisError(data.error || 'Failed to analyze job description.');
      })
      .catch((err) => setJdAnalysisError(err.message || 'An unexpected error occurred during JD analysis.'))
      .finally(() => setIsAnalyzingJd(false));
  }, [jdAnalysisProp, jobDescription, jobTitle, companyName]);

  // Suggest components when JD analysis is available
  useEffect(() => {
    const analysis = jdAnalysisProp || fetchedJdAnalysis;
    if (analysis && components.length > 0) {
      suggestComponents(analysis, jobTitle, companyName);
    }
  }, [jdAnalysisProp, fetchedJdAnalysis, jobTitle, companyName, components, suggestComponents]);

  // Update tailoring progress
  useEffect(() => {
    if (selectedComponentIds.length === 0) setTailoringProgress(0);
    else {
      const tailoredCount = Object.keys(tailoredContentMap).filter((id) => selectedComponentIds.includes(id)).length;
      setTailoringProgress(Math.round((tailoredCount / selectedComponentIds.length) * 100));
    }
  }, [selectedComponentIds, tailoredContentMap]);

  // Notify parent when CV is assembled
  useEffect(() => {
    if (assembledCV && onCVAssembled) onCVAssembled(assembledCV);
  }, [assembledCV, onCVAssembled]);

  // --- Utility: group components by type ---
  const componentsByType: Record<string, CVComponent[]> = {};
  components.forEach((component: CVComponent) => {
    if (!componentsByType[component.componentType]) componentsByType[component.componentType] = [];
    componentsByType[component.componentType].push(component);
  });

  // --- Handlers ---
  type CheckedState = boolean | 'indeterminate';
  const handleComponentToggle = (componentId: string, checked: CheckedState) => {
    if (checked === true) selectComponent(componentId);
    else deselectComponent(componentId);
  };

  const handleRephraseComponent = async (component: CVComponent) => {
    const analysis = jdAnalysisProp || fetchedJdAnalysis || '';
    const idToUse = component.uniqueId || component.id;
    if (component.componentType === 'Profile Summary') {
      await tailorSummaryComponent(idToUse, analysis, webResearchContext);
    } else {
      await rephraseSelectedComponent(idToUse, analysis, webResearchContext);
    }
  };

  const startEditing = (component: CVComponent) => {
    const idToUse = component.uniqueId || component.id;
    setEditingComponentId(idToUse);
    setEditedContent(tailoredContentMap[idToUse] || component.contentPrimary || '');
  };
  const saveEditing = () => {
    if (editingComponentId) {
      const updatedMap = { ...tailoredContentMap };
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
    await assembleSelectedComponents(selectedTemplate as 'Standard' | 'Modern' | 'Compact', headerInfo);
    setActiveTab('preview');
  };

  // Export logic (markdown, plain, pdf, word) - commented out as requested
  // const handleExport = async () => { /* ... */ };

  // --- Tailoring quality indicator ---
  // const getTailoringQualityIndicator = (componentId: string) => { // Removed: Function and its calculations are unused
  //   const originalContent = getComponentById(componentId)?.contentPrimary || '';
  //   const tailoredContent = tailoredContentMap[componentId] || '';
  //   if (!tailoredContent) return 'red';
  //   const originalWords = originalContent.split(/\s+/).length;
  //   const tailoredWords = tailoredContent.split(/\s+/).length;
  //   const wordDiff = Math.abs(tailoredWords - originalWords) / (originalWords || 1);
  //   const analysis = jdAnalysisProp || fetchedJdAnalysis || '';
  //   const hasKeywords =
  //     analysis && tailoredContent && analysis.split(/\s+/).some((word) => tailoredContent.includes(word));
  //   if (!hasKeywords || tailoredWords < 0.7 * originalWords) return 'red';
  //   if (wordDiff < 0.15) return 'yellow';
  //   // const progressGreen = true; // Removed: progressGreen is unused
  //   return 'green';
  // };

  // --- Feedback for tailored component --- - commented out as requested
  // const submitFeedback = async (componentId: string, rating: 'positive' | 'negative') => { /* ... */ };

  // --- Tailoring quality summary ---
  // const overallStatus = 'needs_work'; // Removed: overallStatus is unused
  // const overallStatusIcon = <X className="h-5 w-5 text-red-500" />; // Removed: overallStatusIcon is unused
  // const overallStatusText = 'Needs Work'; // Removed: overallStatusText is unused

  // --- Render ---
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
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
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">{tailoringProgress}%</span>
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
                  Select the components to include in your tailored CV. Suggested components based on the job
                  description are pre-selected.
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
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Re-suggest Components
                  </Button>
                )}
              </div>

              {Object.entries(componentsByType).map(([type, typeComponents]: [string, CVComponent[]]) => (
                <div key={type} className="mb-6">
                  <h3 className="font-medium text-lg mb-2">{type}</h3>
                  <div className="space-y-2">
                    {typeComponents.map((component: CVComponent) => (
                      <div key={component.uniqueId || component.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={component.uniqueId || component.id}
                          checked={isComponentSelected(component.uniqueId || component.id)}
                          onCheckedChange={(checked) =>
                            handleComponentToggle(component.uniqueId || component.id, checked)
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={component.uniqueId || component.id}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              suggestedComponentIds.includes(component.uniqueId || component.id)
                                ? 'text-blue-600 font-semibold'
                                : ''
                            }`}
                          >
                            {component.componentName}
                            {suggestedComponentIds.includes(component.uniqueId || component.id) && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                Suggested
                              </span>
                            )}
                          </label>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {(component.contentPrimary || '').substring(0, 100)}...
                          </p>
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
                  Tailor each selected component to match the job description. You can use AI to rephrase the content or
                  edit it manually.
                </p>
              </div>

              {selectedComponentIds.map((id: string) => {
                const component = getComponentById(id);
                if (!component) return null;

                const idToUse = component.uniqueId || component.id;
                const isTailored = !!tailoredContentMap[idToUse];
                const displayContent = tailoredContentMap[idToUse] || component.contentPrimary || '';
                const isEditing = editingComponentId === idToUse;

                return (
                  <div key={idToUse} className="mb-6 border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{component.componentName}</h3>
                      <div className="flex space-x-2">
                        {!isEditing ? (
                          <>
                            <Button onClick={() => handleRephraseComponent(component)} disabled={isLoading}>
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="mr-2 h-4 w-4" />
                              )}
                              AI Tailor
                            </Button>
                            <Button onClick={() => startEditing(component)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={saveEditing}>
                              <Check className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button onClick={cancelEditing}>
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
                <Button onClick={() => setActiveTab('select')}>Back</Button>
                <Button onClick={handleAssembleCV} disabled={isLoading || selectedComponentIds.length === 0}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
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
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
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
                <div className="text-center py-8 text-gray-500">Click "Assemble CV" to generate your tailored CV</div>
              )}

              <div className="mt-4 flex justify-between">
                <Button onClick={() => setActiveTab('tailor')}>Back</Button>
                <div className="space-x-2">
                  <Button
                    onClick={() => {
                      if (assembledCV) {
                        navigator.clipboard.writeText(assembledCV);
                        alert('CV copied to clipboard!');
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
