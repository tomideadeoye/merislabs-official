import React from 'react';
import { priorities2026 } from '../data';
import { useDeckNavigation } from './NavigationContext';
import { Target } from 'lucide-react';

const PrioritiesSlide = () => {
    const { goToSlideById } = useDeckNavigation();
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#F9F7ED] font-sans text-[#211B1B]">
            {/* Background branding */}
            <div className="absolute top-12 left-12 right-12 z-50 flex justify-between items-center border-b border-[#211B1B]/10 pb-6">
                <div className="flex items-center space-x-4">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="JEE"
                        className="h-6 w-auto object-contain opacity-80"
                    />
                    <div className="h-4 w-px bg-[#211B1B]/20" />
                    <span className="text-[#211B1B]/40 text-[10px] font-bold tracking-[0.4em] uppercase">Strategic Roadmap . 2026</span>
                </div>
            </div>

            {/* Scale background indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#211B1B]/[0.02] text-[40rem] font-black italic select-none z-0">
                P
            </div>

            {/* Main Content Container */}
            <div className="absolute inset-0 top-32 left-12 right-12 bottom-12 z-20 grid grid-cols-12 gap-8">

                {/* Visual Section */}
                <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
                    <div className="relative group p-8 glass-card aspect-square flex flex-col items-center justify-center text-center overflow-hidden">
                        <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition-colors" />
                        <Target className="w-24 h-24 text-red-600 mb-6 opacity-80 group-hover:scale-110 transition-transform duration-500" />
                        <h3 className="text-[#211B1B] text-xl font-bold uppercase tracking-widest leading-tight"> Precision <br /><span className="text-red-600">Execution</span></h3>
                        <p className="mt-4 text-[#211B1B]/40 text-[10px] uppercase tracking-[0.3em] font-bold">Securing positive outcomes</p>
                    </div>
                </div>

                {/* Text Content - TIGHTENED FOR PDF */}
                <div className="col-span-12 lg:col-span-8 flex flex-col justify-center space-y-6">
                    <div className="mb-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="h-[1px] w-8 bg-red-600" />
                            <span className="text-red-500 font-bold tracking-[0.4em] text-[10px] uppercase">Execution Priorities</span>
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#211B1B] via-[#211B1B] to-[#211B1B]/50">
                            Forward <span className="opacity-50">Strategy</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {priorities2026.split('\n\n').map((paragraph, index) => (
                            <div key={index} className="glass-card p-6 border-l-2 border-l-red-600 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
                                <div className="flex items-start space-x-6">
                                    <span className="text-red-600 font-mono text-xl font-black italic opacity-50">
                                        0{index + 1}
                                    </span>
                                    <p className="text-[#211B1B]/70 leading-relaxed text-[13px] text-justify max-w-[95%]">
                                        {paragraph}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between opacity-50">
                        <span className="text-[10px] font-mono tracking-widest uppercase">Strategy Module . Ref. BK-2026</span>
                        <div className="h-px flex-1 mx-8 bg-[#211B1B]/10" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">Jackson, Etti & Edu</span>
                    </div>
                </div>
            </div>

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.05)_0%,transparent_50%)] z-0" />
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <style jsx>{`
                .glass-card {
                    background: rgba(33, 27, 27, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(33, 27, 27, 0.05);
                }
            `}</style>
        </div>
    );
};

export default PrioritiesSlide;
