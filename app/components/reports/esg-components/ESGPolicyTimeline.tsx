import React from 'react';

export const ESGPolicyTimeline: React.FC = () => {
  return (
    <div className="my-4">
      <h3 className="text-lg font-semibold mb-4 text-blue-600">ESG Policy Implementation Roadmap</h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-marker completed">24</div>
            <div className="timeline-content">
              <h4>Initial Assessment</h4>
              <p>Baseline ESG evaluation completed</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker in-progress">25</div>
            <div className="timeline-content">
              <h4>Capacity Building</h4>
              <p>Training programs launched for 500 SMEs</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker planned">26</div>
            <div className="timeline-content">
              <h4>Regulatory Framework</h4>
              <p>New ESG disclosure requirements implemented</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker planned">27</div>
            <div className="timeline-content">
              <h4>Funding Mechanisms</h4>
              <p>Sustainable finance instruments deployed</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker planned">28</div>
            <div className="timeline-content">
              <h4>Full Compliance</h4>
              <p>Achieve 80% ESG compliance across sectors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
