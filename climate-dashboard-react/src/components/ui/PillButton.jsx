export default function PillButton({
  children,
  onClick,
  disabled,
  className = "",
  title,
  ariaLabel,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={[
        // ✅ This should be EXACTLY what your YearSelector "pill" uses
        "h-11 px-5 rounded-full border",
        "bg-white/5 border-white/20",
        "text-white/85 text-sm font-medium",
        "hover:bg-white/10 transition",
        "flex items-center justify-center gap-2",

        disabled
          ? "border-white/10 bg-white/5 text-white/35 cursor-not-allowed hover:bg-white/5"
          : "",

        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
