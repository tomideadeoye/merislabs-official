import Image from 'next/image';

export default function Clients() {
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
                    <div className="flex flex-wrap justify-center gap-12 items-center">
                        {/* Client 1 */}
                        <div className="flex items-center justify-center p-6 bg-white rounded-xl w-64 h-32 shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/clients/NICARB LOGO Green Text (1).png"
                                    alt="NICArb"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Client 2 */}
                        <div className="flex items-center justify-center p-6 bg-white rounded-xl w-64 h-32 shadow-lg hover:scale-105 transition-transform duration-300">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/clients/jackson etti and edu logo (1).png"
                                    alt="Jackson, Etti & Edu"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
