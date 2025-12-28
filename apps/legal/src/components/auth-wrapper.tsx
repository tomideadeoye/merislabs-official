'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Skip authentication for login page
      if (pathname === '/login') {
        setIsLoading(false);
        setIsAuthenticated(true);
        return;
      }

      // Check authentication status
      const authStatus = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') : null;
      
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        // Redirect to login page if not authenticated
        router.push('/login');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated or on login page, render children
  if (isAuthenticated || pathname === '/login') {
    return <>{children}</>;
  }

  // This should never be reached due to redirect, but just in case
  return null;
}