import { Suspense } from 'react';
import NicarbConferenceClient from './client';

export const metadata = {
    title: 'NICArb Annual Conference 2025 | Strengthening Institutional Arbitration & ADR in Africa',
    description: 'Programme brochure for the 2025 NICArb Annual International Arbitration and ADR Conference - Charting a New Path',
};

export default function NicarbAnnualConference2025Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Deck...</div>}>
            <NicarbConferenceClient />
        </Suspense>
    );
}
