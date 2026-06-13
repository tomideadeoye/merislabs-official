import React from 'react';
import * as Sovereign from '@/components/report-templates';

export default function SovereignStyleGuide() {
    const sampleData = [
        { id: 1, name: 'Project Alpha', value: '$500,000', status: 'Active' },
        { id: 2, name: 'Project Beta', value: '$250,000', status: 'Pending' },
        { id: 3, name: 'Project Gamma', value: '$750,000', status: 'Completed' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen p-12 space-y-20">
            <section>
                <h1 className="text-4xl font-black mb-8 text-[#1a1a1a]">Sovereign Report Library: Series 1</h1>
                <Sovereign.PageWrapper1 pageNumber="1" projectName="Style Guide" firmName="MerisLabs">
                    <div className="p-16">
                        <Sovereign.Header1 number="1" title="Classic High-Fidelity" />
                        <p className="mb-8 text-sm text-gray-600">This series uses deep tones and serif typography for a formal, authoritative presence.</p>
                        <Sovereign.TableTemplate1 
                            title="Financial Projections (Sample)" 
                            headers={['ID', 'Name', 'Value', 'Status']}
                            data={sampleData}
                            keys={['id', 'name', 'value', 'status']}
                        />
                        <div className="mt-12">
                            <Sovereign.IdentityCard1 
                                name="Taiwo Ogbara" 
                                role="Senior Associate" 
                                imageUrl="https://media.licdn.com/dms/image/v2/D4D03AQFuh5XXx5j5Qw/profile-displayphoto-shrink_800_800/B4DZWaOFrPH4Ac-/0/1742049140562?e=1779926400&v=beta&t=9ZdcCn63OfNlDD6XQqjpSRRzI1nRgS9o8qO0yYyzGM8"
                            />
                        </div>
                    </div>
                </Sovereign.PageWrapper1>
            </section>

            <section>
                <h1 className="text-4xl font-black mb-8 text-[#1a1a1a]">Sovereign Report Library: Series 2</h1>
                <Sovereign.PageWrapper2 pageNumber="1" projectName="Style Guide" firmName="MerisLabs">
                    <Sovereign.Header2 number="1" title="Modern Minimalist" />
                    <p className="mb-8 text-sm text-gray-500 font-light">This series prioritizes white space and architectural lines for a contemporary strategic feel.</p>
                    <Sovereign.TableTemplate2 
                        headers={['Project Name', 'Market Value', 'Outcome']}
                        data={sampleData}
                        keys={['name', 'value', 'status']}
                    />
                    <div className="mt-20 flex justify-center">
                        <Sovereign.IdentityCard2 
                            name="Orion System" 
                            role="Sovereign AI"
                            imageUrl="https://github.com/shadcn.png"
                            email="orion@merislabs.com"
                        />
                    </div>
                </Sovereign.PageWrapper2>
            </section>
        </div>
    );
}
