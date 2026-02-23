export const ThankYouSlide = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center font-sans">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-40">
                <img
                    src="/baker_hughes_industrial_abstract_1771855197762.png"
                    alt="Background"
                    className="w-full h-full object-cover grayscale opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]"></div>
            </div>

            {/* Massive Faded Logo Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] text-[40rem] font-black italic select-none z-0">
                JEE
            </div>

            {/* Glowing Focal Point */}
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[60%] aspect-square rounded-full bg-red-600/10 blur-[150px] z-0 animate-pulse-slow" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* JEE Logo */}
                <div className="mb-16 opacity-100">
                    <img
                        src="/clients/jackson etti and edu logo (1).png"
                        alt="Jackson, Etti & Edu"
                        className="h-10 w-auto invert brightness-0"
                    />
                </div>

                <div className="h-px w-32 bg-red-600 mb-16 shadow-[0_0_30px_rgba(232,0,0,0.8)]" />

                <h2 className="text-white text-[10rem] font-black uppercase tracking-tighter leading-none mb-16 italic skew-x-[-2deg] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    Thank <span className="text-red-600">You.</span>
                </h2>

                <div className="space-y-6">
                    <p className="text-white/40 text-2xl font-black tracking-[0.8em] uppercase italic">
                        Legal Excellence . 2026
                    </p>
                    <div className="flex justify-center items-center space-x-8">
                        <span className="text-white/20 text-xs font-mono tracking-[0.5em] uppercase">JEE . BAKER HUGHES</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(232,0,0,1)]" />
                        <span className="text-white/20 text-xs font-mono tracking-[0.5em] uppercase">Secured Mandate</span>
                    </div>
                </div>
            </div>

            {/* Contact Details Bottom */}
            <div className="absolute bottom-16 w-full flex justify-center space-x-32 z-20">
                <div className="flex flex-col items-start pt-6 border-t border-white/5">
                    <span className="text-white/20 text-[9px] font-black tracking-[0.5em] uppercase mb-3">Territory</span>
                    <span className="text-white/80 text-sm font-black tracking-widest uppercase">Lagos, Nigeria</span>
                </div>
                <div className="flex flex-col items-start pt-6 border-t border-white/5">
                    <span className="text-white/20 text-[9px] font-black tracking-[0.5em] uppercase mb-3">Global Access</span>
                    <span className="text-white/80 text-sm font-black tracking-widest uppercase">www.JEE.africa</span>
                </div>
                <div className="flex flex-col items-start pt-6 border-t border-white/5">
                    <span className="text-white/20 text-[9px] font-black tracking-[0.5em] uppercase mb-3">Version</span>
                    <span className="text-white/80 text-sm font-black tracking-widest uppercase italic">M.Labs - BH26</span>
                </div>
            </div>

            {/* Scanning Line Animation Effect */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent shadow-[0_20px_50px_rgba(232,0,0,0.5)]" />
        </div>
    );
};
