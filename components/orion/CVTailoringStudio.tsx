'use client';

import React, { useEffect, useState } from 'react';
import { useCVTailoring } from '@/hooks/useCVTailoring';
import { CVComponent } from '@/lib/cv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, FileText, Edit, Check, X, RefreshCw } from 'lucide-react';

interface CVTailoringStudioProps {
  jdAnalysis: string;
  jobTitle: string;
  companyName: string;
  webResearchContext?: string;
  onCVAssembled?: (cv: string) => void;
}

export function CVTailoringStudio({
  jdAnalysis,
  jobTitle,
  companyName,
  webResearchContext = '',
  onCVAssembled
}: CVTailoringStudioProps) {
  const {
    components,
    suggestedComponentIds,
    selectedComponentIds,
    tailoredContentMap,
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

  const [activeTab, setActiveTab] = useState('select');
  const [headerInfo, setHeaderInfo] = useState('**TOMIDE ADEOYE**\ntomideadeoye@gmail.com | +234 818 192 7251');
  const [selectedTemplate, setSelectedTemplate] = useState('Standard');
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load components on mount
  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  // Suggest components when JD analysis is available
  useEffect(() => {
    if (jdAnalysis && components.length > 0) {
      suggestComponents(jdAnalysis, jobTitle, companyName);
    }
  }, [jdAnalysis, jobTitle, companyName, components, suggestComponents]);

  // Notify parent when CV is assembled
  useEffect(() => {
    if (assembledCV && onCVAssembled) {
      onCVAssembled(assembledCV);
    }
  }, [assembledCV, onCVAssembled]);

  // Group components by type
  const componentsByType: Record<string, CVComponent[]> = {};
  components.forEach(component => {
    if (!componentsByType[component.component_type]) {
      componentsByType[component.component_type] = [];
    }
    componentsByType[component.component_type].push(component);
  });

  // Handle component selection toggle
  const handleComponentToggle = (componentId: string, checked: boolean) => {
    if (checked) {
      selectComponent(componentId);
    } else {
      deselectComponent(componentId);
    }
  };

  // Handle component rephrasing
  const handleRephraseComponent = async (component: CVComponent) => {
    if (component.component_type === 'Profile Summary') {
      await tailorSummaryComponent(component.unique_id, jdAnalysis, webResearchContext);
    } else {
      await rephraseSelectedComponent(component.unique_id, jdAnalysis, webResearchContext);
    }
  };

  // Handle manual editing of component content
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

  // Handle CV assembly
  const handleAssembleCV = async () => {
    await assembleSelectedComponents(selectedTemplate as "Standard" | "Modern" | "Compact", headerInfo);
    setActiveTab('preview');
  };

  // Handle error
  const handleError = (error: any, message: string) => {
    console.error(`${message}:`, error);
    setErrorMessage(`${message}: ${error.message || 'Unknown error'}`);
    setTimeout(() => setErrorMessage(null), 5000);
  };

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
          <TabsTrigger value="tailor">2. Tailor Content</TabsTrigger>
          <TabsTrigger value="preview">3. Preview & Export</TabsTrigger>
        </TabsList>

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
                <Button 
                  onClick={() => suggestComponents(jdAnalysis, jobTitle, companyName)}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Re-suggest Components
                </Button>
              </div>

              {Object.entries(componentsByType).map(([type, typeComponents]) => (
                <div key={type} className="mb-6">
                  <h3 className="font-medium text-lg mb-2">{type}</h3>
                  <div className="space-y-2">
                    {typeComponents.map(component => (
                      <div key={component.unique_id} className="flex items-start space-x-2">
                        <Checkbox 
                          id={component.unique_id}
                          checked={isComponentSelected(component.unique_id)}
                          onCheckedChange={(checked) => handleComponentToggle(component.unique_id, checked === true)}
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

              {selectedComponentIds.map(id => {
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
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRephraseComponent(component)}
                              disabled={isLoading}
                            >
                              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                              AI Tailor
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditing(component)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={saveEditing}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
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
                <Button variant="outline" onClick={() => setActiveTab('select')}>
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
                    {assembledCV.split('\n').map((line, i) => (
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
                <Button variant="outline" onClick={() => setActiveTab('tailor')}>
                  Back
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline"
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