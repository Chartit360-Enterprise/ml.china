"use client";

import { useState, useEffect } from "react";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Check authentication status via server
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "check" }),
    })
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });
      const data = await res.json();

      if (data.success) {
        setAuthenticated(true);
      } else {
        setError(true);
        setPassword("");
      }
    } catch {
      setError(true);
    }

    setChecking(false);
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
