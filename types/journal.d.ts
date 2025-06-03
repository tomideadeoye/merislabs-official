export interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  tags: string[];
  type: "JOURNAL";
}
