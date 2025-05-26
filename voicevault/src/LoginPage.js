import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./App.css";

// PUBLIC_INTERFACE
// Login UI for email/password and social login (mocked)
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  // Handle mock email login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        setError("Please enter a valid email.");
        setPending(false);
        return;
      }
      await login({ email });
    } catch (e) {
      setError("Login failed.");
    }
    setPending(false);
  };

  // Handle mock social login
  const handleSocialLogin = async (provider) => {
    setError("");
    setPending(true);
    try {
      await login({ provider });
    } catch (e) {
      setError("Social login failed");
    }
    setPending(false);
  };

  return (
    <div className="container" style={{ marginTop: 108, marginBottom: 30, maxWidth: 410, minHeight: 480 }}>
      <section
        aria-label="Sign in to VoiceVault"
        style={{
          background: "var(--surface)",
          borderRadius: "16px",
          boxShadow: "0 5px 22px #dae7f844, 0 0.5px 1.5px #e7e7fa1b",
          padding: "36px 28px 34px 28px",
          maxWidth: 410,
        }}>
        <h2 className="vault-title" tabIndex={0} aria-label="Welcome to VoiceVault" style={{ color: "var(--primary)", fontSize: "2.15rem", marginBottom: 7 }}>VoiceVault</h2>
        <div className="subtitle" style={{ color: "var(--kavia-orange)", marginBottom: 20, letterSpacing: 0.02 }}>Sign In</div>
        <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 10 }} aria-label="Sign in with Email">
          <input
            key="emailinput"
            className="input-field"
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={pending}
            aria-label="Email Address"
            autoComplete="email"
            required
          />
          <button
            type="submit"
            className="btn btn-large"
            disabled={pending}
            style={{ marginTop: 10, marginBottom: 5 }}>
            {pending ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>
        <div style={{
          textAlign: "center",
          margin: "19px 0 10px 0",
          fontWeight: 500,
          color: "#444",
          fontSize: "1.09rem"
        }}>
          — or —
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            className="btn"
            style={{
              background: "#fff",
              color: "#FF4A4A",
              border: "1.3px solid #ff4a4a",
              display: "flex", alignItems: "center", fontWeight: 700, letterSpacing: 0.01
            }}
            disabled={pending}
            aria-label="Sign in with Google"
            onClick={() => handleSocialLogin("Google")}>
            <svg width="22" height="22" viewBox="0 0 48 48" style={{ marginRight: 7 }} aria-hidden><g>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.23 9.22 3.63l6.86-6.86C36.52 2.41 30.73 0 24 0 14.64 0 6.41 5.79 2.11 14.15l8.07 6.27C12.15 14.03 17.51 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.09 24.52c0-1.89-.17-3.73-.47-5.5H24v10.42h12.36c-.51 2.75-2.03 5.09-4.33 6.63l6.72 5.23c3.92-3.62 6.34-8.98 6.34-16.78z"></path>
              <path fill="#FBBC05" d="M10.18 28.77c-1.47-4.29-1.47-8.95 0-13.24l-8.07-6.27C.88 12.35 0 15.1 0 18c0 2.9.88 5.65 2.43 8.15l7.75-6.15z"></path>
              <path fill="#34A853" d="M24 48c6.73 0 12.54-2.23 16.73-6.07l-7.75-6.15c-2.13 1.41-4.89 2.26-8.01 2.26-6.49 0-11.85-4.53-13.81-10.77l-8.07 6.27C6.41 42.21 14.64 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </g></svg>
            Sign in with Google
          </button>
          <button
            type="button"
            className="btn"
            style={{
              background: "#24292f",
              color: "#fff",
              border: "1.3px solid #24292f",
              display: "flex", alignItems: "center", fontWeight: 700, letterSpacing: 0.01
            }}
            disabled={pending}
            aria-label="Sign in with GitHub"
            onClick={() => handleSocialLogin("GitHub")}>
            <svg aria-hidden width="22" height="22" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: 7 }}>
              <path d="M12 .297c-6.6 0-12 5.402-12 12.09 0 5.341 3.438 9.859 8.207 11.459.6.113.793-.259.793-.577v-2.256C5.657 21.09 4.968 19.69 4.968 19.69c-.547-1.39-1.336-1.761-1.336-1.761-1.091-.756.085-.742.085-.742 1.205.086 1.84 1.241 1.84 1.241 1.07 1.861 2.807 1.324 3.492 1.013.108-.779.42-1.324.761-1.628-3.554-.408-7.288-1.779-7.288-7.92 0-1.751.627-3.18 1.65-4.298-.166-.406-.717-2.047.157-4.265 0 0 1.348-.436 4.418 1.641a14.845 14.845 0 014.029-.542c1.366.007 2.743.184 4.029.542 3.07-2.077 4.416-1.641 4.416-1.641.875 2.218.324 3.859.158 4.265 1.025 1.118 1.65 2.547 1.65 4.298 0 6.154-3.738 7.508-7.301 7.911.429.372.823 1.104.823 2.223v3.293c0 .32.192.694.801.576C20.565 22.245 24 17.727 24 12.387c0-6.688-5.4-12.09-12-12.09z"></path>
            </svg>
            Sign in with GitHub
          </button>
        </div>
        {error && <div className="form-error">{error}</div>}
      </section>
    </div>
  );
}
