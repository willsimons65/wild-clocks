import React from "react";
import { Link } from "react-router-dom";

export default function InlineLink({
  to,
  href,
  children,
  className = "",
}) {
  const baseStyles =
    "text-white/80 underline underline-offset-2 hover:text-white transition-colors";

  // Internal link (React Router)
  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${className}`}>
        {children}
      </Link>
    );
  }

  // External link
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${baseStyles} ${className}`}
      >
        {children}
      </a>
    );
  }

  // Fallback (shouldn’t really happen)
  return <span>{children}</span>;
}