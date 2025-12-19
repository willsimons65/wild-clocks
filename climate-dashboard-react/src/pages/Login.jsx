// src/pages/Login.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginWithCode, isAuthenticated } from "@/services/auth";
import logo from "@/images/assets/wildclocks-logo-1.svg";

export default function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login
  const redirectTo = location.state?.from || "/";

  // ✅ If already authenticated, skip login entirely
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!code.trim()) return;

    setError("");
    setIsSubmitting(true);

    try {
      await loginWithCode(code.trim());

      // ✅ Client-side redirect after successful auth
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid access code");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div
        className="
          w-full max-w-md
          rounded-3xl
          bg-[#1C1C1C]/90
          border border-white/10
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          backdrop-blur-xl
          px-6 py-8
          sm:px-10 sm:py-10
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Wild Clocks"
            className="h-10 sm:h-12 select-none"
            draggable={false}
          />
        </div>

        {/* Heading */}
        <h1 className="text-center text-2xl sm:text-3xl font-light text-white mb-2">
          Welcome to Wild Clocks
        </h1>

        {/* Beta access copy */}
        <p className="text-center text-sm text-white/60 mb-8 tracking-wide">
          Private beta access
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-[0.18em] text-white/50 mb-2">
              Access code
            </label>

            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              inputMode="text"
              placeholder="Enter password"
              className="
                w-full rounded-2xl
                bg-[#111111]
                border border-white/15
                px-4 py-3
                text-white text-base
                outline-none
                focus:border-white/40
                focus:ring-2 focus:ring-white/10
                transition
              "
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !code.trim()}
            className="
              w-full mt-2
              rounded-2xl
              bg-white text-black
              py-3
              text-sm font-semibold tracking-wide
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-[#F2F2F2]
              transition
            "
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/35">
          Access is currently restricted to beta testers.
        </p>
      </div>
    </div>
  );
}

