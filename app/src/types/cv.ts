export interface CVComponent {
  notionPageId: string;
  unique_id: string;
  component_name: string;
  component_type: string;
  content_primary: string;
  id?: string;
  content?: string;
  tags?: string[];
  user_id?: string;
}
