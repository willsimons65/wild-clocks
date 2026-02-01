// src/components/ui/Toast.jsx

import { useEffect } from "react";

export default function Toast({ message, isOpen, onClose, duration = 1600 }) {
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100]">
      <div className="px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg text-sm text-white/85">
        {message}
      </div>
    </div>
  );
}
