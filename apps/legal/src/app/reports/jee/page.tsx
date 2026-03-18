'use client';

import React from 'react';
import { ExternalLink, TrendingUp, Users, Scale, FileText } from 'lucide-react';

const jeeProjects = [
  {
    name: "Project Compass",
    client: "Ecobank Nigeria Limited",
    value: "₦25,000,000",
    description: "Litigation audit dashboard tracking ₦273B+ exposure across 353+ cases",
    metrics: [
      { label: "Cases Audited", value: "353+" },
      { label: "Exposure Tracked", value: "₦273B+" },
      { label: "Law Firms", value: "37" },
      { label: "Error Prevented", value: "₦107B" }
    ],
    url: "https://jee-ecobank-compass.vercel.app/",
    docs: "https://github.com/tomideadeoye/jee-ecobank-compass/tree/main/docs",
    status: "Live",
    category: "Litigation Audit"
  },
  {
    name: "Union Bank Report",
    client: "Union Bank of Nigeria",
    description: "Documentation review and compliance presentation system",
    metrics: [
      { label: "Documents", value: "100+" },
      { label: "Compliance Areas", value: "8" },
      { label: "Findings", value: "45+" }
    ],
    url: "/reports/jee/union-bank-report-1",
    status: "Live",
    category: "Compliance Review"
  },
  {
    name: "Baker Hughes Report",
    client: "Baker Hughes (via JEE)",
    description: "2026 litigation analysis and strategic recommendations",
    metrics: [
      { label: "Year", value: "2026" },
      { label: "Priority Matters", value: "14" },
      { label: "Risk Levels", value: "3" }
    ],
    url: "/reports/jee/baker-hughes-report-2026",
    status: "Live",
    category: "Litigation Analysis"
  },
  {
    name: "UNICOM (Unilever)",
    client: "Unilever Nigeria",
    description: "Regulatory compliance automation for Supply Chain functions",
    metrics: [
      { label: "Obligations Mapped", value: "100+" },
      { label: "Functions", value: "8" },
      { label: "Audit Risk", value: "Mitigated" }
    ],
    url: "https://unicom-report-official.vercel.app/home",
    status: "Live",
    category: "Compliance Automation"
  }
];

const categoryColors = {
  "Litigation Audit": "bg-blue-100 text-blue-800",
  "Compliance Review": "bg-green-100 text-green-800",
  "Litigation Analysis": "bg-purple-100 text-purple-800",
  "Compliance Automation": "bg-orange-100 text-orange-800"
};

export default function JEEClientPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Jackson, Etti & Edu</h1>
              <p className="text-lg text-slate-600 mt-1">Client Portal — MerisLabs</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Total Project Value</p>
                  <p className="text-2xl font-bold text-slate-900">₦25M+</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-900">{jeeProjects.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-slate-600">Relationship Since</p>
                  <p className="text-2xl font-bold text-slate-900">2022</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Portfolio</h2>
          <p className="text-slate-600">All projects delivered for Jackson, Etti & Edu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jeeProjects.map((project) => (
            <div
              key={project.name}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{project.client}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[project.category as keyof typeof categoryColors]}`}>
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-slate-700 mb-6">{project.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{metric.value}</p>
                      <p className="text-xs text-slate-600 mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {/* Value (if available) */}
                {project.value && (
                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <p className="text-sm text-slate-600">Project Value</p>
                    <p className="text-2xl font-bold text-slate-900">{project.value}</p>
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-4">
                  <a
                    href={project.url}
                    target={project.url.startsWith('http') ? '_blank' : undefined}
                    rel={project.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {project.url.startsWith('http') ? (
                      <>
                        Live Demo <ExternalLink size={16} />
                      </>
                    ) : (
                      'View Report'
                    )}
                  </a>
                  {project.docs && (
                    <a
                      href={project.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-slate-100 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      Documentation <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600">Built by MerisLabs</p>
              <p className="text-sm text-slate-500 mt-1">Legal Technology & Compliance Automation</p>
            </div>
            <a
              href="https://jee.africa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              Visit JEE Website <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
