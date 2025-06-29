/**
 * @fileoverview React Error Boundary component for catching and handling UI rendering errors.
 * @description This component implements the Error Boundary pattern in React, catching JavaScript errors that occur
 *   during rendering, in lifecycle methods, and in constructors of its children. It prevents the entire application
 *   from crashing and provides a fallback UI, while also logging the error for debugging.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To gracefully catch JavaScript errors in the component tree.
 *   - To prevent the entire application from unmounting due to a single component error.
 *   - To display a user-friendly fallback UI when an error occurs.
 *   - To log error information (error, errorInfo) to a centralized logging utility for debugging.
 *
 * FILEPATH: `app/components/ErrorBoundary.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/layout.tsx`: Intended to wrap the root of the application here to provide global error catching for the UI.
 *   - `@/lib/logger.ts`: Utilizes the logger for consistent error reporting.
 *   - `app/lib/utils/errorHandler.ts`: Can be integrated to standardize the error object before logging or displaying.
 *   - `pages/500.tsx` (if applicable for server-side render errors that bubble up or specific error pages): This component handles client-side rendering errors, while a 500 page would handle server-side render failures.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `logger` is correctly initialized and accessible in the client-side environment.
 *   - The fallback UI is a simple message; for production, this might be a more elaborate error page or component.
 *   - This Error Boundary catches only errors in the React component tree. Uncaught errors outside of it (e.g., in event handlers, async code) require global error listeners (`window.onerror`, `window.onunhandledrejection`).
 *
 * NOTES:
 *   - Error Boundaries do not catch errors in event handlers, asynchronous code (e.g., `setTimeout`, `requestAnimationFrame`), server-side rendering, or inside the Error Boundary itself.
 *   - For a truly comprehensive global error handling strategy, this should be combined with global `window.onerror` and `window.onunhandledrejection` listeners.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **More Sophisticated Fallback UI**: Implement a dedicated error page or a more interactive fallback component with options to report the error or reload.
 *   - **Error Reporting Integration**: Connect with an external error monitoring service (e.g., Sentry, Bugsnag) to automatically report errors from the client-side.
 *   - **User Feedback**: Provide a way for users to report the error directly from the fallback UI.
 *   - **Contextual Error Messages**: Enhance the fallback UI to show more specific, user-friendly messages based on the error type or environment.
 *   - **Reset Capability**: Add a button to the fallback UI that attempts to reset the state of the component tree below the error boundary, allowing the user to try again.
 */

'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import logger from '@/lib/logger';
import { handleClientError, HandledError } from '@/lib/utils/clientErrorHandler';
import { toast } from 'react-hot-toast';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    const handledError: HandledError = handleClientError(error, {
      componentStack: errorInfo.componentStack,
      context: 'React Error Boundary Catch',
    });

    logger.error(`[ERROR_BOUNDARY] Caught an error: ${handledError.message}`, {
      error: handledError,
      errorInfo: errorInfo.componentStack,
    });

    // Show toast notification for UI errors
    toast.error(`UI Error: ${handledError.message}`);

    // Set state with errorInfo to display in development or for advanced logging
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
          <p className="text-lg mb-8">
            We&#39;re sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
          {this.state.error && this.state.errorInfo && (
            <div className="text-left bg-gray-800 p-6 rounded-lg max-w-2xl overflow-auto">
              <h2 className="text-xl font-semibold mb-2">Error Details:</h2>
              <p className="font-mono text-sm text-red-400 break-words mb-4">{this.state.error.toString()}</p>
              <h3 className="text-lg font-semibold mb-1">Component Stack:</h3>
              <pre className="font-mono text-xs text-gray-400 whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg font-medium transition-colors duration-200"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
