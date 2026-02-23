import { JEE_WEBSITE_URL } from '../../constants';

const JeeUnionBankFooter = ({ pageNumber }: { pageNumber: string }) => (
    <div className="h-20 bg-transparent flex items-center justify-between px-12 relative mt-auto font-sans">
        {/* Top Border - clearly separated from text */}
        <div className="absolute top-0 left-12 right-12 h-px bg-[#211B1B]/10"></div>

        {/* Left Side: Page Number */}
        <div className="flex items-center gap-6 relative z-10">
            <span className="text-xl font-serif font-black text-[#E80000] leading-none">{pageNumber}</span>
            <div className="w-px h-6 bg-[#211B1B]/10"></div>
            <div>
                <p className="text-[10px] text-[#211B1B]/40 uppercase tracking-wider">Review and Standardisation of Union Bank Plc&apos;s Legal Documentation</p>
            </div>
        </div>

        {/* Right - Partner Logos */}
        <div className="flex items-center gap-8 relative z-10">
            <img
                src="/union-bank/logo.png"
                alt="Union Bank"
                className="h-8 w-auto object-contain brightness-0 opacity-50"
            />
            <div className="w-px h-6 bg-[#211B1B]/10"></div>
            <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                <img
                    src="/clients/jackson etti and edu logo (1).png"
                    alt="Jackson, Etti & Edu"
                    className="h-4 w-auto object-contain brightness-0 opacity-30 cursor-pointer hover:opacity-100 transition-opacity"
                />
            </a>
        </div>
    </div>
);

export { JeeUnionBankFooter };
