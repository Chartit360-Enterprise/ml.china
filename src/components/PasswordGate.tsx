"use client";

import { useState, useEffect } from "react";

const CORRECT_PASSWORD = "Minsk2024";
const AUTH_KEY = "china-gdp-ai-auth";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const stored = localStorage.getItem(AUTH_KEY);
    setAuthenticated(stored === "true");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);

    // Small delay for UX
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        localStorage.setItem(AUTH_KEY, "true");
        setAuthenticated(true);
      } else {
        setError(true);
        setPassword("");
      }
      setChecking(false);
    }, 500);
  };

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#06060a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated - show app
  if (authenticated) {
    return <>{children}</>;
  }

  // Password gate
  return (
    <div className="min-h-screen bg-[#06060a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 mb-4">
            <span className="text-3xl">🇨🇳</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">China GDP AI</h1>
          <p className="text-white/40 text-sm">Enter password to access</p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30 focus:outline-none transition ${
                error 
                  ? "border-red-500/50 focus:border-red-500" 
                  : "border-white/10 focus:border-white/30"
              }`}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2 animate-in fade-in slide-in-from-top-1">
                Incorrect password
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || checking}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-medium hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {checking ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              "Enter"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-8">
          Protected access • Contact admin for credentials
        </p>
      </div>
    </div>
  );
}

