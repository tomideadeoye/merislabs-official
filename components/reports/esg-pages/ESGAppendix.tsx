import React from 'react';
import { HybridPage } from '../HybridPage';

interface ESGAppendixProps {
  pageNumber?: number;
}

export const ESGAppendix: React.FC<ESGAppendixProps> = ({ pageNumber }) => {
  return (
    <HybridPage pageNumber={pageNumber} components={{}}>
      <div className="h-full bg-white">
        {/* Header */}
        <div className="text-center pt-16 pb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4 tracking-wide">
            APPENDIX
          </h1>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-8"></div>
        </div>

        {/* ESG Compliance Levels Section */}
        <div className="my-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600 text-center">ESG Compliance Levels</h2>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="gauge-container flex justify-center items-center space-x-8">
              {[
                { name: 'Nigeria SMEs', value: 35, color: '#EF4444' },
                { name: 'Global Average', value: 68, color: '#10B981' },
                { name: 'EU Standards', value: 92, color: '#3B82F6' }
              ].map((item) => (
                <div key={`gauge-${item.name}`} className="gauge-item text-center">
                  <div className="gauge mb-4">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="10"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke={item.color} strokeWidth="10"
                        strokeDasharray={`${item.value * 3.14} ${(100 - item.value) * 3.14}`}
                        transform="rotate(-90 60 60)"/>
                      <text x="60" y="55" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
                        {item.value}%
                      </text>
                      <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#6b7280">
                        {item.name}
                      </text>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-8 mt-16">
          <p className="text-sm text-gray-400">ESG Finance Research Report - Appendix</p>
        </div>
      </div>
    </HybridPage>
  );
};