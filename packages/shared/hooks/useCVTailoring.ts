import { useState, useCallback } from "react";
import {
  fetchCVComponents,
  suggestCVComponents,
  rephraseComponent,
  tailorSummary,
  assembleCV,
  CVComponent,
} from "@repo/shared/cv";

export function useCVTailoring() {
  const [components, setComponents] = useState<CVComponent[]>([]);
  const [suggestedComponentIds, setSuggestedComponentIds] = useState<string[]>(
    []
  );
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>(
    []
  );
  const [tailoredContentMap, setTailoredContentMap] = useState<
    Record<string, string>
  >({});
  const [assembledCV, setAssembledCV] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all CV components
  const fetchComponents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch CV components from the server API route
      const response = await fetch("/api/orion/cv-components");
      const data = await response.json();

      if (data.success) {
        setComponents(data.components as CVComponent[]);
      } else {
        setError(data.error || "Failed to fetch CV components from Notion");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch CV components");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Suggest components based on JD analysis
  const suggestComponents = useCallback(
    async (jdAnalysis: string, jobTitle: string, companyName: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await suggestCVComponents(
          jdAnalysis,
          jobTitle,
          companyName
        );

        if (result.success && result.suggested_component_ids) {
          setSuggestedComponentIds(result.suggested_component_ids);

          // Auto-select suggested components
          setSelectedComponentIds((prevSelected) => {
            const newSelected = [...prevSelected];
            result.suggested_component_ids?.forEach((id) => {
              if (!newSelected.includes(id)) {
                newSelected.push(id);
              }
            });
            return newSelected;
          });
        } else {
          setError(result.error || "Failed to suggest components");
        }
      } catch (err: any) {
        setError(err.message || "Failed to suggest components");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Select a component
  const selectComponent = useCallback((componentId: string) => {
    setSelectedComponentIds((prev) => {
      if (prev.includes(componentId)) {
        return prev;
      }
      return [...prev, componentId];
    });
  }, []);

  // Deselect a component
  const deselectComponent = useCallback((componentId: string) => {
    setSelectedComponentIds((prev) => prev.filter((id) => id !== componentId));
  }, []);

  // Rephrase a component
  const rephraseSelectedComponent = useCallback(
    async (
      componentId: string,
      jdAnalysis: string,
      webResearchContext?: string
    ) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await rephraseComponent(
          componentId,
          jdAnalysis,
          webResearchContext
        );

        if (result.success && result.rephrased_content) {
          setTailoredContentMap((prev) => ({
            ...prev,
            [componentId]: result.rephrased_content!,
          }));
        } else {
          setError(result.error || "Failed to rephrase component");
        }
      } catch (err: any) {
        setError(err.message || "Failed to rephrase component");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Tailor a summary component
  const tailorSummaryComponent = useCallback(
    async (
      componentId: string,
      jdAnalysis: string,
      webResearchContext?: string
    ) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await tailorSummary(
          componentId,
          jdAnalysis,
          webResearchContext
        );

        if (result.success && result.tailored_content) {
          setTailoredContentMap((prev) => ({
            ...prev,
            [componentId]: result.tailored_content!,
          }));
        } else {
          setError(result.error || "Failed to tailor summary");
        }
      } catch (err: any) {
        setError(err.message || "Failed to tailor summary");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Assemble the CV
  const assembleSelectedComponents = useCallback(
    async (
      templateName: "Standard" | "Modern" | "Compact",
      headerInfo: string
    ) => {
      try {
        if (selectedComponentIds.length === 0) {
          setError("No components selected");
          return;
        }

        setIsLoading(true);
        setError(null);
        const result = await assembleCV(
          selectedComponentIds,
          templateName,
          headerInfo,
          tailoredContentMap
        );

        if (result.success && result.assembled_cv) {
          setAssembledCV(result.assembled_cv);
        } else {
          setError(result.error || "Failed to assemble CV");
        }
      } catch (err: any) {
        setError(err.message || "Failed to assemble CV");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedComponentIds, tailoredContentMap]
  );

  // Helper to get a component by ID
  const getComponentById = useCallback(
    (id: string) => {
      return components.find((c) => c.unique_id === id);
    },
    [components]
  );

  // Check if a component is selected
  const isComponentSelected = useCallback(
    (id: string) => {
      return selectedComponentIds.includes(id);
    },
    [selectedComponentIds]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
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
  };
}
