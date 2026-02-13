'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <header className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/merislabswhite.png"
                            alt="MerisLabs"
                            className="h-10 w-auto"
                        />
                        <span className="text-xl font-bold text-white border-l border-white/20 pl-3">
                            Legal
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#products" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Products</a>
                        <Link href="/library" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Legal Library</Link>
                        <a href="#about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">About</a>
                        <Link href="/audit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/25">
                            View Demo
                        </Link>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-blue-300 text-sm font-medium">Now serving enterprises across Africa</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                            Legal Intelligence for
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                African Enterprises
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl">
                            Transform complex litigation portfolios and compliance obligations into actionable intelligence.
                            Built by lawyers, for institutions that demand clarity.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a href="mailto:tomide@merislabs.com" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-lg font-semibold transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2">
                                Request Access
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Products Section */}
            <section id="products" className="py-24 px-8 bg-slate-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Products</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Purpose-built tools for legal departments and law firms managing complex portfolios.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Unified Infrastructure Card */}
                        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-purple-500/50 transition-all overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all"></div>

                            <div className="relative">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3">Unified Infrastructure</h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    Digital rails for the Nigerian business lifecycle. From automated registration to ongoing governance.
                                </p>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Automated CAC Filings
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Digital Market Entry
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Governance Dashboards
                                    </li>
                                </ul>

                                <a href="mailto:tomide@merislabs.com" className="inline-flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                                    Partner with us
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Litigation Intelligence Card */}
                        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all"></div>

                            <div className="relative">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3">Litigation Intelligence</h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    Interactive dashboards that transform litigation portfolios into strategic insights.
                                    Track case status, monetary exposure, risk levels, and external counsel performance.
                                </p>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Portfolio-wide exposure analysis
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Automated PDF report generation
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        External counsel benchmarking
                                    </li>
                                </ul>

                                <Link href="/audit" className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                                    View Demo
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Compliance Suite Card */}
                        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-indigo-500/50 transition-all overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all"></div>

                            <div className="relative">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3">Compliance Suite</h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    Map compliance obligations to their source legislation. Navigate complex regulatory
                                    landscapes with structured, searchable legal text integration.
                                </p>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Obligation-to-law mapping
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Business Compliance Manual (BCM)
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Compliance tracking tool
                                    </li>
                                </ul>

                                <Link href="/library" className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                                    Access Legal Library
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA Section */}
            <section id="contact" className="py-24 px-8 border-t border-slate-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your legal infrastructure?</h2>
                    <p className="text-lg text-slate-400 mb-12">
                        Get in touch to learn how MerisLabs can help your institution build digital-first legal and compliance frameworks.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="mailto:tomide@merislabs.com" className="px-8 py-4 bg-white text-slate-900 rounded-xl text-lg font-semibold transition-all hover:bg-slate-100 flex items-center gap-2 font-mono">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            tomide@merislabs.com
                        </a>
                        <a href="https://merislabs.com" target="_blank" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-lg font-semibold transition-all flex items-center gap-2">
                            Visit MerisLabs
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/merislabswhite.png"
                            alt="MerisLabs"
                            className="h-6 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                        />
                        <span className="text-slate-400 text-sm">© 2025 MerisLabs. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6 text-slate-400 text-sm">
                        <a href="https://merislabs.com" className="hover:text-white transition-colors">MerisLabs</a>
                        <a href="mailto:tomide@merislabs.com" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
