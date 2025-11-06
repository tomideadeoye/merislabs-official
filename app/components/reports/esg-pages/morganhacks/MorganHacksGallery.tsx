import React, { useState } from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';

interface MorganHacksGalleryProps {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksGallery: React.FC<MorganHacksGalleryProps> = ({
    width = 794,
    height = 1123,
    columns = 1
}) => {
    // Actual image data from the copied files
    const [images] = useState([
        { id: 1, src: '/images/morganhacks/gallery/A7400777.jpg', alt: 'MorganHacks Event' },
        { id: 2, src: '/images/morganhacks/gallery/A7400779.jpg', alt: 'Participants working' },
        { id: 3, src: '/images/morganhacks/gallery/A7400799 (1).jpg', alt: 'Team collaboration' },
        { id: 4, src: '/images/morganhacks/gallery/A7400799.jpg', alt: 'Coding session' },
        { id: 5, src: '/images/morganhacks/gallery/A7400813.jpg', alt: 'Presentation' },
        { id: 6, src: '/images/morganhacks/gallery/A7401237.jpg', alt: 'Judging session' },
        { id: 7, src: '/images/morganhacks/gallery/A7401419.jpg', alt: 'Winners announcement' },
        { id: 8, src: '/images/morganhacks/gallery/A7401429.jpg', alt: 'Networking' },
        { id: 9, src: '/images/morganhacks/gallery/A7401435.jpg', alt: 'Keynote speaker' },
        { id: 10, src: '/images/morganhacks/gallery/A7401639.jpg', alt: 'Closing ceremony' },
        { id: 11, src: '/images/morganhacks/gallery/IMG_9386.JPG', alt: 'Opening ceremony' },
        { id: 12, src: '/images/morganhacks/gallery/IMG_9391.JPG', alt: 'Mentors helping' },
        { id: 13, src: '/images/morganhacks/gallery/IMG_9952.jpg', alt: 'Teamwork' },
        { id: 14, src: '/images/morganhacks/gallery/IMG_9961.jpg', alt: 'Project showcase' },
        { id: 15, src: '/images/morganhacks/gallery/IMG_9973.jpg', alt: 'Awards ceremony' },
        { id: 16, src: '/images/morganhacks/gallery/IMG_9974.jpg', alt: 'Group photo' },
    ]);

    const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);

    return (
        <HybridPage
            components={{}}
            width={width}
            height={height}
            columns={columns}
        >
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#F47937] mb-4">
                    MorganHacks Event Gallery
                </h1>
                <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full mb-4"></div>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    Take a look at some memorable moments from our past MorganHacks events.
                    These images showcase the energy, creativity, and collaboration that define our hackathon experience.
                </p>
            </div>

            <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="relative overflow-hidden rounded-lg cursor-pointer group"
                            onClick={() => setSelectedImage(image)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-center px-2 text-sm">{image.alt}</span>
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
            </BackgroundGradient>
        </HybridPage>
    );
};
