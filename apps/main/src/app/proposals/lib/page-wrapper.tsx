import React from 'react';
import type { BrandConfig } from './types';

interface Props {
  children: React.ReactNode;
}

export function A4Page({ children }: Props) {
  return (
    <div
      className="page-wrapper"
      style={{
        width: '210mm',
        height: '297mm',
        maxHeight: '297mm',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pageBreakAfter: 'always',
        printColorAdjust: 'exact',
      }}
    >
      {children}
    </div>
  );
}

export function PageHeader({ logo, label, brand }: { logo: string; label: string; brand: BrandConfig }) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <img src={logo} alt="" className="h-7 w-auto" />
        <span className="text-xs font-medium uppercase tracking-wider ml-2" style={{ color: brand.textLight }}>{label}</span>
      </div>
    </div>
  );
}

export function PageFooter({ left, right, brand }: { left: string; right: string; brand: BrandConfig }) {
  return (
    <div className="pt-4 mt-auto border-t border-gray-200 flex items-center justify-between text-xs" style={{ color: brand.textLight }}>
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}
// This file continues above
