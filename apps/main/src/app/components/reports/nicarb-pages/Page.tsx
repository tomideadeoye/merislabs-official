import React from 'react';

export const Page = ({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <div {...(id ? { id } : {})} className={`w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl my-8 relative flex flex-col print:shadow-none print:my-0 print:mx-0 print:w-full print:max-w-none print:min-h-[297mm] print:h-[297mm] print:break-after-page break-after-page ${className}`}>
    {children}
  </div>
);