"use client";
import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Log to analytics or monitoring service if available
      if (window?.console) {
        console.error("[404] NotFoundPage rendered at", new Date().toISOString(), {
          path: window.location.pathname,
        });
      }
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>
        404: Page Not Found
      </h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        The page you are looking for does not exist.<br />
        Please check the URL or return to the homepage.
      </p>
      <a
        href="/"
        style={{
          background: "#0ea5e9",
          color: "#fff",
          padding: "0.75rem 2rem",
          borderRadius: "0.5rem",
          fontWeight: 700,
          textDecoration: "none",
          fontSize: "1.25rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "background 0.2s",
        }}
        onClick={() => {
          if (window?.console) {
            console.info("[404] User clicked return to homepage", {
              path: window.location.pathname,
            });
          }
        }}
      >
        Return Home
      </a>
      <div style={{ marginTop: "2rem", opacity: 0.7, fontSize: "1rem" }}>
        If you believe this is an error, please contact support.<br />
        <span style={{ fontSize: "0.9rem" }}>
          [404 Handler: app/_not-found/page.tsx]
        </span>
      </div>
    </div>
  );
}
