import React from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\+]?[\d\s\-\(\)]{7,}$/;
const URL_RE = /^(https?:\/\/|www\.)[^\s]+$/;

export function renderLine(line: string, color: string): React.ReactNode {
  if (EMAIL_RE.test(line)) {
    return <a href={`mailto:${line}`} style={{ color, textDecoration: 'underline' }}>{line}</a>;
  }
  if (PHONE_RE.test(line)) {
    return <a href={`tel:${line.replace(/[\s\-]/g, '')}`} style={{ color, textDecoration: 'underline' }}>{line}</a>;
  }
  if (URL_RE.test(line)) {
    const href = line.startsWith('http') ? line : `https://${line}`;
    return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color, textDecoration: 'underline' }}>{line}</a>;
  }
  return <>{line}</>;
}
