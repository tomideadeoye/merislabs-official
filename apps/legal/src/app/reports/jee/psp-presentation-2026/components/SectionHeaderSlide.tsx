import { useDeckNavigation } from './NavigationContext';
import { JEE_WEBSITE_URL } from '../../constants';

interface Props {
    title: string;
    subtitle?: string;
    sectionNumber: number;
    bgLetter?: string;
}

const SectionHeaderSlide: React.FC<Props> = ({ title, subtitle, sectionNumber, bgLetter }) => {
    const { goToSlideById } = useDeckNavigation();
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#F9F7ED] flex flex-col items-center justify-center font-sans text-[#211B1B]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#211B1B]/[0.025] text-[30rem] font-black italic select-none z-0 leading-none">
                {bgLetter || String(sectionNumber).padStart(2, '0')}
            </div>
            <div className="absolute top-[20%] right-[-10%] w-[50%] aspect-square rounded-full bg-red-600/5 blur-[150px] z-0 animate-pulse" />
            <div className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#211B1B 1px, transparent 1px), linear-gradient(90deg, #211B1B 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

            <div className="relative z-10 flex flex-col items-center max-w-5xl text-center px-20">
                <div
                    onClick={() => goToSlideById('toc')}
                    className="inline-flex items-center space-x-5 mb-8 cursor-pointer group hover:scale-105 transition-transform"
                >
                    <div className="h-[1px] w-10 bg-red-600" />
                    <span className="text-red-500 font-bold tracking-[0.5em] text-[10px] uppercase">Section {String(sectionNumber).padStart(2, '0')}</span>
                    <div className="h-[1px] w-10 bg-red-600" />
                </div>

                <h2 className="text-[#211B1B] text-[6rem] font-black uppercase tracking-tighter leading-[0.9] mb-8 italic skew-x-[-2deg] text-transparent bg-clip-text bg-gradient-to-b from-[#211B1B] to-[#211B1B]/30">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-[#211B1B]/40 text-base font-bold tracking-[0.4em] uppercase border-x border-red-600/20 px-10">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="absolute bottom-12 z-20 opacity-50 hover:opacity-100 transition-opacity">
                <a href={JEE_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
                    <img src="/clients/jackson etti and edu logo (1).png" alt="JEE" className="h-5 w-auto object-contain" />
                </a>
            </div>
        </div>
    );
};

export default SectionHeaderSlide;
