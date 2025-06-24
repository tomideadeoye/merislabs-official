'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import './not-found.css';

export default function NotFoundPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Log to analytics or monitoring service if available
      if (window?.console) {
        console.error('[404] NotFoundPage rendered at', new Date().toISOString(), {
          path: window.location.pathname,
        });
      }
    }
  }, []);

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404: Page Not Found</h1>
      <p className="not-found-description">
        The page you are looking for does not exist.
        <br />
        Please check the URL or return to the homepage.
      </p>
      <Link href="/" className="not-found-link">
        Return Home
      </Link>
      <div className="not-found-support">
        If you believe this is an error, please contact support.
        <br />
        <span className="not-found-handler">[404 Handler: app/_not-found/page.tsx]</span>
      </div>
    </div>
  );
}
