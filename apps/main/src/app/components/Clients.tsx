import Image from 'next/image';

export default function Clients() {
    const clients = [
        {
            name: 'NICArb',
            logo: '/clients/NICARB LOGO Green Text (1).png',
            description: 'Nigerian Institute of Chartered Arbitrators'
        },
        {
            name: 'Africa GRC Summit',
            logo: '/clients/africa-grc-summit.png',
            description: 'Governance, Risk, and Compliance Summit Platform'
        },
        {
            name: 'Jackson, Etti & Edu',
            logo: '/clients/jackson etti and edu logo (1).png',
            description: 'Leading Law Firm'
        },
        {
            name: 'BrandQor',
            logo: '/brandqor.png',
            description: 'Personal Branding Platform'
        }
    ];

    return (
        <section className="bg-white py-12 border-y border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Trusted by Leading Organizations
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-12 items-center">
                    {clients.map((client) => (
                        <div
                            key={client.name}
                            className="group relative flex items-center justify-center w-32 h-12 transition-all duration-300 grayscale hover:grayscale-0"
                        >
                            <img
                                src={client.logo}
                                alt={client.name}
                                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                            />

                            
                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-xl">
                                {client.name}
                                {/* Tooltip Arrow */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
