import React from 'react';
import { MorganHacksClient } from './client';

export default function MorganHacksDeckPage() {
    console.log('=== MORGAN HACKS DECK PAGE ===');
    console.log('Rendering MorganHacksClient component');
    console.log('Container classes: container mx-auto py-8');
    console.log('Pointer events style: auto');

    return (
        <div className="container mx-auto py-8" style={{ pointerEvents: 'auto' }}>
            <MorganHacksClient />
        </div>
    );
}
