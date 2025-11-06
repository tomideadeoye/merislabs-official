import React, { useState } from 'react';
import { CONTACT_INFO } from './constants';
import { BackgroundGradient } from '@/components/ui/background-gradient';

interface ContactFormData {
    name: string;
    email: string;
    company: string;
    interest: string;
    message: string;
}

export const CallToAction: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        company: '',
        interest: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        alert('Thank you for your interest! We will contact you soon.');
        setShowForm(false);
        setFormData({ name: '', email: '', company: '', interest: '', message: '' });
    };

    return (
        <BackgroundGradient className="text-center p-6 rounded-xl border border-[#1B4383]/30 shadow-lg shadow-[#1B4383]/20">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1B4383] to-[#F47937] mb-3">
                Ready to Sponsor MorganHacks 2026?
            </h3>
            <p className="text-gray-200 mb-4">
                Be part of an innovative experience that brings together talented students, cutting-edge technology,
                and creative problem-solving in a vibrant, futuristic setting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="px-6 py-3 bg-gradient-to-r from-[#1B4383] to-[#F47937] text-white font-semibold rounded-lg hover:from-[#1B4383] hover:to-[#F47937] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#1B4383]/30 border border-[#1B4383]/30"
                >
                    Become a Sponsor
                </a>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-[#1B4383]/30 shadow-lg shadow-[#1B4383]/20">
                        <h3 className="text-xl font-bold text-[#1B4383] mb-4">Sponsorship Inquiry</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-[#1B4383] focus:ring-2 focus:ring-[#1B4383]/30"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-[#1B4383] focus:ring-2 focus:ring-[#1B4383]/30"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-[#1B4383] focus:ring-2 focus:ring-[#1B4383]/30"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Interest Level</label>
                                <select
                                    name="interest"
                                    value={formData.interest}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-[#1B4383] focus:ring-2 focus:ring-[#1B4383]/30"
                                >
                                    <option value="">Select tier</option>
                                    <option value="bronze">Bronze ($1,000)</option>
                                    <option value="silver">Silver ($2,500)</option>
                                    <option value="gold">Gold ($5,000)</option>
                                    <option value="platinum">Platinum ($10,000)</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-[#1B4383] focus:ring-2 focus:ring-[#1B4383]/30"
                                    placeholder="Tell us about your sponsorship goals..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#1B4383] text-white rounded hover:bg-[#1B4383] border border-[#1B4383]/30"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 border border-gray-500/30"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </BackgroundGradient>
    );
};
