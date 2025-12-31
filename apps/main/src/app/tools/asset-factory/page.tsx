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
    ChevronDown,
    Type,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/lib/utils';

// Local imports
import { ClientProfile, HolidayType, AssetContent, VisualAsset, ColorPalette } from './types';
import { CLIENTS, VISUAL_ASSETS, INITIAL_CONTENT, PRESET_PALETTES, FONT_OPTIONS } from './data';
import { PresidentialTemplate, PresidentialExecutiveTemplate, LifestyleTemplate, DarkLuxuryTemplate, TealDrapesTemplate, CleanCorporateTemplate, NICArbLuxuryTemplate, RoyalObsidianTemplate, EmeraldPrestigeTemplate, HolidayCardTemplate, AppreciationCardTemplate } from './templates';
import { VisualAssetSelector } from './components';

const TEMPLATE_LABELS: Record<string, string> = {
    'presidential': 'Presidential Standard',
    'presidential-executive': 'Presidential Executive',
    'lifestyle': 'Lifestyle',
    'dark-luxury': 'Dark Luxury',
    'teal-drapes': 'Teal Drapes',
    'clean-corporate': 'Clean Corporate',
    'nicarb-luxury': 'NICArb Luxury',
    'royal-obsidian': 'Royal Obsidian',
    'emerald-prestige': 'Emerald Prestige',
    'holiday-card': 'Holiday Card',
    'appreciation-card': 'Appreciation Card'
};

const ASSET_FORMATS = [
    { id: 'square', name: 'Square (IG Post)', width: 1080, height: 1080, ratio: '1:1' },
    { id: 'portrait', name: 'Portrait (4:5)', width: 1080, height: 1350, ratio: '4:5' },
    { id: 'story', name: 'Story (9:16)', width: 1080, height: 1920, ratio: '9:16' },
    { id: 'landscape', name: 'Landscape (16:9)', width: 1920, height: 1080, ratio: '16:9' },
];

// --- Page Main ---

export default function AssetFactoryPage() {
    const [selectedClient, setSelectedClient] = useState<ClientProfile>(CLIENTS[0]);
    const [selectedHoliday, setSelectedHoliday] = useState<HolidayType>('new-year');
    const [selectedTemplate, setSelectedTemplate] = useState<'presidential' | 'presidential-executive' | 'lifestyle' | 'dark-luxury' | 'teal-drapes' | 'clean-corporate' | 'nicarb-luxury' | 'royal-obsidian' | 'emerald-prestige' | 'holiday-card' | 'appreciation-card'>('presidential-executive');
    const [activePalette, setActivePalette] = useState<ColorPalette | undefined>(undefined);
    const [useBrandColors, setUseBrandColors] = useState<boolean>(false); // Legacy toggle, kept for simple on/off for now
    const [content, setContent] = useState<AssetContent>(INITIAL_CONTENT['new-year']);
    const [selectedVisualAsset, setSelectedVisualAsset] = useState<VisualAsset>(VISUAL_ASSETS[0]); // Default to fireworks
    const [downloading, setDownloading] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<string>('square');
    const [clientSelectorOpen, setClientSelectorOpen] = useState(false); // Accordion state
    const flyerRef = useRef<HTMLDivElement>(null);

    const activeDimensions = ASSET_FORMATS.find(f => f.id === selectedFormat) || ASSET_FORMATS[0];

    // Sync content when holiday changes
    // Load state from local storage on mount
    // Sync content when holiday changes
    const STORAGE_KEY = 'ASSET_FACTORY_STATE_V3';

    // Load state from local storage on mount
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.selectedClient) setSelectedClient(parsed.selectedClient);
                if (parsed.selectedHoliday) setSelectedHoliday(parsed.selectedHoliday);
                if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
                if (parsed.activePalette) setActivePalette(parsed.activePalette);
                if (parsed.content) setContent(parsed.content);
                if (parsed.selectedVisualAsset) setSelectedVisualAsset(parsed.selectedVisualAsset);
                if (parsed.selectedFormat) setSelectedFormat(parsed.selectedFormat);
                // useBrandColors is a boolean, explicitly check for undefined
                if (parsed.useBrandColors !== undefined) setUseBrandColors(parsed.useBrandColors);
            } catch (e) {
                console.error("Failed to load asset factory state", e);
            }
        }
    }, []);

    // Save state to local storage on change
    useEffect(() => {
        const stateToSave = {
            selectedClient,
            selectedHoliday,
            selectedTemplate,
            activePalette,
            useBrandColors,
            content,
            selectedVisualAsset,
            selectedFormat
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [selectedClient, selectedHoliday, selectedTemplate, activePalette, useBrandColors, content, selectedVisualAsset, selectedFormat]);

    // Handle holiday change manually to avoid conflict with initial load
    const handleHolidayChange = (holiday: HolidayType) => {
        setSelectedHoliday(holiday);
        setContent(INITIAL_CONTENT[holiday]);

        // Auto-select appropriate visual asset when holiday changes
        if (holiday === 'christmas') {
            const christmasAsset = VISUAL_ASSETS.find(a => a.category === 'christmas');
            if (christmasAsset) setSelectedVisualAsset(christmasAsset);
        } else if (holiday === 'new-year') {
            const newYearAsset = VISUAL_ASSETS.find(a => a.category === 'new-year');
            if (newYearAsset) setSelectedVisualAsset(newYearAsset);
        }
    };

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

                        {/* Client Selection - Accordion Style */}
                        <section>
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">Select Brand Tenant</Label>
                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                {/* Accordion Header - Shows Selected Client */}
                                <button
                                    onClick={() => setClientSelectorOpen(!clientSelectorOpen)}
                                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                                        style={{ backgroundColor: selectedClient.primaryColor }}
                                    >
                                        {selectedClient.logo ? (
                                            <img src={selectedClient.logo} alt="" className="w-6 h-6 object-contain brightness-0 invert" />
                                        ) : (
                                            selectedClient.name[0]
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 text-sm">{selectedClient.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium capitalize">{selectedClient.type} Profile</p>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "w-5 h-5 text-slate-400 transition-transform duration-200",
                                            clientSelectorOpen && "rotate-180"
                                        )}
                                    />
                                </button>

                                {/* Accordion Content - Client List */}
                                <div className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    clientSelectorOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                )}>
                                    <div className="border-t border-slate-100 p-2 space-y-1">
                                        {CLIENTS.map((client) => (
                                            <button
                                                key={client.id}
                                                onClick={() => {
                                                    setSelectedClient(client);
                                                    setClientSelectorOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left",
                                                    selectedClient.id === client.id
                                                        ? "bg-slate-100"
                                                        : "hover:bg-slate-50"
                                                )}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                                    style={{ backgroundColor: client.primaryColor }}
                                                >
                                                    {client.logo ? (
                                                        <img src={client.logo} alt="" className="w-5 h-5 object-contain brightness-0 invert" />
                                                    ) : (
                                                        client.name[0]
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900 text-sm">{client.name}</p>
                                                    <p className="text-[10px] text-slate-400 capitalize">{client.type}</p>
                                                </div>
                                                {selectedClient.id === client.id && (
                                                    <CheckCircle2 className="w-4 h-4 text-slate-900" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Context/Holiday Toggle */}
                        <section>
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">Context & Content</Label>
                            <Tabs value={selectedHoliday} onValueChange={(v) => handleHolidayChange(v as HolidayType)}>
                                <TabsList className="w-full h-12 bg-white border border-slate-100 rounded-xl p-1 mb-6">
                                    <TabsTrigger value="christmas" className="flex-1 rounded-lg">Christmas</TabsTrigger>
                                    <TabsTrigger value="new-year" className="flex-1 rounded-lg">New Year</TabsTrigger>
                                    <TabsTrigger value="custom" className="flex-1 rounded-lg">Custom</TabsTrigger>
                                </TabsList>

                                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 shadow-sm">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400">Greeting Title</Label>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="text-[9px] bg-slate-50 border-none rounded-lg p-1 outline-none font-medium text-slate-500 cursor-pointer hover:bg-slate-100"
                                                    value={content.fontFamilies?.title || ''}
                                                    onChange={(e) => setContent({ ...content, fontFamilies: { ...content.fontFamilies, title: e.target.value } })}
                                                >
                                                    <option value="">Default Font</option>
                                                    {FONT_OPTIONS.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.name.split(' ')[0]}</option>)}
                                                </select>
                                                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
                                                    <button
                                                        onClick={() => setContent({ ...content, textScales: { ...content.textScales || { title: 1, subtitle: 1, message: 1, year: 1 }, title: Math.max(0.5, (content.textScales?.title || 1) - 0.1) } })}
                                                        className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                    >−</button>
                                                    <span className="text-[9px] font-mono text-slate-500 w-8 text-center">{((content.textScales?.title || 1) * 100).toFixed(0)}%</span>
                                                    <button
                                                        onClick={() => setContent({ ...content, textScales: { ...content.textScales || { title: 1, subtitle: 1, message: 1, year: 1 }, title: Math.min(2, (content.textScales?.title || 1) + 0.1) } })}
                                                        className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <Input
                                            value={content.title}
                                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                                            className="rounded-xl border-slate-100"
                                            style={{ fontFamily: content.fontFamilies?.title || undefined }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400">Subtitle</Label>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="text-[9px] bg-slate-50 border-none rounded-lg p-1 outline-none font-medium text-slate-500 cursor-pointer hover:bg-slate-100"
                                                    value={content.fontFamilies?.subtitle || ''}
                                                    onChange={(e) => setContent({ ...content, fontFamilies: { ...content.fontFamilies, subtitle: e.target.value } })}
                                                >
                                                    <option value="">Default Font</option>
                                                    {FONT_OPTIONS.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.name.split(' ')[0]}</option>)}
                                                </select>
                                                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
                                                    <button
                                                        onClick={() => setContent({ ...content, textScales: { ...content.textScales || { title: 1, subtitle: 1, message: 1, year: 1 }, subtitle: Math.max(0.5, (content.textScales?.subtitle || 1) - 0.1) } })}
                                                        className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                    >−</button>
                                                    <span className="text-[9px] font-mono text-slate-500 w-8 text-center">{((content.textScales?.subtitle || 1) * 100).toFixed(0)}%</span>
                                                    <button
                                                        onClick={() => setContent({ ...content, textScales: { ...content.textScales || { title: 1, subtitle: 1, message: 1, year: 1 }, subtitle: Math.min(2, (content.textScales?.subtitle || 1) + 0.1) } })}
                                                        className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <Input
                                            value={content.subtitle}
                                            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                                            className="rounded-xl border-slate-100"
                                            style={{ fontFamily: content.fontFamilies?.subtitle || undefined }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400">Personal Message</Label>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="text-[9px] bg-slate-50 border-none rounded-lg p-1 outline-none font-medium text-slate-500 cursor-pointer hover:bg-slate-100"
                                                    value={content.fontFamilies?.message || ''}
                                                    onChange={(e) => setContent({ ...content, fontFamilies: { ...content.fontFamilies, message: e.target.value } })}
                                                >
                                                    <option value="">Default Font</option>
                                                    {FONT_OPTIONS.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.name.split(' ')[0]}</option>)}
                                                </select>
                                                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
                                                    <button
                                                        onClick={() => setContent({ ...content, textScales: { ...content.textScales || { title: 1, subtitle: 1, message: 1, year: 1 }, message: Math.max(0.5, (content.textScales?.message || 1) - 0.1) } })}
                                                        className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                    >−</button>
                                                    <span className="text-[9px] font-mono text-slate-500 w-8 text-center">{((content.textScales?.message || 1) * 100).toFixed(0)}%</span>
                                                    <button
                                                        onClick={() => setContent({ ...content, textScales: { ...content.textScales || { title: 1, subtitle: 1, message: 1, year: 1 }, message: Math.min(2, (content.textScales?.message || 1) + 0.1) } })}
                                                        className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <textarea
                                            value={content.message}
                                            onChange={(e) => setContent({ ...content, message: e.target.value })}
                                            className="w-full p-3 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                            rows={3}
                                            style={{ fontFamily: content.fontFamilies?.message || undefined }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400">Target Year</Label>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="text-[9px] bg-slate-50 border-none rounded-lg p-1 outline-none font-medium text-slate-500 cursor-pointer hover:bg-slate-100"
                                                    value={content.fontFamilies?.year || ''}
                                                    onChange={(e) => setContent({ ...content, fontFamilies: { ...content.fontFamilies, year: e.target.value } })}
                                                >
                                                    <option value="">Default Font</option>
                                                    {FONT_OPTIONS.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.name.split(' ')[0]}</option>)}
                                                </select>
                                                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
                                                    <button
                                                        onClick={() => setContent({ ...content, textScales: { ...content.textScales || { title: 1, subtitle: 1, message: 1, year: 1 }, year: Math.max(0.5, (content.textScales?.year || 1) - 0.1) } })}
                                                        className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                    >−</button>
                                                    <span className="text-[9px] font-mono text-slate-500 w-8 text-center">{((content.textScales?.year || 1) * 100).toFixed(0)}%</span>
                                                    <button
                                                        onClick={() => setContent({ ...content, textScales: { ...content.textScales || { title: 1, subtitle: 1, message: 1, year: 1 }, year: Math.min(2, (content.textScales?.year || 1) + 0.1) } })}
                                                        className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <Input
                                            value={content.year}
                                            onChange={(e) => setContent({ ...content, year: e.target.value })}
                                            className="rounded-xl border-slate-100"
                                            style={{ fontFamily: content.fontFamilies?.year || undefined }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-bold uppercase text-slate-400">Footer Signature Size</Label>
                                            <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
                                                <button
                                                    onClick={() => setContent({ ...content, textScales: { ...content.textScales || INITIAL_CONTENT[selectedHoliday].textScales!, signature: Math.max(0.5, (content.textScales?.signature || 1) - 0.1) } })}
                                                    className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                >−</button>
                                                <span className="text-[9px] font-mono text-slate-500 w-8 text-center">{((content.textScales?.signature || 1) * 100).toFixed(0)}%</span>
                                                <button
                                                    onClick={() => setContent({ ...content, textScales: { ...content.textScales || INITIAL_CONTENT[selectedHoliday].textScales!, signature: Math.min(2, (content.textScales?.signature || 1) + 0.1) } })}
                                                    className="w-5 h-5 rounded text-slate-500 hover:bg-slate-200 text-xs font-bold"
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tabs>
                        </section>

                        {/* Visual Asset Selector */}
                        <VisualAssetSelector
                            selectedVisualAsset={selectedVisualAsset}
                            onSelect={setSelectedVisualAsset}
                        />

                        {/* Footer Display Controls */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                            <Label className="text-xs font-bold text-slate-900 uppercase tracking-widest block">Footer Configuration</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: 'showAddress', label: 'Address' },
                                    { key: 'showPhone', label: 'Phone' },
                                    { key: 'showWebsite', label: 'Website' },
                                    { key: 'showEmail', label: 'Email' },
                                    { key: 'showSignature', label: 'Signature' },
                                    { key: 'showLogo', label: 'Logo Badge' }
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => setContent({
                                            ...content,
                                            footerControls: {
                                                ...content.footerControls || INITIAL_CONTENT[selectedHoliday].footerControls!,
                                                [item.key]: !(content.footerControls?.[item.key as keyof FooterControls] ?? true)
                                            }
                                        })}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all",
                                            (content.footerControls?.[item.key as keyof FooterControls] ?? true)
                                                ? "bg-slate-900 text-white border-slate-900"
                                                : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        {item.label}
                                        {(content.footerControls?.[item.key as keyof FooterControls] ?? true) ? <CheckCircle2 className="w-3 h-3 ml-2" /> : <div className="w-3 h-3 ml-2 border border-slate-200 rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview Area (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Design Preview</h2>

                                {/* Palette Controls */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center mr-4 bg-white rounded-xl border border-slate-200 p-1">
                                        <button
                                            onClick={() => setActivePalette(undefined)}
                                            className={cn(
                                                "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                                                !activePalette ? "bg-slate-100 ring-2 ring-slate-900 ring-offset-1" : "hover:bg-slate-50"
                                            )}
                                            title="Default Theme"
                                        >
                                            <span className="w-3 h-3 rounded-full bg-slate-400" />
                                        </button>

                                        <div className="w-[1px] h-4 bg-slate-200 mx-2" />

                                        {PRESET_PALETTES.map((palette) => (
                                            <button
                                                key={palette.id}
                                                onClick={() => {
                                                    setActivePalette(palette);
                                                    setUseBrandColors(false); // Disable brand toggle when pallet selected
                                                }}
                                                className={cn(
                                                    "w-6 h-6 rounded-lg mx-0.5 flex items-center justify-center transition-all overflow-hidden",
                                                    activePalette?.id === palette.id ? "ring-2 ring-slate-900 ring-offset-1 scale-110" : "hover:scale-105"
                                                )}
                                                title={palette.name}
                                            >
                                                <div className="w-full h-full flex flex-col">
                                                    <div className="h-1/2 w-full" style={{ backgroundColor: palette.primary }} />
                                                    <div className="h-1/2 w-full flex">
                                                        <div className="w-1/2 h-full" style={{ backgroundColor: palette.secondary }} />
                                                        <div className="w-1/2 h-full" style={{ backgroundColor: palette.accent }} />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}

                                        <div className="w-[1px] h-4 bg-slate-200 mx-2" />

                                        {/* Client Brand Palette Button */}
                                        <button
                                            onClick={() => {
                                                const brandPalette: ColorPalette = {
                                                    id: 'brand',
                                                    name: 'Brand Colors',
                                                    primary: selectedClient.primaryColor,
                                                    secondary: selectedClient.secondaryColor,
                                                    accent: selectedClient.secondaryColor, // Fallback
                                                    background: selectedClient.primaryColor,
                                                    text: selectedClient.textColor
                                                };
                                                setActivePalette(brandPalette);
                                            }}
                                            className={cn(
                                                "px-2 py-1 text-[10px] font-bold uppercase rounded-lg border transition-all flex items-center gap-2",
                                                activePalette?.id === 'brand'
                                                    ? "bg-slate-900 text-white border-slate-900"
                                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedClient.primaryColor }} />
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedClient.secondaryColor }} />
                                            </div>
                                            Brand
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white border text-slate-400 border-transparent hover:border-slate-200">
                                            <Eye className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pl-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                                Using Template: <span className="text-slate-900 font-bold">{TEMPLATE_LABELS[selectedTemplate] || selectedTemplate}</span>
                            </p>
                            <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-100">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Format</Label>
                                <select
                                    className="h-8 bg-slate-50 border-none rounded-lg px-3 text-[11px] font-bold uppercase outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                >
                                    {ASSET_FORMATS.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Holiday Card Specific Controls */}
                        {selectedTemplate === 'holiday-card' && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase">Holiday Card Customization</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Custom Image URL</Label>
                                        <Input
                                            value={content.customImage || ''}
                                            onChange={(e) => setContent({ ...content, customImage: e.target.value })}
                                            placeholder="/images/mum.jpeg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Brand/Person Name</Label>
                                        <Input
                                            value={content.brandName || ''}
                                            onChange={(e) => setContent({ ...content, brandName: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Stage */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-slate-900/5 rounded-none blur-2xl group-hover:bg-slate-900/10 transition-colors" />
                            <div className="relative p-1 bg-white rounded-none border border-slate-100 shadow-2xl overflow-hidden max-w-[700px]" style={{ aspectRatio: activeDimensions.ratio.replace(':', '/') }}>
                                {/* Template Rendering */}
                                {/* Template Rendering */}
                                {selectedTemplate === 'presidential' && <PresidentialTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'presidential-executive' && <PresidentialExecutiveTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'lifestyle' && <LifestyleTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'dark-luxury' && <DarkLuxuryTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'teal-drapes' && <TealDrapesTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'clean-corporate' && <CleanCorporateTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'nicarb-luxury' && <NICArbLuxuryTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'royal-obsidian' && <RoyalObsidianTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'emerald-prestige' && <EmeraldPrestigeTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'holiday-card' && <HolidayCardTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
                                {selectedTemplate === 'appreciation-card' && <AppreciationCardTemplate client={selectedClient} content={content} containerRef={flyerRef} visualAsset={selectedVisualAsset} useBrandColors={useBrandColors} activePalette={activePalette} dimensions={{ width: activeDimensions.width, height: activeDimensions.height }} />}
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
                                    onClick={() => setSelectedTemplate('presidential-executive')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3 text-center",
                                        selectedTemplate === 'presidential-executive' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">Presidential Exec</p>
                                    {selectedTemplate === 'presidential-executive' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
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

                                <button
                                    onClick={() => setSelectedTemplate('holiday-card')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3 text-center",
                                        selectedTemplate === 'holiday-card' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-red-600" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">Holiday Card</p>
                                    {selectedTemplate === 'holiday-card' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>

                                <button
                                    onClick={() => setSelectedTemplate('appreciation-card')}
                                    className={cn(
                                        "group relative aspect-square bg-white rounded-2xl border transition-all p-4 flex flex-col items-center justify-center gap-3 text-center",
                                        selectedTemplate === 'appreciation-card' ? "border-slate-900 shadow-lg ring-2 ring-slate-900/5 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-slate-900" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider leading-tight">Appreciation Card</p>
                                    {selectedTemplate === 'appreciation-card' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-slate-900" />}
                                </button>
                            </div>
                        </section>
                    </div>

                </div >
            </main >

            {/* Decorative Ornaments (Global) */}
            < div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-100/50 to-transparent pointer-events-none -z-10" />

            {/* Footer */}
            < footer className="py-20 text-center text-slate-400 text-sm" >
                <p>© 2025 MerisLabs Asset Factory • Built for sovereign execution.</p>
            </footer >
        </div >
    );
}
