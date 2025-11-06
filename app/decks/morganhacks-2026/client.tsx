"use client";

import React, { useState, useEffect } from 'react';
import { MorganHacksPage } from '../../components/reports/esg-pages/MorganHacksPage';

export const MorganHacksClient: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [, setForceUpdate] = useState({});
    const totalPages = 8; // Updated from 9 to 8 after removing duplicate page 8

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
            console.log('Going to next page...');
            setCurrentPage(currentPage + 1);
            console.log('Page state updated to:', currentPage + 1);
        } else {
            console.log('Already at last page, cannot go further');
        }
    };

    const goToPreviousPage = () => {
        console.log('=== MORGAN HACKS PREVIOUS BUTTON CLICKED ===');
        console.log('Current page before click:', currentPage);
        if (currentPage > 1) {
            console.log('Going to previous page...');
            setCurrentPage(currentPage - 1);
            console.log('Page state updated to:', currentPage - 1);
        } else {
            console.log('Already at first page, cannot go back');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === 1
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-[#F47937] text-white hover:bg-[#F47937]/80'
                            }`}
                    >
                        ← Previous
                    </button>

                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white">MorganHacks 2026</h1>
                        <p className="text-gray-400">Sponsorship Packet</p>
                        <p className="text-[#F47937] font-semibold mt-1">
                            Page {currentPage} of {totalPages}
                        </p>
                    </div>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === totalPages
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-[#F47937] text-white hover:bg-[#F47937]/80'
                            }`}
                    >
                        Next →
                    </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 min-h-[700px]">
                    <MorganHacksPage currentPage={currentPage} />
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`w-3 h-3 rounded-full transition-all ${currentPage === index + 1
                                ? 'bg-[#F47937] scale-125'
                                : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
