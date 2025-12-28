// Invoice and Client types for the invoice generator

export interface Client {
    id: string;
    name: string;
    email: string;
    logo?: string;
    address?: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
}

export interface InvoiceProject {
    projectId: string;
    description?: string;
}

export interface Invoice {
    id: string;
    clientId: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    items: InvoiceItem[];
    projects: InvoiceProject[];
    notes: string;
    subtotal: number;
    tax: number;
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceTemplate {
    clientName: string;
    clientEmail: string;
    clientLogo?: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    items: InvoiceItem[];
    projectIds: string[];
    notes: string;
}
