'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 40, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <h1>500 - Server-side error occurred</h1>
      <p>Sorry, something went wrong. We are working on it!</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
