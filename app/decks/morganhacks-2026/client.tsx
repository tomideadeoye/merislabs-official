"use client";

import React, { useState, useEffect } from 'react';
import { MorganHacksPage } from '../../components/reports/esg-pages/MorganHacksPage';

export const MorganHacksClient: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [, setForceUpdate] = useState({});
    const totalPages = 6;

    console.log('=== MORGAN HACKS CLIENT RENDERING ===');
    console.log('Current page state:', currentPage);
    console.log('Total pages:', totalPages);
    console.log('Force update state:', typeof setForceUpdate);

    useEffect(() => {
        console.log('=== MORGAN HACKS CLIENT EFFECT ===');
        console.log('Current page updated to:', currentPage);
        console.log('Triggering force update...');
        // Force a re-render of the component
        setForceUpdate({});
        console.log('Force update triggered');
    }, [currentPage]);

    const goToNextPage = () => {
        console.log('=== MORGAN HACKS NEXT BUTTON CLICKED ===');
        console.log('Current page before click:', currentPage);
        console.log('Total pages:', totalPages);
        console.log('Checking if can go to next page...');

        if (currentPage < totalPages) {
            console.log('Can go to next page, setting page to:', currentPage + 1);
            setCurrentPage(prev => {
                console.log('=== PAGE STATE UPDATE ===');
                console.log('Previous page value:', prev);
                console.log('New page value:', prev + 1);
                const newValue = prev + 1;
                console.log('Returning new value:', newValue);
                return newValue;
            });
            console.log('Page state update initiated');
        } else {
            console.log('ALREADY AT LAST PAGE, cannot go further');
            console.log('Current page:', currentPage);
            console.log('Total pages:', totalPages);
        }
        console.log('=== END NEXT BUTTON CLICK ===');
    };

    const goToPrevPage = () => {
        console.log('=== MORGAN HACKS PREVIOUS BUTTON CLICKED ===');
        console.log('Current page before click:', currentPage);
        console.log('Checking if can go to previous page...');

        if (currentPage > 1) {
            console.log('Can go to previous page, setting page to:', currentPage - 1);
            setCurrentPage(prev => {
                console.log('=== PAGE STATE UPDATE ===');
                console.log('Previous page value:', prev);
                console.log('New page value:', prev - 1);
                const newValue = prev - 1;
                console.log('Returning new value:', newValue);
                return newValue;
            });
            console.log('Page state update initiated');
        } else {
            console.log('ALREADY AT FIRST PAGE, cannot go further');
            console.log('Current page:', currentPage);
        }
        console.log('=== END PREVIOUS BUTTON CLICK ===');
    };

    console.log('=== RENDERING MORGAN HACKS CLIENT UI ===');
    console.log('Rendering page component with key:', `page-${currentPage}`);
    console.log('Passing currentPage prop:', currentPage);

    return (
        <div className="flex flex-col items-center bg-gray-900 min-h-screen p-4">
            <div className="w-full flex justify-center" style={{ pointerEvents: 'auto' }}>
                <MorganHacksPage key={`page-${currentPage}`} currentPage={currentPage} />
            </div>
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-800/50 rounded-lg" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1000, width: '100%', maxWidth: '794px' }}>
                <button
                    onClick={() => {
                        console.log('=== PREVIOUS BUTTON CLICK HANDLER ===');
                        console.log('Calling goToPrevPage function...');
                        goToPrevPage();
                        console.log('goToPrevPage function completed');
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    style={{ pointerEvents: 'auto', zIndex: 1001 }}
                >
                    Previous
                </button>

                <div className="text-gray-300">
                    Page {currentPage} of {totalPages}
                </div>

                <button
                    onClick={() => {
                        console.log('=== NEXT BUTTON CLICK HANDLER ===');
                        console.log('Calling goToNextPage function...');
                        goToNextPage();
                        console.log('goToNextPage function completed');
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    style={{ pointerEvents: 'auto', zIndex: 1001 }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
