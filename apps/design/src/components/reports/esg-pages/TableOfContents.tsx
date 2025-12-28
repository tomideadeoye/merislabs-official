import React from 'react';
import { HybridPage } from '../HybridPage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

interface TOCItem {
  title: string;
  page: number;
}

const tableOfContents: TOCItem[] = [
  { title: 'Introduction', page: 3 },
  { title: 'Internal Barriers', page: 6 },
  { title: 'External Barriers', page: 9 },
  { title: 'ESG Supply Side Analysis', page: 10 },
  { title: 'Industrialization and ESG Integration', page: 11 },
  { title: 'Governance', page: 12 },
  { title: 'Sustainability Risks and Management', page: 13 },
  { title: 'Financial Risk Categories', page: 14 },
  { title: 'Sustainability Disclosures', page: 15 },
  { title: 'Endnotes', page: 16 },
];

interface TableOfContentsProps {
  pageNumber: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ pageNumber }) => {
  return (
    <HybridPage
      pageNumber={pageNumber}
      columns={1}
      components={{}} // Empty components object for TableOfContents
    >
      <div className="h-full bg-white">
        {/* Header */}
        <div className="text-center pt-16 pb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4 tracking-wide">
            TABLE OF CONTENTS
          </h1>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-8"></div>
        </div>

        {/* Table of Contents */}
        <div className="px-8 pb-16">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-gray-300">
                <TableHead className="text-left font-bold text-gray-800 py-4 text-lg"></TableHead>
                <TableHead className="text-right font-bold text-gray-800 py-4 text-lg w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableOfContents.map((item) => (
                <TableRow key={item.title} className="border-b border-gray-200 hover:bg-gray-50">
                  <TableCell className="py-3 text-gray-700 font-medium">{item.title}</TableCell>
                  <TableCell className="py-3 text-right">
                    <button
                      onClick={() => {
                        const element = document.getElementById(`page-${item.page}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer hover:no-underline transition-colors"
                    >
                      {item.page}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>


      </div>
    </HybridPage>
  );
};
