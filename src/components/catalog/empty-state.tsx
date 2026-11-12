import Link from "next/link";

export function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        {actionHref && actionLabel ? (
          <Link className="button button-primary" href={actionHref}>
            {actionLabel}
          </Link>
        ) : null}
        {secondaryHref && secondaryLabel ? (
          <Link className="button button-secondary" href={secondaryHref}>
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
