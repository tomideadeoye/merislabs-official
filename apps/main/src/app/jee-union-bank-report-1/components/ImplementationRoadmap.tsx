'use client';

import React from 'react';
import { Zap, Users, ShieldCheck, ArrowDown } from 'lucide-react';

interface RoadmapStepProps {
    icon: React.ReactNode;
    title: string;
    timeline: string;
    description: string;
    isActive?: boolean;
}

const RoadmapStep: React.FC<RoadmapStepProps> = ({ icon, title, timeline, description, isActive }) => (
    <div className="relative flex flex-col items-center group">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10
            ${isActive ? 'bg-[#0A1930] border-[#009fe3] text-[#009fe3] shadow-xl scale-110' : 'bg-white border-slate-200 text-slate-400 opacity-60'}`}>
            {icon}
        </div>

        <div className="mt-4 text-center max-w-[200px]">
            <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-[#009fe3]' : 'text-slate-400'}`}>
                {timeline}
            </div>
            <h4 className="text-sm font-serif font-bold text-[#0A1930] mb-2">{title}</h4>
            <p className="text-[10px] leading-relaxed text-slate-500 px-2">{description}</p>
        </div>
    </div>
);

export const ImplementationRoadmap = () => {
    return (
        <div className="w-full py-8 px-4 bg-slate-50/50 rounded-2xl border border-slate-100 mt-6 not-prose">
            <div className="text-center mb-12">
                <h3 className="text-lg font-serif font-bold text-[#0A1930] uppercase tracking-widest">
                    Timelines
                </h3>
                <div className="w-12 h-1 bg-[#009fe3] mx-auto mt-2" />
            </div>

            <div className="relative flex justify-between items-start max-w-4xl mx-auto">
                {/* Horizontal Connector Line */}
                <div className="absolute top-8 left-0 right-0 h-[2px] bg-slate-200 -z-0" />
                <div className="absolute top-8 left-0 h-[2px] bg-gradient-to-r from-[#009fe3] to-[#0A1930] w-[66%] -z-0" />

                <RoadmapStep
                    timeline="Immediate (30 Days)"
                    title="Standardisation & Adoption"
                    description="Migration to the standardised documentation suite within 30 days of report adoption."
                    icon={<Zap className="w-8 h-8" />}
                    isActive={true}
                />

                <RoadmapStep
                    timeline="Phase 2 (3 Months)"
                    title="Institutional Training"
                    description="Rollout of structured training programmes within 3 months."
                    icon={<Users className="w-8 h-8" />}
                    isActive={true}
                />

                <RoadmapStep
                    timeline="Final Phase (12 Months)"
                    title="Compliance Audit"
                    description="First internal documentation compliance audit within 12 months of adoption."
                    icon={<ShieldCheck className="w-8 h-8" />}
                    isActive={false}
                />
            </div>

            {/* Bottom Insight Bar */}
            <div className="mt-16 flex items-center gap-4 bg-[#0A1930] p-4 rounded-lg">
                <div className="w-1 h-8 bg-[#009fe3]" />
                <p className="text-xs text-white/80 font-medium">
                    <span className="text-[#009fe3] font-bold">Insight:</span> The phased approach ensures that operational friction is minimised while institutional resilience is built through continuous verification and training.
                </p>
            </div>
        </div>
    );
};
