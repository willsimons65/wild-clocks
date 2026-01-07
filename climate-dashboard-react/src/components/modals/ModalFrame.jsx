// src/components/modals/ModalFrame.jsx

import { X } from "lucide-react";

export default function ModalFrame({
  title,
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className="
          relative w-full max-w-2xl
          max-h-[85vh]
          rounded-2xl
          bg-zinc-900
          shadow-xl
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-white/60 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 pt-5 pb-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
