'use client';

import React from 'react';
import type { ProposalConfig } from './types';
import { getTemplate } from './templates/registry';

interface Props {
  config: ProposalConfig;
  templateId?: string;
}

export function ProposalDocument({ config, templateId }: Props) {
  const tpl = getTemplate(templateId || config.template);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @page { size: A4; margin: 0 }
        @media print {
          .page-wrapper { page-break-after: always; }
          .no-print { display: none !important; }
        }
      `}</style>
      {config.pages.map((page) => tpl.renderPage(page, config.brand))}
    </div>
  );
}
