import React from 'react';

interface TableTemplate2Props {
    headers: string[];
    data: Record<string, any>[];
    keys: string[];
    brandColor?: string;
}

export const TableTemplate2: React.FC<TableTemplate2Props> = ({ 
    headers, 
    data, 
    keys,
    brandColor = '#1a1a1a'
}) => {
    return (
        <div className="w-full">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-100">
                        {headers.map((header, i) => (
                            <th 
                                key={i} 
                                className="py-4 px-2 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr 
                            key={rowIdx} 
                            className="border-b border-gray-50 group hover:bg-gray-50/30 transition-colors"
                        >
                            {keys.map((key, colIdx) => (
                                <td 
                                    key={colIdx} 
                                    className={`py-5 px-2 text-[13px] text-gray-600 ${
                                        colIdx === 0 ? 'font-bold text-gray-900' : 'font-light'
                                    }`}
                                >
                                    {row[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableTemplate2;"}
{