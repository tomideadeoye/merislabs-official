// This file acts as the main public export for the @repo/ui package.

// Export the utility function
export * from "./lib/utils";

// Export all shadcn/ui and custom UI components
export * from "./components/ui/accordion";
export * from "./components/ui/avatar";
export * from "./components/ui/badge";
export * from "./components/ui/button";
export * from "./components/ui/card";
export * from "./components/ui/checkbox";
export * from "./components/ui/command";
export * from "./components/ui/dialog";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/input";
export * from "./components/ui/label";
export * from "./components/ui/loader";
export * from "./components/ui/multi-select";
export * from "./components/ui/page-header";
export * from "./components/ui/progress";
export * from "./components/ui/scroll-area";
export * from "./components/ui/select";
export * from "./components/ui/skeleton";
export * from "./components/ui/switch";
export * from "./components/ui/tabs";
export * from "./components/ui/textarea";
export * from "./components/ui/tooltip";
export * from "./components/ui/header";
export { default as Footer } from './components/ui/footer';
export * from "./components/ui/theme-provider";

export { default as DraftCommunicationForm } from './components/orion/DraftCommunicationForm';
export { default as WhatsAppReplyDrafter } from './components/orion/WhatsAppReplyDrafter';
export { default as AddOpportunityForm } from './components/orion/opportunities/AddOpportunityForm';
export { default as OpportunityFilters } from './components/orion/opportunities/OpportunityFilters';
export { default as OpportunityList } from './components/orion/opportunities/OpportunityList';
export { default as OpportunityKanbanView } from './components/orion/opportunities/OpportunityKanbanView';
