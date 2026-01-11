import React from "react";

export default function ExternalLink({
  href,
  children,
  className = "",
  ...props
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-teal-400 hover:text-teal-300 transition-colors ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
