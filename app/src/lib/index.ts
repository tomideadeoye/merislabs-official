// This file acts as the main public export for the @/ui/components/ui package.

// Export the utility function
export * from '../../utils';

// Export all shadcn/ui and custom UI components
export * from '../../../components/accordion';
export * from './components/ui/avatar';
export * from './components/ui/badge';
export * from '../../../components/button';
export * from './components/ui/card';
export * from './components/ui/checkbox';
export * from './components/ui/command';
export * from './components/ui/dialog';
export * from './components/ui/dropdown-menu';
export * from './components/ui/input';
export * from './components/ui/label';
export * from './components/ui/loader';
export * from './components/ui/multi-select';
export * from './components/ui/page-header';
export * from './components/ui/progress';
export * from './components/ui/scroll-area';
export * from './components/ui/select';
export * from './components/ui/skeleton';
export * from './components/ui/switch';
export * from './components/ui/tabs';
export * from './components/ui/textarea';
export * from './components/ui/tooltip';
export * from './components/ui/header';
export { default as Footer } from './components/ui/footer';
export * from './components/ui/theme-provider';

export { default as DraftCommunicationForm } from './components/orion/DraftCommunicationForm';
export * from './components/orion/whatsapp/WhatsAppReplyDrafter';
export { default as AddOpportunityForm } from './components/orion/opportunities/AddOpportunityForm';
export { default as OpportunityFilters } from '../../../src/components/OpportunityFilters';
export { default as OpportunityList } from './components/orion/opportunities/OpportunityList';
export { default as OpportunityKanbanView } from '../../../src/components/OpportunityKanbanView';

// FIX: Export the missing component
export * from './components/orion/opportunities/StatusUpdateButton';

export * from '../../../src/components/emailTestDialogStore';

export { RadioGroup, RadioGroupItem } from './components/ui/RadioGroup';
export { Alert, AlertDescription, AlertTitle } from './components/ui/Alert';

export * from './components/orion/opportunities/OpportunityCard';
export * from './components/orion/opportunities/OpportunityEvaluator';
// export * from './components/orion/whatsapp/WhatsAppChatUploader';
// export * from './components/orion/whatsapp/WhatsAppChatAnalysis';
export * from './components/orion/whatsapp/WhatsAppReplyDrafter';
