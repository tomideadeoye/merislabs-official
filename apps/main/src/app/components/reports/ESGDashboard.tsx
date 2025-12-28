import React, { useState } from 'react';
import {
  TrendingUp, Building, Building2,
  Target, ArrowRight, Users, DollarSign, AlertTriangle,
  XCircle, Link, FileText, BarChart
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Treemap } from 'recharts';
import { ChartHeader } from '../infographics/helpers';

// Export all section components
export const IntroductionSection = () => {
  const smeData = [
    { name: 'Businesses', value: 96, color: '#3B82F6' },
    { name: 'GDP Contribution', value: 48, color: '#10B981' },
    { name: 'Employment', value: 50, color: '#F59E0B' }
  ];

  const globalComparison = [
    { region: 'Global', businesses: 90, employment: 50 },
    { region: 'Africa', businesses: 90, employment: 80 },
    { region: 'Nigeria', businesses: 96, employment: 50 }
  ];

  return (
		<div className="section introduction">
			<div className="chart-container">
				<ChartHeader title="Nigerian SME Dominance" />

				<div className="donut-charts flex justify-center gap-8 flex-wrap">
					{smeData.map((item) => (
						<div key={item.name} className="donut-chart">
							<svg height="70" viewBox="0 0 120 120">
								<circle
									cx="60"
									cy="60"
									r="50"
									fill="none"
									stroke="#e0e0e0"
									strokeWidth="10"
								/>
								<circle
									cx="60"
									cy="60"
									r="50"
									fill="none"
									stroke={item.color}
									strokeWidth="10"
									strokeDasharray={`${item.value * 3.14} ${
										(100 - item.value) * 3.14
									}`}
									transform="rotate(-90 60 60)"
								/>
								<text
									x="60"
									y="60"
									textAnchor="middle"
									dy="7"
									fontSize="20"
									fontWeight="bold"
								>
									{item.value}%
								</text>
							</svg>
							<div className="donut-label">{item.name}</div>
						</div>
					))}
				</div>
			</div>

			<div className="comparison-chart">
				<ChartHeader title="Global SME Comparison" />
				<ResponsiveContainer width="100%" height={200}>
					<RechartsBarChart data={globalComparison}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="region" />
						<YAxis domain={[0, 100]} />
						<Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
						<Bar dataKey="businesses" fill="#3B82F6" name="Businesses (%)" />
						<Bar dataKey="employment" fill="#10B981" name="Employment (%)" />
					</RechartsBarChart>
				</ResponsiveContainer>
				{/* Static Legend for PDF Export */}
				<div className="flex justify-center mt-4 space-x-2">
					<div className="flex items-center">
						<div className="w-4 h-4 bg-blue-500 rounded mx-1"></div>
						<span className="text-sm">Businesses (%)</span>
					</div>
					<div className="flex items-center">
						<div className="w-4 h-4 bg-green-500 rounded mx-1"></div>
						<span className="text-sm">Employment (%)</span>
					</div>
				</div>
				{/* Data Table for Clarity */}
				<div className="mt-4 overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Region
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Businesses (%)
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Employment (%)
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{globalComparison.map((region, index) => (
								<tr key={index}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{region.region}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">
										{region.businesses}%
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
										{region.employment}%
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export const DemandSideSection = () => {
  const internalBarriers = [
    { barrier: 'Limited Awareness', impact: 85, severity: 'High' },
    { barrier: 'Poor Reporting Capacity', impact: 90, severity: 'High' },
    { barrier: 'Limited Staff & Tools', impact: 75, severity: 'Medium' },
    { barrier: 'High Uncertainty', impact: 65, severity: 'Medium' },
    { barrier: 'Short-term Focus', impact: 70, severity: 'High' }
  ];


  const priorityChallenges = [
    { challenge: 'Access to Finance', percentage: 35 },
    { challenge: 'Falling Sales', percentage: 52 },
    { challenge: 'Regulatory Burden', percentage: 25 },
    { challenge: 'Infrastructure', percentage: 20 }
  ];

  return (
    <div className="section demand-side">
      <div className="barriers-chart">
        <h3>Internal Barriers Impact Assessment</h3>
        <div className="impact-bars">
          {internalBarriers.map((item) => (
            <div key={item.barrier} className="impact-bar">
              <div className="barrier-name">{item.barrier}</div>
              <div className="impact-visual">
                <div
                  className="impact-level"
                  style={{ width: `${item.impact}%` }}
                  data-severity={item.severity.toLowerCase()}
                >
                  <span className="impact-value">{item.impact}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reporting-gap-chart">
        <h3>Sustainability Reporting Gap</h3>
        <div className="gap-visualization">
          <div className="gap-item">
            <div className="gap-bar" style={{ height: '83%' }}>
              <span>83%</span>
            </div>
            <div className="gap-label">Recognize Importance</div>
          </div>
          <div className="gap-arrow">
            <ArrowRight size={32} />
          </div>
          <div className="gap-item">
            <div className="gap-bar" style={{ height: '8%' }}>
              <span>8%</span>
            </div>
            <div className="gap-label">Actually Report</div>
          </div>
        </div>
      </div>

      <div className="priority-challenges">
        <h3>Top SME Challenges (PwC Survey 2024)</h3>
        <div className="challenge-bars">
          {priorityChallenges.map((item) => (
            <div key={item.challenge} className="challenge-bar">
              <div className="challenge-label">{item.challenge}</div>
              <div className="challenge-visual">
                <div
                  className="challenge-percentage"
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SupplySideSection = () => {
  const riskTransmission = [
    { from: 'Environmental', to: 'Credit Risk', strength: 85 },
    { from: 'Environmental', to: 'Market Risk', strength: 70 },
    { from: 'Social', to: 'Operational Risk', strength: 75 },
    { from: 'Social', to: 'Reputational Risk', strength: 80 },
    { from: 'Governance', to: 'Credit Risk', strength: 90 },
    { from: 'Governance', to: 'Liquidity Risk', strength: 65 }
  ];

  const assessmentChallenges = [
    { challenge: 'Data Scarcity', impact: 90, icon: AlertTriangle },
    { challenge: 'Inconsistency', impact: 75, icon: XCircle },
    { challenge: 'Lack of Integration', impact: 80, icon: Link }
  ];

  return (
    <div className="section supply-side">
      <div className="risk-transmission">
        <h3>ESG Risk Transmission Channels</h3>
        <div className="sankey-diagram">
          {riskTransmission.map((item) => (
            <div key={`${item.from}-${item.to}`} className="transmission-line">
              <div className="line-source">{item.from}</div>
              <div className="line-connector">
                <div
                  className="connection-strength"
                  style={{ width: `${item.strength}%` }}
                ></div>
              </div>
              <div className="line-target">{item.to}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="assessment-challenges">
        <h3>Challenges in Assessing Sustainability Risks</h3>
        <div className="challenge-cards">
          {assessmentChallenges.map(({ challenge, impact, icon: Icon }) => (
            <div key={challenge} className="challenge-card">
              <div className="challenge-icon">
                <Icon size={32} />
              </div>
              <div className="challenge-content">
                <h4>{challenge}</h4>
                <div className="impact-meter">
                  <div
                    className="impact-fill"
                    style={{ width: `${impact}%` }}
                  >
                    {impact}% Impact
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdvancedAnalyticsSection = () => {
  // ESG Radar Chart Data
  const esgRadarData = [
    { dimension: 'Environmental', current: 65, target: 85, fullMark: 100 },
    { dimension: 'Social', current: 70, target: 90, fullMark: 100 },
    { dimension: 'Governance', current: 60, target: 80, fullMark: 100 },
    { dimension: 'Economic', current: 75, target: 95, fullMark: 100 },
    { dimension: 'Innovation', current: 55, target: 75, fullMark: 100 }
  ];

  // Timeline Data for Policy Implementation
  const timelineData = [
    { year: '2024', policies: 2, funding: 500, awareness: 30 },
    { year: '2025', policies: 5, funding: 1200, awareness: 45 },
    { year: '2026', policies: 8, funding: 2100, awareness: 65 },
    { year: '2027', policies: 12, funding: 3500, awareness: 80 },
    { year: '2028', policies: 15, funding: 5200, awareness: 90 }
  ];

  // Sector Impact Data for Tree Map
  const sectorData = [
    { name: 'Manufacturing', size: 35, color: '#3B82F6' },
    { name: 'Agriculture', size: 25, color: '#10B981' },
    { name: 'Services', size: 20, color: '#F59E0B' },
    { name: 'Construction', size: 10, color: '#EF4444' },
    { name: 'Technology', size: 7, color: '#8B5CF6' },
    { name: 'Others', size: 3, color: '#6B7280' }
  ];

  // Compliance Gauge Data
  const complianceData = [
    { name: 'Nigeria SMEs', value: 35, color: '#EF4444' },
    { name: 'Global Average', value: 68, color: '#10B981' },
    { name: 'EU Standards', value: 92, color: '#3B82F6' }
  ];

  return (
    <div className="section advanced-analytics">
      {/* KPI Dashboard */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">35%</div>
          <div className="kpi-label">ESG Compliance Rate</div>
          <div className="kpi-change negative">↓ 5% from last year</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">$2.1B</div>
          <div className="kpi-label">Sustainable Funding Gap</div>
          <div className="kpi-change positive">↑ 15% addressed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">68%</div>
          <div className="kpi-label">Awareness Level</div>
          <div className="kpi-change positive">↑ 12% improvement</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-value">1,247</div>
          <div className="kpi-label">SMEs Trained</div>
          <div className="kpi-change positive">↑ 340% increase</div>
        </div>
      </div>

      {/* Risk Assessment Heat Map */}
      <div className="chart-card">
        <h3>ESG Risk Assessment Matrix</h3>
        <div className="heat-map">
          {[
            { risk: 'High', likelihood: 'High', value: 'Critical' },
            { risk: 'High', likelihood: 'Medium', value: 'High' },
            { risk: 'High', likelihood: 'Low', value: 'Medium' },
            { risk: 'Medium', likelihood: 'High', value: 'High' },
            { risk: 'Medium', likelihood: 'Medium', value: 'Medium' },
            { risk: 'Medium', likelihood: 'Low', value: 'Low' },
            { risk: 'Low', likelihood: 'High', value: 'Medium' },
            { risk: 'Low', likelihood: 'Medium', value: 'Low' },
            { risk: 'Low', likelihood: 'Low', value: 'Low' }
          ].map((cell) => (
            <div key={`${cell.risk}-${cell.likelihood}`} className={`heat-cell ${cell.value.toLowerCase()}`}>
              {(() => {
                switch (cell.value) {
                  case 'Critical':
                    return '!';
                  case 'High':
                    return 'H';
                  case 'Medium':
                    return 'M';
                  case 'Low':
                    return 'L';
                  default:
                    return 'L';
                }
              })()}
            </div>
          ))}
        </div>
        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#7f1d1d' }}></div>
            <span className="legend-label">Critical</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#fecaca' }}></div>
            <span className="legend-label">High</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#fed7aa' }}></div>
            <span className="legend-label">Medium</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#dbeafe' }}></div>
            <span className="legend-label">Low</span>
          </div>
        </div>
      </div>

      {/* Policy Implementation Timeline */}
      <div className="chart-card">
        <h3>ESG Policy Implementation Timeline</h3>
        <div className="timeline-container">
          {[
            { year: '2024', title: 'Initial Assessment', description: 'Baseline ESG evaluation completed', status: 'completed' },
            { year: '2025', title: 'Capacity Building', description: 'Training programs launched for 500 SMEs', status: 'in-progress' },
            { year: '2026', title: 'Regulatory Framework', description: 'New ESG disclosure requirements implemented', status: 'planned' },
            { year: '2027', title: 'Funding Mechanisms', description: 'Sustainable finance instruments deployed', status: 'planned' },
            { year: '2028', title: 'Full Compliance', description: 'Achieve 80% ESG compliance across sectors', status: 'planned' }
          ].map((item) => (
            <div key={`${item.year}-${item.title}`} className="timeline-item">
              <div className={`timeline-marker ${item.status}`}>
                {item.year.slice(-2)}
              </div>
              <div className="timeline-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-grid">
        {/* ESG Performance Radar Chart */}
        <div className="chart-card">
          <h3>ESG Performance Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={esgRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Policy Implementation Timeline */}
        <div className="chart-card">
          <h3>Policy Implementation Roadmap</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="policies" stroke="#3B82F6" strokeWidth={3} name="Policies" />
              <Line yAxisId="right" type="monotone" dataKey="funding" stroke="#10B981" strokeWidth={3} name="Funding (M)" />
              <Line yAxisId="right" type="monotone" dataKey="awareness" stroke="#F59E0B" strokeWidth={3} name="Awareness (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Impact Tree Map */}
        <div className="chart-card">
          <h3>Sector-wise ESG Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={sectorData}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip formatter={(value) => [`${value}%`, 'Impact']} />
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* Compliance Gauges */}
        <div className="chart-card">
          <h3>ESG Compliance Levels</h3>
          <div className="gauge-container">
            {complianceData.map((item) => (
              <div key={item.name} className="gauge-item">
                <div className="gauge">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="10"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke={item.color} strokeWidth="10"
                      strokeDasharray={`${item.value * 3.14} ${(100 - item.value) * 3.14}`}
                      transform="rotate(-90 60 60)"/>
                    <text x="60" y="55" textAnchor="middle" fontSize="16" fontWeight="bold">
                      {item.value}%
                    </text>
                    <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#666">
                      {item.name}
                    </text>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholder Network Visualization */}
        <div className="chart-card">
          <h3>Stakeholder Relationships</h3>
          <div className="network-diagram">
            <div className="network-node central">
              <div className="node-circle">SMEs</div>
            </div>
            <div className="network-connections">
              <div className="connection-group">
                <div className="network-node">
                  <div className="node-circle small">Banks</div>
                </div>
                <div className="network-node">
                  <div className="node-circle small">Regulators</div>
                </div>
              </div>
              <div className="connection-group">
                <div className="network-node">
                  <div className="node-circle small">Investors</div>
                </div>
                <div className="network-node">
                  <div className="node-circle small">NGOs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Flow Waterfall */}
        <div className="chart-card">
          <h3>ESG Impact Flow Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={[
              { name: 'Initial', value: 100, color: '#6B7280' },
              { name: 'Awareness', value: -20, color: '#EF4444' },
              { name: 'Training', value: 15, color: '#10B981' },
              { name: 'Implementation', value: -10, color: '#EF4444' },
              { name: 'Monitoring', value: 25, color: '#10B981' },
              { name: 'Compliance', value: -5, color: '#EF4444' },
              { name: 'Final Impact', value: 105, color: '#3B82F6' }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const ConclusionSection = () => {
  const actionAreas = [
    { area: 'Simplified Standards', impact: 90, feasibility: 70 },
    { area: 'Data Infrastructure', impact: 85, feasibility: 50 },
    { area: 'Capacity Building', impact: 80, feasibility: 75 },
    { area: 'Policy Incentives', impact: 75, feasibility: 60 }
  ];

  return (
    <div className="section conclusion">
      <div className="gap-bridge-visual">
        <h3>Bridging the ESG Finance Gap</h3>
        <div className="bridge-diagram">
          <div className="bridge-side demand-side">
            <Building size={48} />
            <h4>SME Challenges</h4>
            <ul>
              <li>Data Gaps</li>
              <li>Awareness</li>
              <li>Resources</li>
            </ul>
          </div>

          <div className="bridge-construction">
            <div className="bridge-pillar">
              <Target size={24} />
              <span>Clear Standards</span>
            </div>
            <div className="bridge-pillar">
              <Users size={24} />
              <span>Capacity Building</span>
            </div>
            <div className="bridge-pillar">
              <DollarSign size={24} />
              <span>Incentives</span>
            </div>
          </div>

          <div className="bridge-side supply-side">
            <Building2 size={48} />
            <h4>FI Requirements</h4>
            <ul>
              <li>Robust Data</li>
              <li>Compliance</li>
              <li>Risk Management</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="action-priorities">
        <h3>Key Action Areas</h3>
        <div className="priority-matrix">
          <div className="matrix-axis">
            <span className="axis-label">Low Feasibility</span>
            <span className="axis-label">High Feasibility</span>
          </div>
          <div className="matrix-grid">
            {actionAreas.map((item) => (
              <div
                key={item.area}
                className="priority-bubble"
                style={{
                  left: `${item.feasibility}%`,
                  bottom: `${item.impact}%`,
                  transform: 'translate(-50%, 50%)'
                }}
              >
                <div className="bubble-content">
                  {item.area}
                  <div className="bubble-stats">
                    Impact: {item.impact}% | Feas: {item.feasibility}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ESGDashboard = () => {
  const [activeSection, setActiveSection] = useState('demand-side');

  const sections = [
    { id: 'demand-side', label: 'Demand Side', icon: Building },
    { id: 'supply-side', label: 'Supply Side', icon: Building2 },
    { id: 'advanced-analytics', label: 'Advanced Analytics', icon: BarChart },
    { id: 'conclusion', label: 'Conclusion', icon: Target }
  ];

  return (
    <div className="esg-dashboard">

      <nav className="dashboard-nav">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activeSection === id ? 'active' : ''}`}
            onClick={() => setActiveSection(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeSection === 'demand-side' && <DemandSideSection />}
        {activeSection === 'supply-side' && <SupplySideSection />}
        {activeSection === 'advanced-analytics' && <AdvancedAnalyticsSection />}
        {activeSection === 'conclusion' && <ConclusionSection />}
      </main>
    </div>
  );
};

export default ESGDashboard;
