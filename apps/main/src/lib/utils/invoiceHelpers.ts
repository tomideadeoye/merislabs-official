// Helper function to create invoice data from conversational input
import { InvoiceTemplate } from '../types/invoice';
import { projects } from '../../components/projects';

export interface ConversationalInvoiceInput {
    clientName: string;
    clientEmail: string;
    clientLogo?: string;
    items: Array<{
        description: string;
        quantity: number;
        rate: number;
    }>;
    projectNames?: string[];
    dueDate: string;
    notes?: string;
}

export const createInvoiceFromConversation = (input: ConversationalInvoiceInput): InvoiceTemplate => {
    // Find project IDs from names
    const projectIds = input.projectNames?.map(name => {
        const project = projects.find(p =>
            p.name.toLowerCase().includes(name.toLowerCase()) ||
            p.id.toLowerCase() === name.toLowerCase()
        );
        return project?.id;
    }).filter(Boolean) as string[] || [];

    // Generate invoice items with IDs
    const items = input.items.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
    }));

    // Generate invoice number and dates
    const today = new Date().toISOString().split('T')[0];

    return {
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientLogo: input.clientLogo,
        invoiceNumber: '', // Will be auto-generated
        invoiceDate: today,
        dueDate: input.dueDate,
        items,
        projectIds,
        notes: input.notes || '',
    };
};

// Generate URL with invoice data
export const generateInvoiceURL = (template: InvoiceTemplate): string => {
    const params = new URLSearchParams();

    params.set('clientName', template.clientName);
    params.set('clientEmail', template.clientEmail);
    if (template.clientLogo) params.set('clientLogo', template.clientLogo);
    params.set('invoiceDate', template.invoiceDate);
    params.set('dueDate', template.dueDate);
    params.set('items', JSON.stringify(template.items));
    params.set('projectIds', JSON.stringify(template.projectIds));
    if (template.notes) params.set('notes', template.notes);

    return `/invoice-generator?${params.toString()}`;
};
