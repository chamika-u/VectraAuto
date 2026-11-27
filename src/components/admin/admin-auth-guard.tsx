"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";

const AUTH_STORAGE_KEY = "vectra_admin_authenticated";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user already logged in during this session
    try {
      const stored =
        sessionStorage.getItem(AUTH_STORAGE_KEY) ||
        localStorage.getItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(stored === "true");
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (username.trim().toLowerCase() === "admin" && password === "12345") {
        try {
          sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
          localStorage.setItem(AUTH_STORAGE_KEY, "true");
        } catch {
          // ignore storage errors
        }
        setIsAuthenticated(true);
      } else {
        setError("Invalid username or password. Please check your credentials.");
      }
      setIsLoading(false);
    }, 350);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setUsername("");
    setPassword("");
    setError(null);
    setIsAuthenticated(false);
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("12345");
    setError(null);
  };

  
  if (isAuthenticated === null) {
    return (
      <div className="admin-login-backdrop">
        <div className="admin-login-spinner" />
      </div>
    );
  }

  // If not authenticated, show the stylish Admin Login Interface
  if (!isAuthenticated) {
    return (
      <div className="admin-login-backdrop">
        <div className="admin-login-card">
          {/* Header & Logo */}
          <div className="admin-login-header">
            <div className="admin-login-brand">
              <div className="admin-login-logo-box">
                <Image
                  src="/vectraauto-logo.jpg"
                  alt="VectraAuto"
                  width={54}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div className="admin-login-shield-badge">
                <Shield size={16} className="text-emerald-500" />
                <span>Admin Portal</span>
              </div>
            </div>
            <h1 className="admin-login-title">Control Center Sign In</h1>
            <p className="admin-login-subtitle">
              Enter your administrative credentials to manage orders, catalog inventory, and fitment.
            </p>
          </div>

          {/* Error notification */}
          {error && (
            <div className="admin-login-error" role="alert">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-login-field">
              <label htmlFor="admin-username">Username</label>
              <div className="admin-login-input-wrap">
                <User size={17} className="admin-login-icon" aria-hidden="true" />
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="admin-login-input"
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-login-input-wrap">
                <Lock size={17} className="admin-login-icon" aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••"
                  className="admin-login-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="admin-login-toggle-pw"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="admin-login-submit-btn"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo helper pill */}
          <div className="admin-login-hint">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                <KeyRound size={13} className="text-emerald-600" />
                Demo Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-600 flex justify-between">
              <span>Username: <strong className="text-stone-900">admin</strong></span>
              <span>Password: <strong className="text-stone-900">12345</strong></span>
            </div>
          </div>

          {/* Footer Back Link */}
          <div className="admin-login-footer">
            <Link href="/" className="admin-login-back-link">
              <ArrowLeft size={15} />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render admin shell with logout handler available
  return (
    <div className="admin-shell">
      <AdminNav onLogout={handleLogout} />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
