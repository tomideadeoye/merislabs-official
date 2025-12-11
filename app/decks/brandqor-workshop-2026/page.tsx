import { Suspense } from 'react';
import BrandQorWorkshopClient from './client';

export const metadata = {
    title: 'SHOW UP & SHINE 2026 | BrandQor Workshop',
    description: 'Turn your 2025 work into 10x opportunities. A strategy workshop by BrandQor.',
    openGraph: {
        title: 'SHOW UP & SHINE 2026 | BrandQor',
        description: 'Turn your 2025 work into 10x opportunities',
        images: ['/brandqor/public/brandqor-banner.jpeg'],
    },
};

export default function BrandQorWorkshop2026Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0F1115] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#D4A76A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60 text-sm tracking-widest uppercase">Loading Workshop</p>
                </div>
            </div>
        }>
            <BrandQorWorkshopClient />
        </Suspense>
    );
}
