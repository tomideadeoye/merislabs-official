'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf, Users, ShieldCheck, TrendingUp, BarChart3, AlertCircle, ArrowRight } from 'lucide-react';

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

export default function ESGReportPage() {
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 font-sans selection:bg-green-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10 bg-[#08090d]/80">
        <div className="max-width-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-header text-xl font-bold tracking-tighter bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            ORION | LEGAL
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">The Focus</a>
            <a href="#stats" className="hover:text-white transition-colors">The Data</a>
            <a href="#barriers" className="hover:text-white transition-colors">The Barriers</a>
            <a href="#wayforward" className="hover:text-white transition-colors">Impact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/esg-hero.png"
            alt="ESG Nigeria"
            fill
            className="object-cover opacity-50 grayscale-[20%] brightness-[0.6]"
            priority
          />
          <div className="absolute inset-0 bg-radial-gradient from-green-500/5 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-widest mb-6">
              Special Report 2026
            </span>
            <h1 className="font-header text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Bridging the <br />
              <span className="text-green-500">ESG Finance</span> Gap
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              A comprehensive analysis of demand and supply-side constraints facing Nigerian Small and Medium-sized Enterprises (SMEs) in the pursuit of sustainable capital.
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="#about"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-xl font-semibold shadow-lg shadow-green-500/20 transition-all hover:-translate-y-1"
              >
                Explore Findings
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ESG Pillars */}
      <section id="about" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-header">The ESG Ecosystem</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Environment, Social, and Governance criteria have evolved into a crucial method for assessing long-term value creation.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            <Reveal delay={0.1}>
              <div className="group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500">
                <div className="p-3 w-fit rounded-2xl bg-green-500/10 text-green-500 mb-6 group-hover:scale-110 transition-transform">
                  <Leaf size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-400">Environmental</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Performance as a steward of the natural world. Focus on climate strategy, carbon emissions, and biodiversity protection.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500">
                <div className="p-3 w-fit rounded-2xl bg-blue-500/10 text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-400">Social</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Relationship management with stakeholders. Covering labour standards, health & safety, and community engagement.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500">
                <div className="p-3 w-fit rounded-2xl bg-amber-500/10 text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-400">Governance</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Leadership and operational structure. Auditing transparency, board independence, and anti-corruption policies.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section id="stats" className="py-24 px-6 bg-blue-500/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <Reveal delay={0.1}>
              <div className="space-y-2">
                <div className="text-5xl font-bold tracking-tighter">90%</div>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">Global Core</div>
                <p className="text-xs text-slate-500">SMEs represent 90% of businesses globally.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-2">
                <div className="text-5xl font-bold tracking-tighter">96%</div>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">Nigerian Scale</div>
                <p className="text-xs text-slate-500">Nigerian SMEs account for almost all businesses.</p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="space-y-2">
                <div className="text-5xl font-bold tracking-tighter">48%</div>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">GDP Impact</div>
                <p className="text-xs text-slate-500">Contribute under half of Nigeria&apos;s national GDP.</p>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="space-y-2">
                <div className="text-5xl font-bold tracking-tighter">69%</div>
                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest">Funding Gap</div>
                <p className="text-xs text-slate-500">Businesses without formal credit or grants.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Barriers */}
      <section id="barriers" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-header">Structural Barriers</h2>
              <p className="text-slate-400 max-w-2xl">
                The gap is caused by a lopsided relationship between demand-side readiness and supply-side requirements.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl font-bold pb-2 border-b-2 border-green-500 inline-block">Demand Side</h3>
                  <TrendingUp className="text-green-500" />
                </div>
              </Reveal>
              
              <div className="space-y-6">
                {[
                  { title: "Limited Awareness", desc: "Knowledge gap regarding ESG metrics and climate risk disclosures." },
                  { title: "Poor Reporting Capacity", desc: "Only 9% of SMEs operate formal sustainability reporting programs." },
                  { title: "Survival Focus", desc: "Short-term cash flow needs supersede long-term green planning." }
                ].map((item, index) => (
                  <Reveal key={index} delay={index * 0.1}>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border-l-4 border-l-blue-500 border-white/10 hover:border-white/20 transition-all">
                      <h4 className="font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <Reveal>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-2xl font-bold pb-2 border-b-2 border-amber-500 inline-block">Supply Side</h3>
                  <BarChart3 className="text-amber-500" />
                </div>
              </Reveal>

              <div className="space-y-6">
                {[
                  { title: "The Information Gap", desc: "Traditional credit metrics are insufficient for modern ESG due diligence." },
                  { title: "Risk Perception", desc: "Lack of data heightens perceived exposure to environmental shocks." },
                  { title: "Regulatory Disparity", desc: "Lopsided compliance burdens between financiers and borrowers." }
                ].map((item, index) => (
                  <Reveal key={index} delay={index * 0.1}>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border-l-4 border-l-amber-500 border-white/10 hover:border-white/20 transition-all">
                      <h4 className="font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="wayforward" className="py-24 px-6 relative bg-green-500/[0.01]">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-header">The Way Forward</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                Transitioning to a greener and more inclusive Nigerian economy by 2060.
              </p>
            </div>
          </Reveal>

          <div className="space-y-8">
            <Reveal delay={0.2}>
              <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-green-500/30 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-green-500/20 group-hover:text-green-500/40 transition-colors animate-pulse">
                  <AlertCircle size={80} />
                </div>
                <p className="relative z-10 text-slate-300 leading-loose mb-8">
                  The disconnect between financier expectations and SME realities requires coordinated legislative action. Mandating disclosure standards aligned with international best practices is no longer optional—it is vital for SME survival in a global economy that prioritizes sustainability.
                </p>
                <div className="relative z-10 grid md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-slate-400">Legislative Action for Enabling Environments</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-slate-400">Digital ESG Reporting Transformation</span>
                  </div>
                </div>
              </div>
            </Reveal>
            
            <Reveal delay={0.4}>
              <div className="text-center pt-8">
                <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden active:scale-95 transition-all">
                  <span className="relative z-10 flex items-center gap-2">
                    Request Full Report <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="font-header text-xl font-bold tracking-tighter opacity-80">
            BRIDGING THE GAP
          </div>
          <p className="text-slate-500 text-sm">
            Part One of a Three-Part Series on Sustainable Finance in Nigeria.
          </p>
          <div className="flex justify-center gap-8 text-xs font-semibold uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Legal</a>
          </div>
          <div className="pt-8 text-[10px] text-slate-700 tracking-[0.2em] font-bold">
            © 2026 ORION | MERIS LABS OFFICIAL
          </div>
        </div>
      </footer>
    </div>
  );
}
