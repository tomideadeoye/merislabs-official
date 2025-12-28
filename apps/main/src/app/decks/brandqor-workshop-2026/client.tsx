"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { slides, Slide, COLORS } from './slides';

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

// ============================================
// SLIDE COMPONENTS
// ============================================

function TitleSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F1115]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F1115] via-[#1a1c22] to-[#0F1115]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4A76A]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-20 text-center">
                <img src="/brandqor/public/logo/Transperent-46.png" alt="BrandQor" className="h-16 mb-12 opacity-80" />
                <h1 className="text-7xl font-extrabold text-white mb-6 tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {slide.title}
                </h1>
                <div className="w-24 h-1 bg-[#D4A76A] mb-8" />
                <p className="text-2xl text-white/70 font-light tracking-wide">{slide.subtitle}</p>
            </div>
        </div>
    );
}

function MirrorSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F1115]">
            <div className="absolute inset-0 bg-[url('/brandqor/public/brandqorposts/C1.png')] bg-cover bg-center opacity-10" />
            <div className="absolute inset-0 bg-[#0F1115]/80" />

            <div className="relative z-10 h-full flex items-center justify-center px-20">
                <h1 className="text-6xl font-bold text-white text-center leading-tight max-w-4xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {slide.title}
                </h1>
            </div>
        </div>
    );
}

function SplitMirrorSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full flex overflow-hidden">
            <div className="w-1/2 bg-[#0F1115] flex items-center justify-center p-16">
                <p className="text-3xl text-white/80 leading-relaxed whitespace-pre-line text-right">
                    {slide.leftText}
                </p>
            </div>
            <div className="w-1/2 bg-[#1a1c22] flex items-center justify-center p-16 relative">
                <div className="absolute top-0 right-0 w-2 h-full bg-[#D4A76A]" />
                <p className="text-3xl text-[#D4A76A] leading-relaxed whitespace-pre-line">
                    {slide.rightText}
                </p>
            </div>
        </div>
    );
}

function PainSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F1115]">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[600px] h-[600px] border border-white/5 rounded-full" />
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-20 text-center">
                <h1 className="text-5xl font-bold text-white mb-8 max-w-4xl leading-tight">
                    {slide.title}
                </h1>
                <p className="text-xl text-white/50 italic">{slide.subtitle}</p>
            </div>
        </div>
    );
}

function RevealSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F1115]">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#D4A76A]/10 to-transparent" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-20 text-center">
                <h1 className="text-8xl font-extrabold text-white mb-4">{slide.title}</h1>
                <p className="text-2xl text-white/60 mb-12">{slide.subtitle}</p>
                <div className="w-32 h-0.5 bg-[#D4A76A] mb-12" />
                <p className="text-xl text-[#D4A76A]">{slide.text}</p>
            </div>
        </div>
    );
}

function GridSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />
            <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-6 mt-8">
                {slide.caseStudies?.map((cs, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-[#D4A76A] mb-2">{cs.name}</h3>
                        <p className="text-white/70">{cs.result}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function IconRowSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />
            <div className="flex-1 flex items-center justify-center">
                <div className="flex gap-12">
                    {slide.icons?.map((item, i) => (
                        <div key={i} className={`flex flex-col items-center ${i === 0 ? 'text-[#D4A76A]' : 'text-white/80'}`}>
                            <span className="text-6xl mb-4">{item.icon}</span>
                            <span className="text-lg font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CaseStudySlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />
            <p className="text-white/60 text-lg mb-8">{slide.subtitle}</p>

            <div className="flex-1 flex gap-8">
                <div className="flex-1 flex gap-4">
                    {slide.timeline?.map((step, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="text-[#0FA3A3] text-sm font-mono mb-2">{step.month}</div>
                            <h4 className="text-white font-bold text-xl mb-4">{step.title}</h4>
                            <ul className="space-y-2">
                                {step.activities.map((a, j) => (
                                    <li key={j} className="text-white/60 text-sm flex items-start">
                                        <span className="w-1.5 h-1.5 bg-[#D4A76A] rounded-full mt-2 mr-2 flex-shrink-0" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {slide.highlight && (
                <div className="mt-6 bg-[#0FA3A3]/20 border border-[#0FA3A3]/40 rounded-xl px-8 py-4">
                    <p className="text-[#0FA3A3] font-bold text-lg">{slide.highlight}</p>
                </div>
            )}
        </div>
    );
}

function CaseRollupSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />
            <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 mt-8">
                {slide.caseStudies?.map((cs, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                        <h4 className="text-white font-bold mb-1">{cs.name}</h4>
                        <p className="text-[#D4A76A] text-lg font-semibold">{cs.result}</p>
                        {cs.metric && <p className="text-white/50 text-sm mt-1">{cs.metric}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function LoopSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />
            <p className="text-white/50 text-lg mb-8">{slide.subtitle}</p>

            <div className="flex-1 flex items-center justify-center">
                <div className="relative w-[500px] h-[500px]">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
                    <div className="absolute inset-8 border-2 border-dashed border-white/10 rounded-full" />

                    {slide.bullets?.map((b, i) => {
                        const angle = (i * 72 - 90) * (Math.PI / 180);
                        const x = 50 + 40 * Math.cos(angle);
                        const y = 50 + 40 * Math.sin(angle);
                        const isHighlight = b.text === 'No visibility';
                        return (
                            <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${x}%`, top: `${y}%` }}>
                                <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center ${isHighlight ? 'bg-red-500/20 border-2 border-red-500' : 'bg-white/10'}`}>
                                    <span className="text-2xl">{b.icon}</span>
                                </div>
                                <p className={`text-center text-sm mt-2 ${isHighlight ? 'text-red-400 font-bold' : 'text-white/70'}`}>{b.text}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function FlipLSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />
            <p className="text-white/50 mb-8">{slide.subtitle}</p>

            <div className="flex-1 flex items-center justify-center">
                <div className="relative w-[900px] h-[500px]">
                    {/* Axes */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0FA3A3]" />
                    <div className="absolute bottom-0 left-0 w-0.5 h-full bg-[#0FA3A3]" />

                    {/* Labels */}
                    <p className="absolute -left-16 top-1/2 -rotate-90 text-[#0FA3A3] font-mono text-sm">INFLUENCE</p>
                    <p className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-[#0FA3A3] font-mono text-sm">TIME</p>

                    {/* The Flip L curve */}
                    <svg className="absolute inset-0" viewBox="0 0 900 500" fill="none">
                        <path d="M 0 480 L 300 475 Q 450 470 550 400 Q 650 300 700 150 Q 750 50 850 20"
                            stroke="#D4A76A" strokeWidth="4" fill="none" />
                    </svg>

                    {/* Annotations */}
                    <div className="absolute left-[100px] bottom-[60px] text-white/50 text-sm">
                        quiet years
                    </div>
                    <div className="absolute right-[150px] top-[80px] text-[#D4A76A] font-bold">
                        BREAKOUT
                    </div>

                    {/* Inflection point */}
                    <div className="absolute left-[520px] top-[280px]">
                        <div className="w-4 h-4 bg-[#D4A76A] rounded-full animate-pulse" />
                        <p className="absolute left-6 top-0 text-[#D4A76A] text-sm font-semibold whitespace-nowrap">
                            Inflection Point
                        </p>
                    </div>

                    {/* Years lost indicator */}
                    <div className="absolute left-[200px] top-0 bottom-0 border-l-2 border-dashed border-red-500/50" />
                    <p className="absolute left-[160px] top-[50px] text-red-400 text-xs -rotate-90 whitespace-nowrap">
                        years lost by not showing up
                    </p>
                </div>
            </div>
        </div>
    );
}

function FlywheelSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />

            <div className="flex-1 flex items-center justify-center">
                <div className="relative w-[500px] h-[500px]">
                    <div className="absolute inset-0 border-4 border-[#D4A76A]/30 rounded-full" />
                    <div className="absolute inset-[60px] border-2 border-white/10 rounded-full" />
                    <div className="absolute inset-[150px] bg-[#D4A76A] rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-[#0F1115] font-bold text-xl">{slide.highlight}</span>
                    </div>

                    {slide.bullets?.map((b, i) => {
                        const angle = (i * 72 - 90) * (Math.PI / 180);
                        const x = 50 + 38 * Math.cos(angle);
                        const y = 50 + 38 * Math.sin(angle);
                        return (
                            <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${x}%`, top: `${y}%` }}>
                                <div className="bg-white/10 rounded-xl px-4 py-3 text-center">
                                    <span className="text-2xl block mb-1">{b.icon}</span>
                                    <span className="text-white text-sm font-medium">{b.text}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function BeforeAfterSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />

            <div className="flex-1 flex gap-8 mt-8">
                <div className="flex-1 bg-white/5 rounded-2xl p-10 border border-white/10">
                    <h3 className="text-white/50 text-2xl font-bold mb-6">Before</h3>
                    <div className="text-white/70 text-2xl leading-relaxed whitespace-pre-line">
                        {slide.leftText?.replace('Before:\n', '')}
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="w-16 h-16 bg-[#D4A76A] rounded-full flex items-center justify-center">
                        <span className="text-[#0F1115] text-2xl">→</span>
                    </div>
                </div>

                <div className="flex-1 bg-[#D4A76A]/10 rounded-2xl p-10 border border-[#D4A76A]/30">
                    <h3 className="text-[#D4A76A] text-2xl font-bold mb-6">After</h3>
                    <div className="text-[#D4A76A] text-2xl leading-relaxed whitespace-pre-line">
                        {slide.rightText?.replace('After:\n', '')}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CardsSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />

            <div className="flex-1 flex gap-4 mt-8">
                {slide.storyCards?.map((card, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col">
                        <span className="text-4xl mb-3">{card.icon}</span>
                        <h4 className="text-[#D4A76A] font-bold text-lg mb-2">{card.title}</h4>
                        <p className="text-white/70 text-sm mb-4 flex-1">{card.description}</p>
                        <p className="text-white/40 text-xs italic border-t border-white/10 pt-3">
                            {card.prompt}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ContentGridSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />

            <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-6 mt-8">
                {slide.bullets?.map((b, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-8 border border-white/10 flex flex-col items-center justify-center text-center">
                        <span className="text-5xl mb-4">{b.icon}</span>
                        <span className="text-white text-xl font-medium">{b.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UrgencySlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F1115]">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute text-6xl" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        transform: `rotate(${Math.random() * 30 - 15}deg)`,
                    }}>📅</div>
                ))}
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-20 text-center">
                <h1 className="text-5xl font-bold text-white mb-6">{slide.title}</h1>
                <p className="text-3xl text-[#D4A76A] font-light">{slide.subtitle}</p>
            </div>
        </div>
    );
}

function SilhouetteSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />

            <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-3 grid-rows-2 gap-8">
                    {slide.icons?.map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-[#D4A76A]/20 rounded-2xl flex items-center justify-center mb-3">
                                <span className="text-5xl">{item.icon}</span>
                            </div>
                            <span className="text-white font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MissionSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F1115]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F1115] via-[#1a1c22] to-[#0F1115]" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-20 text-center">
                <img src="/brandqor/public/logo/Transperent-46.png" alt="BrandQor" className="h-12 mb-12 opacity-60" />
                <h1 className="text-5xl font-bold text-white mb-4">{slide.title}</h1>
                <p className="text-2xl text-[#D4A76A] mb-12">{slide.subtitle}</p>
                <div className="w-24 h-0.5 bg-white/20 mb-8" />
                <p className="text-xl text-white/50">{slide.text}</p>
            </div>
        </div>
    );
}

function OfferIntroSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0FA3A3]/20 to-[#D4A76A]/20" />
            <div className="absolute inset-0 bg-[#0F1115]/90" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-20 text-center">
                <h1 className="text-5xl font-bold text-white mb-6">{slide.title}</h1>
                <p className="text-2xl text-white/60">{slide.subtitle}</p>
            </div>
        </div>
    );
}

function SplitOfferSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    const founders = ['Monthly video shoot', 'Batch content', 'Thought leadership articles', 'Distribution system', 'Team execution', '10x visibility potential'];
    const professionals = ['Bi-weekly 1:1', 'Content roadmap', 'Accountability', 'Growth metrics', 'Systems that fit 5–7 hrs/week'];

    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />

            <div className="flex-1 flex gap-8 mt-8">
                <div className="flex-1 bg-[#0FA3A3]/10 rounded-2xl p-8 border border-[#0FA3A3]/30 flex flex-col">
                    <h3 className="text-[#0FA3A3] text-2xl font-bold mb-6">Influence Engine — Founders</h3>
                    <ul className="space-y-4 flex-1">
                        {founders.map((item, i) => (
                            <li key={i} className="flex items-center text-white/80">
                                <span className="w-2 h-2 bg-[#0FA3A3] rounded-full mr-3" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button className="mt-6 bg-[#0FA3A3] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#0FA3A3]/80 transition">
                        Apply — Founders
                    </button>
                </div>

                <div className="flex-1 bg-[#D4A76A]/10 rounded-2xl p-8 border border-[#D4A76A]/30 flex flex-col">
                    <h3 className="text-[#D4A76A] text-2xl font-bold mb-6">BrandQor Exclusive — 9–5s</h3>
                    <ul className="space-y-4 flex-1">
                        {professionals.map((item, i) => (
                            <li key={i} className="flex items-center text-white/80">
                                <span className="w-2 h-2 bg-[#D4A76A] rounded-full mr-3" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button className="mt-6 bg-[#D4A76A] text-[#0F1115] py-3 px-6 rounded-xl font-bold hover:bg-[#D4A76A]/80 transition">
                        Apply — 9–5s
                    </button>
                </div>
            </div>
        </div>
    );
}

function ValueStackSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />

            <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
                {slide.valueStack?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/10">
                        <span className="text-white text-xl">{item.item}</span>
                        <span className="text-white/50 line-through">{item.value}</span>
                    </div>
                ))}

                <div className="mt-8 bg-[#D4A76A]/20 rounded-xl p-6 text-center">
                    <p className="text-white/60 mb-2">Total value</p>
                    <p className="text-[#D4A76A] text-3xl font-bold">{slide.highlight}</p>
                </div>

                <div className="mt-6 bg-[#0FA3A3] rounded-xl p-6 text-center">
                    <p className="text-white/80 text-sm mb-1">Today's Price</p>
                    <p className="text-white text-4xl font-extrabold">{slide.subtitle}</p>
                </div>
            </div>
        </div>
    );
}

function TimelineSlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />

            <div className="flex-1 flex items-center">
                <div className="w-full relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#0FA3A3] via-[#D4A76A] to-[#D4A76A] -translate-y-1/2" />

                    <div className="flex justify-between relative">
                        {slide.timeline?.map((step, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div className="w-16 h-16 bg-[#0F1115] border-4 border-[#D4A76A] rounded-full flex items-center justify-center mb-4 z-10">
                                    <span className="text-[#D4A76A] font-bold">{i + 1}</span>
                                </div>
                                <h4 className="text-white font-bold text-lg mb-2">{step.title}</h4>
                                <p className="text-[#0FA3A3] text-sm font-mono mb-3">{step.month}</p>
                                <ul className="text-white/60 text-sm text-center space-y-1">
                                    {step.activities.map((a, j) => (
                                        <li key={j}>{a}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ScarcitySlide({ slide, slideNumber }: { slide: Slide; slideNumber: number }) {
    return (
        <div className="w-full h-full bg-[#0F1115] p-16 flex flex-col">
            <Header title={slide.title} slideNumber={slideNumber} />
            <p className="text-[#D4A76A] text-xl mb-8">{slide.subtitle}</p>

            <div className="flex-1 flex gap-6">
                {slide.testimonials?.map((t, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col">
                        <p className="text-white/80 text-lg italic flex-1">"{t.text}"</p>
                        <p className="text-[#D4A76A] font-medium mt-4">— {t.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EmotionalReturnSlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F1115]">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#D4A76A]/20 to-transparent" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-20 text-center">
                <h1 className="text-4xl font-bold text-white mb-8 max-w-3xl leading-relaxed">
                    {slide.title}
                </h1>
                <div className="w-24 h-0.5 bg-[#D4A76A] mb-8" />
                <p className="text-2xl text-[#D4A76A]">{slide.subtitle}</p>
            </div>
        </div>
    );
}

function CTASlide({ slide }: { slide: Slide }) {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0F1115]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F1115] via-[#1a1c22] to-[#0F1115]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A76A] to-transparent" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-20 text-center">
                <h1 className="text-6xl font-extrabold text-white mb-4">{slide.title}</h1>
                <p className="text-2xl text-white/60 mb-12">{slide.subtitle}</p>

                <div className="flex gap-6">
                    <button className="bg-[#D4A76A] text-[#0F1115] py-4 px-10 rounded-xl font-bold text-xl hover:bg-[#D4A76A]/80 transition">
                        Apply Now
                    </button>
                    <button className="border-2 border-white/30 text-white py-4 px-10 rounded-xl font-bold text-xl hover:bg-white/10 transition">
                        Book a Call
                    </button>
                </div>

                <div className="mt-16 flex items-center gap-8">
                    <img src="/brandqor/public/logo/Transperent-46.png" alt="BrandQor" className="h-10 opacity-60" />
                    <span className="text-white/40">|</span>
                    <span className="text-white/40">hello@brandqor.com</span>
                </div>
            </div>
        </div>
    );
}

// Header component
function Header({ title, slideNumber }: { title: string; slideNumber: number }) {
    return (
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
                <div className="w-16 h-1 bg-[#D4A76A]" />
            </div>
            <span className="text-white/10 text-8xl font-bold leading-none">
                {String(slideNumber).padStart(2, '0')}
            </span>
        </div>
    );
}

// ============================================
// MAIN CLIENT COMPONENT
// ============================================

export default function BrandQorWorkshopClient() {
    const { setTheme } = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPrintMode, setIsPrintMode] = useState(false);

    useEffect(() => { setTheme('dark'); }, [setTheme]);

    const nextSlide = useCallback(() => {
        if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    }, [currentSlide]);

    const prevSlide = useCallback(() => {
        if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
    }, [currentSlide]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    const renderSlide = (slideData: Slide, index: number) => {
        const props = { slide: slideData, slideNumber: index + 1 };
        switch (slideData.type) {
            case 'title': return <TitleSlide slide={slideData} />;
            case 'mirror': return <MirrorSlide slide={slideData} />;
            case 'splitMirror': return <SplitMirrorSlide slide={slideData} />;
            case 'pain': return <PainSlide slide={slideData} />;
            case 'reveal': return <RevealSlide slide={slideData} />;
            case 'grid': return <GridSlide {...props} />;
            case 'iconRow': return <IconRowSlide {...props} />;
            case 'caseStudy': return <CaseStudySlide {...props} />;
            case 'caseRollup': return <CaseRollupSlide {...props} />;
            case 'loop': return <LoopSlide {...props} />;
            case 'flipL': return <FlipLSlide {...props} />;
            case 'flywheel': return <FlywheelSlide {...props} />;
            case 'beforeAfter': return <BeforeAfterSlide {...props} />;
            case 'cards': return <CardsSlide {...props} />;
            case 'contentGrid': return <ContentGridSlide {...props} />;
            case 'urgency': return <UrgencySlide slide={slideData} />;
            case 'silhouette': return <SilhouetteSlide {...props} />;
            case 'mission': return <MissionSlide slide={slideData} />;
            case 'offerIntro': return <OfferIntroSlide slide={slideData} />;
            case 'splitOffer': return <SplitOfferSlide {...props} />;
            case 'valueStack': return <ValueStackSlide {...props} />;
            case 'timeline': return <TimelineSlide {...props} />;
            case 'scarcity': return <ScarcitySlide {...props} />;
            case 'emotionalReturn': return <EmotionalReturnSlide slide={slideData} />;
            case 'cta': return <CTASlide slide={slideData} />;
            default: return <MirrorSlide slide={slideData} />;
        }
    };

    if (isPrintMode) {
        return (
            <div className="bg-white min-h-screen">
                <style jsx global>{`
                    @media print {
                        @page { size: A4 landscape; margin: 0; }
                        .print-slide { width: 297mm !important; height: 210mm !important; page-break-after: always; }
                        .no-print { display: none !important; }
                    }
                `}</style>
                <div className="no-print bg-[#0F1115] p-4 sticky top-0 z-50 flex justify-between items-center">
                    <span className="text-white">Print mode — Use Landscape orientation</span>
                    <button onClick={() => setIsPrintMode(false)} className="px-4 py-2 bg-[#D4A76A] text-[#0F1115] rounded-lg font-bold">
                        ← Back
                    </button>
                </div>
                <div className="p-8">
                    {slides.map((s, i) => (
                        <div key={i} className="print-slide mb-8 mx-auto" style={{ aspectRatio: '16/9', maxWidth: '1120px' }}>
                            {renderSlide(s, i)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen bg-[#0F1115] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative bg-[#0F1115] shadow-2xl overflow-hidden rounded-lg"
                style={{ width: '1280px', height: '720px', maxWidth: '95vw', maxHeight: '85vh', aspectRatio: '16/9' }}>
                {renderSlide(slides[currentSlide], currentSlide)}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6">
                <button onClick={prevSlide} disabled={currentSlide === 0}
                    className="px-5 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30 hover:bg-white/20 border border-white/20">
                    ← Previous
                </button>
                <div className="flex gap-1">
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-[#D4A76A] w-6' : 'bg-white/30 hover:bg-white/50'}`} />
                    ))}
                </div>
                <button onClick={nextSlide} disabled={currentSlide === slides.length - 1}
                    className="px-5 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30 hover:bg-white/20 border border-white/20">
                    Next →
                </button>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-4">
                <span className="text-white/40 text-sm font-mono">{currentSlide + 1} / {slides.length}</span>
                <button onClick={() => setIsPrintMode(true)} className="px-3 py-1 text-xs bg-white/10 text-white rounded hover:bg-white/20">
                    Print
                </button>
            </div>
        </div>
    );
}
