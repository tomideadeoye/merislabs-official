'use client';

import { PageHeader } from '@/components/ui';
import { PageNames } from '@/lib/constants';
import { Users } from 'lucide-react';

export default function WhatsAppHelperFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.WHATSAPP_HELPER}
        icon={<Users className="h-7 w-7" />}
        description="Assist with WhatsApp messaging and automation."
      />
      <div>
        <p className="text-gray-400">WhatsApp Helper feature component will go here.</p>
      </div>
    </div>
  );
}
