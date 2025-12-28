import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { FaGraduationCap, FaGamepad, FaHeartbeat, FaCubes, FaVrCardboard, FaLeaf, FaRobot, FaCar, FaTshirt } from 'react-icons/fa';

interface MorganHacksPage4Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage4: React.FC<MorganHacksPage4Props> = ({
    width = 794,
    height = 1123,
    columns = 1
}) => {
    // Gallery images data
    const galleryImages = [
        {
            id: 1,
            src: "/images/morganhacks/additional/Screenshot 2025-11-06 at 18.54.30.png",
            alt: "MorganHacks Event Screenshot 1"
        },
        {
            id: 2,
            src: "/images/morganhacks/additional/Screenshot 2025-11-06 at 18.54.37.png",
            alt: "MorganHacks Event Screenshot 2"
        },
        {
            id: 3,
            src: "/images/morganhacks/additional/Screenshot 2025-11-06 at 18.54.43.png",
            alt: "MorganHacks Event Screenshot 3"
        },
        {
            id: 4,
            src: "/images/morganhacks/additional/Screenshot 2025-11-06 at 18.54.51.png",
            alt: "MorganHacks Event Screenshot 4"
        },
        {
            id: 5,
            src: "/images/morganhacks/additional/Screenshot 2025-11-06 at 18.54.58.png",
            alt: "MorganHacks Event Screenshot 5"
        },
        {
            id: 6,
            src: "/images/morganhacks/additional/Screenshot 2025-11-06 at 18.55.12.png",
            alt: "MorganHacks Event Screenshot 6"
        },
        {
            id: 7,
            src: "/images/morganhacks/additional/Screenshot 2025-11-06 at 18.55.19.png",
            alt: "MorganHacks Event Screenshot 7"
        },
        {
            id: 8,
            src: "/images/morganhacks/additional/Screenshot 2025-11-06 at 18.55.27.png",
            alt: "MorganHacks Event Screenshot 8"
        }
    ];

    return (
        <HybridPage
            components={{}}
            width={width}
            height={height}
            columns={columns}
        >
            {/* Full page transparent Morgan Blue background */}
            <div
                className="absolute inset-0 w-full h-full bg-[#1B4383]/70"
            ></div>

            {/* Content positioned over the background */}
            <div className="relative z-10">
                <div className="text-center mb-8">
                    <h1 className="font-bold text-white mb-4 text-4xl">
                        Previous MorganHacks Events
                    </h1>
                    <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full"></div>
                </div>

                <div className="space-y-8">
                    <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                        <h2 className="text-xl font-semibold text-white mb-6 text-center">
                            Event Gallery
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {galleryImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10 overflow-hidden"
                                >
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </BackgroundGradient>
                </div>
            </div>
        </HybridPage>
    );
};
