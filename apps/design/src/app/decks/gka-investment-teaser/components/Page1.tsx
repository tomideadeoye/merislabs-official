'use client';

import React from 'react';
import { Anchor, Truck, Waves, Trophy, TrendingUp, Cpu, ThermometerSnowflake, Building } from 'lucide-react';

export const Page1 = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl print:shadow-none print:m-0 overflow-hidden h-full relative flex flex-col shrink-0 font-sans">

            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#f06600] via-[#ff8533] to-[#f06600]"></div>

            {/* Header */}
            <div className="px-12 py-5 border-b border-[#f06600]/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-serif font-black text-[#f06600] uppercase">Corporate Profile</h2>
                        <p className="text-sm text-[#211B1B]/60 mt-1">Page 1 of 2</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-[#f06600] uppercase tracking-wider">GK&A Logistics</div>
                        <div className="text-[10px] text-[#211B1B]/40 uppercase tracking-widest">February 2026</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-12 py-5 overflow-hidden flex flex-col">

                {/* Executive Summary with Image */}
                <div className="mb-4 flex gap-4">
                    <div className="flex-1 p-4 bg-gradient-to-br from-[#fff5f0] to-white rounded-xl border border-[#f06600]/10">
                        <h3 className="text-sm font-black text-[#f06600] uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Building className="w-4 h-4 hidden" />
                            <TrendingUp className="w-4 h-4" />
                            Executive Overview
                        </h3>
                        <p className="text-sm text-[#211B1B] text-justify leading-relaxed">
                            GK&A Logistics is a premier infrastructure and terminal-operating group developing the <strong className="text-[#f06600]">Ikorodu Regional Inland Port</strong>. Located on the Lagos Lagoon, this facility is the critical multimodal alternative to congested legacy ports, offering a highly efficient gateway through a PPP framework with NIWA and the Sealink Consortium.
                        </p>
                    </div>
                    <div className="w-[340px] shrink-0 overflow-hidden rounded-xl shadow-lg border border-[#f06600]/20">
                        <img
                            src="/gka/port-operations.png"
                            alt="GK&A Port Operations"
                            className="w-full h-full object-cover scale-110 origin-top-left"
                        />
                    </div>
                </div>

                {/* Key Metrics Table */}
                <div className="mb-4">
                    <h3 className="text-sm font-black text-[#f06600] uppercase tracking-wider mb-2">Key Operational Metrics</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-b border-[#f06600]/10">
                                    <td className="py-1.5 text-[#211B1B]/60 font-medium">Total Facility Footprint</td>
                                    <td className="py-1.5 text-right font-bold text-[#f06600]">20.3 Hectares</td>
                                </tr>
                                <tr className="border-b border-[#f06600]/10">
                                    <td className="py-1.5 text-[#211B1B]/60 font-medium">Active Mixed-Cargo Hub</td>
                                    <td className="py-1.5 text-right font-bold text-[#f06600]">36,000 SQM</td>
                                </tr>
                                <tr className="border-b border-[#f06600]/10">
                                    <td className="py-1.5 text-[#211B1B]/60 font-medium">Strategic Capacity</td>
                                    <td className="py-1.5 text-right font-bold text-[#f06600]">10,000 TEU annually</td>
                                </tr>
                                <tr className="border-b border-[#f06600]/10">
                                    <td className="py-1.5 text-[#211B1B]/60 font-medium">Enclosed Storage</td>
                                    <td className="py-1.5 text-right font-bold text-[#f06600]">4,460 SQM Warehouse</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr className="border-b border-[#f06600]/10">
                                    <td className="py-1.5 text-[#211B1B]/60 font-medium">Marine Infrastructure</td>
                                    <td className="py-1.5 text-right font-bold text-[#f06600]">540m Quay Wall</td>
                                </tr>
                                <tr className="border-b border-[#f06600]/10">
                                    <td className="py-1.5 text-[#211B1B]/60 font-medium">Quay Apron</td>
                                    <td className="py-1.5 text-right font-bold text-[#f06600]">320m length</td>
                                </tr>
                                <tr className="border-b border-[#f06600]/10">
                                    <td className="py-1.5 text-[#211B1B]/60 font-medium">Asset Readiness</td>
                                    <td className="py-1.5 text-right font-bold text-[#f06600]">Twin-Crane Vessels</td>
                                </tr>
                                <tr className="border-b border-[#f06600]/10">
                                    <td className="py-1.5 text-[#211B1B]/60 font-medium">Power Infrastructure</td>
                                    <td className="py-1.5 text-right font-bold text-[#f06600]">Heavy-Duty Generators</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Competitive Moats */}
                <div className="mb-4">
                    <h3 className="text-sm font-black text-[#f06600] uppercase tracking-wider mb-2">Competitive Moats</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-lg border border-[#f06600]/10 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-[#f06600]/10 rounded-full flex items-center justify-center">
                                    <Anchor className="w-4 h-4 text-[#f06600]" />
                                </div>
                                <div className="text-xs font-black text-[#f06600] uppercase">Section 14 CEMA</div>
                            </div>
                            <p className="text-xs text-[#211B1B] leading-relaxed">
                                Direct Ship Call approval for immediate customs clearance, bypassing standard bonded terminal bottlenecks.
                            </p>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-[#f06600]/10 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-[#f06600]/10 rounded-full flex items-center justify-center">
                                    <Waves className="w-4 h-4 text-[#f06600]" />
                                </div>
                                <div className="text-xs font-black text-[#f06600] uppercase">Lagoon-to-Ocean</div>
                            </div>
                            <p className="text-xs text-[#211B1B] leading-relaxed">
                                Direct Lagos Lagoon access ensuring multimodal barge connectivity that cuts road transport costs and risks.
                            </p>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-[#f06600]/10 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-[#f06600]/10 rounded-full flex items-center justify-center">
                                    <Truck className="w-4 h-4 text-[#f06600]" />
                                </div>
                                <div className="text-xs font-black text-[#f06600] uppercase">Traffic Infrastructure</div>
                            </div>
                            <p className="text-xs text-[#211B1B] leading-relaxed">
                                Exclusive high-capacity truck holding bay synchronized with an automated e-call-up system to eliminate congestion.
                            </p>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-[#f06600]/10 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-[#f06600]/10 rounded-full flex items-center justify-center">
                                    <Trophy className="w-4 h-4 text-[#f06600]" />
                                </div>
                                <div className="text-xs font-black text-[#f06600] uppercase">First-Mover</div>
                            </div>
                            <p className="text-xs text-[#211B1B] leading-relaxed">
                                The first private operator explicitly positioned within 2km of Major Industrial Giants in the Ikorodu corridor.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tech Roadmap */}
                <div className="flex-1">
                    <h3 className="text-sm font-black text-[#f06600] uppercase tracking-wider mb-2">Technology & Cold Chain</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-br from-[#f06600]/5 to-white rounded-lg border border-[#f06600]/20">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-[#f06600] rounded-full flex items-center justify-center text-white text-xs"><ThermometerSnowflake className="w-3 h-3" /></div>
                                <div className="text-xs font-black text-[#f06600] uppercase">Advanced Reefer Capability</div>
                            </div>
                            <ul className="space-y-1.5">
                                <li className="text-xs text-[#211B1B] flex items-start gap-2">
                                    <span className="text-[#ff8533] mt-1">✓</span>
                                    <span>Real-time temperature telemetry</span>
                                </li>
                                <li className="text-xs text-[#211B1B] flex items-start gap-2">
                                    <span className="text-[#ff8533] mt-1">✓</span>
                                    <span>Dedicated reefer power racks</span>
                                </li>
                                <li className="text-xs text-[#211B1B] flex items-start gap-2">
                                    <span className="text-[#ff8533] mt-1">✓</span>
                                    <span>Continuous monitoring integrated via TOS</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-[#ff8533]/10 to-white rounded-lg border border-[#ff8533]/30">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-[#ff8533] rounded-full flex items-center justify-center text-white text-xs"><Cpu className="w-3 h-3" /></div>
                                <div className="text-xs font-black text-[#f06600] uppercase">Smart Terminal Integration</div>
                            </div>
                            <ul className="space-y-1.5">
                                <li className="text-xs text-[#211B1B] flex items-start gap-2">
                                    <span className="text-[#f06600] mt-1">→</span>
                                    <span>Automated OCR/ANPR Gates & Portal</span>
                                </li>
                                <li className="text-xs text-[#211B1B] flex items-start gap-2">
                                    <span className="text-[#f06600] mt-1">→</span>
                                    <span>Customs Single-Window API Link</span>
                                </li>
                                <li className="text-xs text-[#211B1B] flex items-start gap-2">
                                    <span className="text-[#f06600] mt-1">→</span>
                                    <span>Full Yard Inventory & WMS batch tracking</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer accent */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#f06600] to-transparent"></div>
        </div>
    );
};
