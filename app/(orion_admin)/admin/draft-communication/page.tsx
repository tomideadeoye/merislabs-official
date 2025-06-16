import { PageNames } from '../../../../apps/nextjs/src/lib/app_constants';
import { PageHeader, Tabs, TabsList, TabsTrigger } from '@/ui/components/ui';
import { BarChart2, MessageSquare, Smartphone } from 'lucide-react';
import DraftCommunicationClientWrapper from './DraftCommunicationClientWrapper'; // Import the new client wrapper

// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component

export default function DraftCommunicationFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.DRAFT_COMM}
        icon={<MessageSquare className="h-7 w-7" />}
        description="Craft messages, generate reply options, and ask communication-related questions."
      />
      <Tabs defaultValue="draft" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="draft">
            <MessageSquare className="inline-block mr-1 w-4 h-4" /> Draft Communication
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            <Smartphone className="inline-block mr-1 w-4 h-4" /> WhatsApp Helper
          </TabsTrigger>
          <TabsTrigger value="whatsapp-analysis">
            <BarChart2 className="inline-block mr-1 w-4 h-4" /> WhatsApp Chat Analysis
          </TabsTrigger>
        </TabsList>

        {/* All content moved to client wrapper */}
        <DraftCommunicationClientWrapper />
      </Tabs>
    </div>
  );
}
