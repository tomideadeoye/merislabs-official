'use client';

import { Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/lib/utils';
import { VisualAsset } from '../types';
import { VISUAL_ASSETS } from '../data';

interface VisualAssetSelectorProps {
    selectedVisualAsset: VisualAsset;
    onSelect: (asset: VisualAsset) => void;
}

export const VisualAssetSelector = ({ selectedVisualAsset, onSelect }: VisualAssetSelectorProps) => {
    return (
        <section>
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">Visual Asset</Label>
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="grid grid-cols-3 gap-2">
                    {VISUAL_ASSETS.map((asset) => (
                        <button
                            key={asset.id}
                            onClick={() => onSelect(asset)}
                            className={cn(
                                "relative aspect-square rounded-xl border-2 transition-all overflow-hidden group",
                                selectedVisualAsset.id === asset.id
                                    ? "border-slate-900 ring-2 ring-slate-900/10"
                                    : "border-slate-100 hover:border-slate-300",
                                asset.category === 'new-year' && "bg-gradient-to-br from-amber-50 to-orange-50",
                                asset.category === 'christmas' && "bg-gradient-to-br from-green-50 to-emerald-50",
                                asset.category === 'generic' && "bg-slate-50"
                            )}
                            title={asset.name}
                        >
                            {asset.path ? (
                                <img
                                    src={asset.path}
                                    alt={asset.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-slate-300" />
                                </div>
                            )}
                            {selectedVisualAsset.id === asset.id && (
                                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-slate-900" />
                                </div>
                            )}
                            {/* Category Badge */}
                            <div className={cn(
                                "absolute bottom-1 left-1 right-1 text-[7px] font-bold uppercase tracking-wider py-0.5 rounded text-center",
                                asset.category === 'new-year' && "bg-amber-100 text-amber-700",
                                asset.category === 'christmas' && "bg-green-100 text-green-700",
                                asset.category === 'generic' && "bg-slate-100 text-slate-500"
                            )}>
                                {asset.category === 'new-year' ? 'NYE' : asset.category === 'christmas' ? 'XMAS' : 'ANY'}
                            </div>
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-3 text-center">
                    Selected: <span className="font-semibold text-slate-600">{selectedVisualAsset.name}</span>
                </p>
            </div>
        </section>
    );
};
