// src/components/layout/Card.jsx

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl shadow-md bg-white/70 dark:bg-zinc-900/70 backdrop-blur p-6 ${className}`}

    >
      {children}
    </div>
  );
}
