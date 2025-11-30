'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function QuickCreateInvoice() {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Animation delay
        setTimeout(() => setIsReady(true), 300);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-4">
            <div className={`max-w-3xl w-full transition-all duration-700 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Main Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-12 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg shadow-purple-500/50">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            Quick Invoice Creation
                        </h1>
                        <p className="text-xl text-gray-400">
                            I'm ready to create your invoice! Just provide me with the details.
                        </p>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-6 mb-12">
                        <div className="bg-slate-800/30 rounded-xl p-6 border border-purple-500/10">
                            <h2 className="text-2xl font-bold text-white mb-4">What I Need From You:</h2>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold">1.</span>
                                    <span><strong className="text-white">Client Details:</strong> Name, email, and optionally their logo URL or file path</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold">2.</span>
                                    <span><strong className="text-white">Invoice Items:</strong> Description, quantity, and rate for each service/product</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold">3.</span>
                                    <span><strong className="text-white">Previous Projects:</strong> Which projects from your portfolio to showcase (optional)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold">4.</span>
                                    <span><strong className="text-white">Due Date:</strong> When payment is expected</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold">5.</span>
                                    <span><strong className="text-white">Notes:</strong> Any additional terms or messages (optional)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                                Example Format:
                            </h3>
                            <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 space-y-2">
                                <p><span className="text-purple-400">Client:</span> Acme Corporation</p>
                                <p><span className="text-purple-400">Email:</span> billing@acme.com</p>
                                <p><span className="text-purple-400">Logo:</span> https://acme.com/logo.png</p>
                                <p className="pt-2"><span className="text-purple-400">Items:</span></p>
                                <p className="pl-4">- Web Development: 40 hours @ $150/hr</p>
                                <p className="pl-4">- API Integration: 20 hours @ $150/hr</p>
                                <p className="pt-2"><span className="text-purple-400">Projects:</span> QorePay, BrandQor</p>
                                <p><span className="text-purple-400">Due Date:</span> 2025-12-30</p>
                                <p><span className="text-purple-400">Notes:</span> Payment via bank transfer</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => router.push('/invoice-generator')}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-white font-semibold transition-all"
                        >
                            Manual Entry
                        </button>
                        <button
                            onClick={() => {
                                // Scroll to chat or show ready message
                                alert('Great! Please provide the invoice details in the chat, and I\'ll create it for you instantly! 🚀');
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/50 transition-all transform hover:scale-[1.02]"
                        >
                            I'm Ready - Let's Go!
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Saved Clients Info */}
                    <div className="mt-8 pt-8 border-t border-purple-500/20">
                        <p className="text-center text-gray-400 text-sm">
                            💾 All client details will be automatically saved for future invoices
                        </p>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="bg-slate-900/30 backdrop-blur-xl border border-purple-500/10 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <p className="text-sm text-gray-300">Instant Creation</p>
                    </div>
                    <div className="bg-slate-900/30 backdrop-blur-xl border border-purple-500/10 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">💾</div>
                        <p className="text-sm text-gray-300">Auto-Save Clients</p>
                    </div>
                    <div className="bg-slate-900/30 backdrop-blur-xl border border-purple-500/10 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">🎨</div>
                        <p className="text-sm text-gray-300">Premium Design</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
