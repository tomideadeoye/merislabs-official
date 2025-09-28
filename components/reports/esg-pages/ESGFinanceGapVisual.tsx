import React from "react";

const ESGFinanceGapVisual: React.FC = () => {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold text-blue-600 mb-8 text-center">
        Visual 2: The ESG Finance Gap
      </h3>

      {/* Main Visual Container */}
      <div className="relative w-full max-w-4xl mx-auto" style={{ height: '500px' }}>
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full"
          style={{ maxHeight: '500px' }}
        >
          {/* Background */}
          <rect width="800" height="500" fill="transparent" />

          {/* Left Side - Demand (Orange) */}
          <g transform="translate(50, 50)">
            {/* SME Buildings Icons */}
            <g transform="translate(0, 0)">
              {/* Building 1 */}
              <rect x="20" y="20" width="25" height="35" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
              <rect x="25" y="15" width="15" height="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="1"/>
              <rect x="22" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="28" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="34" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="22" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="28" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="34" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
            </g>

            {/* Building 2 */}
            <g transform="translate(35, 5)">
              <rect x="20" y="20" width="20" height="40" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
              <rect x="22" y="15" width="16" height="8" fill="#FED7AA" stroke="#EA580C" strokeWidth="1"/>
              <rect x="23" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="29" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="35" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="23" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="29" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="35" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
            </g>

            {/* Building 3 */}
            <g transform="translate(60, 10)">
              <rect x="20" y="20" width="22" height="38" fill="#F97316" stroke="#EA580C" strokeWidth="1"/>
              <rect x="23" y="15" width="16" height="9" fill="#FED7AA" stroke="#EA580C" strokeWidth="1"/>
              <rect x="24" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="30" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="36" y="25" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="24" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="30" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
              <rect x="36" y="32" width="3" height="3" fill="#FFFFFF" opacity="0.8"/>
            </g>

            {/* Label */}
            <text x="45" y="80" textAnchor="middle" className="text-sm font-semibold fill-orange-600">
              Nigerian SMEs
            </text>

            {/* Demand-side constraints list */}
            <g transform="translate(0, 100)">
              <text x="45" y="0" textAnchor="middle" className="text-xs font-medium fill-orange-700 mb-2">
                Demand-Side Constraints:
              </text>
              <text x="10" y="20" className="text-xs fill-gray-700">• Lack of ESG Data/Metrics</text>
              <text x="10" y="35" className="text-xs fill-gray-700">• Limited Awareness</text>
              <text x="10" y="50" className="text-xs fill-gray-700">• Poor Reporting Capacity</text>
              <text x="10" y="65" className="text-xs fill-gray-700">• Limited Staff & Tools</text>
              <text x="10" y="80" className="text-xs fill-gray-700">• High Uncertainty</text>
              <text x="10" y="95" className="text-xs fill-gray-700">• Short-term Focus</text>
            </g>
          </g>

          {/* Right Side - Supply (Blue) */}
          <g transform="translate(550, 50)">
            {/* Financial Institution Building */}
            <g transform="translate(0, 0)">
              <rect x="20" y="20" width="40" height="45" fill="#3B82F6" stroke="#2563EB" strokeWidth="1"/>
              <rect x="25" y="15" width="30" height="10" fill="#BFDBFE" stroke="#2563EB" strokeWidth="1"/>
              {/* Windows */}
              <rect x="25" y="25" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="35" y="25" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="45" y="25" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="25" y="35" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="35" y="35" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="45" y="35" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="25" y="45" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="35" y="45" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
              <rect x="45" y="45" width="5" height="5" fill="#FFFFFF" opacity="0.8"/>
            </g>

            {/* Label */}
            <text x="40" y="80" textAnchor="middle" className="text-sm font-semibold fill-blue-600">
              Financial Institutions
            </text>
            <text x="40" y="95" textAnchor="middle" className="text-xs font-medium fill-blue-600">
              & Investors
            </text>

            {/* Supply-side constraints list */}
            <g transform="translate(0, 115)">
              <text x="40" y="0" textAnchor="middle" className="text-xs font-medium fill-blue-700 mb-2">
                Supply-Side Constraints:
              </text>
              <text x="5" y="20" className="text-xs fill-gray-700">• Complex Frameworks</text>
              <text x="5" y="35" className="text-xs fill-gray-700">• Data Dependence</text>
              <text x="5" y="50" className="text-xs fill-gray-700">• Weak ESG Ecosystem</text>
              <text x="5" y="65" className="text-xs fill-gray-700">• Sparse Incentives</text>
              <text x="5" y="80" className="text-xs fill-gray-700">• Fragmented Information</text>
            </g>
          </g>

          {/* The Gap - Broken Bridge/Chasm */}
          <g transform="translate(350, 200)">
            {/* Broken bridge segments */}
            <rect x="0" y="0" width="30" height="8" fill="#9CA3AF" transform="rotate(-15)"/>
            <rect x="35" y="-5" width="30" height="8" fill="#9CA3AF" transform="rotate(10)"/>
            <rect x="70" y="0" width="30" height="8" fill="#9CA3AF" transform="rotate(-20)"/>
            <rect x="105" y="-8" width="30" height="8" fill="#9CA3AF" transform="rotate(15)"/>

            {/* Bridge supports broken */}
            <rect x="10" y="10" width="4" height="20" fill="#6B7280"/>
            <rect x="45" y="5" width="4" height="15" fill="#6B7280"/>
            <rect x="80" y="12" width="4" height="18" fill="#6B7280"/>
            <rect x="115" y="2" width="4" height="16" fill="#6B7280"/>

            {/* Gap indicator */}
            <path d="M 0 25 Q 70 45 140 25" stroke="#EF4444" strokeWidth="3" fill="none" strokeDasharray="5,5"/>
            <text x="70" y="60" textAnchor="middle" className="text-sm font-bold fill-red-600">
              THE GAP
            </text>
          </g>

          {/* Locked Treasure Chest in the Middle */}
          <g transform="translate(350, 300)">
            {/* Treasure chest */}
            <rect x="20" y="15" width="40" height="25" fill="#92400E" stroke="#78350F" strokeWidth="2"/>
            <rect x="25" y="10" width="30" height="10" fill="#D97706" stroke="#78350F" strokeWidth="2"/>
            {/* Lock */}
            <circle cx="40" cy="22" r="3" fill="#374151" stroke="#1F2937" strokeWidth="1"/>
            <rect x="38" y="20" width="4" height="4" fill="#374151"/>
            {/* Gold lines */}
            <rect x="22" y="17" width="36" height="1" fill="#FCD34D"/>
            <rect x="22" y="20" width="36" height="1" fill="#FCD34D"/>
            <rect x="22" y="23" width="36" height="1" fill="#FCD34D"/>
            <rect x="22" y="26" width="36" height="1" fill="#FCD34D"/>
            <rect x="22" y="29" width="36" height="1" fill="#FCD34D"/>

            {/* Label */}
            <text x="40" y="55" textAnchor="middle" className="text-sm font-bold fill-amber-600">
              ESG-Linked Capital
            </text>
          </g>

          {/* Under-construction Bridge (Solution) */}
          <g transform="translate(300, 380)">
            {/* Construction bridge outline */}
            <path d="M 0 20 L 200 20" stroke="#6B7280" strokeWidth="4" fill="none" opacity="0.5"/>
            {/* Bridge supports under construction */}
            <rect x="20" y="20" width="6" height="25" fill="#9CA3AF" opacity="0.7"/>
            <rect x="80" y="20" width="6" height="25" fill="#9CA3AF" opacity="0.7"/>
            <rect x="140" y="20" width="6" height="25" fill="#9CA3AF" opacity="0.7"/>
            <rect x="170" y="20" width="6" height="25" fill="#9CA3AF" opacity="0.7"/>

            {/* Construction signs */}
            <rect x="85" y="5" width="30" height="15" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
            <text x="100" y="15" textAnchor="middle" className="text-xs font-bold fill-orange-800">
              WORK
            </text>
            <text x="100" y="25" textAnchor="middle" className="text-xs font-bold fill-orange-800">
              IN PROGRESS
            </text>

            {/* Label */}
            <text x="100" y="55" textAnchor="middle" className="text-sm font-semibold fill-blue-600">
              Actionable Recommendations
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export { ESGFinanceGapVisual };
