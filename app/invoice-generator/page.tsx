'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { projects, type Project } from '../components/projects';
import { getNextInvoiceNumber } from '../lib/stores/invoiceStore';
import '../css/print.css';
import { Upload, Download, Plus, X, Calendar, DollarSign, FileText, Mail, Phone, Globe, Linkedin, Twitter, ExternalLink } from 'lucide-react';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
}

interface SelectedProject {
    project: Project;
    description: string;
}

export default function InvoiceGenerator() {
    const searchParams = useSearchParams();

    // Default to NICArb details
    const [clientLogo, setClientLogo] = useState<string | null>('/clients/NICARB LOGO Green Text (1).png');
    const [clientName, setClientName] = useState('The Nigerian Institute of Chartered Arbitrators');
    const [clientEmail, setClientEmail] = useState('soshodijohn@nicarb.org');
    const [clientContact, setClientContact] = useState('Shola Oshodi-John (Registrar/CEO)');
    const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('2025-12-30');
    const [currency, setCurrency] = useState<'USD' | 'NGN'>('NGN');
    const [items, setItems] = useState<InvoiceItem[]>([
        {
            id: '1',
            description: 'Conference Programme Design & Development',
            quantity: 1,
            rate: 100000
        }
    ]);
    const [selectedProjects, setSelectedProjects] = useState<SelectedProject[]>([]);
    const [notes, setNotes] = useState('');
    const invoiceRef = useRef<HTMLDivElement>(null);

    // Load data from URL parameters (overrides defaults if present)
    useEffect(() => {
        setInvoiceNumber(getNextInvoiceNumber());

        const urlClientName = searchParams.get('clientName');
        const urlClientEmail = searchParams.get('clientEmail');
        const urlClientContact = searchParams.get('clientContact');
        const urlClientLogo = searchParams.get('clientLogo');
        const urlDueDate = searchParams.get('dueDate');
        const urlCurrency = searchParams.get('currency') as 'USD' | 'NGN';
        const urlItems = searchParams.get('items');
        const urlProjectIds = searchParams.get('projectIds');
        const urlNotes = searchParams.get('notes');

        if (urlClientName) setClientName(urlClientName);
        if (urlClientEmail) setClientEmail(urlClientEmail);
        if (urlClientContact) setClientContact(urlClientContact);
        if (urlClientLogo) setClientLogo(urlClientLogo);
        if (urlDueDate) setDueDate(urlDueDate);
        if (urlCurrency) setCurrency(urlCurrency);
        if (urlNotes) setNotes(urlNotes);

        if (urlItems) {
            try {
                const parsedItems = JSON.parse(urlItems);
                setItems(parsedItems);
            } catch (e) {
                console.error('Failed to parse items:', e);
            }
        }

        if (urlProjectIds) {
            try {
                const projectIds = JSON.parse(urlProjectIds);
                const selectedProjs = projectIds
                    .map((id: string) => {
                        const project = projects.find(p => p.id === id);
                        return project ? { project, description: project.description } : null;
                    })
                    .filter(Boolean);
                setSelectedProjects(selectedProjs);
            } catch (e) {
                console.error('Failed to parse project IDs:', e);
            }
        }
    }, [searchParams]);

    const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const calculateTotal = () => calculateSubtotal(); // Tax removed as requested

    return (
        <div className="min-h-screen bg-white flex justify-center p-8 print:p-0">
            <div id="invoice-preview" ref={invoiceRef} className="max-w-[210mm] w-full bg-white text-gray-900">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <img src="/MERISLABS-LOGO.png" alt="MerisLabs Logo" className="h-10 mb-2 object-contain" />
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
                        <p className="text-gray-500 mt-1 font-medium text-sm">#{invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-emerald-600">MerisLabs</h2>
                        <p className="text-xs text-gray-600 mt-1">Software Development & Consulting</p>
                    </div>
                </div>

                {/* Bill To & Dates */}
                <div className="flex justify-between mb-6 pb-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                        <div className="space-y-0.5">
                            {clientLogo && (
                                <img src={clientLogo} alt="Client Logo" className="h-10 mb-2 object-contain" />
                            )}
                            <p className="text-base font-bold text-gray-900">{clientName}</p>
                            <p className="text-xs text-gray-600">{clientEmail}</p>
                            {clientContact && <p className="text-xs text-gray-600">{clientContact}</p>}
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                            <p className="text-xs font-medium text-gray-900">{invoiceDate}</p>
                        </div>
                        {dueDate && (
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Due Date</p>
                                <p className="text-xs font-medium text-gray-900">{dueDate}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Line Items */}
                <div className="mb-6">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="text-right py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="text-right py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rate</th>
                                <th className="text-right py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td className="py-2 text-xs text-gray-900">
                                        <div className="font-medium">{item.description}</div>
                                        {item.description.includes('Conference Programme') && (
                                            <div className="text-[10px] text-emerald-600 mt-0.5 space-x-2">
                                                <a href="https://nicarb-conference-programme.vercel.app" target="_blank" className="hover:underline">View Web Version</a>
                                                <span>|</span>
                                                <a href="https://github.com/tomideadeoye/merislabs-github-media/blob/main/Reports/2025-%20NICArb%20Annual%20Conference%20Programme_compressed.pdf" target="_blank" className="hover:underline">View PDF Version</a>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 text-right text-xs text-gray-600">{item.quantity}</td>
                                    <td className="py-2 text-right text-xs text-gray-600">
                                        {currency === 'NGN' ? '₦' : '$'}{item.rate.toLocaleString()}
                                    </td>
                                    <td className="py-2 text-right text-xs font-bold text-gray-900">
                                        {currency === 'NGN' ? '₦' : '$'}{(item.quantity * item.rate).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Signature & Totals */}
                <div className="flex justify-between items-end mb-8">
                    {/* Signature */}
                    <div className="pl-2">
                        <img src="/signature-tomide-adeoye.png" alt="Tomide Adeoye Signature" className="h-16 mb-1 object-contain -ml-2" />
                        <div className="border-t border-gray-100 pt-1 w-40">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tomide Adeoye</p>

                        </div>
                    </div>

                    {/* Totals */}
                    <div className="w-56 space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Subtotal</span>
                            <span>{currency === 'NGN' ? '₦' : '$'}{calculateSubtotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                            <span>Total</span>
                            <span className="text-emerald-600">{currency === 'NGN' ? '₦' : '$'}{calculateTotal().toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="mb-8 grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bank Details</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase mb-0.5">Moniepoint</p>
                                <p className="text-xs font-medium text-gray-900">Adeoye Tomide Toluwase | Merislabs</p>
                                <p className="text-xs font-mono text-gray-600 tracking-wide">8181927251</p>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-[10px] text-emerald-600 font-bold uppercase mb-0.5">Access Bank</p>
                                <p className="text-xs font-medium text-gray-900">Adeoye Tomide Toluwase</p>
                                <p className="text-xs font-mono text-gray-600 tracking-wide">0694635405</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Online Payment</h3>
                        <a
                            href="https://paystack.shop/pay/orion-horizon"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-3 bg-white border border-gray-200 rounded hover:border-emerald-500 hover:shadow-sm transition-all text-left no-underline"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-gray-900">Pay with Card</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-[10px] text-gray-500">Secure payment via Paystack</p>
                            <p className="text-[10px] text-emerald-600 mt-1 font-medium group-hover:underline break-all">paystack.shop/pay/orion-horizon</p>
                        </a>
                    </div>
                </div>

                {/* Previous Projects */}
                {selectedProjects.length > 0 && (
                    <div className="mb-8 pb-6 border-t border-gray-100 pt-6">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Previous Projects</h3>
                        <div className="space-y-3">
                            {selectedProjects.map(({ project }) => (
                                <div key={project.id} className="border-l-2 border-emerald-500 pl-2">
                                    <h4 className="text-xs font-bold text-gray-900">{project.name}</h4>
                                    <p className="text-[10px] text-gray-600 line-clamp-2">{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services Footer */}
                <div className="border-t border-gray-100 pt-6 mb-6">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Our Services</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <a href="https://merislabs.com" target="_blank" rel="noopener noreferrer" className="block p-2 bg-gray-50 rounded hover:bg-emerald-50 transition-colors group text-left no-underline">
                            <h4 className="text-[10px] font-bold text-gray-900 mb-0.5 group-hover:text-emerald-700">Web Development</h4>
                            <p className="text-[9px] text-gray-500 leading-tight group-hover:text-emerald-600">Modern web apps with Next.js & React</p>
                        </a>
                        <a href="https://merislabs.com" target="_blank" rel="noopener noreferrer" className="block p-2 bg-gray-50 rounded hover:bg-emerald-50 transition-colors group text-left no-underline">
                            <h4 className="text-[10px] font-bold text-gray-900 mb-0.5 group-hover:text-emerald-700">Reports & Pitch Decks</h4>
                            <p className="text-[9px] text-gray-500 leading-tight group-hover:text-emerald-600">Professional design & strategy</p>
                        </a>
                        <a href="https://merislabs.com" target="_blank" rel="noopener noreferrer" className="block p-2 bg-gray-50 rounded hover:bg-emerald-50 transition-colors group text-left no-underline">
                            <h4 className="text-[10px] font-bold text-gray-900 mb-0.5 group-hover:text-emerald-700">API & Consulting</h4>
                            <p className="text-[9px] text-gray-500 leading-tight group-hover:text-emerald-600">Backend systems & advisory</p>
                        </a>
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                        <Globe className="w-3 h-3 text-emerald-600" />
                        <span>merislabs.com</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                        <Mail className="w-3 h-3 text-emerald-600" />
                        <span>tomide@merislabs.com</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>+234 818 192 7251</span>
                    </div>
                    <a href="https://www.linkedin.com/company/35651921" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-emerald-600 transition-colors">
                        <Linkedin className="w-3 h-3 text-emerald-600" />
                        <span>MerisLabs</span>
                    </a>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                        <Twitter className="w-3 h-3 text-emerald-600" />
                        <span>@_tomide</span>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500 font-medium">MerisLabs: Building the Digital Infrastructure for African Professionals.</p>
                </div>
            </div>
        </div>
    );
}
