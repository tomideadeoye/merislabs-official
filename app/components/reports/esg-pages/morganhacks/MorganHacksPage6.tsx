import React from 'react';
import { HybridPage } from '../../HybridPage';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

interface MorganHacksPage6Props {
    width?: number;
    height?: number;
    columns?: number;
}

export const MorganHacksPage6: React.FC<MorganHacksPage6Props> = ({
    width = 794,
    height = 1123,
    columns = 1
}) => {
    return (
        <HybridPage
            components={{}}
            width={width}
            height={height}
            columns={columns}
        >
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 mb-4">
                    About the Event
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <BackgroundGradient className="p-6 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/20">
                <div className="p-4 bg-gray-900/80 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
                    <h3 className="text-xl font-semibold text-blue-400 mb-3">About MorganHacks 2026</h3>
                    <p className="text-gray-200 mb-4">
                        MorganHacks is a 24-hour hackathon where students from across the region come together to solve real-world challenges
                        through technology and innovation. Participants work in teams to develop projects that address issues in areas such as
                        sustainability, healthcare, education, and social justice.
                    </p>
                    <p className="text-gray-200 mb-4">
                        The event features workshops, mentoring from industry professionals, and networking opportunities with potential employers.
                        With a focus on creativity, collaboration, and technical skill development, MorganHacks provides a platform for students
                        to showcase their talents and make meaningful connections in the tech industry.
                    </p>
                    <p className="text-gray-200">
                        This year's hackathon will take place on April 11th-12th, 2026 at Morgan State University, bringing together talented students,
                        experienced mentors, and industry leaders for an unforgettable weekend of innovation and collaboration.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BackgroundGradient className="p-4 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/10">
                        <h3 className="text-lg font-semibold text-green-400 mb-2">🎯 Event Goals</h3>
                        <ul className="text-gray-200 space-y-2">
                            <li className="flex items-start">
                                <span className="text-green-400 mr-2">✓</span>
                                Foster innovation and creativity among students
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-400 mr-2">✓</span>
                                Address real-world challenges through technology
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-400 mr-2">✓</span>
                                Build connections between students and industry professionals
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-400 mr-2">✓</span>
                                Provide hands-on learning and skill development opportunities
                            </li>
                        </ul>
                    </BackgroundGradient>

                    <BackgroundGradient className="p-4 rounded-lg border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">🌟 What to Expect</h3>
                        <ul className="text-gray-200 space-y-2">
                            <li className="flex items-start">
                                <span className="text-yellow-400 mr-2">•</span>
                                24 hours of intensive hacking and innovation
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-400 mr-2">•</span>
                                Workshops and technical sessions
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-400 mr-2">•</span>
                                Mentoring from industry experts
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-400 mr-2">•</span>
                                Networking opportunities with potential employers
                            </li>
                        </ul>
                    </BackgroundGradient>
                </div>

                {/* Social Media Links */}
                <div className="mt-8 p-4 bg-gray-900/80 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/10">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3 text-center">Connect With Us</h3>
                    <p className="text-gray-200 text-center mb-4">
                        Follow us on social media for updates, announcements, and behind-the-scenes content
                    </p>
                    <div className="flex justify-center space-x-6">
                        <a
                            href="https://www.morganhacks.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-gray-300 hover:text-purple-400 transition-colors duration-300"
                        >
                            <div className="text-2xl mb-1">🌐</div>
                            <span className="text-sm">morganhacks.com</span>
                        </a>
                        <a
                            href="https://instagram.com/morganhacks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-gray-300 hover:text-purple-400 transition-colors duration-300"
                        >
                            <FaInstagram className="text-2xl mb-1" />
                            <span className="text-sm">@morganhacks</span>
                        </a>
                        <a
                            href="https://linkedin.com/company/morganhacks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-gray-300 hover:text-purple-400 transition-colors duration-300"
                        >
                            <FaLinkedin className="text-2xl mb-1" />
                            <span className="text-sm">@morganhacks</span>
                        </a>
                        <a
                            href="https://twitter.com/morganhacks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-gray-300 hover:text-purple-400 transition-colors duration-300"
                        >
                            <FaTwitter className="text-2xl mb-1" />
                            <span className="text-sm">@morganhacks</span>
                        </a>
                    </div>
                </div>
            </BackgroundGradient>
        </HybridPage>
    );
};
