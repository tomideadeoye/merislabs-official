'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
    Download,
    Settings2,
    Layout,
    User,
    Eye,
    CheckCircle2,
    Sparkles,
    Wine,
    Building2,
    Award,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/lib/utils';

// Local imports
import { ClientProfile, HolidayType, AssetContent, VisualAsset } from './types';
import { CLIENTS, VISUAL_ASSETS, INITIAL_CONTENT } from './data';
import { PresidentialTemplate, LifestyleTemplate, DarkLuxuryTemplate, TealDrapesTemplate, CleanCorporateTemplate, NICArbLuxuryTemplate, RoyalObsidianTemplate, EmeraldPrestigeTemplate } from './templates';
import { VisualAssetSelector } from './components';

// --- Page Main ---

export default function AssetFactoryPage() {
    const [selectedClient, setSelectedClient] = useState<ClientProfile>(CLIENTS[0]);
    const [selectedHoliday, setSelectedHoliday] = useState<HolidayType>('new-year');
    const [selectedTemplate, setSelectedTemplate] = useState<'presidential' | 'lifestyle' | 'dark-luxury' | 'teal-drapes' | 'clean-corporate' | 'nicarb-luxury' | 'royal-obsidian' | 'emerald-prestige'>('lifestyle');
    const [content, setContent] = useState<AssetContent>(INITIAL_CONTENT['new-year']);
    const [selectedVisualAsset, setSelectedVisualAsset] = useState<VisualAsset>(VISUAL_ASSETS[0]); // Default to fireworks
    const [downloading, setDownloading] = useState(false);
    const flyerRef = useRef<HTMLDivElement>(null);

    // Sync content when holiday changes
    useEffect(() => {
        setContent(INITIAL_CONTENT[selectedHoliday]);
        // Auto-select appropriate visual asset when holiday changes
        if (selectedHoliday === 'christmas') {
            const christmasAsset = VISUAL_ASSETS.find(a => a.category === 'christmas');
            if (christmasAsset) setSelectedVisualAsset(christmasAsset);
        } else if (selectedHoliday === 'new-year') {
            const newYearAsset = VISUAL_ASSETS.find(a => a.category === 'new-year');
            if (newYearAsset) setSelectedVisualAsset(newYearAsset);
        }
    }, [selectedHoliday]);

    const handleDownload = async () => {
        if (!flyerRef.current) return;
        setDownloading(true);
        try {
            const html2canvas = (await import('html2canvas-pro')).default;
            const canvas = await html2canvas(flyerRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: null,
            });
            const link = document.createElement('a');
            link.download = `${selectedClient.name}_${content.title}_${content.year}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error(err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Top Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <Layout className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Asset Factory</h1>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Strategic Brand Engine</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse" />
                            Live Preview
                        </Badge>
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-xl h-11 shadow-lg shadow-slate-200"
                        >
                            {downloading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Export Asset
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-6 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Sidebar & Controls (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Client Selection */}
                        <section>
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">Select Brand Tenant</Label>
                            <div className="grid grid-cols-1 gap-3">
                                {CLIENTS.map((client) => (
                                    <button
                                        key={client.id}
                                        onClick={() => setSelectedClient(client)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left",
                                            selectedClient.id === client.id
                                                ? "bg-white border-slate-900 shadow-xl shadow-slate-200 ring-2 ring-slate-900/5"
                                                : "bg-white border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm"
                                            style={{ backgroundColor: client.primaryColor }}
                                        >
                                            {client.logo ? (
                                                <img src={client.logo} alt="" className="w-8 h-8 object-contain brightness-0 invert" />
                                            ) : (
                                                client.name[0]
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{client.name}</p>
                                            <p className="text-xs text-slate-400 font-medium capitalize">{client.type} Profile</p>
                                        </div>
                                        {selectedClient.id === client.id && (
                                            <CheckCircle2 className="ml-auto w-5 h-5 text-slate-900" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Context/Holiday Toggle */}
                        <section>
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">Context & Content</Label>
                            <Tabs defaultValue="new-year" onValueChange={(v) => setSelectedHoliday(v as HolidayType)}>
                                <TabsList className="w-full h-12 bg-white border border-slate-100 rounded-xl p-1 mb-6">
                                    <TabsTrigger value="christmas" className="flex-1 rounded-lg">Christmas</TabsTrigger>
                                    <TabsTrigger value="new-year" className="flex-1 rounded-lg">New Year</TabsTrigger>
                                    <TabsTrigger value="custom" className="flex-1 rounded-lg">Custom</TabsTrigger>
                                </TabsList>

                                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-slate-400">Greeting Title</Label>
                                        <Input
                                            value={content.title}
                                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                                            className="rounded-xl border-slate-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-slate-400">Subtitle</Label>
                                        <Input
                                            value={content.subtitle}
                                            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                                            className="rounded-xl border-slate-100"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-slate-400">Personal Message</Label>
                                        <textarea
                                            value={content.message}
                                            onChange={(e) => setContent({ ...content, message: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-slate-400">Target Year</Label>
                                        <Input
                                            value={content.year}
                                            onChange={(e) => setContent({ ...content, year: e.target.value })}
                                            className="rounded-xl border-slate-100"
                                        />
                                    </div>
                                </div>
                            </Tabs>
                        </section>

                        {/* Visual Asset Selector */}
                        <VisualAssetSelector
                            selectedVisualAsset={selectedVisualAsset}
                            onSelect={setSelectedVisualAsset}
                        />

                    </div>

                    {/* Preview Area (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Design Preview</h2>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white border border-transparent hover:border-slate-200">
                                    <Eye className="w-5 h-5 text-slate-500" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white border border-transparent hover:border-slate-200">
                                    <Settings2 className="w-5 h-5 text-slate-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Stage */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-slate-900/5 rounded-none blur-2xl group-hover:bg-slate-900/10 transition-colors" />
                            <div className="relative p-1 bg-white rounded-none border border-slate-100 shadow-2xl overflow-hidden aspect-square max-w-[700px] mx-auto">
                                {selectedTemplate === 'presidential' && (
                                    <PresidentialTemplate
                                        client={selectedClient}
                                        content={content}
                                        containerRef={flyerRef}
                                        visualAsset={selectedVisualAsset}
                                    />
                                )}
                                {selectedTemplate === 'lifestyle' && (
                                    <LifestyleTemplate
                                        client={selectedClient}
                                        content={content}
                                        containerRef={flyerRef}
                                        visualAsset={selectedVisualAsset}
                                    />
                                )}
                                {selectedTemplate === 'dark-luxury' && (
                                    <DarkLuxuryTemplate
                                        client={selectedClient}
                                        content={content}
                                        containerRef={flyerRef}
                                        visualAsset={selectedVisualAsset}
                                    />
                                )}
                                {selectedTemplate === 'teal-drapes' && (
                                    <TealDrapesTemplate
                                        client={selectedClient}
                                        content={content}
                                        containerRef={flyerRef}
                                        visualAsset={selectedVisualAsset}
                                    />
                                )}
                                {selectedTemplate === 'clean-corporate' && (
                                    <CleanCorporateTemplate
                                        client={selectedClient}
                                        content={content}
                                        containerRef={flyerRef}
                                        visualAsset={selectedVisualAsset}
                                    />
                                )}
                                {selectedTemplate === 'nicarb-luxury' && (
                                    <NICArbLuxuryTemplate
                                        client={selectedClient}
                                        content={content}
                                        containerRef={flyerRef}
                                        visualAsset={selectedVisualAsset}
                                    />
                                )}
                                {selectedTemplate === 'royal-obsidian' && (
                                    <RoyalObsidianTemplate
                                        client={selectedClient}
                                        content={content}
                                        containerRef={flyerRef}
                                        visualAsset={selectedVisualAsset}
                                    />
                                )}
                                {selectedTemplate === 'emerald-prestige' && (
                                    <EmeraldPrestigeTemplate
                                        client={selectedClient}
                                        content={content}
                                        containerRef={flyerRef}
                                        visualAsset={selectedVisualAsset}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Template Gallery */}
                        <section>
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 block">Select Layout Template</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <button
                                    onClick={() => setSelectedTemplate('lifestyle')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3",
                                        selectedTemplate === 'lifestyle' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <User className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider">Lifestyle</p>
                                    {selectedTemplate === 'lifestyle' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>

                                <button
                                    onClick={() => setSelectedTemplate('dark-luxury')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3",
                                        selectedTemplate === 'dark-luxury' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Wine className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider">Dark Luxury</p>
                                    {selectedTemplate === 'dark-luxury' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>

                                <button
                                    onClick={() => setSelectedTemplate('teal-drapes')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3",
                                        selectedTemplate === 'teal-drapes' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider">Teal Drapes</p>
                                    {selectedTemplate === 'teal-drapes' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>

                                <button
                                    onClick={() => setSelectedTemplate('clean-corporate')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3",
                                        selectedTemplate === 'clean-corporate' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider">Corporate</p>
                                    {selectedTemplate === 'clean-corporate' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>

                                <button
                                    onClick={() => setSelectedTemplate('presidential')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3",
                                        selectedTemplate === 'presidential' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Layout className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider">Presidential</p>
                                    {selectedTemplate === 'presidential' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>

                                <button
                                    onClick={() => setSelectedTemplate('nicarb-luxury')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3 text-center",
                                        selectedTemplate === 'nicarb-luxury' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-[#064802]" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">NICArb Exclusive</p>
                                    {selectedTemplate === 'nicarb-luxury' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>

                                <button
                                    onClick={() => setSelectedTemplate('royal-obsidian')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3 text-center",
                                        selectedTemplate === 'royal-obsidian' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">Royal Obsidian</p>
                                    {selectedTemplate === 'royal-obsidian' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>

                                <button
                                    onClick={() => setSelectedTemplate('emerald-prestige')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3 text-center",
                                        selectedTemplate === 'emerald-prestige' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-full bg-[#064802]" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">Emerald Prestige</p>
                                    {selectedTemplate === 'emerald-prestige' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>
                            </div>
                        </section>
                    </div>

                </div >
            </main >

            {/* Decorative Ornaments (Global) */}
            < div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-100/50 to-transparent pointer-events-none -z-10" />

            {/* Footer */}
            <footer className="py-20 text-center text-slate-400 text-sm">
                <p>© 2025 MerisLabs Asset Factory • Built for sovereign execution.</p>
            </footer>
        </div>
    );
}
