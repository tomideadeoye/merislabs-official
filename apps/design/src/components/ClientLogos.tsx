export default function ClientLogos() {
    const clients = [
        {
            name: 'NICArb',
            logo: '/clients/NICARB LOGO Green Text (1).png',
            description: 'Nigerian Institute of Chartered Arbitrators',
            url: 'https://nicarb.org'
        },
        {
            name: 'Africa GRC Summit',
            logo: '/clients/africa-grc-summit.png',
            description: 'Governance, Risk, and Compliance Summit Platform',
            url: 'https://www.africagrcsummit.com'
        },
        {
            name: 'Jackson, Etti & Edu',
            logo: '/clients/jackson etti and edu logo (1).png',
            description: 'Leading Law Firm',
            url: 'https://jacksonettiandedu.com'
        },
        {
            name: 'QorePay',
            logo: '/qorepay.png',
            description: 'Payment Gateway Solutions',
            url: 'https://qorepay.com'
        },
        {
            name: 'BrandQor',
            logo: '/clients/brandqor.png',
            description: 'Personal Branding Platform',
            url: 'https://www.brandqor.com'
        },
        {
            name: 'GK&A Logistics',
            logo: '/gka/gka-logo.png',
            description: 'Regional Inland Port Terminal',
            url: 'https://www.gkaports.com'
        }
    ];

    return (
        <section className="bg-gray-900 py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Trusted by Leading Organizations</h2>
                    <p className="text-gray-400">Building digital solutions for forward-thinking companies</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
                    {clients.map((client) => (
                        <a
                            key={client.name}
                            href={client.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-200"
                            title={client.description}
                        >
                            <img
                                src={client.logo}
                                alt={client.name}
                                className="max-h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
