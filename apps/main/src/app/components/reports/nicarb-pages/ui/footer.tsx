const Nicarb2025ConferenceFooter = ({ pageNumber }: { pageNumber: string }) => (
    <div className="h-20 bg-white border-t-4 border-[#075302] flex items-center justify-between px-8 relative mt-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-white to-green-600 opacity-50"></div>

        {/* Page Number */}
        <div className="text-3xl font-bold text-[#064802]/20 font-serif">{pageNumber}</div>

        {/* Center - Conference Title */}
        <div className="text-center flex-1">
            <p className="text-[#064802] font-bold tracking-[0.2em] text-xs md:text-sm">2025 International Arbitration and ADR Conference</p>
        </div>

        {/* Right - NICArb Branding */}
        <div className="flex items-center gap-4">
            <img
                src="/nicarb/NICARB-LOGO-GREEN-BOLD.webp"
                alt="NICArb"
                className="h-10 w-auto object-contain"
            />
        </div>
    </div>
);

export { Nicarb2025ConferenceFooter };
