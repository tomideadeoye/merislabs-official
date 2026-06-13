import React from 'react';

interface TableTemplate1Props {
    title?: string;
    headers: string[];
    data: Record<string, any>[];
    keys: string[];
    zebra?: boolean;
    headerBgColor?: string;
}

export const TableTemplate1: React.FC<TableTemplate1Props> = ({ 
    title, 
    headers, 
    data, 
    keys,
    zebra = true,
    headerBgColor = '#1a1a1a'
}) => {
    return (
        <div className="w-full">
            {title && <h4 className="text-lg font-semibold text-[#1a1a1a] mb-3">{title}</h4>}
            <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr style={{ backgroundColor: headerBgColor }} className="text-white">
                            {headers.map((header, i) => (
                                <th key={i} className="p-3 text-left font-bold uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIdx) => (
                            <tr 
                                key={rowIdx} 
                                className={`border-b border-gray-200 transition-colors hover:bg-gray-50/50 ${
                                    zebra && rowIdx % 2 !== 0 ? 'bg-gray-50' : 'bg-white'
                                }`}
                            >
                                {keys.map((key, colIdx) => (
                                    <td key={colIdx} className="p-3 text-gray-700 leading-relaxed">
                                        {row[key]}
                                    </td>
                                )).concat()}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableTemplate1;