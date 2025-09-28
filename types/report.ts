export interface Contact {
  name: string;
  phone: string;
  email: string;
  image: string;
  company: string;
  role: string;
  companyUrl: string;
  linkedinUrl?: string;
}

export interface ReportData {
  contacts: Contact[];
}