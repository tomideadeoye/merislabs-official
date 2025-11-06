import React, { useState } from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import GlitchText from '../../../../components/GlitchText';

interface MorganHacksPage7Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage7: React.FC<MorganHacksPage7Props> = ({
    width = 794,
    height = 1123,
    columns = 1
}) => {
    // Event images data
    const images = [
        { id: 1, src: '/images/morganhacks/gallery/A7400777.jpg', alt: 'MorganHacks Event Highlights' },
        { id: 2, src: '/images/morganhacks/gallery/A7400779.jpg', alt: 'Participants in Action' },
        { id: 3, src: '/images/morganhacks/gallery/A7400799 (1).jpg', alt: 'Team Collaboration' },
        { id: 4, src: '/images/morganhacks/gallery/A7400799.jpg', alt: 'Coding Session' },
        { id: 5, src: '/images/morganhacks/gallery/A7400813.jpg', alt: 'Project Presentation' },
        { id: 6, src: '/images/morganhacks/gallery/A7401237.jpg', alt: 'Judging Session' },
        { id: 7, src: '/images/morganhacks/gallery/A7401419.jpg', alt: 'Winners Announcement' },
        { id: 8, src: '/images/morganhacks/gallery/A7401429.jpg', alt: 'Networking Event' },
        { id: 9, src: '/images/morganhacks/gallery/A7401435.jpg', alt: 'Keynote Speaker' },
        { id: 10, src: '/images/morganhacks/gallery/A7401639.jpg', alt: 'Closing Ceremony' },
        { id: 11, src: '/images/morganhacks/gallery/IMG_9386.JPG', alt: 'Opening Ceremony' },
        { id: 12, src: '/images/morganhacks/gallery/IMG_9391.JPG', alt: 'Mentors Helping Participants' },
        { id: 13, src: '/images/morganhacks/gallery/IMG_9952.jpg', alt: 'Teamwork Moment' },
        { id: 14, src: '/images/morganhacks/gallery/IMG_9961.jpg', alt: 'Project Showcase' },
        { id: 15, src: '/images/morganhacks/gallery/IMG_9973.jpg', alt: 'Awards Ceremony' },
        { id: 16, src: '/images/morganhacks/gallery/IMG_9974.jpg', alt: 'Group Photo' },
    ];

    const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);

    return (
        <HybridPage
            components={{}}
            width={width}
            height={height}
            columns={columns}
        >
            <div className="text-center mb-8">
                <GlitchText
                    speed={1}
                    enableShadows={true}
                    enableOnHover={false}
                    className="font-bold text-white mb-4"
                >
                    Snippets from Last MorganHacks
                </GlitchText>
                <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full mb-4"></div>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    Memorable moments from our most recent MorganHacks event that showcase the energy, creativity, and collaboration of our participants.
                </p>
            </div>

            <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="relative overflow-hidden rounded-lg cursor-pointer group aspect-square"
                            onClick={() => setSelectedImage(image)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-center px-2 text-xs">{image.alt}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-4xl max-h-[90vh]">
                            <button
                                className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-black/70 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(null);
                                }}
                            >
                                ✕
                            </button>
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                className="max-w-full max-h-[80vh] object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="text-center text-white mt-2">
                                {selectedImage.alt}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center p-6 bg-[#F47937] rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10">
                    <h3 className="text-2xl font-bold text-white mb-3">
                        Join Us for MorganHacks 2026
                    </h3>
                    <p className="text-white mb-4">
                        Be part of another successful event. Your sponsorship will help us continue to provide exceptional experiences for our participants.
                    </p>
                    <div className="flex justify-center">
                        <div className="bg-white text-[#F47937] px-4 py-2 rounded-lg font-semibold">
                            April 11-12, 2026 • Morgan State University
                        </div>
                    </div>
                </div>
            </BackgroundGradient>
        </HybridPage>
    );
};
