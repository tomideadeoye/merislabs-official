import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LabelList } from "recharts";

const SMEDominanceCharts: React.FC = () => {
  // Data for the three donut charts
  const businessData = [
    { name: "SME", value: 96, color: "hsl(221.2 83.2% 53.3%)" },
    { name: "Large", value: 4, color: "hsl(210 40% 96%)" },
  ];

  const gdpData = [
    { name: "SME", value: 48, color: "hsl(142.1 76.2% 36.3%)" },
    { name: "Other", value: 52, color: "hsl(210 40% 96%)" },
  ];

  const employmentData = [
    { name: "SME", value: 50, color: "hsl(32.5 94.6% 43.7%)" },
    { name: "Other", value: 50, color: "hsl(210 40% 96%)" },
  ];


  return (
    <div className="my-8">
      <h3 className="text-md font-semibold text-blue-600 mb-6 text-center">
        The Dominance of Nigerian SMEs
      </h3>

      <div className="grid grid-cols-3 gap-6">
        {/* Chart 1: % of Nigerian Businesses */}
        <div className="text-center">
          <h4 className="text-xs font-medium text-gray-700 mb-3">
            % of Nigerian Businesses
          </h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={businessData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {businessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <LabelList
                  dataKey="value"
                  position="center"
                  formatter={(label: React.ReactNode) => `${label}%`}
                  style={{ fill: 'white', fontSize: '14px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-600">SME (96%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-xs text-gray-600">Large (4%)</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Contribution to GDP */}
        <div className="text-center">
          <h4 className="text-xs font-medium text-gray-700 mb-3">
            Contribution to GDP
          </h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gdpData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {gdpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <LabelList
                  dataKey="value"
                  position="center"
                  formatter={(label: React.ReactNode) => `${label}%`}
                  style={{ fill: 'white', fontSize: '14px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">SME (48%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-xs text-gray-600">Other (52%)</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Share of Employment */}
        <div className="text-center">
          <h4 className="text-xs font-medium text-gray-700 mb-3">
            Share of Employment
          </h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {employmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <LabelList
                  dataKey="value"
                  position="center"
                  formatter={(label: React.ReactNode) => `${label}%`}
                  style={{ fill: 'white', fontSize: '14px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-600">SME (~50%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-xs text-gray-600">Other (~50%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SMEDominanceCharts };
