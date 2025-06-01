













import React, { useState } from 'react';
import { Opportunity } from '@/types/opportunity';
import { useOpportunityMemory } from '@/hooks/useOpportunityMemory';

// Define proper interfaces for the component props
interface OpportunityDetailViewProps {

  opportunity: Opportunity;
  onUpdate?: (opportunity: Opportunity) => void;
}











// Define interfaces for the data structures
interface Tag {
  id: string;
  name: string;
  color?: string;
}


interface Evaluation {
  id: string;
  score: number;
  notes: string;
  createdAt: string;
}





interface Highlight {
  id: string;
  text: string;
  type: string;
  createdAt: string;
}




interface Draft {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}













interface Contact {
  id: string;
  name: string;
  email: string;
  role?: string;
}





interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}


















interface StatusUpdate {
  id: string;
  status: string;
  timestamp: string;
  notes?: string;
}








// Define proper props for CreateHabiticaTaskDialog
interface CreateHabiticaTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  opportunityId: string;
  taskType: string;
}






// Mock component for CreateHabiticaTaskDialog
const CreateHabiticaTaskDialog: React.FC<CreateHabiticaTaskDialogProps> = ({
  isOpen,
  onOpenChange,
  opportunityId,
  taskType
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2>Create Habitica Task</h2>
        <p>Opportunity: {opportunityId}</p>
        <p>Task Type: {taskType}</p>
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>


    </div>
  );
};


























export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  opportunity,
  onUpdate
}) => {
  const { memories, addMemory, removeMemory } = useOpportunityMemory(opportunity.id);
  const [showHabiticaDialog, setShowHabiticaDialog] = useState(false);
  const [habiticaTaskType, setHabiticaTaskType] = useState('');



  // Mock data - replace with actual data from props or API
  const tags: Tag[] = opportunity.tags?.map((tag, index) => ({
    id: `tag_${index}`,
    name: tag,
    color: 'blue'
  })) || [];





















  const evaluations: Evaluation[] = opportunity.evaluations || [];
  const highlights: Highlight[] = opportunity.highlights || [];
  const drafts: Draft[] = opportunity.drafts || [];
  const contacts: Contact[] = opportunity.contacts || [];
  const messages: Message[] = opportunity.messages || [];
  const statusHistory: StatusUpdate[] = opportunity.statusHistory || [];














  const handleCreateHabiticaTask = (taskType: string) => {
    setHabiticaTaskType(taskType);
    setShowHabiticaDialog(true);
  };








  return (
    <div className="opportunity-detail-view">
      <div className="header">
        <h1>{opportunity.title}</h1>
        <p>{opportunity.description}</p>
      </div>










      {/* Tags Section */}
      <div className="tags-section">
        <h3>Tags</h3>
        {tags.map((tag: Tag, index: number) => (
          <span key={tag.id} className="tag">
            {tag.name}
          </span>
        ))}
      </div>








      {/* Evaluations Section */}
      <div className="evaluations-section">
        <h3>Evaluations</h3>
        {evaluations.map((evaluation: Evaluation, index: number) => (
          <div key={evaluation.id} className="evaluation">
            <span>Score: {evaluation.score}</span>
            <p>{evaluation.notes}</p>
          </div>
        ))}
      </div>








      {/* Highlights Section */}
      <div className="highlights-section">
        <h3>Highlights</h3>
        {highlights.map((highlight: Highlight, index: number) => (
          <div key={highlight.id} className="highlight">
            <p>{highlight.text}</p>
            <span>{highlight.type}</span>
          </div>
        ))}
      </div>

















      {/* Drafts Section */}
      <div className="drafts-section">
        <h3>Drafts</h3>
        {drafts.map((draft: Draft, index: number) => (
          <div key={draft.id} className="draft">
            <h4>{draft.title}</h4>
            <p>{draft.content}</p>
          </div>
        ))}
      </div>















      {/* Contacts Section */}
      <div className="contacts-section">
        <h3>Contacts</h3>
        {contacts.map((contact: Contact, index: number) => (
          <div key={contact.id} className="contact">
            <span>{contact.name}</span>
            <span>{contact.email}</span>
            {contact.role && <span>{contact.role}</span>}
          </div>
        ))}
        {messages.map((message: Message, mIndex: number) => (
          <div key={message.id} className="message">
            <span>{message.sender}</span>
            <p>{message.content}</p>
            <span>{message.timestamp}</span>
          </div>
        ))}
      </div>

























































      {/* Status History Section */}
      <div className="status-section">
        <h3>Status History</h3>
        {statusHistory.map((status: StatusUpdate, index: number) => (
          <div key={status.id} className="status-update">
            <span>{status.status}</span>
            <span>{status.timestamp}</span>
            {status.notes && <p>{status.notes}</p>}
          </div>
        ))}
      </div>






















































































































      {/* Habitica Task Creation Buttons */}
      <div className="habitica-actions">
        <button onClick={() => handleCreateHabiticaTask('research')}>
          Create Research Task
        </button>
        <button onClick={() => handleCreateHabiticaTask('followup')}>
          Create Follow-up Task
        </button>
        <button onClick={() => handleCreateHabiticaTask('proposal')}>
          Create Proposal Task
        </button>
      </div>


      {/* Habitica Task Dialog */}
      <CreateHabiticaTaskDialog




        isOpen={showHabiticaDialog}
        onOpenChange={(open: boolean) => setShowHabiticaDialog(open)}
        opportunityId={opportunity.id}
        taskType={habiticaTaskType}
      />












    </div>
  );
};

export default OpportunityDetailView;
