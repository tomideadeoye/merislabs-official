import React from 'react';

export default function ReportsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 print:p-0 print:bg-white">
            {children}
        </div>
    );
}
