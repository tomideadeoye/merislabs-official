// Only import nodemailer and the real email service in Node.js environments
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
  // Re-export the real email_service implementation for @repo/shared/email_service consumers.
  module.exports = require('../../lib/email_service');
} else {
  // Export stubs for non-Node environments (client, edge, etc.)
  module.exports = {
    sendEmailService: () => {
      throw new Error('Email service is not available in this environment.');
    }
  };
}
