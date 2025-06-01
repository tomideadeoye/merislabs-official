"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { OpportunityNotionPayload } from '@/lib/notion_next_service';

export const NotionOpportunityForm = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jdText, setJdText] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('Identified');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !company.trim()) {
      setFeedback({ type: 'error', message: 'Title and company are required.' });
      return;
    }
    
    setIsSubmitting(true);
    setFeedback(null);
    
    try {
      const payload: OpportunityNotionPayload = {
        title: title.trim(),
        company: company.trim(),
        jd_text: jdText.trim() || undefined,
        url: url.trim() || undefined,
        status
      };
      
      const response = await fetch('/api/orion/notion/opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFeedback({ type: 'success', message: 'Opportunity created in Notion successfully!' });
        
        // Reset form
        setTitle('');
        setCompany('');
        setJdText('');
        setUrl('');
        setStatus('Identified');
      } else {
        throw new Error(data.error || 'Failed to create opportunity in Notion');
      }
    } catch (err: any) {
      console.error('Error creating opportunity in Notion:', err);
      setFeedback({ type: 'error', message: err.message || 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">Create Opportunity in Notion</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-gray-300">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            className="bg-gray-700 border-gray-600 text-gray-200"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="company" className="text-gray-300">Company *</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., CloudScale Technologies"
            className="bg-gray-700 border-gray-600 text-gray-200"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="url" className="text-gray-300">URL (Optional)</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g., https://example.com/job-posting"
            className="bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>
        
        <div>
          <Label htmlFor="status" className="text-gray-300">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="Identified">Identified</SelectItem>
              <SelectItem value="Researching">Researching</SelectItem>
              <SelectItem value="Evaluating">Evaluating</SelectItem>
              <SelectItem value="Application Ready">Application Ready</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="Offer Received">Offer Received</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="jdText" className="text-gray-300">Job Description (Optional)</Label>
          <Textarea
            id="jdText"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            className="min-h-[150px] bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !title.trim() || !company.trim()} 
          className="bg-blue-600 hover:bg-blue-700 w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating in Notion...
            </>
          ) : (
            <>
              Create in Notion
            </>
          )}
        </Button>
        
        {feedback && (
          <div className={`p-3 rounded-md flex items-center ${
            feedback.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300' 
                                     : 'bg-red-900/30 border border-red-700 text-red-300'
          }`}>
            {feedback.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-2" /> : 
              <AlertTriangle className="h-5 w-5 mr-2" />
            }
            {feedback.message}
          </div>
        )}
      </form>
    </div>
  );
};