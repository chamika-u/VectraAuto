"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ padding: "40px 20px", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2>Application error</h2>
          <p>An unexpected error occurred. Please try again.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "10px 20px",
              background: "#1f6f5f",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

