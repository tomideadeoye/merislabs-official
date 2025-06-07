"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, AlertTriangle } from 'lucide-react';
import type { SendEmailParams, EmailAttachment } from '@/lib/email_service';
import { useEmailTestDialogStore } from './emailTestDialogStore';

export const FinalizeAndSendEmailDialog: React.FC = () => {
  const {
    isOpen,
    close,
    initialTo = "",
    initialSubject = "",
    initialHtmlBody = "",
    onEmailSent
  } = useEmailTestDialogStore();
  const attachmentsToSend: any[] = [];
  const [to, setTo] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [htmlBody, setHtmlBody] = useState(initialHtmlBody);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state if initial props change
  useEffect(() => {
    setTo(initialTo);
    setSubject(initialSubject);
    setHtmlBody(initialHtmlBody);
  }, [initialTo, initialSubject, initialHtmlBody, isOpen]);

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !htmlBody.trim()) {
      setError("Recipient, Subject, and Body are required.");
      return;
    }
    setIsSending(true);
    setError(null);

    const emailData: SendEmailParams = {
      to,
      subject,
      htmlBody,
      attachments: attachmentsToSend,
    };

    try {
      const response = await fetch('/api/orion/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`Email sent successfully to ${to}!`);
        if (onEmailSent) onEmailSent(data.messageId);
        close();
      } else {
        throw new Error(data.error || "Failed to send email.");
      }
    } catch (err: any) {
      setError(err.message);
      console.error('[EMAIL_DIALOG] Error sending email:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-green-400">Compose & Send Email</DialogTitle>
          <DialogDescription className="text-gray-400">
            Review and send your prepared email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="emailTo" className="text-gray-300">To:*</Label>
            <Input id="emailTo" value={to} onChange={e => setTo(e.target.value)} className="bg-gray-700 border-gray-600" />
          </div>
          <div>
            <Label htmlFor="emailSubject" className="text-gray-300">Subject:*</Label>
            <Input id="emailSubject" value={subject} onChange={e => setSubject(e.target.value)} className="bg-gray-700 border-gray-600" />
          </div>
          <div>
            <Label htmlFor="emailBody" className="text-gray-300">Body (HTML):*</Label>
            <Textarea id="emailBody" value={htmlBody} onChange={e => setHtmlBody(e.target.value)} rows={15} className="min-h-[300px] bg-gray-700 border-gray-600 font-sans" />
          </div>
          {attachmentsToSend && attachmentsToSend.length > 0 && (
            <div>
                <Label className="text-gray-300">Attachments:</Label>
                <ul className="list-disc list-inside text-xs text-gray-400">
                    {attachmentsToSend.map(att => <li key={att.filename}>{att.filename} ({att.contentType})</li>)}
                </ul>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400 flex items-center mb-2"><AlertTriangle className="mr-1.5 h-4 w-4"/>{error}</p>}
        <DialogFooter>
          <Button onClick={close} variant="outline" className="text-gray-300 border-gray-600">Cancel</Button>
          <Button onClick={handleSend} disabled={isSending || !to || !subject || !htmlBody} className="bg-green-600 hover:bg-green-700">
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
