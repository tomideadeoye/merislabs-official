import React, { useState, useEffect } from 'react';
import { BackgroundGradient } from '@/components/ui/background-gradient';

// Define sponsor data with logos
const SPONSORS = [
    {
        name: "TEKsystems",
        logo: "/images/sponsors/teksystems-logo.svg"
    },
    {
        name: "Lyft",
        logo: "/images/sponsors/lyft.png"
    },
    {
        name: "Pepsi",
        logo: "/images/sponsors/pepsi.png"
    },
    {
        name: "Google",
        logo: "/images/sponsors/google.png"
    },
    {
        name: "Deloitte",
        logo: "/images/sponsors/deloitte.png"
    },
    {
        name: "Genera8tor",
        logo: "/images/sponsors/genera8tor.avif"
    },
    {
        name: "Ripple",
        logo: "/images/sponsors/ripple.png"
    },
    {
        name: "Deutsche Bank",
        logo: "/images/sponsors/deutsche-bank.png"
    },
    {
        name: "M&T Bank",
        logo: "/images/sponsors/mt-bank.png"
    },
    {
        name: "GitHub",
        logo: "/images/sponsors/github-mark.png"
    },
    {
        name: "BVCC",
        logo: "/images/sponsors/bvcc.webp"
    },
    {
        name: "Wolfram Alpha",
        logo: "/images/sponsors/wolfram-alpha.png"
    },
    {
        name: "Amazon Web Services",
        logo: "/images/sponsors/aws.png"
    },
    {
        name: "Timeless Venture Group",
        logo: "/images/sponsors/timeless_venture_group_llc_logo.jpeg"
    },
    {
        name: "Thurgood Marshall College Fund",
        logo: "/images/sponsors/logo-thurgood-marshall.webp"
    },
    {
        name: "HBCUvc",
        logo: "/images/sponsors/hbcuvc.png"
    },
    {
        name: "Venture for THEM",
        logo: "/images/sponsors/venture-for-them.jpeg"
    },
    {
        name: "Gambix",
        logo: "/images/sponsors/gambix.jpeg"
    },
    { name: "The Bureau of Central Intelligence" },
    {
        name: "Microsoft",
        logo: "/images/sponsors/microsoft.png"
    }
];

export const SponsorGrid: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    console.log('=== SPONSOR GRID RENDERING ===');
    console.log('SPONSORS data:', SPONSORS);

    useEffect(() => {
        console.log('=== SPONSOR GRID MOUNTED ===');
        console.log('Number of sponsors:', SPONSORS.length);

        // Check if image files exist
        SPONSORS.forEach((sponsor, index) => {
            if (sponsor.logo) {
                console.log(`Checking sponsor ${index}: ${sponsor.name} with logo path: ${sponsor.logo}`);

                // Create image element to test if it loads
                const img = new Image();
                img.onload = () => {
                    console.log(`✅ Image loaded successfully for ${sponsor.name}:`, sponsor.logo);
                };
                img.onerror = (error) => {
                    console.error(`❌ Failed to load image for ${sponsor.name}:`, sponsor.logo, error);
                };
                img.src = sponsor.logo;
            } else {
                console.log(`📝 No logo for sponsor ${index}: ${sponsor.name}`);
            }
        });
    }, []);

    return (
        <div className="mb-8 p-4 rounded-lg border border-[#1B4383]/30 shadow-lg shadow-[#1B4383]/20 bg-[#1B4383]/20">

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {SPONSORS.map((sponsor, index) => {
                    console.log(`Rendering sponsor ${index}:`, sponsor);

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="relative p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-md w-full h-24"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {sponsor.logo ? (
                                    <img
                                        src={sponsor.logo}
                                        alt={`${sponsor.name} logo`}
                                        className="max-h-16 w-auto object-contain"
                                        onLoad={() => console.log(`✅ Image component loaded for ${sponsor.name}`, sponsor.logo)}
                                        onError={(e) => {
                                            console.error(`❌ Image component failed to load for ${sponsor.name}`, sponsor.logo, e);
                                            // If image fails to load, show text instead
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                const textElement = document.createElement('span');
                                                textElement.className = 'text-sm font-medium text-gray-700 text-center';
                                                textElement.textContent = sponsor.name;
                                                parent.appendChild(textElement);
                                            }
                                        }}
                                    />
                                ) : (
                                    <span className="text-sm font-medium text-gray-700 text-center">{sponsor.name}</span>
                                )}
                                {hoveredIndex === index && (
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap border border-gray-300">
                                        {sponsor.name}
                                    </div>
                                )}
                            </div>
                            {/* Company name badge below the sponsor image - full name display */}
                            <div className="mt-2 px-2 py-1 bg-[#F47937] text-white text-xs font-medium rounded whitespace-normal break-words w-full text-center">
                                {sponsor.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
