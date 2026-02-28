'use client';

import React from 'react';
import { Building, FileCheck, Shield, Phone, Mail, Globe, CheckCircle } from 'lucide-react';

export const Page2 = () => {
    return (
        <div className="max-w-[210mm] w-full mx-auto bg-white shadow-2xl print:shadow-none print:m-0 overflow-hidden h-full relative flex flex-col shrink-0 font-sans">

            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#f06600] via-[#ff8533] to-[#f06600]"></div>

            {/* Header */}
            <div className="px-12 py-6 border-b border-[#f06600]/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-serif font-black text-[#f06600] uppercase">Structure & Integrity</h2>
                        <p className="text-sm text-[#211B1B]/60 mt-1">Page 2 of 2</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-[#f06600] uppercase tracking-wider">GK&A Logistics</div>
                        <div className="text-[10px] text-[#211B1B]/40 uppercase tracking-widest">February 2026</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-12 py-8 overflow-hidden flex flex-col">

                {/* Regulatory Framework */}
                <div className="mb-5">
                    <h3 className="text-sm font-black text-[#f06600] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FileCheck className="w-4 h-4" />
                        Regulatory & Institutional Framework
                    </h3>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                        {[
                            { agency: 'NPA', approval: 'Terminal Operating License' },
                            { agency: 'NIWA', approval: 'Inland Waterway License' },
                            { agency: 'NCS', approval: 'Direct Ship Call (Section 14 CEMA)' },
                            { agency: 'Lagos State EPA', approval: 'EIA Approved' },
                            { agency: 'Land Use Act', approval: 'Right of Occupancy' }
                        ].map((item, i) => (
                            <div key={i} className="p-3 bg-[#fff5f0] rounded-lg border border-[#f06600]/10 text-center">
                                <div className="text-xs font-bold text-[#f06600]">{item.agency}</div>
                                <div className="text-[9px] text-[#211B1B]/60 mt-1 leading-tight">{item.approval}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Corporate Operating Architecture */}
                <div className="mb-5">
                    <div className="p-4 bg-white rounded-lg border border-[#f06600]/20">
                        <h3 className="text-sm font-black text-[#f06600] uppercase tracking-wider mb-3">Operating Group Architecture</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-gradient-to-br from-[#fff5f0] to-white rounded border border-[#f06600]/10">
                                <div className="text-xs font-bold text-[#f06600] mb-1">GK&A Logistics Services Ltd</div>
                                <div className="text-[10px] text-[#211B1B]/70 leading-tight">Primary terminal operating entity and flagship logistics division.</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-[#fff5f0] to-white rounded border border-[#f06600]/10">
                                <div className="text-xs font-bold text-[#f06600] mb-1">GK&A Terminal Harbour Ltd</div>
                                <div className="text-[10px] text-[#211B1B]/70 leading-tight">Dedicated maritime assets and terminal infrastructure operations.</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-[#fff5f0] to-white rounded border border-[#f06600]/10">
                                <div className="text-xs font-bold text-[#f06600] mb-1">GK&A Port Infrastructure PTE. LTD.</div>
                                <div className="text-[10px] text-[#211B1B]/70 leading-tight">Singaporean holding vehicle ensuring international governance.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Mitigation */}
                <div className="mb-5">
                    <div className="p-4 bg-white rounded-lg border border-[#f06600]/20">
                        <h3 className="text-sm font-black text-[#f06600] uppercase tracking-wider mb-3">Operational Compliance</h3>
                        <div className="space-y-1.5 grid grid-cols-2 gap-x-4">
                            {[
                                { risk: 'Regulatory', mitigation: 'Multi-agency MOUs; quarterly audits' },
                                { risk: 'Safety & Standard', mitigation: 'ISO 9001/14001 certification pathway' },
                                { risk: 'Environmental', mitigation: 'EIA-approved; quarterly environmental audits' },
                                { risk: 'Security', mitigation: 'Role-based access; 24/7 CCTV & audit logs' }
                            ].map((item, i) => (
                                <div key={i} className="text-xs">
                                    <span className="font-bold text-[#f06600]">{item.risk}:</span>
                                    <span className="text-[#211B1B]/70 ml-1">{item.mitigation}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Corporate Footprint & Contact */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="p-4 bg-gradient-to-br from-[#fff5f0] to-white rounded-lg border border-[#f06600]/10">
                        <h3 className="text-sm font-black text-[#f06600] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Corporate Footprint
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <div className="text-[9px] uppercase text-[#211B1B]/50 tracking-wider">Registered Office</div>
                                <div className="text-xs text-[#211B1B] font-medium">No 6, Femi Okunnu Road, Ikoyi, Lagos</div>
                            </div>
                            <div>
                                <div className="text-[9px] uppercase text-[#211B1B]/50 tracking-wider">Operational Facility</div>
                                <div className="text-xs text-[#211B1B] font-medium">NPA Lighter Terminal, Ikorodu, Lagos</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-[#f06600] to-[#cc5500] text-white rounded-lg">
                        <h3 className="text-sm font-black text-[#ffcc99] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Corporate Inquiries
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <Phone className="w-4 h-4 text-[#ffcc99]" />
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase text-white/50 tracking-wider">Phone</div>
                                    <div className="text-sm font-semibold">
                                        <a href="tel:+2347038341611" className="hover:text-[#ffcc99] transition-colors print:text-white">
                                            +234 703 834 1611
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <Mail className="w-4 h-4 text-[#ffcc99]" />
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase text-white/50 tracking-wider">Email</div>
                                    <div className="text-sm font-semibold">
                                        <a href="mailto:info@gkaports.com" className="hover:text-[#ffcc99] transition-colors print:text-white">
                                            info@gkaports.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <Globe className="w-4 h-4 text-[#ffcc99]" />
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase text-white/50 tracking-wider">Website</div>
                                    <div className="text-sm font-semibold">
                                        <a href="https://www.gkaports.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffcc99] transition-colors print:text-white">
                                            www.gkaports.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-3 mt-3 border-t border-white/20">
                                <div className="text-xs text-white/80 italic">
                                    <strong className="text-[#ffcc99]">Omobola Abiru</strong><br />
                                    Managing Director, GK&A Logistics
                                </div>
                                <div className="text-sm font-semibold mt-2">
                                    <a href="mailto:mobola.abiru@gkaports.com" className="hover:text-[#ffcc99] transition-colors print:text-white">
                                        mobola.abiru@gkaports.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Takeaways Footer */}
            <div className="px-12 py-4 bg-[#fff5f0] border-t border-[#f06600]/10">
                <div className="flex items-start gap-4">
                    <div className="text-[#f06600] font-black text-xs uppercase tracking-wider whitespace-nowrap mt-0.5">Key Capabilities:</div>
                    <div className="grid grid-cols-3 gap-4 flex-1">
                        {[
                            '36,000 SQM Active Mixed-Cargo Operational Hub',
                            'Section 14 CEMA Direct Ship Call authority',
                            'Automated Terminal Operating System (TOS)',
                            'First-mover operational reality in Ikorodu',
                            '540m Quay Wall linking Lagos Lagoon to Apapa',
                            'Robust multi-entity international governance'
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-[#f06600] mt-0.5 shrink-0" />
                                <span className="text-[9px] text-[#211B1B] leading-tight">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer accent */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#f06600] to-transparent"></div>
        </div>
    );
};
