import Image from 'next/image';
import Link from 'next/link';

export default function Clients() {
    const clients = [
        {
            name: 'NICArb',
            logo: '/clients/NICARB LOGO Green Text (1).png',
            url: 'https://nicarb.org'
        },
        {
            name: 'Jackson, Etti & Edu',
            logo: '/clients/jackson etti and edu logo (1).png',
            url: 'https://jacksonettiandedu.com'
        },
        {
            name: 'GK&A Logistics',
            logo: '/gka/gka-logo.png',
            url: 'https://www.gkaports.com'
        },
        {
            name: 'BrandQor',
            logo: '/clients/brandqor.png',
            url: 'https://www.brandqor.com'
        }
    ];

    return (
        <section>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20 border-t border-gray-800">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                        <h2 className="h2 mb-4 text-white">Our Clients</h2>
                        <p className="text-xl text-gray-400">
                            Trusted by leading organizations.
                        </p>
                    </div>

                    {/* Items */}
                    <div className="flex flex-wrap justify-center gap-6 items-center">
                        {clients.map((client) => (
                            <Link
                                href={client.url}
                                key={client.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center gap-3 p-4 bg-white rounded-xl w-48 shadow-md hover:scale-105 transition-all duration-300"
                            >
                                <div className="relative w-full h-24">
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="text-gray-900 font-bold text-xs tracking-tight text-center group-hover:text-[#f06600] transition-colors">
                                    {client.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
