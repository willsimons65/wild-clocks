// src/components/layout/PageWrapper.jsx

import React from "react";

// A simple centered layout wrapper used across pages
export default function PageWrapper({ children }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {children}
    </div>
  );
}