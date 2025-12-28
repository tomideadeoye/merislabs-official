// Local storage utilities for invoice and client data
import { Client, Invoice } from '../types/invoice';

const CLIENTS_KEY = 'merislabs_clients';
const INVOICES_KEY = 'merislabs_invoices';

// Client operations
export const saveClient = (client: Client): void => {
    const clients = getClients();
    const existingIndex = clients.findIndex(c => c.id === client.id);

    if (existingIndex >= 0) {
        clients[existingIndex] = { ...client, updatedAt: new Date().toISOString() };
    } else {
        clients.push(client);
    }

    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const getClients = (): Client[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CLIENTS_KEY);
    return data ? JSON.parse(data) : [];
};

export const getClientById = (id: string): Client | null => {
    const clients = getClients();
    return clients.find(c => c.id === id) || null;
};

export const getClientByName = (name: string): Client | null => {
    const clients = getClients();
    return clients.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
};

export const deleteClient = (id: string): void => {
    const clients = getClients().filter(c => c.id !== id);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

// Invoice operations
export const saveInvoice = (invoice: Invoice): void => {
    const invoices = getInvoices();
    const existingIndex = invoices.findIndex(i => i.id === invoice.id);

    if (existingIndex >= 0) {
        invoices[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
        invoices.push(invoice);
    }

    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
};

export const getInvoices = (): Invoice[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
};

export const getInvoiceById = (id: string): Invoice | null => {
    const invoices = getInvoices();
    return invoices.find(i => i.id === id) || null;
};

export const getInvoicesByClient = (clientId: string): Invoice[] => {
    const invoices = getInvoices();
    return invoices.filter(i => i.clientId === clientId);
};

export const deleteInvoice = (id: string): void => {
    const invoices = getInvoices().filter(i => i.id !== id);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
};

export const getNextInvoiceNumber = (): string => {
    const invoices = getInvoices();
    if (invoices.length === 0) return 'INV-001';

    const numbers = invoices
        .map(i => i.invoiceNumber)
        .filter(num => num.startsWith('INV-'))
        .map(num => parseInt(num.replace('INV-', '')))
        .filter(num => !isNaN(num));

    if (numbers.length === 0) return 'INV-001';

    const maxNumber = Math.max(...numbers);
    return `INV-${String(maxNumber + 1).padStart(3, '0')}`;
};
