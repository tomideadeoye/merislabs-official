/**
 * ============================================================================
 * PRINT ALL CASES PAGE - PDF REPORT RENDERER
 * ============================================================================
 */
import React, { Suspense } from 'react';
import PrintAllCasesContent from './PrintAllCasesContent';

export default function PrintAllCasesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading Litigation Report...</p>
      </div>
    </div>}>
      <PrintAllCasesContent />
    </Suspense>
  );
}
