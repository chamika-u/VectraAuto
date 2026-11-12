"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

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
    <div className="container section">
      <div className="empty-state">
        <p className="eyebrow" style={{ justifyContent: "center" }}>
          <AlertTriangle size={14} aria-hidden="true" /> Something went wrong
        </p>
        <h2>We could not load this page</h2>
        <p>
          The page could not be loaded right now. Your cart is stored in this browser and should
          still be available.
        </p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <button className="button button-primary" type="button" onClick={reset}>Try again</button>
          <Link className="button button-secondary" href="/products">Browse parts</Link>
        </div>
      </div>
    </div>
  );
}
