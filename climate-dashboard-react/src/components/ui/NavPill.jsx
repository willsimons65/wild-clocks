// src/components/ui/NavPill.jsx

import chevronDown from "@/images/assets/chevron-down.svg";

export default function NavPill({
  children,
  onClick,
  disabled,
  className = "",
  title,
  ariaLabel,
  variant = "default", // "default" | "icon"
  withChevron = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={[
        "bg-white/5 border-white/20 border",
        "text-white/85 text-sm font-medium",
        "hover:bg-white/10 transition",
        "flex items-center justify-center gap-2",
        variant === "icon"
          ? "header-btn"
          : "h-9 px-5 rounded-full whitespace-nowrap shrink-0",

        disabled
          ? "border-white/10 bg-white/5 text-white/35 cursor-not-allowed hover:bg-white/5"
          : "",

        className,
      ].join(" ")}
    >
      {children}

      {withChevron ? (
        <img
          src={chevronDown}
          alt=""
          aria-hidden="true"
          className="w-3 h-3 opacity-70"
        />
      ) : null}
    </button>
  );
}
