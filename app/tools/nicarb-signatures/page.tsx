'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function NICARBSignaturesPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const signatures = {
        simple: `<img src="https://merislabs.com/nicarb/christmas-signatures/nicarb_final_2026_white_1765805295269.jpeg" alt="NICARB - Merry Christmas & Happy New Year 2026" style="max-width: 600px; height: auto; display: block;">`,

        custom: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; max-width: 600px;">
    <tr>
        <td style="vertical-align: middle; padding-right: 20px;">
            <img src="https://merislabs.com/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" style="height: 60px; width: auto; display: block;">
        </td>
        <td style="vertical-align: middle; padding: 0 15px;">
            <div style="width: 2px; height: 60px; background: linear-gradient(to bottom, #D4AF37, #C5A028);"></div>
        </td>
        <td style="vertical-align: middle; padding-left: 15px;">
            <div style="font-family: Georgia, serif; font-size: 22px; color: #2d5a2d; font-style: italic; margin-bottom: 5px;">
                Merry Christmas
            </div>
            <div style="font-family: Georgia, serif; font-size: 14px; color: #2d5a2d;">
                & Happy New Year 2026
            </div>
        </td>
    </tr>
</table>`,

        withOrnament: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; max-width: 600px; background: #ffffff;">
    <tr>
        <td style="text-align: center; padding: 20px;">
            <img src="https://merislabs.com/clients/NICARB%20LOGO%20Green%20Text%20(1).png" alt="NICARB" style="height: 60px; width: auto; display: block; margin: 0 auto 10px;">

            <div style="text-align: center; margin: 0 auto 15px; max-width: 300px;">
                <svg width="280" height="30" viewBox="0 0 280 30" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <line x1="0" y1="15" x2="80" y2="15" stroke="#D4AF37" stroke-width="1.5"/>
                    <path d="M110 10 Q115 8 120 10 Q125 12 130 10 Q135 8 140 10" stroke="#2d5a2d" fill="none" stroke-width="1.5"/>
                    <circle cx="125" cy="12" r="3" fill="#D4AF37"/>
                    <circle cx="115" cy="14" r="2" fill="#2d5a2d" opacity="0.6"/>
                    <circle cx="135" cy="14" r="2" fill="#2d5a2d" opacity="0.6"/>
                    <path d="M105 12 L107 15 L105 18 L103 15 Z" fill="#2d5a2d" opacity="0.7"/>
                    <path d="M145 12 L147 15 L145 18 L143 15 Z" fill="#2d5a2d" opacity="0.7"/>
                    <line x1="160" y1="15" x2="280" y2="15" stroke="#D4AF37" stroke-width="1.5"/>
                    <path d="M95 10 L96 13 L99 13 L96.5 15 L97.5 18 L95 16 L92.5 18 L93.5 15 L91 13 L94 13 Z" fill="#D4AF37" opacity="0.6"/>
                    <path d="M155 10 L156 13 L159 13 L156.5 15 L157.5 18 L155 16 L152.5 18 L153.5 15 L151 13 L154 13 Z" fill="#D4AF37" opacity="0.6"/>
                </svg>
            </div>

            <div style="margin-bottom: 5px;">
                <span style="font-family: Georgia, serif; font-size: 22px; color: #2d5a2d; font-style: italic;">Merry Christmas</span>
            </div>
            <div>
                <span style="font-family: Georgia, serif; font-size: 14px; color: #2d5a2d;">& Happy New Year 2026</span>
            </div>
        </td>
    </tr>
</table>`
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-green-900 mb-3">
                        NICARB Christmas E-Signatures 2026
                    </h1>
                    <p className="text-lg text-gray-600">
                        Professional Christmas signatures for email - Copy and paste directly!
                    </p>
                </div>

                {/* Main Signature Preview */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-green-900 mb-6 flex items-center gap-2">
                        <span className="text-3xl">🎄</span>
                        Final Design
                    </h2>

                    <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border-2 border-green-100 mb-6">
                        <Image
                            src="/nicarb/christmas-signatures/nicarb_final_2026_white_1765805295269.jpeg"
                            alt="NICARB Christmas 2026"
                            width={600}
                            height={200}
                            className="mx-auto"
                            priority
                        />
                    </div>

                    <div className="flex gap-4 justify-center">
                        <a
                            href="/nicarb/christmas-signatures/nicarb_final_2026_white_1765805295269.jpeg"
                            download="NICARB_Christmas_2026.jpeg"
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Image
                        </a>
                    </div>
                </div>

                {/* HTML Signature Options */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Simple Image Signature */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-green-900 mb-1">
                                    Simple Image Signature
                                </h3>
                                <p className="text-sm text-gray-600">Recommended - Works everywhere</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                Recommended
                            </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                                {signatures.simple}
                            </pre>
                        </div>

                        <button
                            onClick={() => copyToClipboard(signatures.simple, 'simple')}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {copied === 'simple' ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy HTML Code
                                </>
                            )}
                        </button>
                    </div>

                    {/* Custom HTML Signature */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-green-900 mb-1">
                                    Custom HTML Signature
                                </h3>
                                <p className="text-sm text-gray-600">With logo and text elements</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto max-h-40">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                                {signatures.custom}
                            </pre>
                        </div>

                        <button
                            onClick={() => copyToClipboard(signatures.custom, 'custom')}
                            className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {copied === 'custom' ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy HTML Code
                                </>
                            )}
                        </button>
                    </div>

                    {/* Signature with Ornament */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-green-900 mb-1">
                                    With Decorative Ornament
                                </h3>
                                <p className="text-sm text-gray-600">Logo with ornament underneath</p>
                            </div>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                New
                            </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto max-h-40">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                                {signatures.withOrnament}
                            </pre>
                        </div>

                        <button
                            onClick={() => copyToClipboard(signatures.withOrnament, 'ornament')}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {copied === 'ornament' ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy HTML Code
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-green-900 mb-6">
                        📧 How to Use in Email
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">📮</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Gmail</h3>
                            </div>
                            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                                <li>Click "Copy HTML Code" button above</li>
                                <li>Go to Gmail Settings → General → Signature</li>
                                <li>Paste the HTML code in the signature box</li>
                                <li>Save changes</li>
                            </ol>
                        </div>

                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">📨</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Outlook</h3>
                            </div>
                            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                                <li>Click "Copy HTML Code" button above</li>
                                <li>Go to File → Options → Mail → Signatures</li>
                                <li>Paste the HTML code in the editor</li>
                                <li>Click OK to save</li>
                            </ol>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                        <p className="text-sm text-amber-900">
                            <strong>💡 Tip:</strong> The "Simple Image Signature" option works in all email clients and is the easiest to set up. Use the "Custom HTML" version if you want more control over the layout.
                        </p>
                    </div>
                </div>

                {/* Alternative Design Gallery */}
                <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <span className="text-3xl">🎨</span>
                        Alternative Designs
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Other design variants considered during the creative process
                    </p>

                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            { name: 'Transparent Wreath', file: 'nicarb_xmas_transparent_v2_1765777025997.png' },
                            { name: 'Transparent Ornament', file: 'nicarb_xmas_transparent_v1_1765777006645.png' },
                            { name: 'Artistic Watercolor', file: 'nicarb_xmas_artistic_1765777044817.png' },
                            { name: 'Modern Geometric', file: 'nicarb_xmas_modern_1765777066057.png' },
                            { name: 'Luxe Bells', file: 'nicarb_xmas_luxe_1765777085007.png' },
                            { name: 'Nigerian Adire', file: 'nicarb_xmas_nigerian_1765777103494.png' },
                            { name: 'Premium V1', file: 'nicarb_xmas_premium_v1_1765776025250.png' },
                            { name: 'Premium V2', file: 'nicarb_xmas_premium_v2_1765776055800.png' },
                            { name: 'Navy & Gold', file: 'nicarb_xmas_navy_gold_1765776116371.png' },
                            { name: 'Festive Final', file: 'nicarb_xmas_festive_final_1765776145698.png' },
                            { name: 'Original Reference', file: 'nicarb_christmas_signature_v1_1765775758966.png' },
                        ].map((design, index) => (
                            <div key={index} className="group relative bg-gray-50 rounded-lg p-3 hover:shadow-lg transition-all">
                                <div className="aspect-video bg-white rounded-md overflow-hidden mb-2 border border-gray-200">
                                    <Image
                                        src={`/nicarb/christmas-signatures/${design.file}`}
                                        alt={design.name}
                                        width={300}
                                        height={150}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                                <p className="text-xs font-medium text-gray-700 text-center">{design.name}</p>
                                <a
                                    href={`/nicarb/christmas-signatures/${design.file}`}
                                    download
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg flex items-center justify-center transition-opacity"
                                >
                                    <span className="px-3 py-1 bg-white text-gray-900 rounded-md text-xs font-medium">
                                        Download
                                    </span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-600 text-sm">
                    <p>Created by Merislabs for NICARB • December 2025</p>
                </div>
            </div>
        </div>
    );
}
