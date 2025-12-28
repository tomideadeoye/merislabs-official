import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { FaGraduationCap, FaGamepad, FaHeartbeat, FaCubes, FaVrCardboard, FaLeaf, FaRobot, FaCar, FaTshirt } from 'react-icons/fa';

interface MorganHacksPage3Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage3: React.FC<MorganHacksPage3Props> = ({
    width = 794,
    height = 1123,
    columns = 1
}) => {
    // Tracks data
    const tracks = [
        {
            id: 1,
            title: "Education",
            subtitle: "Edtech",
            icon: <FaGraduationCap className="text-2xl text-white" />,
            description: "Innovative solutions for learning and education"
        },
        {
            id: 2,
            title: "Entertainment",
            icon: <FaGamepad className="text-2xl text-white" />,
            description: "Creative and engaging entertainment experiences"
        },
        {
            id: 3,
            title: "Health",
            subtitle: "Healthtech",
            icon: <FaHeartbeat className="text-2xl text-white" />,
            description: "Technology solutions for healthcare and wellness"
        },
        {
            id: 4,
            title: "New Frontiers",
            subtitle: "Web 3; AR/VR",
            icon: <FaCubes className="text-2xl text-white" />,
            description: "Exploring emerging technologies and virtual experiences"
        },
        {
            id: 5,
            title: "Sustainability",
            subtitle: "Food, Finance, Energy, Water",
            icon: <FaLeaf className="text-2xl text-white" />,
            description: "Solutions for environmental and social sustainability"
        },
        {
            id: 6,
            title: "Robotics",
            icon: <FaRobot className="text-2xl text-white" />,
            description: "Autonomous systems and intelligent machines"
        }
    ];

    // Past projects data
    const pastProjects = [
        {
            id: 1,
            title: "SIGNIFY",
            description: "The team developed a prototype, integrating Azure TTS for speech, Mediapipe for gesture recognition, and Libcamera for camera support. The system ran on a Raspberry Pi 5 with OpenCV and TensorFlow/Keras."
        },
        {
            id: 2,
            title: "MIRAcare",
            description: "MIRAcare empowers patients to manage their healthcare by inputting medical data, which doctors can use to make diagnoses and identify risks. Its AI also helps researchers spot disease patterns and outbreaks, improving public health."
        },
        {
            id: 3,
            title: "S.A.L.L.Y.",
            description: "S.A.L.L.Y. is a mobile app that will focus on utilizing Cognitive Behavioral Therapy (CBT) and Chat-GPT API model to create an assessable environment for people to understand themselves and keep them goal oriented with weekly mental and physical restoration task."
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
                        Hackathon Tracks & Past Projects
                    </h1>
                    <div className="w-24 h-1 bg-[#F47937] mx-auto rounded-full"></div>
                </div>

                <div className="space-y-8">
                    <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                        <h2 className="text-xl font-semibold text-white mb-6 text-center">
                            Hackathon Tracks
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            {tracks.map((track) => (
                                <div
                                    key={track.id}
                                    className="p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10 hover:bg-gray-800/80 transition-all duration-300"
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="mr-3 p-2 bg-[#F47937]/10 rounded-lg">
                                            {track.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">
                                                {track.subtitle || track.title}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm">{track.description}</p>
                                </div>
                            ))}
                        </div>
                    </BackgroundGradient>

                    <BackgroundGradient className="p-6 rounded-xl border border-[#F47937]/30 shadow-lg shadow-[#F47937]/20">
                        <h2 className="text-xl font-semibold text-white mb-6 text-center">
                            Past Projects
                        </h2>
                        <div>
                            {pastProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-4 bg-gray-900/80 rounded-lg border border-[#F47937]/30 shadow-lg shadow-[#F47937]/10"
                                >
                                    <div className="flex items-start">
                                        <h3 className="text-xl font-semibold text-[#F47937] mr-3 flex-shrink-0">{project.title}</h3>
                                        <p className="text-gray-200">{project.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BackgroundGradient>
                </div>
            </div>
        </HybridPage>
    );
};
