"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FinalizeAndSendEmailDialog } from './FinalizeAndSendEmailDialog';
import { Mail } from 'lucide-react';

export const EmailTestButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const sampleHtmlEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a5568;">Test Email from Orion</h2>
      <p>This is a test email sent from the Orion system.</p>
      <p>The email sending functionality is working correctly!</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #f7fafc; border-left: 4px solid #4299e1;">
        <p style="margin: 0; color: #4a5568;">This email was sent using Nodemailer from a Next.js API route.</p>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #718096;">
        Sent from Orion - Your personal AI assistant
      </p>
    </div>
  `;
  
  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Mail className="mr-2 h-4 w-4" />
        Test Email Sending
      </Button>
      
      <FinalizeAndSendEmailDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        initialTo=""
        initialSubject="Test Email from Orion"
        initialHtmlBody={sampleHtmlEmail}
        onEmailSent={(messageId) => {
          console.log('Email sent successfully with message ID:', messageId);
        }}
      />
    </>
  );
};