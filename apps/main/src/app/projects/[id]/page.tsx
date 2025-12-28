'use client';

import { useRouter } from 'next/navigation';
import { projects } from '@/components/projects';
import ProjectDetail from '@/components/ProjectDetail';
import { use } from 'react';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const project = projects.find((p: any) => p.id === id);

    if (!project) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">Project not found</h1>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <ProjectDetail
                project={project}
                onBack={() => router.back()}
            />
        </div>
    );
}
