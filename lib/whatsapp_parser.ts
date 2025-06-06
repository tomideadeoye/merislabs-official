/**
 * WhatsApp chat parser
 * 
 * This module provides functions for parsing WhatsApp chat exports.
 */

export interface WhatsAppMessage {
  date: Date;
  sender: string;
  content: string;
  isMedia: boolean;
  mediaType?: string;
}

export interface WhatsAppChat {
  messages: WhatsAppMessage[];
  participants: string[];
  startDate: Date;
  endDate: Date;
}

/**
 * Parse WhatsApp chat export text
 */
export function parseWhatsAppChat(chatText: string): WhatsAppChat {
  const lines = chatText.split('\n');
  const messages: WhatsAppMessage[] = [];
  const participants = new Set<string>();
  
  let startDate: Date | null = null;
  let endDate: Date | null = null;
  
  // Regular expression for matching WhatsApp message format
  // Format: [DD/MM/YYYY, HH:MM:SS] Sender: Message
  const messageRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?)\]\s([^:]+):\s(.+)$/;
  
  let currentMessage: WhatsAppMessage | null = null;
  
  for (const line of lines) {
    const match = line.match(messageRegex);
    
    if (match) {
      // If we have a current message, push it to the messages array
      if (currentMessage) {
        messages.push(currentMessage);
      }
      
      // Parse date and time
      const [_, dateStr, timeStr, sender, content] = match;
      const [day, month, year] = dateStr.split('/').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      
      // Create date object (adjust year format if needed)
      const adjustedYear = year < 100 ? 2000 + year : year;
      const date = new Date(adjustedYear, month - 1, day, hour, minute);
      
      // Update start and end dates
      if (!startDate || date < startDate) {
        startDate = date;
      }
      if (!endDate || date > endDate) {
        endDate = date;
      }
      
      // Check if the message is a media message
      const isMedia = content.includes('<Media omitted>') || 
                      content.includes('<image omitted>') || 
                      content.includes('<video omitted>') ||
                      content.includes('<audio omitted>') ||
                      content.includes('<document omitted>');
      
      // Determine media type if applicable
      let mediaType;
      if (isMedia) {
        if (content.includes('<image')) {
          mediaType = 'image';
        } else if (content.includes('<video')) {
          mediaType = 'video';
        } else if (content.includes('<audio')) {
          mediaType = 'audio';
        } else if (content.includes('<document')) {
          mediaType = 'document';
        } else {
          mediaType = 'unknown';
        }
      }
      
      // Create new message object
      currentMessage = {
        date,
        sender: sender.trim(),
        content: content.trim(),
        isMedia,
        mediaType
      };
      
      // Add sender to participants set
      participants.add(sender.trim());
    } else if (currentMessage) {
      // If the line doesn't match the regex and we have a current message,
      // it's likely a continuation of the previous message
      currentMessage.content += '\n' + line;
    }
  }
  
  // Add the last message if it exists
  if (currentMessage) {
    messages.push(currentMessage);
  }
  
  return {
    messages,
    participants: Array.from(participants),
    startDate: startDate || new Date(),
    endDate: endDate || new Date()
  };
}

/**
 * Get basic statistics from a WhatsApp chat
 */
export function getBasicChatStats(chat: WhatsAppChat) {
  const { messages, participants } = chat;
  
  // Count messages per participant
  const messageCountByParticipant: Record<string, number> = {};
  participants.forEach(participant => {
    messageCountByParticipant[participant] = 0;
  });
  
  messages.forEach(message => {
    messageCountByParticipant[message.sender] = (messageCountByParticipant[message.sender] || 0) + 1;
  });
  
  // Count media messages per participant
  const mediaCountByParticipant: Record<string, number> = {};
  participants.forEach(participant => {
    mediaCountByParticipant[participant] = 0;
  });
  
  messages.forEach(message => {
    if (message.isMedia) {
      mediaCountByParticipant[message.sender] = (mediaCountByParticipant[message.sender] || 0) + 1;
    }
  });
  
  // Calculate average message length per participant
  const totalLengthByParticipant: Record<string, number> = {};
  participants.forEach(participant => {
    totalLengthByParticipant[participant] = 0;
  });
  
  messages.forEach(message => {
    if (!message.isMedia) {
      totalLengthByParticipant[message.sender] = 
        (totalLengthByParticipant[message.sender] || 0) + message.content.length;
    }
  });
  
  const avgMessageLengthByParticipant: Record<string, number> = {};
  participants.forEach(participant => {
    const totalMessages = messageCountByParticipant[participant] - mediaCountByParticipant[participant];
    avgMessageLengthByParticipant[participant] = totalMessages > 0 
      ? Math.round(totalLengthByParticipant[participant] / totalMessages) 
      : 0;
  });
  
  // Calculate messages by day of week
  const messagesByDayOfWeek: Record<string, number> = {
    'Sunday': 0,
    'Monday': 0,
    'Tuesday': 0,
    'Wednesday': 0,
    'Thursday': 0,
    'Friday': 0,
    'Saturday': 0
  };
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  messages.forEach(message => {
    const dayOfWeek = dayNames[message.date.getDay()];
    messagesByDayOfWeek[dayOfWeek] = (messagesByDayOfWeek[dayOfWeek] || 0) + 1;
  });
  
  // Calculate messages by hour of day
  const messagesByHour: Record<number, number> = {};
  for (let i = 0; i < 24; i++) {
    messagesByHour[i] = 0;
  }
  
  messages.forEach(message => {
    const hour = message.date.getHours();
    messagesByHour[hour] = (messagesByHour[hour] || 0) + 1;
  });
  
  return {
    totalMessages: messages.length,
    totalParticipants: participants.length,
    messageCountByParticipant,
    mediaCountByParticipant,
    avgMessageLengthByParticipant,
    messagesByDayOfWeek,
    messagesByHour,
    duration: {
      days: Math.ceil((chat.endDate.getTime() - chat.startDate.getTime()) / (1000 * 60 * 60 * 24)),
      startDate: chat.startDate,
      endDate: chat.endDate
    }
  };
}