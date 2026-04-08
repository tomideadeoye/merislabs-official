import { JEE_WEBSITE_URL } from '../../constants';

const ThankYouSlide = () => (
    <div className="w-full h-full relative overflow-hidden bg-[#F9F7ED] flex flex-col items-center justify-center font-sans text-[#211B1B]">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#211B1B 1px, transparent 1px), linear-gradient(90deg, #211B1B 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#211B1B]/[0.02] text-[35rem] font-black italic select-none z-0 leading-none">JEE</div>
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[60%] aspect-square rounded-full bg-red-600/5 blur-[150px] z-0 animate-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-14 opacity-90 hover:opacity-100 transition-opacity">
                <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                    <img src="/clients/jackson etti and edu logo (1).png" alt="Jackson, Etti & Edu" className="h-10 w-auto object-contain scale-125" />
                </a>
            </div>

            <div className="h-px w-20 bg-red-600 mb-10 shadow-[0_0_20px_rgba(232,0,0,0.4)]" />

            <h2 className="text-[#211B1B] text-8xl font-black uppercase tracking-tighter leading-none mb-10 italic skew-x-[-2deg]">
                Thank <span className="text-red-600">You.</span>
            </h2>

            <p className="text-[#211B1B]/40 text-base font-bold tracking-[0.5em] uppercase mb-2">
                Project Fortify · CLDR Business Plan
            </p>
            <div className="flex items-center space-x-5">
                <span className="text-[#211B1B]/25 text-xs font-mono tracking-widest uppercase">Jackson, Etti &amp; Edu</span>
                <div className="w-1 h-1 rounded-full bg-red-600" />
                <span className="text-[#211B1B]/25 text-xs font-mono tracking-widest uppercase">Partnership Selection Programme 2026</span>
            </div>
        </div>

        <div className="absolute bottom-12 w-full flex justify-center space-x-20 z-20">
            <div className="flex flex-col items-center">
                <span className="text-[#211B1B]/20 text-[9px] font-bold tracking-[0.4em] uppercase mb-1">Location</span>
                <span className="text-[#211B1B]/60 text-xs font-bold tracking-widest">LAGOS, NIGERIA</span>
            </div>
            <div className="flex flex-col items-center border-l border-[#211B1B]/5 pl-10">
                <span className="text-[#211B1B]/20 text-[9px] font-bold tracking-[0.4em] uppercase mb-1">Web</span>
                <span className="text-[#211B1B]/60 text-xs font-bold tracking-widest uppercase">www.JEE.africa</span>
            </div>
            <div className="flex flex-col items-center border-l border-[#211B1B]/5 pl-10">
                <span className="text-[#211B1B]/20 text-[9px] font-bold tracking-[0.4em] uppercase mb-1">Email</span>
                <span className="text-[#211B1B]/60 text-xs font-bold tracking-widest">jee@jee.africa</span>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
    </div>
);

export default ThankYouSlide;
