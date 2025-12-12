import { useState, useEffect, useRef } from "react";

export function useChartWidth(initial = 320) {
  const ref = useRef(null);
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setWidth(w);
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
