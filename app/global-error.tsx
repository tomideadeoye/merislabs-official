'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h1>500 - Server-side error occurred</h1>
          <p>Sorry, something went wrong. We are working on it!</p>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}
