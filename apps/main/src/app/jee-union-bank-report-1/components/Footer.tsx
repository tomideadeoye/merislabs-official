const JeeUnionBankFooter = ({ pageNumber }: { pageNumber: string }) => (
    <div className="h-20 bg-white border-t-4 border-[#075302] flex items-center justify-between px-8 relative mt-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-white to-green-600 opacity-50"></div>

        {/* Page Number */}
        <div className="text-3xl font-bold text-[#064802]/20 font-serif">{pageNumber}</div>

        {/* Center - Report Title */}
        <div className="text-center flex-1">
            <p className="text-[#064802] font-bold tracking-[0.2em] text-xs md:text-sm">UNION BANK-NIGERIA LIQUIDITY MANAGEMENT FRAMEWORK</p>
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
                className="h-10 w-auto object-contain"
            />
        </div>
    </div>
);

export { JeeUnionBankFooter };
