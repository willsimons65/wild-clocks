// src/components/ui/NavPill.jsx

export default function NavPill({
  children,
  onClick,
  disabled = false,
  className = "",
  title,
  ariaLabel,

  // visual options
  variant = "default", // default | icon
  size = "md", // md | sm
}) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none " +
    "rounded-full border transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 " +
    "active:scale-[0.99]";

  // ✅ This is the canonical look (matches Jan / 1)
  const defaultStyle =
    "bg-white/5 border-white/20 text-white/85 hover:bg-white/10";

  const disabledStyle =
    "border-white/10 bg-white/5 text-white/35 cursor-not-allowed hover:bg-white/5";

  const sizes = {
    md: "h-9 px-5 text-sm font-medium",
    sm: "h-9 px-4 text-sm font-medium",
  };

  // icon-only pill
  const iconSizing = size === "md" ? "h-9 w-9 p-0" : "h-9 w-9 p-0";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={[
        base,
        variant === "icon" ? iconSizing : sizes[size],
        disabled ? disabledStyle : defaultStyle,
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
