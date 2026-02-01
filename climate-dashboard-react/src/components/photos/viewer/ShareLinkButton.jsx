// src/components/photos/viewer/ShareLinkButton.jsx

export default function ShareLinkButton({ onCopied }) {
  async function handleShare() {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      onCopied?.();
      return;
    } catch (err) {
      console.warn("Clipboard copy failed, falling back", err);
    }

    // Fallback: prompt
    window.prompt("Copy this link:", url);
    onCopied?.();
  }

  return (
    <button
      onClick={handleShare}
      className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-sm transition"
      title="Copy link"
    >
      Share
    </button>
  );
}
