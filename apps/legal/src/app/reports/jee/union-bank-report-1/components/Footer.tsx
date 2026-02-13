const JeeUnionBankFooter = ({ pageNumber }: { pageNumber: string }) => (
    <div className="h-20 bg-gray-50 border-t-4 border-[#009fe3] flex items-center justify-between px-8 relative mt-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#009fe3] via-white to-[#009fe3] opacity-30"></div>

        {/* Page Number */}
        <div className="text-3xl font-bold text-[#009fe3]/20 font-serif">{pageNumber}</div>

        {/* Center - Report Title */}
        <div className="text-center flex-1 no-justify">
            <p className="text-gray-500 text-xs no-justify">Review and Standardisation of Union Bank Plc&apos;s Legal Documentation</p>
        </div>

        {/* Right - Union Bank and Jackson Etti & Edu Logos */}
        <div className="flex items-center gap-6">
            <img
                src="/union-bank/logo.png"
                alt="Union Bank"
                className="h-12 w-auto object-contain"
            />
            <div className="w-px h-10 bg-gray-300"></div>
            <img
                src="/clients/jackson etti and edu logo (1).png"
                alt="Jackson, Etti & Edu"
                className="h-5 w-auto object-contain"
            />
        </div>
    </div>
);

export { JeeUnionBankFooter };
