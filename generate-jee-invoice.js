/**
 * Generate JEE Invoice PDF using Puppeteer
 * This script creates a professional invoice for JEE (Jackson, Etti and Edu)
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Invoice data
const invoiceData = {
  client: {
    name: 'Jackson, Etti and Edu (JEE)',
    email: 'info@jee.africa',
    contact: 'Attention: Chidozie Obidigwe',
    logo: '' // No specific logo path found, using text branding
  },
  invoice: {
    number: 'INV-004',
    date: '2026-02-13',
    dueDate: '2026-03-13',
    currency: 'NGN',
    currencySymbol: '₦'
  },
  items: [
    {
      description: 'Union Bank Litigation Audit Report - Premium Export & Finalization Suite',
      links: [
        { label: 'View Report', url: 'https://legal.merislabs.com/reports/jee/union-bank-report-1' }
      ],
      quantity: 1,
      rate: 70000
    }
  ],
  notes: 'Professional services for litigation intelligence and digital reporting infrastructure.'
};

// Calculate totals
const total = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

// HTML template for the invoice
const generateInvoiceHTML = () => {
  // MerisLabs logo
  const merisLogoPath = join(__dirname, 'apps/main/public', 'images', 'merislabswhite.png');
  const merisLogoBase64 = fs.existsSync(merisLogoPath)
    ? `data:image/png;base64,${fs.readFileSync(merisLogoPath).toString('base64')}`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      padding: 0;
      background: white;
      color: #111827;
    }

    .header-container {
      background: #1E40AF; /* JEE Blue / Professional Blue */
      padding: 24px 32px;
      color: white;
      margin-bottom: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .content-wrapper {
      padding: 0 32px 24px 32px;
    }

    .invoice-title {
      font-size: 36px;
      font-weight: bold;
      color: white;
    }

    .invoice-number {
      color: rgba(255, 255, 255, 0.9);
      margin-top: 8px;
    }

    .company-info {
      text-align: right;
    }

    .company-name {
      font-size: 24px;
      font-weight: bold;
      color: white;
    }

    .company-logo {
      height: 40px;
      margin-bottom: 8px;
      object-fit: contain;
    }

    .company-details {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 4px;
      line-height: 1.6;
    }

    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 2px solid #E5E7EB;
    }

    .bill-to h3 {
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .bill-to .client-name {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }

    .bill-to .client-email {
      color: #6B7280;
    }

    .bill-to .client-contact {
      font-size: 14px;
      color: #9CA3AF;
      margin-top: 4px;
    }

    .dates {
      text-align: right;
    }

    .date-item {
      margin-bottom: 8px;
    }

    .date-label {
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
    }

    .date-value {
      color: #111827;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 48px;
    }

    thead tr {
      border-bottom: 2px solid #E5E7EB;
    }

    th {
      text-align: left;
      padding: 12px 0;
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
    }

    th.right {
      text-align: right;
    }

    tbody tr {
      border-bottom: 1px solid #F3F4F6;
    }

    td {
      padding: 16px 0;
      color: #111827;
    }

    td.right {
      text-align: right;
    }

    .item-description {
      font-weight: 500;
    }

    .item-links {
      margin-top: 4px;
      font-size: 12px;
    }

    .item-links a {
      color: #1E40AF;
      text-decoration: none;
      margin-right: 16px;
    }

    .item-amount {
      font-weight: 600;
    }

    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 48px;
    }

    .totals-table {
      width: 256px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      color: #374151;
    }

    .total-row.final {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      padding-top: 16px;
      border-top: 2px solid #E5E7EB;
    }

    .total-row.final .amount {
      color: #1E40AF;
      font-weight: bold;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #9CA3AF;
      padding-top: 32px;
      border-top: 1px solid #E5E7EB;
    }

    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header-container">
    <div class="header">
      <div>
        <h1 class="invoice-title">INVOICE</h1>
        <p class="invoice-number">#${invoiceData.invoice.number}</p>
      </div>
      <div class="company-info">
        ${merisLogoBase64 ? `<img src="${merisLogoBase64}" alt="MerisLabs Logo" class="company-logo" />` : '<div class="company-name">MerisLabs</div>'}
        <p class="company-details">Software Development & Consulting</p>
        <p class="company-details">merislabs.com</p>
        <p class="company-details">tomide@merislabs.com</p>
        <p class="company-details">+234 818 192 7251 | +234 705 591 4441</p>
      </div>
    </div>
  </div>

  <div class="content-wrapper">
    <div class="info-section">
      <div class="bill-to">
        <h3>Bill To</h3>
        <p class="client-name">${invoiceData.client.name}</p>
        <p class="client-email">${invoiceData.client.email}</p>
        ${invoiceData.client.contact ? `<p class="client-contact">${invoiceData.client.contact}</p>` : ''}
      </div>
      <div class="dates">
        <div class="date-item">
          <span class="date-label">Date: </span>
          <span class="date-value">${invoiceData.invoice.date}</span>
        </div>
        <div class="date-item">
          <span class="date-label">Due: </span>
          <span class="date-value">${invoiceData.invoice.dueDate}</span>
        </div>
      </div>
    </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="right">Qty</th>
        <th class="right">Rate</th>
        <th class="right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoiceData.items.map(item => `
        <tr>
          <td>
            <div class="item-description">${item.description}</div>
            ${item.links ? `
              <div class="item-links">
                ${item.links.map(link => `<a href="${link.url}" target="_blank">${link.label}</a>`).join('')}
              </div>
            ` : ''}
          </td>
          <td class="right">${item.quantity}</td>
          <td class="right">${invoiceData.invoice.currencySymbol}${item.rate.toLocaleString()}</td>
          <td class="right item-amount">${invoiceData.invoice.currencySymbol}${(item.quantity * item.rate).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-table">
      <div class="total-row final">
        <span>Total:</span>
        <span class="amount">${invoiceData.invoice.currencySymbol}${total.toLocaleString()}</span>
      </div>
    </div>
  </div>

  <div class="payment-section" style="margin-bottom: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 20px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
    <div>
      <h3 style="font-size: 10px; font-weight: 600; color: #6B7280; text-transform: uppercase; margin-bottom: 12px;">Bank Details</h3>
      <div style="margin-bottom: 12px;">
        <p style="font-size: 10px; color: #1E40AF; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Moniepoint</p>
        <p style="font-size: 11px; font-weight: 500; color: #111827;">Adeoye Tomide Toluwase | Merislabs</p>
        <p style="font-size: 11px; font-family: monospace; color: #4B5563;">8181927251</p>
      </div>
      <div style="padding-top: 10px; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 10px; color: #1E40AF; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;">Access Bank</p>
        <p style="font-size: 11px; font-weight: 500; color: #111827;">Adeoye Tomide Toluwase</p>
        <p style="font-size: 11px; font-family: monospace; color: #4B5563;">0694635405</p>
      </div>
    </div>
    <div>
      <h3 style="font-size: 10px; font-weight: 600; color: #6B7280; text-transform: uppercase; margin-bottom: 12px;">Notes</h3>
      <p style="font-size: 12px; color: #4B5563; line-height: 1.5;">${invoiceData.notes}</p>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p style="margin-top: 8px; font-size: 12px;">© 2025 MerisLabs. All rights reserved.</p>
  </div>
  </div>
</body>
</html>
  `;
};

// Generate PDF
async function generateInvoice() {
  console.log('🚀 Starting JEE invoice generation...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set the HTML content
    const html = generateInvoiceHTML();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const outputPath = join(__dirname, 'invoices', `JEE-Invoice-${invoiceData.invoice.number}.pdf`);

    // Create invoices directory if it doesn't exist
    const invoicesDir = join(__dirname, 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      scale: 0.8,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    console.log('✅ Invoice generated successfully!');
    console.log(`📄 Saved to: ${outputPath}`);
    console.log(`\n💰 Invoice Details:`);
    console.log(`   Client: ${invoiceData.client.name}`);
    console.log(`   Attention: ${invoiceData.client.contact}`);
    console.log(`   Amount: ${invoiceData.invoice.currencySymbol}${total.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error generating invoice:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the generator
generateInvoice().catch(console.error);
