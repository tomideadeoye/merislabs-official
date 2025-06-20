'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS: Provides a fallback UI for unhandled errors that occur during rendering on the client side. Displays a generic error message and a button to attempt recovery by resetting the application state.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/global-error.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - This is a special Next.js file that catches errors not handled by `error.tsx` files in nested routes.
//   - Receives `error` object and `reset` function from Next.js.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed this component should provide a basic, user-friendly error page for unexpected client-side errors.
// NOTES: This component is a standard Next.js error boundary fallback. It does not have complex internal logic or dependencies on other custom components.
export default function GlobalError({ reset }: { _error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      style={{
        padding: 40,
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <h1>500 - Server-side error occurred</h1>
      <p>Sorry, something went wrong. We are working on it!</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
