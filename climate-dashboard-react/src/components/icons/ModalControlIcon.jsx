export default function ModalControlIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="19.5"
        fill="#1E1E1E"
        stroke="#585858"
      />
      <circle cx="10" cy="20" r="2" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
      <circle cx="30" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

