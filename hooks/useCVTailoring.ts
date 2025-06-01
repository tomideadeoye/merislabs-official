'use client';

import { useState, useCallback } from 'react';
import { 
  CVComponent, 
  fetchCVComponents, 
  suggestCVComponents, 
  rephraseComponent, 
  tailorSummary, 
  assembleCV 
} from '@/lib/cv';

export interface UseCVTailoringResult {
  // State
  components: CVComponent[];
  suggestedComponentIds: string[];
  selectedComponentIds: string[];
  tailoredContentMap: Record<string, string>;
  assembledCV: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchComponents: () => Promise<void>;
  suggestComponents: (jdAnalysis: string, jobTitle: string, companyName: string) => Promise<void>;
  selectComponent: (componentId: string) => void;
  deselectComponent: (componentId: string) => void;
  rephraseSelectedComponent: (componentId: string, jdAnalysis: string, webResearchContext?: string) => Promise<void>;
  tailorSummaryComponent: (componentId: string, jdAnalysis: string, webResearchContext?: string) => Promise<void>;
  assembleSelectedComponents: (templateName: string, headerInfo: string) => Promise<void>;
  
  // Helpers
  getComponentById: (componentId: string) => CVComponent | undefined;
  isComponentSelected: (componentId: string) => boolean;
  clearError: () => void;
}

export function useCVTailoring(): UseCVTailoringResult {
  const [components, setComponents] = useState<CVComponent[]>([]);
  const [suggestedComponentIds, setSuggestedComponentIds] = useState<string[]>([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  const [tailoredContentMap, setTailoredContentMap] = useState<Record<string, string>>({});
  const [assembledCV, setAssembledCV] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchComponents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedComponents = await fetchCVComponents();
      setComponents(fetchedComponents);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch CV components');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const suggestComponents = useCallback(async (
    jdAnalysis: string,
    jobTitle: string,
    companyName: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await suggestCVComponents(jdAnalysis, jobTitle, companyName);
      
      if (result.success && result.suggested_component_ids) {
        setSuggestedComponentIds(result.suggested_component_ids);
        // Auto-select suggested components
        setSelectedComponentIds(result.suggested_component_ids);
      } else {
        setError(result.error || 'Failed to suggest CV components');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to suggest CV components');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const selectComponent = useCallback((componentId: string) => {
    setSelectedComponentIds(prev => {
      if (prev.includes(componentId)) {
        return prev;
      }
      return [...prev, componentId];
    });
  }, []);
  
  const deselectComponent = useCallback((componentId: string) => {
    setSelectedComponentIds(prev => prev.filter(id => id !== componentId));
  }, []);
  
  const rephraseSelectedComponent = useCallback(async (
    componentId: string,
    jdAnalysis: string,
    webResearchContext?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await rephraseComponent(componentId, jdAnalysis, webResearchContext);
      
      if (result.success && result.rephrased_content) {
        setTailoredContentMap(prev => ({
          ...prev,
          [componentId]: result.rephrased_content!
        }));
      } else {
        setError(result.error || 'Failed to rephrase component');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to rephrase component');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const tailorSummaryComponent = useCallback(async (
    componentId: string,
    jdAnalysis: string,
    webResearchContext?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await tailorSummary(componentId, jdAnalysis, webResearchContext);
      
      if (result.success && result.tailored_content) {
        setTailoredContentMap(prev => ({
          ...prev,
          [componentId]: result.tailored_content!
        }));
      } else {
        setError(result.error || 'Failed to tailor summary');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to tailor summary');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const assembleSelectedComponents = useCallback(async (
    templateName: string,
    headerInfo: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await assembleCV(
        selectedComponentIds,
        templateName,
        headerInfo,
        tailoredContentMap
      );
      
      if (result.success && result.assembled_cv) {
        setAssembledCV(result.assembled_cv);
      } else {
        setError(result.error || 'Failed to assemble CV');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to assemble CV');
    } finally {
      setIsLoading(false);
    }
  }, [selectedComponentIds, tailoredContentMap]);
  
  const getComponentById = useCallback((componentId: string) => {
    return components.find(c => c.unique_id === componentId);
  }, [components]);
  
  const isComponentSelected = useCallback((componentId: string) => {
    return selectedComponentIds.includes(componentId);
  }, [selectedComponentIds]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    // State
    components,
    suggestedComponentIds,
    selectedComponentIds,
    tailoredContentMap,
    assembledCV,
    isLoading,
    error,
    
    // Actions
    fetchComponents,
    suggestComponents,
    selectComponent,
    deselectComponent,
    rephraseSelectedComponent,
    tailorSummaryComponent,
    assembleSelectedComponents,
    
    // Helpers
    getComponentById,
    isComponentSelected,
    clearError
  };
}