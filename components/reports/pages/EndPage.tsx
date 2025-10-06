import React from 'react';
import { HybridPage } from '../HybridPage';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/avatar';
import { ModernCard, ModernCardContent } from '../../ui/modern-card';
import { reportData } from '../../../data';
import { Contact } from '../../../types';
import dynamic from 'next/dynamic';

// Dynamically import QRCode to avoid SSR issues
const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => ({ default: mod.QRCodeSVG })), {
  ssr: false,
  loading: () => <div className="w-30 h-30 bg-gray-200 animate-pulse rounded"></div>
});

interface EndpageProps {
  pageNumber?: number;
}

export const Endpage: React.FC<EndpageProps> = ({ pageNumber }) => {
  const contacts = reportData.contacts || [];

  return (
    <HybridPage pageNumber={pageNumber} useColumns={false} components={{}}>
      <div className="relative h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4 flex-shrink-0">
          <h1 className="text-blue-600 text-base font-semibold tracking-wide uppercase">Bridging the Financing Divide</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
        </div>

        {/* Main Content - scrollable area */}
        <div className="flex-1 overflow-y-auto pb-4">
          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-blue-600 text-xl font-light mb-6 tracking-tight">Contact Information</h2>

            {/* Container to limit width and center the cards */}
            <div className="max-w-2xl mx-auto space-y-4">
              {contacts.map((contact: Contact) => (
                <ModernCard key={contact.email} className="overflow-hidden transition-all duration-300 hover:shadow-md border-0 bg-white/80 backdrop-blur-sm p-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <ModernCardContent className="p-0">
                    <div className="flex items-center p-4">
                      <Avatar className="mr-4 w-12 h-12 ring-2 ring-blue-100">
                        <AvatarImage src={contact.image} alt={contact.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-sm font-semibold">
                          {contact.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        {/* Name linked to LinkedIn profile if available */}
                        {contact.linkedinUrl ? (
                          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 text-base font-medium mb-0.5 hover:text-blue-600 transition-colors flex items-center">
                            {contact.name}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        ) : (
                          <h3 className="text-gray-800 text-base font-medium mb-0.5">{contact.name}</h3>
                        )}
                        <p className="text-blue-500 text-xs font-medium mb-1.5">{contact.role}</p>
                        <div className="space-y-1">
                          <a href={`mailto:${contact.email}`} className="text-gray-600 text-xs hover:text-blue-600 transition-colors flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {contact.email}
                          </a>
                          {/* Phone number restored */}
                          <a href={`tel:${contact.phone}`} className="text-gray-600 text-xs hover:text-blue-600 transition-colors flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {contact.phone}
                          </a>
                          <a href={contact.companyUrl} className="text-gray-600 text-xs hover:text-blue-600 transition-colors flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                            </svg>
                            {contact.company}
                          </a>
                        </div>
                      </div>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              ))}
            </div>

            {/* QR Code */}
            {contacts.length > 0 && contacts[0].companyUrl && (
              <div className="mt-8 text-center">

                <div className="inline-flex flex-col items-center bg-white p-4 rounded-xl shadow-md">
                  <div className="p-2 bg-gray-100 rounded-lg mb-2">
                    <QRCodeSVG
                      value={contacts[0].companyUrl}
                      size={100}
                      level="M"
                      className="rounded-md"
                    />
                  </div>
                  <p className="text-gray-600 text-xs font-medium">{contacts[0].company}</p>
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Date - fixed at bottom */}
        <div className="pt-4 pb-4 border-t border-gray-200 flex-shrink-0">
          <p className="text-gray-400 text-xs text-center">September 2025</p>
        </div>

        {/* Full width image with blue transparent overlay */}
        <div className="w-full mt-8 relative flex-shrink-0">
          <img
            src="/bridgin_financing_gap/business_endingpage.png"
            alt="Business ending page"
            className="w-full h-auto rounded-lg object-cover"
            style={{ maxHeight: '300px' }}
          />
          <div className="absolute inset-0 bg-blue-500 opacity-30 rounded-lg"></div>
        </div>
      </div>
    </HybridPage>
  );
};
