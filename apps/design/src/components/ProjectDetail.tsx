'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';
import { SiGoogleplay } from 'react-icons/si';
import { Project } from './projects';
import ProjectMediaDisplay from './ProjectMediaDisplay';

export default function ProjectDetail({
    project,
    onBack
}: {
    project: Project;
    onBack?: () => void;
}) {
    const typedLinks = project.links || [];

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col h-full">
                {onBack && (
                    <button
                        className="self-start mb-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        onClick={onBack}
                    >
                        <X className="h-6 w-6 text-white" />
                        <span className="sr-only">Close</span>
                    </button>
                )}

                <div className="flex-1 p-8 relative z-10">
                    <div className="max-w-4xl mx-auto h-full">
                        <ProjectMediaDisplay project={project} isFullscreen={true} />
                    </div>
                </div>

                <div className="p-8 bg-gray-900/50 backdrop-blur-sm relative z-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="font-architects-daughter text-base text-purple-600 mb-2">{project.tag}</div>
                        <h1 className="text-3xl font-bold mb-4">{project.name}</h1>

                        <div className="text-base text-gray-300 mb-4">
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                                    li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                                    strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
                                    em: ({ node, ...props }) => <span className="italic" {...props} />,
                                    a: ({ node, ...props }) => (
                                        <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                                    ),
                                }}
                            >
                                {project.description}
                            </ReactMarkdown>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {Array.isArray(project?.technologies) &&
                                project?.technologies.map((tool: string, techIndex: number) => (
                                    <span key={tool} className="text-xs bg-gray-700 px-3 py-1 rounded-full">
                                        {tool}
                                    </span>
                                ))}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {typedLinks.map((link, linkIndex) => (
                                <Link
                                    key={link.url}
                                    className="text-sm hover:underline px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors flex items-center"
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.type === 'google-play-store' ? (
                                        <>
                                            <SiGoogleplay className="inline mr-2" />
                                            Google Play Store
                                        </>
                                    ) : link.type}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
