'use client';

import React, { useRef, useState } from 'react';
import { ExternalLink, Mail, Phone, Globe, Linkedin, Twitter } from 'lucide-react';
import '../css/print.css';

interface InvoiceItem {
    id: string;
    description: string;
    subNote?: string;
    quantity: number;
    rate: number;
}

export default function InvoiceJEE() {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const [invoiceNumber] = useState('INV-002');
    const [invoiceDate] = useState('2025-11-30');
    const [dueDate] = useState('2025-12-30');
    const [currency] = useState('NGN');

    const [clientName] = useState('Jackson, Etti & Edu');
    const [clientEmail] = useState('taiwo.ogbara@jee.africa');
    const [clientContact] = useState('Taiwo Ogbara, MCArb., ABR');
    const [clientAddress] = useState('3-5 Sinari Daranijo Street, Off Ajose Adeogun, Victoria Island, Lagos, Nigeria.');
    const [clientLogo] = useState('/clients/jackson etti and edu logo (1).png');

    const [items] = useState<InvoiceItem[]>([
        {
            id: '1',
            description: 'Litigation Audit Web Platform Development',
            subNote: 'Design and development of interactive case management dashboard (Project Compass) using Next.js.',
            quantity: 1,
            rate: 100000
        },
        {
            id: '2',
            description: 'Data Structuring & Migration',
            subNote: 'Parsing and structuring of 348 Ecobank litigation files into queryable database format.',
            quantity: 1,
            rate: 100000
        },
        {
            id: '3',
            description: 'Automated Reporting Module',
            subNote: 'Implementation of dynamic PDF generation for Executive Summaries and External Counsel schedules.',
            quantity: 1,
            rate: 100000
        }
    ]);

    const calculateSubtotal = () => {
        return 300000; // Fixed total
    };

    const calculateTotal = () => {
        return 300000; // Fixed total
    };

    return (
        <div className="min-h-screen bg-white flex justify-center p-8 print:p-0">
            <div id="invoice-preview" ref={invoiceRef} className="max-w-[210mm] w-full bg-white text-gray-900">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <img src="/MERISLABS-LOGO.png" alt="MerisLabs Logo" className="h-8 mb-1 object-contain" />
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
                        <p className="text-gray-500 mt-0.5 font-medium text-xs">#{invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-base font-bold text-emerald-600">MerisLabs</h2>
                        <p className="text-[10px] text-gray-600 mt-0.5">Software Development & Consulting</p>
                    </div>
                </div>

                {/* Bill To & Dates */}
                <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bill To</h3>
                        <div className="space-y-0.5">
                            {clientLogo && (
                                <img src={clientLogo} alt="Client Logo" className="h-8 mb-1 object-contain" />
                            )}
                            <p className="text-sm font-bold text-gray-900">{clientName}</p>
                            <p className="text-[10px] text-gray-600">{clientAddress}</p>
                            <p className="text-[10px] text-gray-600 mt-1">Attn: {clientContact}</p>
                            <p className="text-[10px] text-gray-600">{clientEmail}</p>
                        </div>
                    </div>
                    <div className="text-right space-y-1.5">
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                            <p className="text-[10px] font-medium text-gray-900">{invoiceDate}</p>
                        </div>
                        {dueDate && (
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Due Date</p>
                                <p className="text-[10px] font-medium text-gray-900">{dueDate}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Line Items */}
                <div className="mb-4">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td className="py-1.5 text-xs text-gray-900">
                                        <div className="font-medium">{item.description}</div>
                                        {item.subNote && (
                                            <div className="text-[9px] text-gray-500 mt-0.5 italic leading-tight">
                                                {item.subNote}
                                            </div>
                                        )}
                                        {item.description.includes('Litigation Audit') && (
                                            <div className="text-[9px] text-emerald-600 mt-0.5">
                                                <a href="https://jee-ecobank-compass.vercel.app" target="_blank" className="hover:underline">View Project: jee-ecobank-compass.vercel.app</a>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Signature & Totals */}
                <div className="flex justify-between items-end mb-5">
                    {/* Signature */}
                    <div className="pl-2">
                        <img src="/signature-tomide-adeoye.png" alt="Tomide Adeoye Signature" className="h-12 mb-0.5 object-contain -ml-2" />
                        <div className="border-t border-gray-100 pt-0.5 w-36">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Tomide Adeoye</p>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="w-48">
                        <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-1.5">
                            <span>Total</span>
                            <span className="text-emerald-600">{currency === 'NGN' ? '₦' : '$'}{calculateTotal().toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="mb-5 grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="space-y-2">
                        <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Bank Details</h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-[9px] text-emerald-600 font-bold uppercase mb-0.5">Moniepoint</p>
                                <p className="text-[10px] font-medium text-gray-900">Adeoye Tomide Toluwase | Merislabs</p>
                                <p className="text-[10px] font-mono text-gray-600 tracking-wide">8181927251</p>
                            </div>
                            <div className="pt-1.5 border-t border-gray-200">
                                <p className="text-[9px] text-emerald-600 font-bold uppercase mb-0.5">Access Bank</p>
                                <p className="text-[10px] font-medium text-gray-900">Adeoye Tomide Toluwase</p>
                                <p className="text-[10px] font-mono text-gray-600 tracking-wide">0694635405</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Online Payment</h3>
                        <a
                            href="https://paystack.shop/pay/orion-horizon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-2.5 bg-white border border-gray-200 rounded hover:border-emerald-500 hover:shadow-sm transition-all text-left no-underline"
                        >
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[10px] font-bold text-gray-900">Pay with Card</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-[9px] text-gray-500">Secure payment via Paystack</p>
                            <p className="text-[9px] text-emerald-600 mt-0.5 font-medium group-hover:underline break-all">paystack.shop/pay/orion-horizon</p>
                        </a>
                    </div>
                </div>

                {/* Services Footer */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                    <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Our Services</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <a href="https://merislabs.com" target="_blank" rel="noopener noreferrer" className="block p-1.5 bg-gray-50 rounded hover:bg-emerald-50 transition-colors group text-left no-underline">
                            <h4 className="text-[9px] font-bold text-gray-900 mb-0.5 group-hover:text-emerald-700">Web Development</h4>
                            <p className="text-[8px] text-gray-500 leading-tight group-hover:text-emerald-600">Modern web apps with Next.js & React</p>
                        </a>
                        <a href="https://merislabs.com" target="_blank" rel="noopener noreferrer" className="block p-1.5 bg-gray-50 rounded hover:bg-emerald-50 transition-colors group text-left no-underline">
                            <h4 className="text-[9px] font-bold text-gray-900 mb-0.5 group-hover:text-emerald-700">Reports & Pitch Decks</h4>
                            <p className="text-[8px] text-gray-500 leading-tight group-hover:text-emerald-600">Professional design & strategy</p>
                        </a>
                        <a href="https://merislabs.com" target="_blank" rel="noopener noreferrer" className="block p-1.5 bg-gray-50 rounded hover:bg-emerald-50 transition-colors group text-left no-underline">
                            <h4 className="text-[9px] font-bold text-gray-900 mb-0.5 group-hover:text-emerald-700">API & Consulting</h4>
                            <p className="text-[8px] text-gray-500 leading-tight group-hover:text-emerald-600">Backend systems & advisory</p>
                        </a>
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="bg-gray-50 rounded-lg p-3 flex flex-wrap gap-3 justify-between items-center">
                    <div className="flex items-center gap-1 text-[9px] text-gray-600">
                        <Globe className="w-2.5 h-2.5 text-emerald-600" />
                        <span>merislabs.com</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-600">
                        <Mail className="w-2.5 h-2.5 text-emerald-600" />
                        <span>tomide@merislabs.com</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-600">
                        <Phone className="w-2.5 h-2.5 text-emerald-600" />
                        <span>+234 818 192 7251</span>
                    </div>
                    <a href="https://www.linkedin.com/company/35651921" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] text-gray-600 hover:text-emerald-600 transition-colors">
                        <Linkedin className="w-2.5 h-2.5 text-emerald-600" />
                        <span>MerisLabs</span>
                    </a>
                    <div className="flex items-center gap-1 text-[9px] text-gray-600">
                        <Twitter className="w-2.5 h-2.5 text-emerald-600" />
                        <span>@_tomide</span>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-5 text-center border-t border-gray-100 pt-3">
                    <p className="text-[10px] text-gray-500 font-medium">MerisLabs: Building the Digital Infrastructure for African Professionals.</p>
                </div>
            </div>
        </div>
    );
}
